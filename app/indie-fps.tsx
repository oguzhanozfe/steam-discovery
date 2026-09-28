'use client';
/* eslint-disable next/no-html-link-for-pages -- Static Vite build uses canonical HTML routes. */

import { useState, type CSSProperties } from 'react';
import {
  ArrowDownToLine,
  ArrowUpRight,
  Crosshair,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import directory from './data/indie-fps.json';
import marketData from './data/fps-market.json';
import {
  categories,
  estimate,
  ageDays,
  positiveRate,
  traction,
  summarize,
  money,
  type MarketGame,
  type Source,
} from './fps-model';
import { SteamArtwork } from './steam-artwork';
import { ReferenceLink, ReferenceRegister } from './source-references';

type DirectoryGame = (typeof directory.games)[number];
const marketGames = marketData.games as MarketGame[];
const study = marketGames.filter((game) => game.cohort === 'study');
const context = marketGames.filter((game) => game.cohort === 'context');
const community = marketGames.filter((game) => game.community);
const coOpCategories = categories
  .filter((category) => category.id !== 'campaign')
  .map((category) => ({
    ...category,
    label: category.id === 'roguelite' ? 'Run-based co-op' : category.label,
  }));
const coverage = marketData.coverage as {
  searches: { label: string; url: string; note: string }[];
  excluded: { title: string; appId: string; reason: string; url: string }[];
};
const comparisons = [
  ...coOpCategories.map((category) => ({
    ...category,
    ...summarize(
      study.filter((game) => game.cooperative && game.category === category.id),
    ),
  })),
  ...categories
    .filter((item) => item.id !== 'wave')
    .map((item) => ({
      id: `solo-${item.id}`,
      label: `Solo ${item.id === 'campaign' ? 'campaign / arena' : item.id === 'roguelite' ? 'run-based FPS' : 'tactical FPS'}`,
      ...summarize(
        study.filter((game) => !game.cooperative && game.category === item.id),
      ),
    })),
];
const maxMedianReviews = Math.max(
  1,
  ...comparisons.map((category) => category.medianReviews ?? 0),
);
const directoryGames = directory.games
  .slice()
  .sort(
    (a, b) =>
      Number(a.cohort === 'watchlist') - Number(b.cohort === 'watchlist') ||
      (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '') ||
      a.title.localeCompare(b.title),
  );
const allReferences = [
  ...marketGames.flatMap((game) =>
    game.sources.map((source) => ({
      url: source.url,
      uses: source.uses.map((use) => `${game.title}: ${use}`),
    })),
  ),
  ...directoryGames.flatMap((game) =>
    game.sources.map((source) => ({
      url: source.url,
      uses: source.uses.map((use) => `${game.title}: ${use}`),
    })),
  ),
  ...marketData.methodology.sources,
  ...marketData.coverage.searches.map((source) => ({
    url: source.url,
    uses: [source.note],
  })),
  ...marketData.coverage.excluded.map((source) => ({
    url: source.url,
    uses: [source.reason],
  })),
];
const checkedDate = directory.checkedAt.slice(0, 10);
const recentCutoff = new Date(
  Date.parse(`${checkedDate}T00:00:00Z`) - 90 * 86400000,
)
  .toISOString()
  .slice(0, 10);
const date = (value: string) =>
  new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
const number = (value: number | null) =>
  value === null ? 'Unavailable' : Math.round(value).toLocaleString('en-US');
const percent = (value: number | null) =>
  value === null ? 'Unavailable' : `${Math.round(value)}%`;
const range = (low: number | null, high: number | null) =>
  low === null || high === null
    ? 'Not estimated'
    : `${money(low)}–${money(high)}`;
const storeUrl = (appId: string) =>
  `https://store.steampowered.com/app/${appId}/`;

function Sources({ sources }: { sources: Source[] }) {
  return (
    <ul className="fps-sources">
      {sources.map((source) => (
        <li key={source.url}>
          <ReferenceLink url={source.url} />
          <span>{source.access}</span>
        </li>
      ))}
    </ul>
  );
}

function MarketCard({ game }: { game: MarketGame }) {
  const revenue = estimate(game);
  return (
    <article className="fps-game" id={`game-${game.appId}`}>
      <div className="fps-game-top">
        <a
          className="fps-game-art"
          href={storeUrl(game.appId)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${game.title} on Steam`}
        >
          <SteamArtwork appId={game.appId} title={game.title} />
        </a>
        <div className="fps-game-title">
          <div className="fps-badges">
            <span data-status={game.status}>{game.status}</span>
            {game.availability && <span>{game.availability}</span>}
            <span>{traction(game)}</span>
          </div>
          <h3>
            <a href={storeUrl(game.appId)} target="_blank" rel="noreferrer">
              {game.title}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </h3>
          <p>{game.developer}</p>
          <p>
            First Steam access{' '}
            <time dateTime={game.firstSteamDate}>
              {date(game.firstSteamDate)}
            </time>{' '}
            · {number(ageDays(game))} days since first Steam release
          </p>
        </div>
      </div>
      <p className="fps-game-hook">{game.hook}</p>
      {game.caseStudy && (
        <details className="fps-case-study">
          <summary>Read case study · loop, progression & lessons</summary>
          <dl>
            <div>
              <dt>Core loop</dt>
              <dd>{game.caseStudy.loop}</dd>
            </div>
            <div>
              <dt>Progression</dt>
              <dd>{game.caseStudy.progression}</dd>
            </div>
            <div>
              <dt>Co-op design</dt>
              <dd>{game.caseStudy.cooperativeDesign}</dd>
            </div>
            <div>
              <dt>Our design lesson</dt>
              <dd>{game.caseStudy.lesson}</dd>
            </div>
            <div>
              <dt>Limits</dt>
              <dd>{game.caseStudy.limits}</dd>
            </div>
          </dl>
          <p>
            Product facts: official sources below. Design lessons are editorial
            interpretation; no playtest or profit claim.
          </p>
        </details>
      )}
      <dl className="fps-game-metrics">
        <div>
          <dt>Total reviews</dt>
          <dd>{number(game.metrics.reviews)}</dd>
          <small>All purchase types</small>
        </div>
        <div>
          <dt>Positive reviews</dt>
          <dd>{percent(positiveRate(game))}</dd>
          <small>Player sentiment</small>
        </div>
        <div className="fps-revenue">
          <dt>Est. base-game gross</dt>
          <dd>
            {revenue
              ? range(revenue.low, revenue.high)
              : game.metrics.free
                ? 'Free to play'
                : 'Not estimated'}
          </dd>
          <small>Scenario · USD</small>
        </div>
      </dl>
      <details className="fps-game-evidence">
        <summary>
          Evidence, assumptions & sources{' '}
          <span>{game.sources.length} sources</span>
        </summary>
        <div className="fps-evidence-body">
          {game.revenueExclusion && (
            <p className="fps-data-gap">
              <strong>Revenue not estimated:</strong> {game.revenueExclusion}
            </p>
          )}
          <p>
            <strong>Comparable because:</strong> {game.scopeNote}
          </p>
          <p>
            <strong>Studio & market context:</strong> {game.indieContext}
          </p>
          <p>
            <strong>Credits:</strong> {game.developer} · Published by{' '}
            {game.publisher}.
          </p>
          <dl className="fps-evidence-metrics">
            <div>
              <dt>First Steam release</dt>
              <dd>{date(game.firstSteamDate)}</dd>
            </div>
            <div>
              <dt>Steam purchase reviews used for estimate</dt>
              <dd>{number(game.metrics.steamReviews)}</dd>
            </div>
            <div>
              <dt>Current US base price</dt>
              <dd>
                {game.metrics.free
                  ? 'Free'
                  : game.metrics.priceUsd === null
                    ? 'Unavailable'
                    : new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(game.metrics.priceUsd)}
              </dd>
            </div>
            <div>
              <dt>Concurrent players at check</dt>
              <dd>{number(game.metrics.ccu)} · one snapshot, not retention</dd>
            </div>
          </dl>
          <p>
            Checked {date(game.metrics.checkedAt)}. Revenue is an editorial
            scenario, not disclosed sales or profit.{' '}
            <a href="#fps-methodology">Read the calculation and limits.</a>
          </p>
          {game.metrics.errors.length > 0 && (
            <p className="fps-data-gap">
              <strong>Snapshot gaps:</strong> {game.metrics.errors.join('; ')}
            </p>
          )}
          <Sources sources={game.sources} />
        </div>
      </details>
    </article>
  );
}

function DirectoryCard({ game }: { game: DirectoryGame }) {
  return (
    <article
      className="fps-game fps-directory-game"
      id={`directory-${game.appId}`}
    >
      <div className="fps-game-top">
        <a
          className="fps-game-art"
          href={storeUrl(game.appId)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${game.title} on Steam`}
        >
          <SteamArtwork appId={game.appId} title={game.title} />
        </a>
        <div className="fps-game-title">
          <div className="fps-badges">
            <span data-status={game.status}>{game.status}</span>
            <span>{game.cohort === 'recent' ? '2025–26' : 'Watchlist'}</span>
          </div>
          <h3>
            <a href={storeUrl(game.appId)} target="_blank" rel="noreferrer">
              {game.title}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </h3>
          <p>{game.developer}</p>
          <p>
            {game.releaseDate ? date(game.releaseDate) : 'Date not announced'} ·{' '}
            {game.subgenre}
          </p>
        </div>
      </div>
      <p className="fps-game-hook">{game.hook}</p>
      <details className="fps-game-evidence">
        <summary>
          Release context & sources <span>{game.sources.length} sources</span>
        </summary>
        <div className="fps-evidence-body">
          <p>{game.releaseNote}</p>
          <p>
            <strong>Published by:</strong> {game.publisher}.
          </p>
          <p>{game.indieContext}</p>
          <Sources sources={game.sources} />
        </div>
      </details>
    </article>
  );
}

export function IndieFps() {
  const [view, setView] = useState<'market' | 'directory'>('market');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('coop');
  const [cohort, setCohort] = useState('all');
  const [sort, setSort] = useState('reviews');
  const search = query.trim().toLowerCase();
  const selected = (
    category === 'community'
      ? community
      : category === 'context'
        ? context
        : study
  ).filter(
    (game) =>
      category === 'all' ||
      category === 'context' ||
      category === 'community' ||
      (category.startsWith('solo')
        ? !game.cooperative &&
          (category === 'solo' || game.category === category.slice(5))
        : game.cooperative &&
          (category === 'coop' || game.category === category)),
  );
  const summary = summarize(selected);
  const featured =
    study.find((game) => game.appId === '1492070') ??
    study.find((game) => game.category === 'wave');
  const categoryLabel =
    category === 'coop'
      ? 'Co-op FPS · three-year sample'
      : category === 'solo'
        ? 'Solo FPS · comparison sample'
        : (comparisons.find((item) => item.id === category)?.label ??
          (category === 'context'
            ? 'Context · excluded from comparisons'
            : 'All study categories'));
  const filteredMarket = selected
    .filter(
      (game) =>
        (status === 'all' || game.status === status) &&
        `${game.title} ${game.developer} ${game.publisher} ${game.hook}`
          .toLowerCase()
          .includes(search),
    )
    .sort((a, b) => {
      if (sort === 'newest')
        return (
          b.firstSteamDate.localeCompare(a.firstSteamDate) ||
          a.title.localeCompare(b.title)
        );
      if (sort === 'revenue')
        return (
          (estimate(b)?.low ?? -1) - (estimate(a)?.low ?? -1) ||
          a.title.localeCompare(b.title)
        );
      return (
        (b.metrics.reviews ?? -1) - (a.metrics.reviews ?? -1) ||
        a.title.localeCompare(b.title)
      );
    });
  const filteredDirectory = directoryGames.filter(
    (game) =>
      (status === 'all' || game.status === status) &&
      (cohort === 'all' ||
        game.cohort === cohort ||
        (cohort === '90-days' &&
          game.status !== 'Upcoming' &&
          game.releaseDate !== null &&
          game.releaseDate >= recentCutoff &&
          game.releaseDate <= checkedDate)) &&
      `${game.title} ${game.developer} ${game.publisher} ${game.subgenre} ${game.hook}`
        .toLowerCase()
        .includes(search),
  );
  const reset = () => {
    setQuery('');
    setStatus('all');
    setCategory(category === 'community' ? 'community' : 'coop');
    setCohort('all');
    setSort('reviews');
  };
  const changeView = (next: 'market' | 'directory') => {
    setView(next);
    reset();
    setCategory('coop');
  };
  const hasFilters =
    query !== '' ||
    status !== 'all' ||
    (view === 'market'
      ? (category !== 'coop' && category !== 'community') || sort !== 'reviews'
      : cohort !== 'all');

  return (
    <section className="workbench hub-view fps-view">
      <header className="fps-hero">
        <div className="fps-hero-copy">
          <p className="fps-eyebrow">
            <Crosshair size={17} aria-hidden="true" /> STEAM MARKET INTELLIGENCE{' '}
            <span>2023–2026</span>
          </p>
          <h1>
            Co-op FPS.
            <br />
            <span>By the numbers.</span>
          </h1>
          <p>
            Wave survival, roguelites and mission-based co-op. Compare player
            traction, release age and estimated gross revenue before choosing
            your scope.
          </p>
          <div className="fps-hero-links">
            <a href="#fps-games">
              Explore the games <ArrowUpRight size={16} aria-hidden="true" />
            </a>
            <a href="#fps-methodology">Method & limits</a>
            <span>Checked {date(marketData.checkedAt)}</span>
          </div>
        </div>
        {featured && (
          <figure className="fps-hero-art">
            <SteamArtwork
              appId={featured.appId}
              title={featured.title}
              priority
            />
            <figcaption>
              <span>IN THE STUDY</span> {featured.title}
              <a
                href={storeUrl(featured.appId)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${featured.title} on Steam`}
              >
                <ArrowUpRight size={18} />
              </a>
            </figcaption>
          </figure>
        )}
      </header>

      <div className="fps-view-switch" aria-label="Research collection">
        <button
          type="button"
          aria-pressed={view === 'market' && category !== 'community'}
          onClick={() => changeView('market')}
        >
          Co-op market study{' '}
          <span>{study.filter((game) => game.cooperative).length}</span>
        </button>
        <button
          type="button"
          aria-pressed={view === 'market' && category === 'community'}
          onClick={() => {
            changeView('market');
            setCategory('community');
          }}
        >
          Community case studies <span>{community.length}</span>
        </button>
        <button
          type="button"
          aria-pressed={view === 'directory'}
          onClick={() => changeView('directory')}
        >
          FPS release directory <span>{directoryGames.length}</span>
        </button>
        <a
          href={
            view === 'market' ? '/data/fps-market.json' : '/data/indie-fps.json'
          }
          download
        >
          <ArrowDownToLine size={16} aria-hidden="true" /> Download data
        </a>
      </div>

      {view === 'market' && category !== 'community' ? (
        <>
          <div className="fps-section-top">
            <div>
              <p className="fps-eyebrow">SELECTED COHORT</p>
              <h2>{categoryLabel}</h2>
            </div>
            <p>
              {category === 'context'
                ? 'Older releases and scope boundaries — outside the comparison sample'
                : `First Steam release: ${date(marketData.windowStart)}–${date(marketData.windowEnd)}`}
            </p>
          </div>
          <div className="fps-kpis" aria-label={`${categoryLabel} summary`}>
            <div>
              <span>Games in this sample</span>
              <strong>{summary.count}</strong>
              <small>
                {summary.thousandReviewCount} with 1,000+ total reviews
              </small>
            </div>
            <div>
              <span>Median total reviews</span>
              <strong>{number(summary.medianReviews)}</strong>
              <small>
                {summary.medianAgeDays === null
                  ? 'Release age unavailable'
                  : `${number(summary.medianAgeDays)} days median release age`}
              </small>
            </div>
            <div>
              <span>Median positive share</span>
              <strong>{percent(summary.medianPositive)}</strong>
              <small>Per-game player sentiment</small>
            </div>
            <div className="fps-kpi-revenue">
              <span>Median est. base-game gross</span>
              <strong>{range(summary.revenueLow, summary.revenueHigh)}</strong>
              <small>
                Scenario · USD · {summary.pricedCount}/{summary.count} games
                estimable
              </small>
            </div>
          </div>
          <p className="fps-sample-note">
            {marketData.coverageNote}{' '}
            <a href="#fps-methodology">
              Estimates are scenarios, not profit or a success probability.
            </a>
          </p>

          <section
            className="fps-comparison"
            aria-labelledby="fps-compare-heading"
          >
            <div className="fps-comparison-header">
              <div>
                <p className="fps-eyebrow">CATEGORY COMPARISON</p>
                <h2 id="fps-compare-heading">
                  Different loops. Different outcomes.
                </h2>
              </div>
              <span>Bars: median total reviews</span>
            </div>
            <div className="fps-comparison-labels" aria-hidden="true">
              <span>Category · sample / median age</span>
              <span>Median reviews</span>
              <span>Positive</span>
              <span>Median gross scenario · USD</span>
            </div>
            {comparisons.map((item) => (
              <button
                className="fps-comparison-row"
                type="button"
                key={item.id}
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
                aria-label={`Filter ${item.label}: ${item.count} games, ${number(item.medianReviews)} median total reviews`}
              >
                <span className="fps-comparison-name">
                  <strong>{item.label}</strong>
                  <small>
                    n={item.count} · {number(item.medianAgeDays)} median days
                  </small>
                </span>
                <span className="fps-comparison-volume">
                  <strong>{number(item.medianReviews)}</strong>
                  <span className="fps-bar" aria-hidden="true">
                    <span
                      style={
                        {
                          '--fps-bar-width': `${((item.medianReviews ?? 0) / maxMedianReviews) * 100}%`,
                        } as CSSProperties
                      }
                    />
                  </span>
                </span>
                <span className="fps-comparison-positive">
                  <small>Positive</small>
                  {percent(item.medianPositive)}
                </span>
                <span className="fps-comparison-revenue">
                  <small>Median gross scenario · USD</small>
                  {range(item.revenueLow, item.revenueHigh)}
                  <small>
                    Estimated: {item.pricedCount}/{item.count} games
                  </small>
                </span>
              </button>
            ))}
            <p>
              Solo categories are curated benchmarks, not representative market
              samples. Comparisons use the study cohort only and differ in
              release age; reviews and revenue scenarios are lifetime snapshots,
              not age-adjusted outcomes. Select a row to explore that category.
            </p>
          </section>
        </>
      ) : view === 'market' ? (
        <div className="fps-directory-intro fps-community-intro">
          <div>
            <p className="fps-eyebrow">
              COMMUNITY PICKS · PRIMARY-SOURCE RESEARCH
            </p>
            <h2>What makes a wave worth surviving?</h2>
          </div>
          <p>
            Games from the{' '}
            <a href={marketData.community.url} target="_blank" rel="noreferrer">
              wave-survival discussion on Reddit
            </a>
            , checked against official product descriptions. Open a case study
            for its combat loop, progression, co-op design and a lesson to test.
          </p>
          <p>{marketData.community.note}</p>
          {marketData.community.unresolved.map((item) => (
            <p key={item.title}>
              <strong>{item.title}:</strong> {item.reason}
            </p>
          ))}
        </div>
      ) : (
        <div className="fps-directory-intro">
          <div>
            <p className="fps-eyebrow">BROADER RELEASE DIRECTORY</p>
            <h2>More FPS games to keep in view.</h2>
          </div>
          <p>{directory.scope}</p>
        </div>
      )}

      <section
        className="fps-results"
        id="fps-games"
        aria-labelledby="fps-games-heading"
      >
        <div className="fps-section-top">
          <div>
            <p className="fps-eyebrow">
              {view === 'market' ? 'THE COMPARABLES' : 'RELEASES & WATCHLIST'}
            </p>
            <h2 id="fps-games-heading">
              {view === 'market'
                ? category === 'community'
                  ? 'Community picks & case studies.'
                  : 'Look at the games behind the numbers.'
                : 'Find your next reference.'}
            </h2>
          </div>
          <SlidersHorizontal size={20} aria-hidden="true" />
        </div>
        <form
          className="fps-filters"
          role="search"
          aria-label="Filter indie FPS games"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="fps-query" htmlFor="fps-search">
            <span>Search</span>
            <span className="fps-search-field">
              <Search size={17} aria-hidden="true" />
              <input
                id="fps-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                maxLength={120}
                placeholder="Game or studio…"
              />
            </span>
          </label>
          {view === 'market' ? (
            <label htmlFor="fps-category">
              <span>Category</span>
              <select
                id="fps-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="coop">All co-op FPS</option>
                <option value="community">
                  Community picks · case studies
                </option>
                <option value="all">All games · including solo</option>
                {coOpCategories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
                <option value="solo">All solo FPS · comparison</option>
                {comparisons
                  .filter((item) => item.id.startsWith('solo-'))
                  .map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.label}
                    </option>
                  ))}
                <option value="context">
                  Context · older / other perspectives
                </option>
              </select>
            </label>
          ) : (
            <label htmlFor="fps-cohort">
              <span>Collection</span>
              <select
                id="fps-cohort"
                value={cohort}
                onChange={(event) => setCohort(event.target.value)}
              >
                <option value="all">All games</option>
                <option value="90-days">Last 90 days</option>
                <option value="recent">2025–26 releases</option>
                <option value="watchlist">Older EA & upcoming</option>
              </select>
            </label>
          )}
          <label htmlFor="fps-status">
            <span>Status</span>
            <select
              id="fps-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              <option value="Released">Released</option>
              <option value="Early Access">Early Access</option>
              {view === 'directory' && (
                <option value="Upcoming">Upcoming</option>
              )}
            </select>
          </label>
          {view === 'market' && (
            <label htmlFor="fps-sort">
              <span>Sort by</span>
              <select
                id="fps-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="reviews">Most reviews</option>
                <option value="revenue">Gross estimate · low scenario</option>
                <option value="newest">Newest first Steam release</option>
              </select>
            </label>
          )}
          <button
            className="fps-reset"
            type="button"
            onClick={reset}
            disabled={!hasFilters}
          >
            <X size={16} aria-hidden="true" />
            <span>Reset</span>
          </button>
        </form>
        <div className="fps-results-meta">
          <output aria-live="polite" aria-atomic="true">
            {view === 'market'
              ? `${filteredMarket.length} of ${selected.length} games in this category`
              : `${filteredDirectory.length} of ${directoryGames.length} games`}
          </output>
          <span>
            {view === 'market'
              ? 'Traction labels describe reviews, not commercial success'
              : cohort === '90-days'
                ? `${date(recentCutoff)}–${date(checkedDate)}`
                : 'Recent releases first · watchlist after'}
          </span>
        </div>
        <div className="fps-game-grid">
          {view === 'market'
            ? filteredMarket.map((game) => (
                <MarketCard game={game} key={game.appId} />
              ))
            : filteredDirectory.map((game) => (
                <DirectoryCard game={game} key={game.appId} />
              ))}
        </div>
        {(view === 'market' ? filteredMarket : filteredDirectory).length ===
          0 && (
          <div className="fps-empty">
            <h3>No games match these filters.</h3>
            <p>Try another game, studio or category.</p>
            <button className="fps-reset" type="button" onClick={reset}>
              Reset filters
            </button>
          </div>
        )}
      </section>

      <details className="fps-methodology" id="fps-methodology">
        <summary>
          <span>
            <span className="fps-eyebrow">HOW TO READ THIS STUDY</span>Method,
            selection & blind spots
          </span>
          <span>Open methodology</span>
        </summary>
        <div className="fps-methodology-body">
          <h2>Scope and selection</h2>
          <p>{marketData.scope}</p>
          <p>
            Visible released games have at least {marketData.minimumReviews}{' '}
            total Steam reviews. Removing the lowest-reach games raises sample
            medians; these comparisons cannot estimate a market-wide success
            rate. Community case studies also include older games, third-person
            and top-down shooters, and major-publisher references. Only games
            meeting the study’s date, FPS and independent-development criteria
            enter its comparisons.
          </p>
          <p>
            Independent and creator-led games are the focus. External publishers
            are allowed. Where only studio credits are available, indie status
            is provisional and stated per game; the cohort is not an audited
            ownership or small-team budget census.
          </p>
          <h3>Revenue is a scenario</h3>
          <p>{marketData.methodology.summary}</p>
          <p className="fps-formula">{marketData.methodology.formula}</p>
          <ul>
            {marketData.methodology.limitations.map((limit) => (
              <li key={limit}>{limit}</li>
            ))}
          </ul>
          <h3>Review traction is not profitability</h3>
          <p>
            Fewer than 100 total reviews: limited. 100–999: growing.
            1,000–9,999: established. 10,000 or more: large. Games younger than
            30 days are an early read. These labels do not establish development
            costs, profit, retention or a probability of success.
          </p>
          <h3>Category boundaries</h3>
          <dl className="fps-category-definitions">
            {categories.map((item) => (
              <div key={item.id}>
                <dt>{item.label}</dt>
                <dd>{item.description}</dd>
              </div>
            ))}
          </dl>
          {context.length > 0 && (
            <>
              <h3>Context only · excluded from comparisons</h3>
              <ul>
                {context.map((game) => (
                  <li key={game.appId}>
                    <a
                      href={storeUrl(game.appId)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {game.title}
                    </a>{' '}
                    — {game.scopeNote}
                  </li>
                ))}
              </ul>
            </>
          )}
          <h3>Search coverage</h3>
          <ul>
            {coverage.searches.map((item) => (
              <li key={item.url}>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                </a>{' '}
                — {item.note}
              </li>
            ))}
          </ul>
          {coverage.excluded.length > 0 && (
            <>
              <h3>Excluded & unresolved candidates</h3>
              <ul>
                {coverage.excluded.map((item) => (
                  <li key={item.appId}>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.title}
                    </a>{' '}
                    — {item.reason}
                  </li>
                ))}
              </ul>
            </>
          )}
          <Sources sources={marketData.methodology.sources} />
        </div>
      </details>
      <details className="fps-references">
        <summary>Full source register & claim-level references</summary>
        <ReferenceRegister references={allReferences} />
      </details>
    </section>
  );
}
