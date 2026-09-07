import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  selectRadarGames,
  defaultRadarFilters,
  positiveShare,
} from '../app/hub-model.ts';
import { publicRoutes } from '../.prerender/entry-prerender.js';

const read = async (path) =>
  JSON.parse(await readFile(new URL('../' + path, import.meta.url), 'utf8'));
const catalog = await read('public/data/radar-catalog.json');
const snapshot = await read('app/data/radar-snapshot.json');
const concepts = await read('app/data/solo-concepts.json');
const niches = await read('app/data/hub-niches.json');
const stories = await read('app/data/hub-cases.json');
const articles = await read('app/data/hub-articles.json');
const images = await read('app/data/game-images.json');
const rows = catalog.games;
const ids = new Set(rows.map((game) => game.appId));
assert.equal(ids.size, rows.length, 'Duplicate radar IDs');
assert.equal(snapshot.catalogCount, rows.length);
assert.equal(
  new Set(stories.stories.map((story) => story.id)).size,
  stories.stories.length,
);
assert.equal(
  new Set(articles.articles.map((article) => article.id)).size,
  articles.articles.length,
);

for (const game of rows) {
  assert(/^\d+$/.test(game.appId) && game.title && Array.isArray(game.tags));
  assert(
    game.checkedAt && game.reviewDefinition && game.source && game.steamUrl,
  );
  for (const key of ['reviews', 'positive', 'negative', 'priceUsd', 'ccu'])
    assert(
      game[key] === null || (Number.isFinite(game[key]) && game[key] >= 0),
      game.title + ': ' + key,
    );
  if (game.positive != null && game.negative != null)
    assert.equal(game.reviews, game.positive + game.negative, game.title);
  if (game.reviewDelta != null) {
    assert(game.previousCheckedAt && game.previousReviews != null);
    assert.equal(game.reviewDelta, game.reviews - game.previousReviews);
  }
}
for (const game of snapshot.games) {
  assert(ids.has(game.appId));
  assert(
    game.headerImage && images[game.appId]?.url,
    'Missing curated artwork: ' + game.title,
  );
}
for (const niche of niches.niches) {
  assert.equal(niche.comparables.length, 3);
  assert(niche.demand && niche.supply && niche.limitation && niche.watch);
  for (const comparable of niche.comparables) {
    assert(ids.has(String(comparable.appId)), 'Missing comparable');
    assert(comparable.source && comparable.asOf);
    assert.equal(comparable.reviews, comparable.positive + comparable.negative);
  }
}
for (const concept of concepts.concepts) {
  assert(niches.niches.some((niche) => niche.id === concept.nicheId));
  assert.equal(concept.comparables.length, 3);
  for (const appId of concept.comparables)
    assert(snapshot.games.some((game) => game.appId === String(appId)));
  assert(['Demo', 'Microgame candidate'].includes(concept.deliverable));
  assert(
    concept.cuts.length &&
      concept.risks.length &&
      concept.test &&
      concept.stop &&
      concept.aiHelp,
  );
}
for (const story of stories.stories) {
  assert(publicRoutes.some((route) => route.initial.storyId === story.id));
  for (const kpi of story.kpis)
    assert(kpi.source && kpi.window && kpi.evidence && kpi.caveat);
}
for (const article of articles.articles) {
  assert(publicRoutes.some((route) => route.initial.guideId === article.id));
  assert(
    article.url && article.checkedAt && article.cannotProve && article.access,
  );
  assert(article.soloChecklist.length && article.smallTeamChecklist.length);
}
const base = {
  ...rows[0],
  appId: '1',
  title: 'Z test',
  reviews: null,
  positive: null,
  negative: null,
  owners: null,
  genre: 'Puzzle',
  tags: [],
  developer: 'Sample Maker',
  cohort: 'Curated research',
  status: 'Released',
};
const examples = [
  base,
  {
    ...base,
    appId: '2',
    title: 'A test',
    reviews: 0,
    positive: 0,
    negative: 0,
    owners: '100,000 .. 200,000',
  },
  {
    ...base,
    appId: '3',
    title: 'B test',
    reviews: 1500,
    positive: 1200,
    negative: 300,
    owners: '200,000 .. 500,000',
  },
];
const query = (changes) =>
  selectRadarGames(examples, { ...defaultRadarFilters, ...changes });
assert.equal(positiveShare(base), null, 'Unknown is not zero');
assert.equal(positiveShare(examples[1]), null, 'Zero reviews has no rating');
assert.equal(positiveShare(examples[2]), 80);
assert.deepEqual(
  query({ signal: 'Unknown review count' }).map((g) => g.appId),
  ['1'],
);
assert.deepEqual(
  query({ signal: 'Under 1K reviews' }).map((g) => g.appId),
  ['2'],
);
assert.deepEqual(
  query({ signal: '1K+ reviews' }).map((g) => g.appId),
  ['3'],
);
assert.deepEqual(
  query({ signal: '100–200K owner estimate' }).map((g) => g.appId),
  ['2'],
);
assert.equal(query({ query: 'puzzle maker' }).length, 3);
assert.equal(query({ query: 'nonexistent' }).length, 0);
assert.equal(query({ status: 'Upcoming' }).length, 0);
assert.equal(query({ cohort: 'June 2026 release subset' }).length, 0);
assert.deepEqual(
  query({ sort: 'Fewest reviews' }).map((g) => g.appId),
  ['2', '3', '1'],
);
assert.deepEqual(
  query({ sort: 'Most reviews' }).map((g) => g.appId),
  ['3', '2', '1'],
);
assert.deepEqual(
  selectRadarGames(examples, { ...defaultRadarFilters, savedOnly: true }, [
    '3',
  ]).map((g) => g.appId),
  ['3'],
);
assert.deepEqual(
  examples.map((g) => g.appId),
  ['1', '2', '3'],
  'Sorting must not mutate source rows',
);
assert(
  selectRadarGames(rows, {
    ...defaultRadarFilters,
    signal: '100–200K owner estimate',
  }).length > 0,
);

// Validate links emitted by all new hub and story routes, not only hand-maintained menus.
const routePaths = new Set(publicRoutes.map((route) => route.path));
for (const route of publicRoutes.filter((route) =>
  ['hub', 'radar', 'solo', 'guides', 'stories'].includes(route.initial.view),
)) {
  const html = await readFile(
    new URL(
      '../dist-static/' + route.path.slice(1) + 'index.html',
      import.meta.url,
    ),
    'utf8',
  );
  for (const match of html.matchAll(/href="(\/[^"]*)"/g)) {
    const path = match[1].split(/[?#]/)[0];
    if (!path || path.startsWith('/data/') || /\.[a-z0-9]+$/.test(path))
      continue;
    assert(
      routePaths.has(path),
      'Broken internal link: ' + path + ' on ' + route.path,
    );
  }
  if (route.initial.guideId) {
    const structured = JSON.parse(
      html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
    );
    const article = structured['@graph'].find(
      (item) => item['@type'] === 'Article',
    );
    assert(article && !article.datePublished);
    assert.equal(
      article.isBasedOn.url,
      articles.articles.find((item) => item.id === route.initial.guideId).url,
    );
  }
}
const exportedStories = await read('dist-static/data/game-stories.json');
assert.equal(
  exportedStories.stories.length,
  publicRoutes.filter((route) => route.initial.storyId).length,
);
console.log(
  'Validated hub: ' +
    rows.length +
    ' radar rows, filters, null semantics, watchlist selection, ' +
    concepts.concepts.length +
    ' solo concepts, ' +
    niches.niches.length +
    ' niche briefs, ' +
    stories.stories.length +
    ' new stories, ' +
    articles.articles.length +
    ' playbooks and rendered links.',
);
