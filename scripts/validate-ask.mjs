// Ask the Library without a key: a fake provider exercises retrieval, the
// grounding check and refusals. Run: node --import ./scripts/ts-hook.mjs scripts/validate-ask.mjs [--data-only]
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { askLibrary, checkClaims, extractive, search, parseModelOutput } from '../app/ask-core.ts';
import { passages, cards } from '../app/ask-library.ts';

const fake = (reply) => {
  const provider = async () => {
    provider.calls += 1;
    return { text: typeof reply === 'string' ? reply : JSON.stringify(reply), promptTokens: 1, completionTokens: 1 };
  };
  provider.calls = 0;
  return provider;
};

// Library shape: every passage is citable and links to a page and a source.
assert(passages.length > 500, `only ${passages.length} passages`);
for (const p of passages) {
  assert(/^https?:\/\//.test(p.sourceUrl), `${p.ref}: no http source`);
  assert(p.evidenceClass, `${p.ref}: no evidence class`);
  assert(!/#(buildTransfer|demand)\b/.test(p.ref), `${p.ref}: example plans are not evidence`);
}
if (!process.argv.includes('--data-only')) {
  const root = new URL('../', import.meta.url);
  const paths = [...new Set(passages.map((p) => p.sitePath))];
  for (const path of paths)
    await access(new URL(`dist-static${path}index.html`, root)).catch(() =>
      assert.fail(`${path} is cited but not built (run build:vercel first)`),
    );
}

const question = 'Does a demo concurrent player count during Next Fest predict sales?';
const { hits } = search(passages, question);
assert(hits.length > 0, 'retrieval found nothing');

// 1. A grounded claim survives; an uncited one and one with an invented number are dropped.
const p1 = hits[0].passage;
const good = await askLibrary(
  question,
  passages,
  fake({
    answerable: true,
    claims: [
      { text: 'The library has a cited finding on this.', cite: ['P1'] },
      { text: 'Demos always work.', cite: [] },
      { text: 'Exactly 987654 players is the cutoff.', cite: ['P1'] },
      { text: 'Made-up passage.', cite: ['P99'] },
    ],
  }),
  cards,
);
assert.notEqual(p1.evidenceClass, 'editorial', 'test question should retrieve evidence first');
assert.equal(good.status, 'answer');
assert.equal(good.claims.length, 1);
assert.deepEqual(good.claims[0].sources, [1]);
assert.equal(good.sources[0].ref, p1.ref);
assert.deepEqual(
  good.audit.checks.map((c) => c.kept),
  [true, false, false, false],
);
assert.deepEqual(good.audit.checks[2].ungroundedNumbers, ['987654']);

// 2. Numbers that appear in the cited passage pass the check.
const n = (p1.text.match(/\d[\d,]*(?:\.\d+)?/) ?? [])[0];
if (n) assert(checkClaims([{ text: `It reports ${n}.`, cite: ['P1'] }], [p1])[0].kept);

// 3. The model declining, bad JSON, and weak retrieval are refusals.
assert.equal((await askLibrary(question, passages, fake({ answerable: false, claims: [] }))).reason, 'model-declined');
assert.equal((await askLibrary(question, passages, fake('not json'))).reason, 'bad-output');
const offTopic = fake({ answerable: true, claims: [] });
const weak = await askLibrary('What is the best colour palette for a capsule image?', passages, offTopic);
assert.equal(weak.reason, 'weak-retrieval');
assert.equal(offTopic.calls, 0, 'weak retrieval must not call the model');
assert(parseModelOutput('```json\n{"answerable":false,"claims":[]}\n```'));

// 4. Tier 1 (no model): quotes passages verbatim, or says the library does not cover it.
const quoted = extractive(question, passages);
assert.equal(quoted.status, 'passages');
assert(quoted.passages.length > 0 && quoted.passages.every((p) => passages.includes(p)));
assert.equal(extractive('What is the best colour palette for a capsule image?', passages).status, 'refused');

console.log(
  `Ask the Library: ${passages.length} citable passages from ${new Set(passages.map((p) => p.sitePath)).size} pages; extractive search, grounding check and refusals pass with a fake provider. This does not measure answer quality (see docs/ASK.md).`,
);
