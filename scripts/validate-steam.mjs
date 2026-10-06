import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

// Checks the generated /steam/ game and tag pages: coverage, internal links,
// evidence caveats and sitemap wiring.
const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');
const exists = (path) =>
  access(new URL(path, root)).then(
    () => true,
    () => false,
  );
const catalog = JSON.parse(await read('public/data/radar-catalog.json'));
for (const game of catalog.games)
  assert(
    await exists(`dist-static/steam/${game.appId}/index.html`),
    `Missing game page: ${game.appId}`,
  );
const directory = await read('dist-static/steam/index.html');
const tagPaths = [
  ...directory.matchAll(/href="(\/steam\/tags\/[^"]+\/)"/g),
].map((match) => match[1]);
assert(tagPaths.length > 0, 'Directory lists no tag pages');
const checked = new Set();
for (const path of ['/steam/', ...tagPaths]) {
  const html =
    path === '/steam/' ? directory : await read(`dist-static${path}index.html`);
  assert(
    html.includes('not affiliated with Valve'),
    `Missing disclosure: ${path}`,
  );
  if (path !== '/steam/')
    assert(
      html.includes('not your odds of success'),
      `Missing sample caveat: ${path}`,
    );
  for (const match of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const target = match[1];
    if (checked.has(target)) continue;
    checked.add(target);
    const file = target.endsWith('/') ? `${target}index.html` : target;
    assert(
      await exists(`dist-static${file}`),
      `Broken link ${target} on ${path}`,
    );
  }
}
const sample = await read(
  `dist-static/steam/${catalog.games[0].appId}/index.html`,
);
assert(
  sample.includes('Reviews are not copies sold') ||
    sample.includes('No comparable review count'),
  'Game page lacks review definition',
);
assert(
  (await read('dist-static/robots.txt')).includes('sitemap-steam.xml'),
  'robots.txt must reference sitemap-steam.xml',
);
const sitemap = await read('dist-static/sitemap-steam.xml');
for (const match of sitemap.matchAll(
  /<loc>https:\/\/steam-discovery\.vercel\.app(\/[^<]*)<\/loc>/g,
)) {
  const html = await read(`dist-static${match[1]}index.html`);
  assert(
    !html.includes('noindex'),
    `Sitemap lists a noindex page: ${match[1]}`,
  );
}
console.log(
  `Steam pages validated: ${catalog.games.length} game pages, ${tagPaths.length} tag pages, ${checked.size} internal links, sitemap and disclosures.`,
);
