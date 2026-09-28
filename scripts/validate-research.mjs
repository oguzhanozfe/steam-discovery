import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { publicRoutes, readingMetadata } from '../.prerender/entry-prerender.js';
import './validate-hub.mjs';

const read = path => readFile(new URL(`../dist-static/${path}`, import.meta.url), 'utf8');
const sitemap = await read('sitemap.xml');
assert.equal(new Set(publicRoutes.map(route => route.path)).size, publicRoutes.length, 'Duplicate route');
assert.equal(new Set(readingMetadata.map(note => note.url)).size, readingMetadata.length, 'Duplicate source note');
const titles = new Set();
for (const route of publicRoutes) {
  const html = await read(`${route.path.slice(1)}index.html`);
  const canonical = `https://steam-discovery.vercel.app${route.path}`;
  assert(html.includes(`rel="canonical" href="${canonical}"`), `Canonical: ${route.path}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `One h1: ${route.path}`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title && !titles.has(title), `Unique title: ${route.path}`); titles.add(title);
  const metadata = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1] ?? 'null');
  assert.equal(metadata['@context'], 'https://schema.org');
  if (route.noindex) { assert(html.includes('noindex,follow')); assert(!sitemap.includes(`<loc>${canonical}</loc>`)); }
  else assert(sitemap.includes(`<loc>${canonical}</loc>`));
  if (route.initial.readingId) {
    const note = readingMetadata.find(item => item.id === route.initial.readingId);
    const article = metadata['@graph'].find(item => item['@type'] === 'Article');
    assert.equal(article.isBasedOn.url, note.url);
    assert(!article.datePublished, 'Do not reuse source publication date as our note date');
    assert(html.includes(note.url));
  }
}
for (const note of readingMetadata) {
  assert(note.date === null || /^\d{4}-\d{2}-\d{2}$/.test(note.date));
  assert(!note.date || note.date <= new Date().toISOString().slice(0, 10), 'Future publication date');
  assert(note.limitations && note.access && note.summary);
}
const home = await read('index.html');
assert(!home.includes('YOUR SURVIVAL PROJECT'));
assert(home.includes('Sources &amp; Reading') && !home.includes('Project workspace'));
assert((await read('feed.xml')).includes('Research note:'));
assert((await read('robots.txt')).includes('OAI-SearchBot'));
console.log(`Validated ${publicRoutes.length} pages, ${readingMetadata.length} source notes, canonical URLs, structured data, sitemap and public-only route rules.`);

// Guard release-state semantics and the public FPS data/HTML contract.
const fps = JSON.parse(await readFile(new URL('../app/data/indie-fps.json', import.meta.url), 'utf8'));
assert.deepEqual(JSON.parse(await read('data/indie-fps.json')), fps);
const fpsHtml = await read('indie-fps/index.html');
assert.equal(new Set(fps.games.map(game => game.appId)).size, fps.games.length);
for (const game of fps.games) {
  assert(['Released', 'Early Access', 'Upcoming'].includes(game.status));
  assert(['recent', 'watchlist'].includes(game.cohort));
  assert(game.hook && game.indieContext && game.releaseNote);
  if (game.releaseDate) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(game.releaseDate));
    assert.equal(new Date(game.releaseDate).toISOString().slice(0, 10), game.releaseDate);
  }
  if (game.status !== 'Upcoming') assert(game.releaseDate && game.releaseDate <= fps.checkedAt, game.title);
  if (game.status === 'Upcoming') assert.equal(game.cohort, 'watchlist');
  if (game.cohort === 'recent') assert(game.releaseDate >= '2025-01-01' && game.releaseDate <= fps.checkedAt);
  assert(game.sources.some(source => source.url === `https://store.steampowered.com/app/${game.appId}/`));
  assert(game.sources.some(source => source.url.startsWith(`https://steamdb.info/app/${game.appId}/`)));
  assert(fpsHtml.includes(`id="game-${game.appId}"`));
  for (const source of game.sources) {
    assert.equal(new URL(source.url).protocol, 'https:');
    assert(source.uses.length && source.access);
    assert(fpsHtml.includes(`data-source-record="${source.url.replaceAll('&', '&amp;')}"`));
  }
}
console.log(`Validated ${fps.games.length} FPS entries, date/status semantics, source mappings and export parity.`);
