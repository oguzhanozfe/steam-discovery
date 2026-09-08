import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import { publicRoutes } from '../.prerender/entry-prerender.js';

const root = new URL('../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const exists = async path => access(new URL(path, root)).then(() => true, () => false);
const retired = [
  'survival-demo/index.html', 'progress/index.html', 'analysis/index.html',
  'data/survival-demo-gdd.json', 'data/survival-demo-gdd.md',
  'data/survival-validation-evidence.json', 'data/original-analysis.json',
  'Steam-Indie-2026-Decision-Report.md',
];
for (const file of retired) assert(!await exists('dist-static/' + file), `Retired output remains: ${file}`);
for (const file of [
  'api/progress.ts', 'app/city-escape-gdd.tsx', 'app/fps-survival-concept.tsx',
  'app/progress-tracker.tsx', 'app/progress-data.ts', 'app/progress-card-authoring-guide.ts',
  'app/data/progress-tracker.json', 'app/data/fps-survival-concept.json',
  'app/data/survival-demo-gdd.json', 'app/data/survival-demo-gdd-v01.json',
  'app/data/survival-validation-evidence.json', 'app/data/original-analysis.json',
  'handoffs/progress-tracker/START_HERE.md',
]) assert(!await exists(file), `Internal project source remains: ${file}`);
assert(!await exists('.vercel/output/functions/api/progress.func'), 'Retired API must not be deployed');

const privateContent = /City Escape: First Outbreak|city-escape-demo|survival-demo-gdd|fps-survival-concept|survival-validation-evidence|progress-tracker\.json|read_progress_card_authoring_guide|earn-the-second-street|fps-zomboid-is-not-an-empty-market|for the FPS survival slice|our survival clip|the team's existing-system brief|Project workspace|\/survival-demo\/|\/api\/progress/i;
let scanned = 0;
async function scan(directory) {
  for (const file of await readdir(new URL(directory, root), { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) await scan(path);
    else if (/\.(html|js|json|md|xml|txt)$/.test(file.name)) {
      assert(!privateContent.test(await read(path)), `Private project content in ${path}`);
      scanned++;
    }
  }
}
await scan('dist-static');
for (const route of publicRoutes) {
  assert(!/^\/(survival-demo|progress|analysis)(\/|$)/.test(route.path));
  const html = await read('dist-static/' + route.path.slice(1) + 'index.html');
  assert(html.includes('Original articles &amp; references'));
  for (const match of html.matchAll(/href="(\/[^"<>]*)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), 'https://steam-discovery.vercel.app');
    const path = decodeURIComponent(url.pathname);
    assert(await exists('dist-static' + path + (path.endsWith('/') ? 'index.html' : '')), `Broken internal link on ${route.path}: ${match[1]}`);
  }
  if (route.initial.view !== 'methodology') {
    assert(html.includes('data-ad-placement='), `No ad space: ${route.path}`);
    assert(html.includes('No paid sponsor is featured in this space.'));
    assert(!/googlesyndication|adsbygoogle|doubleclick|ca-pub-/.test(html), 'Do not enable an unconfigured ad network');
  }
}
const about = await read('dist-static/about/index.html');
assert(about.includes('id="advertising"'));
assert(about.includes('Payment does not determine our findings'));
assert(about.includes('not paid campaigns'));
for (const source of JSON.parse(await read('app/data/advertising-sources.json'))) assert(about.includes(source.url.replaceAll('&', '&amp;')));
assert(!await exists('dist-static/ads.txt'), 'Do not publish a fabricated seller declaration');
const genres = await read('dist-static/research/open-world-survival-craft/index.html');
assert(genres.includes('The Planet Crafter') && genres.includes('Windrose'), 'Preserve public genre cases');
assert(genres.includes('data-ad-placement="genre-between-demand-and-cases"'));
console.log(`Public-only validation passed: ${scanned} output files, ${publicRoutes.length} routes, retired project/API absent, references retained and advertising clearly separated. Historical deployments and Git history are outside this check.`);
