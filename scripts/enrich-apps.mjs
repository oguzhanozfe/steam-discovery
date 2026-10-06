import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';

// Incremental per-app enrichment for every catalog game: SteamSpy tags/owners and
// official Steam store metadata. Each run checks a bounded batch (missing first,
// then stalest) so a daily job covers the whole catalog within a few days while
// respecting published and observed rate limits. No credentials are used.
const root = new URL('../', import.meta.url);
const read = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(new URL(path, root), 'utf8'));
  } catch (error) {
    if (fallback !== undefined && error.code === 'ENOENT') return fallback;
    throw error;
  }
};
const arg = (name, fallback) => {
  const hit = process.argv.find((value) => value.startsWith(`--${name}=`));
  const value = hit ? Number(hit.split('=')[1]) : NaN;
  return Number.isFinite(value) && value >= 0 ? value : fallback;
};
// SteamSpy documents 1 request per second for appdetails; the store endpoint
// throttles at roughly 200 requests per 5 minutes.
const spyLimit = arg('spy', 1500);
const storeLimit = arg('store', 600);
const spyMaxAgeDays = arg('spy-age', 7);
const storeMaxAgeDays = arg('store-age', 30);
const detailsPath = 'data/steam/app-details.json';

const catalog = await read('public/data/radar-catalog.json');
const details = await read(detailsPath, {
  schemaVersion: 1,
  description:
    'Per-app enrichment cache. SteamSpy fields are provider estimates; store fields come from the undocumented public Steam appdetails endpoint and can change without notice.',
  apps: {},
});
const errors = [];
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
const ageDays = (checkedAt) =>
  checkedAt ? (Date.now() - Date.parse(checkedAt)) / 86400000 : Infinity;
const queue = (key, maxAge, limit) =>
  catalog.games
    .map((game) => game.appId)
    .filter((appId) => ageDays(details.apps[appId]?.[key]?.checkedAt) > maxAge)
    .sort(
      (a, b) =>
        (Date.parse(details.apps[a]?.[key]?.checkedAt ?? 0) || 0) -
        (Date.parse(details.apps[b]?.[key]?.checkedAt ?? 0) || 0),
    )
    .slice(0, limit);
const entry = (appId) => (details.apps[appId] ??= { appId });
const save = () =>
  writeFile(new URL(detailsPath, root), JSON.stringify(details) + '\n');
await mkdir(new URL('data/steam/', root), { recursive: true });

let spyDone = 0;
let spyOk = 0;
let streak = 0;
// Stop a phase after repeated consecutive failures instead of hammering a blocked endpoint.
const MAX_STREAK = 10;
for (const appId of queue('spy', spyMaxAgeDays, spyLimit)) {
  const source = `https://steamspy.com/api.php?request=appdetails&appid=${appId}`;
  try {
    const game = await json(source);
    const tags = Object.entries(
      game.tags && !Array.isArray(game.tags) ? game.tags : {},
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
    entry(appId).spy = {
      checkedAt: new Date().toISOString(),
      source,
      tags,
      genre: game.genre || null,
      languages: game.languages || null,
      developer: game.developer || null,
      publisher: game.publisher || null,
      owners: game.owners || null,
      positive: game.positive ?? null,
      negative: game.negative ?? null,
      ccu: game.ccu ?? null,
      priceUsd:
        game.price === '' || game.price == null
          ? null
          : Number(game.price) / 100,
    };
    spyOk++;
    streak = 0;
  } catch (error) {
    errors.push({ appId, source, message: error.message });
    if (++streak >= MAX_STREAK) {
      console.log('SteamSpy unavailable; stopping this phase.');
      break;
    }
  }
  if (++spyDone % 100 === 0) {
    console.log(`SteamSpy appdetails: ${spyDone}`);
    await save();
  }
  await pause(1100);
}

let storeDone = 0;
let storeOk = 0;
streak = 0;
for (const appId of queue('store', storeMaxAgeDays, storeLimit)) {
  const source = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=english`;
  try {
    const response = await json(source);
    const data = response[appId]?.success ? response[appId].data : null;
    entry(appId).store = data
      ? {
          checkedAt: new Date().toISOString(),
          source,
          type: data.type ?? null,
          name: data.name ?? null,
          releaseDate: data.release_date?.date ?? null,
          comingSoon: Boolean(data.release_date?.coming_soon),
          shortDescription: data.short_description ?? null,
          headerImage: data.header_image ?? null,
          isFree: Boolean(data.is_free),
          priceUsd: data.is_free
            ? 0
            : data.price_overview?.initial != null
              ? data.price_overview.initial / 100
              : null,
          genres: (data.genres ?? []).map((item) => item.description),
          categories: (data.categories ?? []).map((item) => item.description),
          developers: data.developers ?? [],
          publishers: data.publishers ?? [],
          recommendations: data.recommendations?.total ?? null,
        }
      : { checkedAt: new Date().toISOString(), source, unavailable: true };
    storeOk++;
    streak = 0;
  } catch (error) {
    errors.push({ appId, source, message: error.message });
    if (++streak >= MAX_STREAK) {
      console.log('Steam store unavailable; stopping this phase.');
      break;
    }
    // Back off on throttling rather than burning the remaining batch.
    if (/HTTP 429|HTTP 403/.test(error.message)) await pause(60000);
  }
  if (++storeDone % 100 === 0) {
    console.log(`Store appdetails: ${storeDone}`);
    await save();
  }
  await pause(1600);
}

details.lastRun = {
  completedAt: new Date().toISOString(),
  spyChecked: spyOk,
  storeChecked: storeOk,
  errors: errors.slice(0, 200),
  errorCount: errors.length,
};
await save();
const all = Object.values(details.apps);
console.log(
  `Enriched ${spyOk} SteamSpy and ${storeOk} store records; ${errors.length} unavailable. Coverage: ${all.filter((app) => app.spy).length} SteamSpy, ${all.filter((app) => app.store).length} store of ${catalog.games.length} catalog apps.`,
);
