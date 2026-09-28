export type Source = {
  url: string;
  label: string;
  uses: string[];
  access: string;
};
export type MarketGame = {
  appId: string;
  title: string;
  developer: string;
  publisher: string;
  category: 'wave' | 'roguelite' | 'tactical' | 'campaign';
  cohort: 'study' | 'context';
  cooperative: boolean;
  firstSteamDate: string;
  releaseDate: string;
  status: 'Released' | 'Early Access';
  availability?: 'Delisted';
  revenueExclusion?: string;
  hook: string;
  scopeNote: string;
  indieContext: string;
  sources: Source[];
  metrics: {
    checkedAt: string;
    reviews: number | null;
    positive: number | null;
    steamReviews: number | null;
    priceUsd: number | null;
    free: boolean;
    ccu: number | null;
    errors: string[];
  };
};
export const categories = [
  {
    id: 'wave',
    label: 'Co-op wave / horde',
    description: 'Round survival and horde-defense hybrids with online co-op.',
  },
  {
    id: 'roguelite',
    label: 'Run-based FPS',
    description:
      'Roguelite runs, extraction loops and build-driven shooters; solo and co-op.',
  },
  {
    id: 'tactical',
    label: 'Tactical / mission FPS',
    description:
      'Objective-led co-op and tactical survival rather than repeated arena waves.',
  },
  {
    id: 'campaign',
    label: 'Campaign / arena FPS',
    description:
      'Authored campaigns, retro shooters and standalone arena games.',
  },
] as const;
export type Revenue = {
  low: number;
  high: number;
  unitsLow: number;
  unitsHigh: number;
};
export function estimate(game: MarketGame): Revenue | null {
  const { steamReviews, priceUsd, free } = game.metrics;
  if (
    game.revenueExclusion ||
    free ||
    steamReviews == null ||
    steamReviews <= 0 ||
    priceUsd == null ||
    priceUsd <= 0
  )
    return null;
  // ponytail: transparent sensitivity scenarios, not a calibrated sales model; replace with disclosed sales when available.
  return {
    low: steamReviews * 20 * priceUsd * 0.4,
    high: steamReviews * 60 * priceUsd * 0.8,
    unitsLow: steamReviews * 20,
    unitsHigh: steamReviews * 60,
  };
}
export function ageDays(game: MarketGame): number {
  return Math.max(
    1,
    Math.floor(
      (Date.parse(game.metrics.checkedAt) -
        Date.parse(`${game.firstSteamDate}T00:00:00Z`)) /
        86400000,
    ),
  );
}
export function positiveRate(game: MarketGame): number | null {
  const { reviews, positive } = game.metrics;
  return reviews && positive != null ? (positive / reviews) * 100 : null;
}
export function traction(game: MarketGame): string {
  const reviews = game.metrics.reviews;
  if (reviews == null) return 'Unknown';
  if (ageDays(game) < 30) return 'Early read';
  return reviews >= 10000
    ? 'Large audience'
    : reviews >= 1000
      ? 'Established'
      : reviews >= 100
        ? 'Growing'
        : 'Limited reach';
}
export function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const i = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[i] : (sorted[i - 1] + sorted[i]) / 2;
}
export function summarize(games: MarketGame[]) {
  const estimates = games
    .map(estimate)
    .filter((value): value is Revenue => value !== null);
  return {
    count: games.length,
    pricedCount: estimates.length,
    revenueLow: median(estimates.map((value) => value.low)),
    revenueHigh: median(estimates.map((value) => value.high)),
    medianReviews: median(
      games.flatMap((game) =>
        game.metrics.reviews == null ? [] : [game.metrics.reviews],
      ),
    ),
    medianAgeDays: median(games.map(ageDays)),
    medianPositive: median(
      games.flatMap((game) =>
        positiveRate(game) == null ? [] : [positiveRate(game)!],
      ),
    ),
    thousandReviewCount: games.filter(
      (game) => (game.metrics.reviews ?? 0) >= 1000,
    ).length,
  };
}
export function money(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
