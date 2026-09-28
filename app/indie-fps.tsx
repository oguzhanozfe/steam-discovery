'use client';
/* eslint-disable next/no-html-link-for-pages -- Static Vite build uses canonical HTML routes. */

import { useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Search, X } from 'lucide-react';
import directory from './data/indie-fps.json';
import { SteamArtwork } from './steam-artwork';
import { ReferenceLink, ReferenceRegister } from './source-references';

type FpsGame = {
  appId: string;
  title: string;
  developer: string;
  publisher: string;
  subgenre: string;
  status: 'Released' | 'Early Access' | 'Upcoming';
  cohort: 'recent' | 'watchlist';
  releaseDate: string | null;
  releaseNote: string;
  hook: string;
  indieContext: string;
  sources: { url: string; label: string; uses: string[]; access: string }[];
};

const games = (directory.games as FpsGame[])
  .slice()
  .sort(
    (a, b) =>
      Number(a.cohort === 'watchlist') - Number(b.cohort === 'watchlist') ||
      (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '') ||
      a.title.localeCompare(b.title),
  );
const references = games.flatMap((game) =>
  game.sources.map((source) => ({
    url: source.url,
    uses: source.uses.map((use) => `${game.title}: ${use}`),
  })),
);
const checkedDate = directory.checkedAt.slice(0, 10);
const recentCutoff = new Date(
  Date.parse(`${checkedDate}T00:00:00Z`) - 90 * 86400000,
)
  .toISOString()
  .slice(0, 10);
const formatDate = (date: string) =>
  new Date(`${date.slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

export function IndieFps() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [cohort, setCohort] = useState('all');
  const search = query.trim().toLowerCase();
  const filtered = games.filter(
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
  const hasFilters = query !== '' || status !== 'all' || cohort !== 'all';
  const reset = () => {
    setQuery('');
    setStatus('all');
    setCohort('all');
  };

  return (
    <section className="workbench hub-view fps-view">
      <header className="fps-heading">
        <p className="section-kicker">
          STEAM FIELD GUIDE · FIRST-PERSON SHOOTERS
        </p>
        <h1>
          Recent indie FPS games.
          <br />
          <span>And what to watch next.</span>
        </h1>
        <p className="fps-intro">{directory.scope}</p>
        <div className="fps-snapshot">
          <span>
            <strong>{games.length}</strong> selected games
          </span>
          <span>
            Checked{' '}
            <time dateTime={directory.checkedAt}>
              {formatDate(directory.checkedAt)}
            </time>
          </span>
          <a href="/data/indie-fps.json" download>
            <ArrowDownToLine size={16} aria-hidden="true" /> Download the source
            list
          </a>
        </div>
      </header>

      <aside className="fps-method" aria-label="Selection criteria">
        <strong>What counts as indie here?</strong>
        <p>{directory.indieDefinition}</p>
        <p>
          Dates distinguish full release from Early Access. The watchlist also
          includes older Early Access games and upcoming releases. This is a
          curated selection, not a market ranking.
        </p>
      </aside>

      <form
        className="fps-filters"
        role="search"
        aria-label="Filter indie FPS games"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="fps-query" htmlFor="fps-search">
          <span>Search games</span>
          <span className="fps-search-field">
            <Search size={18} aria-hidden="true" />
            <input
              id="fps-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              maxLength={120}
              placeholder="Title, studio, subgenre…"
            />
          </span>
        </label>
        <label htmlFor="fps-status">
          <span>Release status</span>
          <select
            id="fps-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">All statuses</option>
            <option value="Released">Released</option>
            <option value="Early Access">Early Access</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </label>
        <label htmlFor="fps-cohort">
          <span>Collection</span>
          <select
            id="fps-cohort"
            value={cohort}
            onChange={(event) => setCohort(event.target.value)}
          >
            <option value="all">All games</option>
            <option value="90-days">Released in the last 90 days</option>
            <option value="recent">Recent releases · 2025–26</option>
            <option value="watchlist">Older EA & upcoming</option>
          </select>
        </label>
        <button
          className="fps-reset"
          type="button"
          onClick={reset}
          disabled={!hasFilters}
        >
          <X size={16} aria-hidden="true" /> Reset
        </button>
      </form>

      <div className="fps-results-meta">
        <output aria-live="polite" aria-atomic="true">
          {filtered.length} of {games.length} games
        </output>
        <span>
          {cohort === '90-days'
            ? `Release dates from ${formatDate(recentCutoff)} to ${formatDate(checkedDate)}`
            : 'Recent releases first · newest dated releases first within each collection'}
        </span>
      </div>

      <div className="fps-grid">
        {filtered.map((game, index) => (
          <article
            className="fps-card"
            id={`game-${game.appId}`}
            key={game.appId}
          >
            <a
              className="fps-artwork-link"
              href={`https://store.steampowered.com/app/${game.appId}/`}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${game.title} on Steam`}
            >
              <SteamArtwork
                appId={game.appId}
                title={game.title}
                className="fps-artwork"
                priority={index < 2}
              />
            </a>
            <div className="fps-card-body">
              <div className="fps-card-meta">
                <span className="fps-status" data-status={game.status}>
                  {game.status}
                </span>
                <span>
                  {game.cohort === 'recent' ? '2025–26 release' : 'Watchlist'}
                </span>
              </div>
              <p className="fps-subgenre">{game.subgenre}</p>
              <h2>
                <a
                  href={`https://store.steampowered.com/app/${game.appId}/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {game.title}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </a>
              </h2>
              <dl className="fps-credits">
                <div>
                  <dt>Developer</dt>
                  <dd>{game.developer}</dd>
                </div>
                <div>
                  <dt>Publisher</dt>
                  <dd>{game.publisher}</dd>
                </div>
              </dl>
              <p className="fps-release">
                {game.releaseDate && (
                  <time dateTime={game.releaseDate}>
                    {formatDate(game.releaseDate)}
                  </time>
                )}
                <span>{game.releaseNote}</span>
              </p>
              <p className="fps-hook">{game.hook}</p>
              <p className="fps-indie-context">
                <strong>Indie context:</strong> {game.indieContext}
              </p>
              <ul
                className="fps-sources"
                aria-label={`Sources for ${game.title}`}
              >
                {game.sources.map((source) => (
                  <li key={source.url}>
                    <ReferenceLink url={source.url} />
                    <span>{source.access}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="hub-empty fps-empty">
          <h2>No games match these filters.</h2>
          <p>Try another title, studio or subgenre.</p>
          <button type="button" className="fps-reset" onClick={reset}>
            Show all games
          </button>
        </div>
      )}

      <details className="fps-references">
        <summary>Source register & claim-level references</summary>
        <ReferenceRegister references={references} />
      </details>
    </section>
  );
}
