// Tactic cards must point at existing research records and must not add numbers.
// Run: node --experimental-strip-types scripts/validate-tactics.mjs [--data-only]
import { readFile, access } from 'node:fs/promises';
import {
  resolveRef,
  numbersIn,
  cardText,
  stageOrder,
} from '../app/tactics-model.ts';

const root = new URL('../', import.meta.url);
const json = async (path) =>
  JSON.parse(await readFile(new URL(path, root), 'utf8'));
const dataOnly = process.argv.includes('--data-only');

const tactics = process.env.TACTICS_FILE
  ? JSON.parse(await readFile(process.env.TACTICS_FILE, 'utf8'))
  : await json('app/data/tactics.json');
const classes = await json('app/data/evidence-classes.json');
const articles = (
  await Promise.all(
    ['newsletters', 'reading-expansion', 'reading-updates'].map((f) =>
      json(`app/data/${f}.json`),
    ),
  )
).flatMap((f) => f.articles);
const stories = (
  await Promise.all(
    ['game-stories', 'hub-cases', 'story-expansion'].map((f) =>
      json(`app/data/${f}.json`),
    ),
  )
).flatMap((f) => f.stories);
const playbooks = (await json('app/data/hub-articles.json')).articles;
const cases = [
  ...(await json('app/data/countercases.json')),
  ...(await json('app/data/reference-cases.json')),
  ...(await json('app/data/newsletter-games.json')),
  ...(await json('app/data/game-benchmarks.json')).games,
];
const records = {
  article: articles,
  story: stories,
  playbook: playbooks,
  case: cases,
};

const errors = [];
const check = (ok, message) => {
  if (!ok) errors.push(message);
};
const classIds = Object.keys(classes.classes);
for (const [label, cls] of Object.entries(classes.labels))
  check(
    classIds.includes(cls),
    `evidence-classes: "${label}" maps to unknown class ${cls}`,
  );

const stageIds = tactics.stages.map((s) => s.id);
check(
  JSON.stringify(stageIds) === JSON.stringify(stageOrder),
  'tactics.stages must list every stage in stageOrder',
);
check(
  tactics.cards.length >= 30,
  `Need at least 30 cards, found ${tactics.cards.length}`,
);
const ids = new Set();
for (const card of tactics.cards) {
  const at = `card ${card.id}`;
  check(
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(card.id),
    `${at}: id must be a lowercase slug`,
  );
  check(!ids.has(card.id), `${at}: duplicate id`);
  ids.add(card.id);
  for (const field of ['title', 'summary', 'cannotProve', 'channel'])
    check(
      typeof card[field] === 'string' && card[field].trim().length > 0,
      `${at}: missing ${field}`,
    );
  check(
    tactics.channels.includes(card.channel),
    `${at}: unknown channel "${card.channel}"`,
  );
  check(
    card.stages?.length > 0 && card.stages.every((s) => stageIds.includes(s)),
    `${at}: invalid stages`,
  );
  check(
    card.teamSizes?.length > 0 &&
      card.teamSizes.every((t) => ['solo', 'small'].includes(t)),
    `${at}: invalid teamSizes`,
  );
  check(
    Array.isArray(card.try) && card.try.length >= 1 && card.try.length <= 3,
    `${at}: try needs 1–3 steps`,
  );
  check(
    /^\d{4}-\d{2}-\d{2}$/.test(card.checkedAt),
    `${at}: checkedAt must be YYYY-MM-DD`,
  );
  check(card.evidence?.length >= 2, `${at}: needs at least 2 evidence refs`);
  const resolved = [];
  for (const ref of [...card.evidence, ...(card.counter ?? [])]) {
    const item = resolveRef(ref, records, classes);
    if (!item) {
      check(false, `${at}: unresolvable ref ${ref}`);
      continue;
    }
    check(
      item.evidenceClass !== null,
      `${at}: label "${item.label}" (${ref}) is not in evidence-classes.json`,
    );
    check(
      /^https?:\/\//.test(item.sourceUrl),
      `${at}: ${ref} has no http(s) source`,
    );
    resolved.push(item);
  }
  const main = resolved.filter((item) => card.evidence.includes(item.ref));
  check(
    main.some(
      (item) => item.evidenceClass && item.evidenceClass !== 'editorial',
    ),
    `${at}: needs at least one non-editorial evidence ref`,
  );
  const allowed = new Set(
    resolved.flatMap((item) =>
      numbersIn(`${item.quote} ${item.caveat ?? ''} ${item.recordTitle}`),
    ),
  );
  for (const number of numbersIn(cardText(card)))
    check(
      allowed.has(number),
      `${at}: number "${number}" is not in its referenced records`,
    );
}

if (!dataOnly) {
  const exists = (path) =>
    access(new URL(path, root)).then(
      () => true,
      () => false,
    );
  check(
    await exists('dist-static/tactics/index.html'),
    'dist-static/tactics/index.html missing (run build:vercel first)',
  );
  for (const card of tactics.cards) {
    const path = `dist-static/tactics/${card.id}/index.html`;
    if (!(await exists(path))) {
      check(false, `${path} missing`);
      continue;
    }
    const html = await readFile(new URL(path, root), 'utf8');
    check(
      html.includes('References &amp; how we used them'),
      `${path}: no reference register`,
    );
    check(html.includes('Cannot prove'), `${path}: limit not rendered`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
const refs = tactics.cards.reduce(
  (n, c) => n + c.evidence.length + (c.counter?.length ?? 0),
  0,
);
console.log(
  `Validated ${tactics.cards.length} tactic cards, ${refs} evidence references and ${Object.keys(classes.labels).length} evidence-label mappings. Numbers on cards all appear in their source records. This does not certify that a tactic works.`,
);
