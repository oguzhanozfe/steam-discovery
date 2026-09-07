export type RadarGame = {
  appId: string;
  title: string;
  genre: string;
  tags: string[];
  developer?: string | null;
  publisher?: string | null;
  releaseDate: string | null;
  status: string;
  priceUsd: number | null;
  owners: string | null;
  reviews: number | null;
  positive: number | null;
  negative: number | null;
  ccu: number | null;
  reviewDefinition: string;
  ccuDefinition?: string | null;
  checkedAt: string;
  cohort: string;
  source: string;
  steamUrl: string;
  hook?: string;
  recordId?: string | null;
  headerImage?: string | null;
  reviewDelta?: number | null;
  previousCheckedAt?: string | null;
  previousReviews?: number | null;
  ownerSource?: string | null;
  ownerCheckedAt?: string | null;
};
export type RadarFilters = {
  query: string;
  cohort: string;
  status: string;
  signal: string;
  sort: string;
  savedOnly: boolean;
};
export const defaultRadarFilters: RadarFilters = {
  query: '',
  cohort: 'All records',
  status: 'Any status',
  signal: 'Any signal',
  sort: 'Research first',
  savedOnly: false,
};
export function selectRadarGames(
  games: RadarGame[],
  filters: RadarFilters,
  saved: string[] = [],
) {
  const words = filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const result = games.filter((game) => {
    const haystack = [
      game.appId,
      game.title,
      game.genre,
      ...game.tags,
      game.developer,
      game.publisher,
      game.hook,
    ]
      .join(' ')
      .toLowerCase();
    const [low, high] = (game.owners ?? '')
      .split('..')
      .map((part) => Number(part.replace(/[^\d]/g, '')));
    return (
      words.every((word) => haystack.includes(word)) &&
      (filters.cohort === 'All records' || game.cohort === filters.cohort) &&
      (filters.status === 'Any status' || game.status === filters.status) &&
      (!filters.savedOnly || saved.includes(game.appId)) &&
      (filters.signal === 'Any signal' ||
        (filters.signal === '100–200K owner estimate' &&
          low === 100000 &&
          high === 200000) ||
        (filters.signal === 'Under 1K reviews' &&
          game.reviews !== null &&
          game.reviews < 1000) ||
        (filters.signal === '1K+ reviews' &&
          game.reviews !== null &&
          game.reviews >= 1000) ||
        (filters.signal === 'Unknown review count' && game.reviews === null))
    );
  });
  result.sort((a, b) =>
    filters.sort === 'Most reviews'
      ? (b.reviews ?? -1) - (a.reviews ?? -1)
      : filters.sort === 'Fewest reviews'
        ? (a.reviews ?? Infinity) - (b.reviews ?? Infinity)
        : filters.sort === 'Title A–Z'
          ? a.title.localeCompare(b.title)
          : filters.sort === 'Latest check'
            ? b.checkedAt.localeCompare(a.checkedAt)
            : Number(b.cohort === 'Curated research') -
                Number(a.cohort === 'Curated research') ||
              a.title.localeCompare(b.title),
  );
  return result;
}
export function positiveShare(game: RadarGame) {
  if (
    game.positive === null ||
    game.negative === null ||
    game.positive + game.negative === 0
  )
    return null;
  return Math.round((100 * game.positive) / (game.positive + game.negative));
}
