import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  estimate,
  median,
  summarize,
  ageDays,
  traction,
  positiveRate,
} from '../app/fps-model.ts';
const data = JSON.parse(
  await readFile(
    new URL('../app/data/fps-market.json', import.meta.url),
    'utf8',
  ),
);
const game = {
  firstSteamDate: '2026-08-01',
  metrics: {
    checkedAt: '2026-09-28T12:00:00Z',
    steamReviews: 100,
    reviews: 125,
    positive: 100,
    priceUsd: 10,
    free: false,
  },
};
assert.deepEqual(estimate(game), {
  low: 8000,
  high: 48000,
  unitsLow: 2000,
  unitsHigh: 6000,
});
for (const patch of [
  { free: true },
  { priceUsd: null },
  { priceUsd: 0 },
  { steamReviews: null },
  { steamReviews: 0 },
])
  assert.equal(
    estimate({ ...game, metrics: { ...game.metrics, ...patch } }),
    null,
  );
assert.equal(positiveRate(game), 80);
assert.equal(estimate({ ...game, revenueExclusion: 'Mixed free/paid history' }), null);
assert.equal(
  positiveRate({ ...game, metrics: { ...game.metrics, reviews: 0 } }),
  null,
);
assert.equal(ageDays(game), 58);
assert.equal(traction(game), 'Growing');
assert.equal(traction({ ...game, firstSteamDate: '2026-09-27' }), 'Early read');
assert.equal(median([]), null);
assert.equal(median([8, 2]), 5);
assert.equal(median([9, 1, 4]), 4);
assert.equal(summarize([]).revenueLow, null);
assert.equal(
  summarize([game, { ...game, metrics: { ...game.metrics, free: true } }])
    .pricedCount,
  1,
);
const ids = new Set();
for (const g of data.games) {
  assert.match(g.appId, /^\d+$/);
  assert(!ids.has(g.appId), `Duplicate ${g.appId}`);
  ids.add(g.appId);
  assert(['wave', 'roguelite', 'tactical', 'campaign'].includes(g.category));
  assert(['Released', 'Early Access'].includes(g.status));
  assert.equal(typeof g.cooperative, 'boolean');
  assert(g.firstSteamDate <= g.releaseDate, `${g.title}: chronology`);
  if (g.cohort === 'study')
    assert(
      g.firstSteamDate >= data.windowStart &&
        g.firstSteamDate <= data.windowEnd,
      `${g.title}: outside window`,
    );
  assert(
    !g.metrics.errors.includes('Not collected yet'),
    `${g.title}: uncollected`,
  );
  for (const key of ['reviews', 'positive', 'steamReviews', 'priceUsd', 'ccu'])
    assert(
      g.metrics[key] === null ||
        (Number.isFinite(g.metrics[key]) && g.metrics[key] >= 0),
      `${g.title} ${key}`,
    );
  if (g.metrics.reviews !== null && g.metrics.positive !== null)
    assert(g.metrics.positive <= g.metrics.reviews);
  assert.equal(
    new Set(g.sources.map((source) => source.url)).size,
    g.sources.length,
    `${g.title}: duplicate source`,
  );
  for (const source of g.sources) {
    assert(new URL(source.url).protocol === 'https:');
    assert(source.uses.length > 0 && source.access);
  }
  const revenue = estimate(g);
  if (revenue)
    assert(Number.isFinite(revenue.low) && revenue.low <= revenue.high);
}
console.log(
  `FPS model + ${data.games.length} records passed (dates, sources, missing data, estimates and cohort bounds).`,
);
