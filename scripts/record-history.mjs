import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';

// Appends dated review/price/CCU observations to data/history/<YYYY-MM-DD>.json.
// Each point is filed under the date it was actually checked, with its source,
// so re-running is idempotent and different review definitions never mix.
const root = new URL('../', import.meta.url);
const read = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(new URL(path, root), 'utf8'));
  } catch (error) {
    if (fallback !== undefined && error.code === 'ENOENT') return fallback;
    throw error;
  }
};
const historyFields = [
  'appId',
  'source',
  'reviews',
  'positive',
  'ccu',
  'priceUsd',
];
const catalog = await read('public/data/radar-catalog.json');
const details = await read('data/steam/app-details.json', { apps: {} });

const byDate = new Map();
const add = (checkedAt, appId, source, reviews, positive, ccu, priceUsd) => {
  if (!checkedAt || reviews == null) return;
  const date = new Date(checkedAt).toISOString().slice(0, 10);
  if (!byDate.has(date)) byDate.set(date, new Map());
  byDate
    .get(date)
    .set(`${appId}:${source}`, [
      appId,
      source,
      reviews,
      positive,
      ccu,
      priceUsd,
    ]);
};
for (const game of catalog.games) {
  // "api" = official appreviews totals (curated rows); "spy" = SteamSpy positive + negative.
  if (game.cohort === 'Curated research')
    add(
      game.checkedAt,
      game.appId,
      'api',
      game.reviews,
      game.positive,
      game.ccu,
      game.priceUsd,
    );
  else if (game.cohort === 'SteamSpy owner-ranked sample')
    add(
      game.checkedAt,
      game.appId,
      'spy',
      game.reviews,
      game.positive,
      game.ccu,
      game.priceUsd,
    );
}
for (const [appId, app] of Object.entries(details.apps)) {
  const spy = app.spy;
  if (spy && spy.positive != null && spy.negative != null)
    add(
      spy.checkedAt,
      appId,
      'spy',
      spy.positive + spy.negative,
      spy.positive,
      spy.ccu,
      spy.priceUsd,
    );
}

await mkdir(new URL('data/history/', root), { recursive: true });
let written = 0;
for (const [date, points] of byDate) {
  const path = `data/history/${date}.json`;
  const existing = await read(path, { date, fields: historyFields, rows: [] });
  const merged = new Map(
    existing.rows.map((row) => [`${row[0]}:${row[1]}`, row]),
  );
  for (const [key, row] of points) merged.set(key, row);
  const rows = [...merged.values()].sort(
    (a, b) => Number(a[0]) - Number(b[0]) || a[1].localeCompare(b[1]),
  );
  await writeFile(
    new URL(path, root),
    JSON.stringify({
      date,
      fields: historyFields,
      sources: {
        api: 'Steam appreviews: all languages, all purchase types, off-topic filtered',
        spy: 'SteamSpy positive + negative (provider cache)',
      },
      rows,
    }) + '\n',
  );
  written += points.size;
}
const files = (await readdir(new URL('data/history/', root))).filter((name) =>
  name.endsWith('.json'),
);
console.log(
  `Recorded ${written} observations across ${byDate.size} dates; ${files.length} history days on disk.`,
);
