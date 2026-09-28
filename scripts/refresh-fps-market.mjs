import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as pause } from 'node:timers/promises';
const root = new URL('../', import.meta.url);
const file = new URL('app/data/fps-market.json', root);
const data = JSON.parse(await readFile(file, 'utf8'));
const artworkFile = new URL('app/data/game-images.json', root);
const artwork = JSON.parse(await readFile(artworkFile, 'utf8'));
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!response.ok) throw Error(`HTTP ${response.status}`);
  return response.json();
}
for (const game of data.games) {
  if (
    process.argv.includes('--missing-only') &&
    !game.metrics.errors.includes('Not collected yet')
  )
    continue;
  if (!/^\d+$/.test(game.appId)) throw Error('Invalid app ID');
  const id = game.appId;
  const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${id}&cc=us&l=english`;
  const reviewUrl = `https://store.steampowered.com/appreviews/${id}?json=1&language=all&purchase_type=all&num_per_page=1&filter=all&filter_offtopic_activity=1`;
  const paidUrl = reviewUrl.replace('purchase_type=all', 'purchase_type=steam');
  const playersUrl = `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${id}`;
  const results = await Promise.allSettled(
    [storeUrl, reviewUrl, paidUrl, playersUrl].map(get),
  );
  const errors = results.flatMap((result, i) =>
    result.status === 'rejected'
      ? [
          `${['Store', 'Reviews', 'Steam-purchase reviews', 'Current players'][i]}: ${result.reason.message}`,
        ]
      : [],
  );
  const value = (i) =>
    results[i].status === 'fulfilled' ? results[i].value : null;
  const store = value(0)?.[id]?.data;
  const all = value(1)?.query_summary;
  const paid = value(2)?.query_summary;
  const number = (value) =>
    Number.isFinite(value) && value >= 0 ? value : null;
  if (!store) errors.push('No usable store metadata');
  if (!all) errors.push('No usable review summary');
  if (!paid) errors.push('No usable Steam-purchase review summary');
  game.metrics = {
    checkedAt: new Date().toISOString(),
    reviews: number(all?.total_reviews),
    positive: number(all?.total_positive),
    steamReviews: number(paid?.total_reviews),
    priceUsd:
      store?.price_overview?.currency === 'USD'
        ? store.price_overview.initial / 100
        : null,
    free: store?.is_free === true,
    ccu:
      value(3)?.response?.result === 1
        ? number(value(3).response.player_count)
        : null,
    errors,
  };
  game.sources = game.sources.filter(
    (source) =>
      ![storeUrl, reviewUrl, paidUrl, playersUrl].includes(source.url),
  );
  for (const [url, label, uses] of [
    [
      storeUrl,
      'Store API',
      ['Current US base price, availability and official capsule artwork'],
    ],
    [
      reviewUrl,
      'Review snapshot',
      [
        'All-language, all-purchase review count and sentiment; off-topic activity filtered',
      ],
    ],
    [
      paidUrl,
      'Steam-purchase reviews',
      [
        'Steam-purchase review count used as scenario input; not audited copies sold',
      ],
    ],
    [
      playersUrl,
      'Current players',
      [
        'Concurrent Steam players at collection time; not daily or all-time peak',
      ],
    ],
  ]) {
    game.sources.push({
      url,
      label,
      uses,
      access:
        'Public Steam API; snapshot timestamp is recorded per game. A failed request is recorded as missing, not zero.',
    });
  }
  if (store?.header_image)
    artwork[id] = {
      ...artwork[id],
      url: store.header_image,
      width: 460,
      height: 215,
      checkedAt: game.metrics.checkedAt.slice(0, 10),
      source: `https://store.steampowered.com/app/${id}/`,
      kind: 'header',
    };
  console.log(
    `${game.title}: ${game.metrics.reviews ?? '?'} reviews, ${game.metrics.steamReviews ?? '?'} Steam, $${game.metrics.priceUsd ?? '?'}${errors.length ? ` (${errors.join('; ')})` : ''}`,
  );
  await pause(800);
}
data.checkedAt = new Date().toISOString();
await writeFile(file, JSON.stringify(data, null, 2) + '\n');
await writeFile(artworkFile, JSON.stringify(artwork, null, 2) + '\n');
