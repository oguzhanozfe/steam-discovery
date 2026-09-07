import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';

// Manual, reproducible public-data snapshot. No credentials or private analytics.
const root = new URL('../', import.meta.url);
const read = async (path) =>
  JSON.parse(await readFile(new URL(path, root), 'utf8'));
const save = async (path, data) =>
  writeFile(new URL(path, root), JSON.stringify(data, null, 2) + '\n');
const onlyNew = process.argv.includes('--only-new');
const seeds = new Map();
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (
    (value.appId || value.steamAppId) &&
    /^\d+$/.test(String(value.appId || value.steamAppId)) &&
    (value.title || value.name)
  ) {
    const id = String(value.appId || value.steamAppId);
    const previous = seeds.get(id) ?? {};
    seeds.set(id, {
      ...previous,
      appId: id,
      title: value.title ?? value.name,
      genre: value.genre ?? previous.genre ?? '',
      hook: value.hook ?? previous.hook ?? '',
      recordId: value.id ?? previous.recordId ?? null,
    });
  }
  for (const child of Object.values(value)) {
    if (typeof child !== 'object') continue;
    if (Array.isArray(child)) child.forEach(visit);
    else visit(child);
  }
}
for (const file of [
  'game-benchmarks',
  'reference-cases',
  'newsletter-games',
  'deep-case-metrics',
  'game-stories',
  'hub-cases',
  'story-expansion',
  'hub-niches',
  'hub-articles',
]) {
  try {
    visit(await read(`app/data/${file}.json`));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}
const startedAt = new Date().toISOString();
let previous = { games: [] };
let catalogPrevious = { games: [], pages: [] };
try {
  previous = await read('app/data/radar-snapshot.json');
} catch {}
try {
  catalogPrevious = await read('public/data/radar-catalog.json');
} catch {}
const errors = onlyNew ? [...(previous.errors ?? [])] : [];
async function json(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(25000),
    headers: {
      'User-Agent':
        'SteamDiscoveryResearch/1.0 (+https://steam-discovery.vercel.app/about/)',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
const broad = new Map(
  onlyNew
    ? catalogPrevious.games
        .filter((game) => game.cohort === 'SteamSpy owner-ranked sample')
        .map((game) => [game.appId, game])
    : [],
);
const pages = onlyNew ? catalogPrevious.pages : [];
if (!onlyNew) {
  // SteamSpy documents one /all request per 60 seconds; avoid concurrent /all requests.
  for (const [index, page] of [0, 5, 20].entries()) {
    if (index) await pause(61000);
    const source = `https://steamspy.com/api.php?request=all&page=${page}`;
    try {
      const response = await json(source);
      const checkedAt = new Date().toISOString();
      const valid = Object.values(response).filter(
        (game) => game.appid && game.appid !== 999999,
      );
      pages.push({ page, count: valid.length, checkedAt, source });
      for (const game of valid)
        broad.set(String(game.appid), {
          appId: String(game.appid),
          title: game.name,
          developer: game.developer,
          publisher: game.publisher,
          tags: [],
          genre: '',
          releaseDate: null,
          status: 'Not verified',
          owners: game.owners || null,
          positive: game.positive ?? null,
          negative: game.negative ?? null,
          reviews: Number.isFinite(game.positive + game.negative)
            ? game.positive + game.negative
            : null,
          reviewDefinition:
            'SteamSpy reported positive + negative; cached provider snapshot',
          ccu: game.ccu ?? null,
          ccuDefinition:
            'SteamSpy field: previous-day peak CCU; provider cache may lag',
          priceUsd:
            game.price === '' || game.price == null
              ? null
              : Number(game.price) / 100,
          checkedAt,
          cohort: 'SteamSpy owner-ranked sample',
          source,
          steamUrl: `https://store.steampowered.com/app/${game.appid}/`,
          sourceDate: null,
        });
      console.log(`SteamSpy page ${page}: ${valid.length} rows`);
    } catch (error) {
      errors.push({ source, message: error.message });
      console.log(`Unavailable: ${source} (${error.message})`);
    }
  }
}
const games = [];
for (const [appId, seed] of seeds) {
  const old = previous.games.find((game) => game.appId === appId);
  if (onlyNew && old) {
    games.push(old);
    continue;
  }
  const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`;
  const reviewUrl = `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&purchase_type=all&num_per_page=1&filter=recent&filter_offtopic_activity=1`;
  const fetched = await Promise.allSettled([json(storeUrl), json(reviewUrl)]);
  const details =
    fetched[0].status === 'fulfilled' ? fetched[0].value[appId]?.data : null;
  const summary =
    fetched[1].status === 'fulfilled' ? fetched[1].value.query_summary : null;
  if (fetched[0].status === 'fulfilled' && !details)
    errors.push({
      appId,
      source: storeUrl,
      message: 'No usable app metadata in successful HTTP response',
    });
  if (
    fetched[1].status === 'fulfilled' &&
    !Number.isFinite(summary?.total_reviews)
  )
    errors.push({
      appId,
      source: reviewUrl,
      message: 'No usable review summary in successful HTTP response',
    });
  fetched.forEach((item, index) => {
    if (item.status === 'rejected')
      errors.push({
        appId,
        source: [storeUrl, reviewUrl][index],
        message: item.reason.message,
      });
  });
  const checkedAt = new Date().toISOString();
  const currentReviews = summary?.total_reviews ?? null;
  const reviewDelta =
    old &&
    old.reviews != null &&
    currentReviews != null &&
    old.reviewDefinition ===
      'Steam API: all languages, all purchase types, off-topic activity filtered'
      ? currentReviews - old.reviews
      : null;
  const row = {
    ...seed,
    title: details?.name ?? seed.title,
    developer: details?.developers?.join(', ') ?? null,
    publisher: details?.publishers?.join(', ') ?? null,
    tags: details?.genres?.map((item) => item.description) ?? [],
    genre: seed.genre,
    releaseDate: details?.release_date?.date ?? null,
    status: !details
      ? 'Not verified'
      : details.release_date?.coming_soon
        ? 'Upcoming'
        : details.genres?.some((item) => item.id === '70')
          ? 'Early Access'
          : 'Released',
    priceUsd: details?.is_free
      ? 0
      : details?.price_overview?.final != null
        ? details.price_overview.final / 100
        : null,
    owners: broad.get(appId)?.owners ?? null,
    ccu: broad.get(appId)?.ccu ?? null,
    ccuDefinition: broad.get(appId)?.ccuDefinition ?? null,
    ownerSource: broad.has(appId) ? broad.get(appId).source : null,
    ownerCheckedAt: broad.has(appId) ? broad.get(appId).checkedAt : null,
    reviews: currentReviews,
    positive: summary?.total_positive ?? null,
    negative: summary?.total_negative ?? null,
    reviewDefinition:
      'Steam API: all languages, all purchase types, off-topic activity filtered',
    previousReviews: old?.reviews ?? null,
    previousCheckedAt: old?.checkedAt ?? null,
    reviewDelta,
    checkedAt,
    cohort: 'Curated research',
    source: reviewUrl,
    storeSource: storeUrl,
    steamUrl: `https://store.steampowered.com/app/${appId}/`,
    headerImage: details?.header_image ?? null,
  };
  games.push(row);
  if (details?.header_image) {
    const manifest = await read('app/data/game-images.json');
    // Preserve previously decoded/curated art; metadata discovery is not image verification.
    if (!manifest[appId]) {
      manifest[appId] = {
        url: details.header_image,
        width: 460,
        height: 215,
        source: storeUrl,
        checkedAt,
        verification:
          'URL returned by official Steam metadata; not independently decoded',
      };
      await save('app/data/game-images.json', manifest);
    }
  }
  if (games.length % 20 === 0)
    console.log(`Curated checks: ${games.length}/${seeds.size}`);
  await pause(1100);
}
const cohort = await read('public/data/steam-june-2026-cohort.json');
const union = new Map(broad);
for (const game of cohort.games)
  if (!union.has(String(game.appId)))
    union.set(String(game.appId), {
      appId: String(game.appId),
      title: game.title,
      developer: null,
      publisher: null,
      tags: game.selectedTagNames,
      genre: game.selectedTagNames.join(' / '),
      releaseDate: game.releaseDate,
      status: 'Released in June 2026 snapshot',
      priceUsd: null,
      owners: null,
      ccu: null,
      ccuDefinition: null,
      reviews: game.displayedReviews,
      positive: null,
      negative: null,
      reviewDefinition: game.languageSpecific
        ? 'Historical Steam search count: language-specific'
        : 'Historical Steam search displayed review count; query differs from current API',
      checkedAt: game.retrievedAt,
      cohort: 'June 2026 release subset',
      source: game.rawSource,
      steamUrl: game.source,
    });
for (const game of games) union.set(game.appId, game);
const metadata = {
  schemaVersion: 1,
  capturedAt: startedAt,
  completedAt: new Date().toISOString(),
  mode: 'Manual snapshot, not a live feed',
  reviewMethod:
    'Current curated rows: official Steam appreviews, all languages, all purchase types; off-topic filtering on. Reviews are not copies sold.',
  ownerMethod:
    "SteamSpy owner ranges are estimates, not verified sales. CCU field is the provider's previous-day peak, not live players.",
  coverage:
    'Union of three non-contiguous owner-ranked SteamSpy pages (0, 5, 20), an earlier 2,102-app June 2026 release subset and a purposive curated research set. Not a Steam census, not an indie-only sample, and no market success-rate denominator.',
  timing:
    'Retrieved timestamps describe our check; SteamSpy refreshes daily and upstream data may lag. June rows retain their original September 2 capture.',
  changes:
    'Review deltas appear only after two comparable official-API snapshots. No daily growth is inferred from lifetime reviews.',
  pages,
  errors,
};
await mkdir(new URL('public/data/', root), { recursive: true });
await save('app/data/radar-snapshot.json', {
  ...metadata,
  games,
  catalogCount: union.size,
});
await save('public/data/radar-catalog.json', {
  ...metadata,
  games: [...union.values()],
});
console.log(
  `Saved ${games.length} curated checks; ${union.size} unique catalog apps; ${errors.length} unavailable requests.`,
);
