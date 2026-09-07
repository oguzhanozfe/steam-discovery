'use client';
/* eslint-disable next/no-html-link-for-pages -- Static Vite build uses canonical HTML routes, not the Next router. */

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  Compass,
  Download,
  Radar,
  Search,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import snapshot from './data/radar-snapshot.json';
import conceptData from './data/solo-concepts.json';
import articleData from './data/hub-articles.json';
import nicheData from './data/hub-niches.json';
import { gameLibrary, readingLibrary } from './discovery-data';
import { gameStories, storyPath } from './editorial-data';
import {
  defaultRadarFilters,
  positiveShare,
  selectRadarGames,
  type RadarFilters,
  type RadarGame,
} from './hub-model';
import { SteamArtwork } from './steam-artwork';

const initialGames = snapshot.games as RadarGame[];
const day = (value: string) =>
  value.includes('T')
    ? new Date(value).toLocaleDateString('en-CA', {
        timeZone: 'Europe/Istanbul',
      })
    : value.slice(0, 10);
const number = (value: number | null | undefined) =>
  value == null ? 'Unknown' : value.toLocaleString('en-US');
const niches = nicheData.niches;
const date = '2026-09-08';
function Links({ urls }: { urls: string[] }) {
  return (
    <div className="hub-sources">
      {[...new Set(urls)].map((url) => (
        <a key={url} href={url} target="_blank" rel="noreferrer">
          {new URL(url, 'https://steam-discovery.vercel.app').hostname.replace(
            /^www\./,
            '',
          )}
          <ArrowUpRight size={14} />
        </a>
      ))}
    </div>
  );
}
function Items({ items }: { items: string[] }) {
  return (
    <ul className="hub-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
function Header({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="hub-heading">
      <p className="section-kicker">{kicker}</p>
      <h1>{title}</h1>
      <p>{children}</p>
    </header>
  );
}

export function SmallTeamHub() {
  const [search, setSearch] = useState('');
  const choices = niches.filter((niche) =>
    `${niche.title} ${niche.playerJob} ${niche.watch}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <section className="workbench hub-view">
      <Header
        kicker="SMALL TEAM GAME DEV HUB"
        title="Find your audience. Choose a smaller game."
      >
        Explore the market, understand the games, then turn one player promise
        into a test you can finish.
      </Header>
      <div className="hub-entry-grid">
        <a className="hub-entry primary" href="/radar/">
          <Radar />
          <span>
            <strong>Steam Radar</strong>
            <p>
              {number(snapshot.catalogCount)} searchable apps. Compare evidence,
              find a niche and save your watchlist.
            </p>
          </span>
          <ArrowRight />
        </a>
        <a className="hub-entry" href="/solo-lab/">
          <Compass />
          <span>
            <strong>One person. Two weeks.</strong>
            <p>
              {conceptData.concepts.length} original spins, hard scope cuts, AI
              workflows and a day-by-day plan.
            </p>
          </span>
          <ArrowRight />
        </a>
      </div>
      <div className="hub-stats">
        <span>
          <b>{gameStories.length}</b> game stories
        </span>
        <span>
          <b>{readingLibrary.length}</b> research notes
        </span>
        <span>
          <b>{niches.length}</b> niche briefs
        </span>
        <span>
          <b>{articleData.articles.length}</b> action playbooks
        </span>
        <span>
          Research checked <b>{date}</b>
        </span>
      </div>
      <div className="hub-section-heading">
        <div>
          <p className="section-kicker">WHAT TO WATCH · EDITORIAL RESEARCH</p>
          <h2>Where a small team can test a different promise</h2>
        </div>
        <label className="hub-search" htmlFor="niche-search">
          <Search size={18} />
          <span className="sr-only">Search niche briefs</span>
          <Input
            id="niche-search"
            maxLength={120}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Horror, cozy, inventory, logistics…"
          />
        </label>
      </div>
      <p className="hub-muted">
        Selected comparables establish that an audience exists. They do not
        prove an empty market or predict your sales. These are research
        priorities, not live alerts.
      </p>
      <div className="hub-niche-grid">
        {choices.map((niche) => (
          <article className="hub-niche" key={niche.id} id={niche.id}>
            <div className="hub-card-top">
              <span>{niche.scopeFit}</span>
              <span>{niche.comparables.length} comparables</span>
            </div>
            <h3>{niche.title}</h3>
            <p>{niche.playerJob}</p>
            <dl>
              <div>
                <dt>Demand signal</dt>
                <dd>{niche.demand}</dd>
              </div>
              <div>
                <dt>Competition</dt>
                <dd>{niche.supply}</dd>
              </div>
              <div>
                <dt>Watch next</dt>
                <dd>{niche.watch}</dd>
              </div>
              <div>
                <dt>Opening to test</dt>
                <dd>{niche.opening}</dd>
              </div>
            </dl>
            <div className="hub-comps">
              {niche.comparables.map((game) => (
                <a
                  key={game.appId}
                  href={`/radar/?q=${encodeURIComponent(game.title)}`}
                >
                  <span>{game.title}</span>
                  <small>
                    {number(game.reviews)} reviews · {game.asOf}
                  </small>
                </a>
              ))}
            </div>
            <p className="hub-caution">{niche.limitation}</p>
            <Links urls={niche.sources} />
            <a
              className="hub-action"
              href={`/solo-lab/#${conceptData.concepts.find((concept) => concept.nicheId === niche.id)?.id ?? 'concepts'}`}
            >
              Explore a two-week spin in this niche <ArrowRight size={16} />
            </a>
          </article>
        ))}
      </div>
      {!choices.length && (
        <output aria-live="polite">
          No niche matches.{' '}
          <button onClick={() => setSearch('')}>Clear search</button>
        </output>
      )}
      <section className="hub-section">
        <div className="hub-section-heading">
          <div>
            <p className="section-kicker">NEWLY DIGESTED · HISTORICAL & RECENT CASES</p>
            <h2>More stories. Different routes to an audience.</h2>
          </div>
          <a href="/stories/">All {gameStories.length} stories →</a>
        </div>
        <div className="hub-story-grid">
          {gameStories
            .filter((story) =>
              [
                'balatro',
                'repo',
                'minami-lane',
                'a-game-about-digging-a-hole',
                'arco',
                'power-of-ten',
              ].includes(story.id),
            )
            .map((story) => (
              <a
                href={storyPath(story.id)}
                className="story-card"
                key={story.id}
              >
                <SteamArtwork appId={String(story.appId)} title={story.title} />
                <div>
                  <span className="section-kicker">{story.title}</span>
                  <h3>{story.headline}</h3>
                  <p>{story.deck}</p>
                  <span className="hub-action">
                    Story, KPI, chronology, build transfer →
                  </span>
                </div>
              </a>
            ))}
        </div>
      </section>
      <section className="hub-section">
        <div className="hub-section-heading">
          <h2>A practical reading path</h2>
          <a href="/playbooks/">All action playbooks →</a>
        </div>
        <ol className="hub-reading-path">
          {[
            [
              'steam-visibility-mechanisms',
              'Understand discovery',
              'What Valve actually says about visibility.',
            ],
            [
              'gamalytic-methodology-metric-definitions',
              'Read metrics correctly',
              'Owners, reviews, gross revenue and income are different.',
            ],
            [
              'gdc-hearth-hamlet-compact-incrementals',
              'Choose a small promise',
              'When a beautiful screenshot implies too much game.',
            ],
            [
              'gamedeveloper-power-of-ten-wishlist-countercase',
              'Read the downside',
              'Wishlists do not make launch demand certain.',
            ],
            [
              'lieu-sheepherds-gameplay-trailer',
              'Make the action legible',
              'Show an action, its consequence and a complication.',
            ],
          ].map(([id, title, detail], i) => (
            <li key={id}>
              <span>0{i + 1}</span>
              <a href={`/playbooks/${id}/`}>
                <strong>{title}</strong>
                <p>{detail}</p>
              </a>
            </li>
          ))}
        </ol>
      </section>
      <p className="hub-method">
        Independent, AI-assisted research by Steam Discovery. Game art belongs
        to the respective rights holders. Not affiliated with Valve, SteamSpy or
        the cited publications.{' '}
        <a href="/about/">Methodology and corrections</a>.
      </p>
    </section>
  );
}

export function SteamRadar() {
  const [games, setGames] = useState<RadarGame[]>(initialGames);
  const [catalogState, setCatalogState] = useState(
    'Loading the expanded catalog…',
  );
  const [filters, setFilters] = useState<RadarFilters>(defaultRadarFilters);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [storageNote, setStorageNote] = useState('');
  const [reload, setReload] = useState(0);
  /* eslint-disable react/react-compiler -- One-time hydration of browser-only URL/storage after matching server-rendered defaults. */
  useEffect(() => {
    const query = new URLSearchParams(window.location.search).get('q');
    if (query)
      setFilters((value) => ({ ...value, query: query.slice(0, 120) }));
    try {
      const stored = JSON.parse(
        localStorage.getItem('steam-discovery-watchlist-v1') ?? '[]',
      );
      if (Array.isArray(stored))
        setSaved(stored.filter((id) => typeof id === 'string').slice(0, 500));
    } catch {
      setStorageNote(
        'Watchlist storage is unavailable; selections will last for this visit.',
      );
    }
  }, []);
  /* eslint-enable react/react-compiler */
  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/radar-catalog.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unavailable');
        return response.json();
      })
      .then((data: unknown) => {
        if (
          !data ||
          typeof data !== 'object' ||
          !('games' in data) ||
          !Array.isArray(data.games) ||
          !('schemaVersion' in data) ||
          data.schemaVersion !== 1
        )
          throw new Error('Invalid catalog');
        setGames(data.games);
        setCatalogState(`${number(data.games.length)} unique apps loaded`);
      })
      .catch((error) => {
        if (error.name !== 'AbortError')
          setCatalogState(
            'Expanded catalog unavailable. Curated records still work.',
          );
      });
    return () => controller.abort();
  }, [reload]);
  useEffect(() => {
    if (selected)
      document
        .getElementById('radar-evidence')
        ?.scrollIntoView({ block: 'start' });
  }, [selected]);
  const filtered = useMemo(
    () => selectRadarGames(games, filters, saved),
    [games, filters, saved],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 30));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(currentPage * 30, (currentPage + 1) * 30);
  const detail = games.find((game) => game.appId === selected);
  const comps = games.filter((game) => compare.includes(game.appId));
  const setFilter = <K extends keyof RadarFilters>(
    key: K,
    value: RadarFilters[K],
  ) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setPage(0);
  };
  function toggleSaved(id: string) {
    const next = saved.includes(id)
      ? saved.filter((value) => value !== id)
      : [...saved, id];
    setSaved(next);
    try {
      localStorage.setItem(
        'steam-discovery-watchlist-v1',
        JSON.stringify(next),
      );
    } catch {
      setStorageNote('Watchlist is saved for this visit only.');
    }
  }
  function exportSelection() {
    const rows = filters.savedOnly
      ? filtered
      : games.filter((game) => saved.includes(game.appId));
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            scope:
              'Device-local watchlist; public observations and estimates, not sales',
            games: rows,
          },
          null,
          2,
        ),
      ],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steam-discovery-watchlist.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <section className="workbench hub-view radar-view">
      <Header
        kicker="STEAM RADAR · FIND COMPARABLES"
        title="What is out there, and what can you learn from it?"
      >
        Search games, inspect their evidence and compare up to three. Saved
        games stay in this browser. Snapshot checked {day(snapshot.completedAt)}
        ; this is not a live Steam feed.
      </Header>
      <div className="radar-toolbar">
        <label className="hub-search" htmlFor="radar-search">
          <Search size={18} />
          <span className="sr-only">
            Search radar by game, genre, developer or theme
          </span>
          <Input
            id="radar-search"
            maxLength={120}
            placeholder="Game, genre, developer or theme…"
            value={filters.query}
            onChange={(e) => setFilter('query', e.target.value)}
          />
        </label>
        <Button
          variant={filters.savedOnly ? 'default' : 'outline'}
          onClick={() => setFilter('savedOnly', !filters.savedOnly)}
        >
          <Bookmark size={16} />
          Watchlist ({saved.length})
        </Button>
        <Button
          variant="outline"
          disabled={!saved.length}
          onClick={exportSelection}
        >
          <Download size={16} />
          Export watchlist
        </Button>
      </div>
      <div className="radar-filters">
        {(
          [
            [
              'cohort',
              'Coverage',
              [
                'All records',
                'Curated research',
                'SteamSpy owner-ranked sample',
                'June 2026 release subset',
              ],
            ],
            [
              'status',
              'Release state',
              [
                'Any status',
                'Released',
                'Early Access',
                'Upcoming',
                'Released in June 2026 snapshot',
                'Not verified',
              ],
            ],
            [
              'signal',
              'Evidence filter',
              [
                'Any signal',
                '100–200K owner estimate',
                'Under 1K reviews',
                '1K+ reviews',
                'Unknown review count',
              ],
            ],
            [
              'sort',
              'Sort',
              [
                'Research first',
                'Most reviews',
                'Fewest reviews',
                'Title A–Z',
                'Latest check',
              ],
            ],
          ] as const
        ).map(([key, label, options]) => (
          <label key={key}>
            {label}
            <select
              value={filters[key]}
              onChange={(e) => setFilter(key, e.target.value)}
            >
              {options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        ))}
        <Button
          variant="ghost"
          onClick={() => {
            setFilters(defaultRadarFilters);
            setPage(0);
          }}
        >
          Reset filters
        </Button>
      </div>
      <output className="radar-status" aria-live="polite">
        <span>
          {filtered.length.toLocaleString()} matching · {catalogState}
        </span>
        {catalogState.includes('unavailable') && (
          <button
            onClick={() => {
              setCatalogState('Loading the expanded catalog…');
              setReload((value) => value + 1);
            }}
          >
            Retry catalog
          </button>
        )}
        <span>{storageNote || 'Missing values remain unknown.'}</span>
      </output>
      <details className="hub-disclosure">
        <summary>Coverage, definitions and update method</summary>
        <p>{snapshot.coverage}</p>
        <p>{snapshot.reviewMethod}</p>
        <p>{snapshot.ownerMethod}</p>
        <p>{snapshot.timing}</p>
        <p>{snapshot.changes}</p>
        <p>
          Store metadata uses Steam’s public, undocumented appdetails endpoint
          and can be unavailable or change. Dates shown beside rows use
          Europe/Istanbul; exact UTC timestamps remain in the ledger. Genre tags
          are available for curated games and the selected June tags; SteamSpy
          bulk rows do not contain tags. Genre search is therefore incomplete. A
          low review count is not evidence of a small development team.
        </p>
        <p>
          {snapshot.errors.length} request failures are recorded in the
          downloadable ledger. An unavailable request is not a zero.
        </p>
        <Links
          urls={[
            'https://steamspy.com/api.php',
            'https://partner.steamgames.com/doc/store/getreviews',
            '/data/radar-catalog.json',
          ]}
        />
        <a href="/playbooks/gamalytic-methodology-metric-definitions/">
          Learn how estimates differ from sales →
        </a>
      </details>
      {comps.length > 0 && (
        <section className="radar-compare" aria-label="Game comparison">
          <div className="hub-section-heading">
            <h2>Compare the evidence ({comps.length}/3)</h2>
            <button onClick={() => setCompare([])}>Clear comparison</button>
          </div>
          <div className="hub-compare-grid">
            {comps.map((game) => (
              <article key={game.appId}>
                <h3>{game.title}</h3>
                <p>
                  {game.status} · {game.releaseDate ?? 'Date unverified'}
                </p>
                <dl>
                  <div>
                    <dt>Reviews</dt>
                    <dd>{number(game.reviews)}</dd>
                  </div>
                  <div>
                    <dt>Positive share</dt>
                    <dd>
                      {positiveShare(game) == null
                        ? 'Unknown'
                        : `${positiveShare(game)}%`}
                    </dd>
                  </div>
                  <div>
                    <dt>Owner estimate</dt>
                    <dd>{game.owners ?? 'Unknown'}</dd>
                  </div>
                  <div>
                    <dt>Checked</dt>
                    <dd>{day(game.checkedAt)}</dd>
                  </div>
                </dl>
                <p className="hub-muted">{game.reviewDefinition}</p>
                <button
                  onClick={() =>
                    setCompare(compare.filter((id) => id !== game.appId))
                  }
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
          <p className="hub-caution">
            Compare like-for-like definitions and dates. None of these rows
            establish revenue, profit, team size or organic acquisition.
          </p>
        </section>
      )}
      {detail && (
        <section
          id="radar-evidence"
          className="radar-detail"
          aria-label={`${detail.title} evidence`}
        >
          <div className="hub-section-heading">
            <h2>{detail.title}</h2>
            <Button
              variant="ghost"
              onClick={() => setSelected(null)}
              aria-label="Close game evidence"
            >
              <X />
            </Button>
          </div>
          <div className="hub-detail-grid">
            <div>
              <p>
                {detail.hook ||
                  'Broad catalog record: a marketing story has not been verified for this game.'}
              </p>
              <p>
                {detail.genre ||
                  detail.tags.join(' · ') ||
                  'Genre tags unavailable in this sample.'}
              </p>
              <p>
                <strong>Developer:</strong> {detail.developer ?? 'Not checked'}
                <br />
                <strong>Publisher:</strong> {detail.publisher ?? 'Not checked'}
                <br />
                <strong>Store state:</strong> {detail.status} ·{' '}
                {detail.releaseDate ?? 'Date unverified'}
              </p>
              <p className="hub-caution">
                {detail.reviewDefinition}. Retrieved {detail.checkedAt}.{' '}
                {detail.ccu != null && `${detail.ccuDefinition}.`}
              </p>
              {detail.reviewDelta != null ? (
                <p>
                  <strong>
                    {detail.reviewDelta >= 0 ? '+' : ''}
                    {number(detail.reviewDelta)} reviews
                  </strong>{' '}
                  since {detail.previousCheckedAt}. Comparable-query change, not
                  attributed campaign lift.
                </p>
              ) : (
                <p>
                  No comparable earlier review snapshot: growth is not yet
                  measured.
                </p>
              )}
              <Links
                urls={[
                  detail.steamUrl,
                  detail.source,
                  `https://steamdb.info/app/${detail.appId}/charts/`,
                  ...(detail.ownerSource ? [detail.ownerSource] : []),
                ]}
              />
            </div>
            <div className="hub-evidence-box">
              <h3>Turn a record into a decision</h3>
              <Items
                items={[
                  'Play the opening and name the smallest repeating decision.',
                  'Read favorable and critical reviews from the same release period.',
                  'Find the launch or update event; record its date and disclosed outcome.',
                  'Propose a different player promise with one production constraint.',
                ]}
              />
              {gameStories.find(
                (story) => String(story.appId) === detail.appId,
              ) ? (
                <a
                  className="hub-action"
                  href={storyPath(
                    gameStories.find(
                      (story) => String(story.appId) === detail.appId,
                    )!.id,
                  )}
                >
                  Read the digested game story →
                </a>
              ) : gameLibrary.find((game) => game.appId === detail.appId) ? (
                <a
                  className="hub-action"
                  href={`/games/${gameLibrary.find((game) => game.appId === detail.appId)!.id}/`}
                >
                  Open researched benchmark →
                </a>
              ) : (
                <p className="hub-muted">
                  No case study attached yet. The catalog is wider than the
                  editorial library.
                </p>
              )}
              <a className="hub-action" href="/solo-lab/">
                Find a constrained spin →
              </a>
            </div>
          </div>
        </section>
      )}
      <Table className="radar-table">
        <TableHeader>
          <TableRow>
            {[
              'Game / research coverage',
              'Release state',
              'Reviews',
              'Positive',
              'Owner estimate',
              'US price',
              'Save / compare',
            ].map((label) => (
              <TableHead key={label} scope="col">
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((game) => (
            <TableRow key={game.appId}>
              <TableCell>
                <button
                  className="radar-game-title"
                  onClick={() => setSelected(game.appId)}
                >
                  {game.title}
                </button>
                <span className="radar-cell-note">
                  {game.genre ||
                    game.tags.slice(0, 3).join(' · ') ||
                    game.cohort}
                </span>
                <span className="radar-cell-note">
                  {game.cohort} · checked {day(game.checkedAt)}
                </span>
              </TableCell>
              <TableCell>
                {game.status}
                <span className="radar-cell-note">
                  {game.releaseDate ?? 'Date unverified'}
                </span>
              </TableCell>
              <TableCell>
                {number(game.reviews)}
                <span className="radar-cell-note">
                  {game.cohort === 'Curated research'
                    ? 'Steam API'
                    : game.cohort === 'June 2026 release subset'
                      ? 'Historical store count'
                      : 'SteamSpy snapshot'}
                </span>
              </TableCell>
              <TableCell>
                {positiveShare(game) == null ? '—' : `${positiveShare(game)}%`}
              </TableCell>
              <TableCell>
                {game.owners?.replace(' .. ', '–') ?? 'Unknown'}
                {game.owners && (
                  <span className="radar-cell-note">
                    SteamSpy model ·{' '}
                    {day(game.ownerCheckedAt ?? game.checkedAt)}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {game.priceUsd == null
                  ? '—'
                  : game.priceUsd === 0
                    ? 'Free'
                    : `$${game.priceUsd.toFixed(2)}`}
              </TableCell>
              <TableCell>
                <div className="radar-row-actions">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleSaved(game.appId)}
                    aria-pressed={saved.includes(game.appId)}
                    aria-label={`${saved.includes(game.appId) ? 'Unsave' : 'Save'} ${game.title}`}
                  >
                    <Bookmark
                      fill={
                        saved.includes(game.appId) ? 'currentColor' : 'none'
                      }
                      size={16}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={
                      compare.length >= 3 && !compare.includes(game.appId)
                    }
                    aria-pressed={compare.includes(game.appId)}
                    onClick={() =>
                      setCompare(
                        compare.includes(game.appId)
                          ? compare.filter((id) => id !== game.appId)
                          : [...compare, game.appId],
                      )
                    }
                  >
                    {compare.includes(game.appId) ? (
                      <Check size={16} />
                    ) : (
                      'Compare'
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!visible.length && (
        <div className="hub-empty">
          <h2>No games match these filters</h2>
          <p>
            Try a broader term, choose all records, or save a game before
            opening the watchlist.
          </p>
          <Button
            onClick={() => {
              setFilters(defaultRadarFilters);
              setPage(0);
            }}
          >
            Show all records
          </Button>
        </div>
      )}
      <div className="radar-pagination">
        <Button
          variant="outline"
          disabled={currentPage === 0}
          onClick={() => setPage(currentPage - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage + 1} of {pages} · 30 per page
        </span>
        <Button
          variant="outline"
          disabled={currentPage + 1 >= pages}
          onClick={() => setPage(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  );
}

export function SoloLab() {
  const [kind, setKind] = useState('All slices');
  const [fit, setFit] = useState('All scope');
  const concepts = conceptData.concepts.filter(
    (concept) =>
      (kind === 'All slices' || concept.deliverable === kind) &&
      (fit === 'All scope' || concept.fit === fit),
  );
  return (
    <section className="workbench hub-view">
      <Header
        kicker="SOLO LAB · AI-ASSISTED PRODUCTION"
        title="One person, two weeks, one clear player promise."
      >
        {conceptData.assumption}
      </Header>
      <div className="hub-release-note">
        <strong>
          Build time and release eligibility are different clocks.
        </strong>
        <p>{conceptData.releaseConstraint}</p>
        <a href={conceptData.releaseSource} target="_blank" rel="noreferrer">
          Valve’s release requirements ↗
        </a>
      </div>
      <div className="radar-filters" id="concepts">
        <label>
          Deliverable
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            {['All slices', 'Demo', 'Microgame candidate'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Production scope
          <select value={fit} onChange={(e) => setFit(e.target.value)}>
            {['All scope', 'Focused', 'Stretch'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <p>
          All concepts are original hypotheses. Reference games were not
          necessarily made by one person or in two weeks.
        </p>
      </div>
      <div className="solo-grid">
        {concepts.map((concept, i) => (
          <article key={concept.id} id={concept.id} className="solo-card">
            <div className="hub-card-top">
              <span>{concept.genre}</span>
              <span>
                {concept.deliverable} · {concept.fit}
              </span>
            </div>
            <span className="solo-number">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h2>{concept.title}</h2>
            <p className="solo-pitch">{concept.pitch}</p>
            <p>
              <strong>The spin:</strong> {concept.spin}
            </p>
            <div className="hub-comps">
              {concept.comparables.map((appId) => {
                const game = initialGames.find(
                  (row) => row.appId === String(appId),
                );
                return (
                  <a
                    key={appId}
                    href={`/radar/?q=${encodeURIComponent(game?.title ?? String(appId))}`}
                  >
                    {game?.title ?? `Steam app ${appId}`}
                  </a>
                );
              })}
            </div>
            <div className="hub-detail-grid">
              <div>
                <h3>Build exactly this</h3>
                <Items items={concept.scope} />
              </div>
              <div>
                <h3>Cut from the sprint</h3>
                <Items items={concept.cuts} />
              </div>
            </div>
            <dl>
              <div>
                <dt>Where AI helps</dt>
                <dd>{concept.aiHelp}</dd>
              </div>
              <div>
                <dt>Human bottleneck</dt>
                <dd>{concept.humanBottleneck}</dd>
              </div>
              <div>
                <dt>First clip</dt>
                <dd>{concept.clip}</dd>
              </div>
              <div>
                <dt>Where to market</dt>
                <dd>{concept.channel}</dd>
              </div>
              <div>
                <dt>Proposed validation</dt>
                <dd>{concept.test}</dd>
              </div>
              <div>
                <dt>Revise or stop if</dt>
                <dd>{concept.stop}</dd>
              </div>
            </dl>
            <details>
              <summary>Risks and release scope</summary>
              <Items items={concept.risks} />
              <p>{concept.commercial}</p>
            </details>
            <a className="hub-action" href={`/#${concept.nicheId}`}>
              Read the demand and competition brief →
            </a>
          </article>
        ))}
      </div>
      <section className="hub-section" id="two-week-plan">
        <h2>The two-week execution plan</h2>
        <p className="hub-muted">
          Days 1–10 are the ten planned workdays; days 11–14 are calendar
          buffer, not four extra full-time workdays.
        </p>
        <ol className="hub-sprint">
          {conceptData.sprint.map((step) => (
            <li key={step.days}>
              <strong>Days {step.days}</strong>
              <div>
                <h3>{step.goal}</h3>
                <p>{step.output}</p>
                <p>
                  <b>Gate:</b> {step.gate}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <div className="hub-detail-grid hub-section">
        <section className="hub-evidence-box">
          <h2>Use AI where it saves iteration</h2>
          <Items items={conceptData.aiWorkflow} />
          <a href="/playbooks/steam-ai-content-survey/">
            Steam’s AI content survey, explained →
          </a>
        </section>
        <section className="hub-evidence-box">
          <h2>Measure whether to keep building</h2>
          <Items items={conceptData.measurement} />
          <a
            href="https://partner.steamgames.com/doc/marketing/utm_analytics"
            target="_blank"
            rel="noreferrer"
          >
            Steam UTM documentation ↗
          </a>
        </section>
      </div>
    </section>
  );
}

export function DeveloperPlaybooks({ articleId }: { articleId?: string }) {
  const [query, setQuery] = useState('');
  const [audience, setAudience] = useState('Solo');
  const selected = articleData.articles.find(
    (article) => article.id === articleId,
  );
  const articles = selected
    ? [selected]
    : articleData.articles.filter((article) =>
        [article.title, article.publisher, ...article.topics, article.synopsis]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
  return (
    <section className="workbench hub-view">
      <Header
        kicker="DEVELOPER PLAYBOOKS · READ → DECIDE → DO"
        title={
          selected
            ? selected.title
            : 'Research you can turn into next week’s work.'
        }
      >
        Original digests with the source’s argument, practical takeaways and our
        proposed actions. Check date: {articleData.checkedAt}. Source
        publication dates stay separate.
      </Header>
      {selected ? (
        <a className="hub-action" href="/playbooks/">
          ← All playbooks
        </a>
      ) : (
        <label className="hub-search" htmlFor="playbook-search">
          <Search size={18} />
          <span className="sr-only">Search developer playbooks</span>
          <Input
            id="playbook-search"
            maxLength={120}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Discovery, AI, trailer, festivals, estimates…"
          />
        </label>
      )}
      <div className="hub-audience">
        <span>Show the action plan for</span>
        {['Solo', '2–5 people'].map((value) => (
          <Button
            key={value}
            variant={audience === value ? 'default' : 'outline'}
            onClick={() => setAudience(value)}
            aria-pressed={audience === value}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className={selected ? 'hub-playbook-detail' : 'hub-playbook-grid'}>
        {articles.map((article) => (
          <article className="hub-playbook" key={article.id}>
            <p className="section-kicker">
              {article.publisher} · {article.evidenceClassification}
            </p>
            {!selected && (
              <h2>
                <a href={`/playbooks/${article.id}/`}>{article.title}</a>
              </h2>
            )}
            <p className="hub-muted">
              {article.author ?? article.publisher} · Published{' '}
              {article.publishDate ?? 'date not displayed'} · Checked{' '}
              {article.checkedAt}
            </p>
            <p className="hub-synopsis">{article.synopsis}</p>
            <h3>Key takeaways</h3>
            <Items items={article.takeaways} />
            <div className="hub-task-box">
              <h3>
                {audience === 'Solo'
                  ? 'Do this as a solo developer'
                  : 'Split the work across a small team'}
              </h3>
              <Items
                items={
                  audience === 'Solo'
                    ? article.soloChecklist
                    : article.smallTeamChecklist
                }
              />
              <span className="hub-muted">
                Our proposed application, not a result measured by the source.
              </span>
            </div>
            <p className="hub-caution">
              <strong>What this cannot prove:</strong> {article.cannotProve}
            </p>
            {article.relatedGames.length > 0 && (
              <div className="hub-comps">
                {article.relatedGames.map((game) => (
                  <a
                    key={game.steamAppId}
                    href={`/radar/?q=${encodeURIComponent(game.name)}`}
                  >
                    {game.name} →
                  </a>
                ))}
              </div>
            )}
            <Links
              urls={[
                article.url,
                ...article.supportingSources.map((source) => source.url),
              ]}
            />
            <p className="hub-muted">{article.access}</p>
          </article>
        ))}
      </div>
      {!articles.length && (
        <output aria-live="polite">
          No playbook matches.{' '}
          <button onClick={() => setQuery('')}>Clear search</button>
        </output>
      )}
      <section className="hub-section hub-evidence-box">
        <h2>Keep the chain from source to decision</h2>
        <p>
          Choose a niche in the hub, inspect a strong and a modest comparable in
          Radar, read the relevant story, then take one bounded experiment into
          Solo Lab. If a KPI has no date, definition or source, do not use it to
          justify production.
        </p>
        <div className="hub-links">
          <a href="/">Niche briefs →</a>
          <a href="/radar/">Steam Radar →</a>
          <a href="/stories/">Game stories →</a>
          <a href="/solo-lab/">Solo Lab →</a>
          <a href="/reading/">Full source library →</a>
        </div>
      </section>
    </section>
  );
}
