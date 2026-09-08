import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  publicRoutes,
  storyReferences,
  sourceMetadata,
  citationUrls,
} from '../.prerender/entry-prerender.js';

const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');
const json = async (path) => JSON.parse(await read(path));
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
      })[c],
  );
const stories = (await json('dist-static/data/game-stories.json')).stories;
const checks = await json('app/data/reference-checks.json');
const about = await read('dist-static/about/index.html');
let mappedReferences = 0;
for (const story of stories) {
  const html = await read(`dist-static/case-studies/${story.id}/index.html`);
  assert(html.includes('Research synthesis by Steam Discovery'), story.id);
  const references = storyReferences(story);
  for (const ref of references) {
    assert(['https:', 'http:'].includes(new URL(ref.url).protocol));
    assert(
      html.includes(`data-source-record="${escape(ref.url)}"`),
      `Missing full reference: ${story.id} ${ref.url}`,
    );
  }
  for (const source of [
    ...story.kpis.map((k) => k.source),
    ...story.timeline.map((e) => e.source),
  ]) {
    assert(
      html.includes(`data-reference-url="${escape(source)}"`),
      `Missing inline citation: ${story.id}`,
    );
    assert(
      references.some((ref) => ref.url === source && ref.uses.length),
      `Missing claim mapping: ${story.id}`,
    );
  }
  const nested = [
    ...story.story.flatMap((section) => section.sourceUrls),
    ...story.kpis.map((k) => k.source),
    ...story.timeline.map((e) => e.source),
    ...story.demand.sourceUrls,
    ...story.mechanism.sourceUrls,
  ];
  for (const url of nested)
    assert(
      story.sourceUrls.includes(url),
      `Inline source omitted from export/structured metadata: ${story.id} ${url}`,
    );
  if (story.story.some((section) => !section.sourceUrls.length))
    assert(
      html.includes('Steam Discovery interpretation / proposed experiment'),
    );
  mappedReferences += references.length;
}
for (const route of publicRoutes.filter(
  (route) =>
    route.initial.guideId || route.initial.readingId || route.initial.gameId,
)) {
  const html = await read('dist-static/' + route.path.slice(1) + 'index.html');
  assert(
    html.includes('References &amp; how we used them'),
    `No visible source register: ${route.path}`,
  );
}
for (const source of checks.sources) {
  const metadata = sourceMetadata(source.url);
  assert.equal(metadata.title, source.title);
  assert(
    about.includes(escape(source.title)),
    `Missing checked article title: ${source.title}`,
  );
  assert(about.includes(`data-source-record="${escape(source.url)}"`));
}
assert.equal(
  checks.sources.filter((source) => source.wordingCompared).length,
  checks.wordingReviewCount,
);
assert(about.includes('not a site-wide plagiarism certification'));
assert(
  about.includes('the preceding week'),
  'Retain the public correction explanation',
);
const peglin = stories.find((story) => story.id === 'peglin');
assert(
  !peglin.story.some((section) => section.body.includes('preceding week')),
);
assert(
  peglin.timeline.some((event) =>
    event.outcome?.includes('roughly six earlier months'),
  ),
);
assert.equal(
  sourceMetadata('https://example.org/unknown-article').title,
  null,
  'Do not fabricate a title from a slug',
);
assert.equal(
  sourceMetadata('https://example.org/unknown-article').author,
  null,
  'Do not fabricate authors',
);
const dataset = await json('dist-static/data/reference-metadata.json');
assert(dataset.sources.length >= checks.sources.length);
assert.deepEqual(await json('dist-static/data/reference-checks.json'), checks);
const researchIndex = await json('dist-static/data/research-index.json');
for (const path of ['/', '/solo-lab/', '/case-studies/', '/build-lab/', '/playbooks/']) {
  const route = publicRoutes.find(route => route.path === path);
  assert(route, path);
  const urls = citationUrls(route);
  assert(urls.length > 0, `No structured/export citations: ${path}`);
  const exported = researchIndex.pages.find(page => page.url === 'https://steam-discovery.vercel.app' + path);
  if (!route.noindex) assert.deepEqual(exported.citations, urls);
}
for (const page of researchIndex.pages) {
  for (const url of page.citations) {
    const canonical = url.replace(/\/$/, '');
    assert(dataset.sources.some(source => source.url.replace(/\/$/, '') === canonical), `Missing citation metadata: ${page.url} → ${url}`);
  }
}
for (const article of (await json('app/data/hub-articles.json')).articles) {
  assert(dataset.sources.find(source => source.url === article.url)?.uses.some(use => use.includes(article.title)), `Missing playbook source usage: ${article.title}`);
}
for (const path of ['solo-lab/', 'build-lab/']) {
  const html = await read(`dist-static/${path}index.html`);
  assert(html.includes('Design proposal by Steam Discovery'));
  assert(html.includes('References &amp; how we used them'));
}
console.log(
  `Validated ${stories.length} story registers (${mappedReferences} source mappings), all reading/playbook/game pages, ${checks.sources.length} freshly checked metadata records, export parity and correction disclosure. These checks do not detect plagiarism or certify source truth.`,
);
