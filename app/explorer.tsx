'use client';

import { ArrowRight, ArrowUpRight, Check, Clock3, ExternalLink, Gamepad2, Plus, Search, ShieldAlert, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { categories, compactNumber, defaultExplorerFilters, gameLibrary, type ExplorerFilters, type GameRecord } from './discovery-data';
import { SteamArtwork } from './steam-artwork';
import { gamePath } from './site-routes';
import { ReferenceLink, ReferenceRegister, gameReferences } from './source-references';

export function SourceLink({ url, label = 'Source' }: { url: string; label?: string }) {
  return <ReferenceLink url={url} label={label} />;
}
export function EvidenceBadge({ value }: { value: string }) {
  const kind = /estimat|model/i.test(value) ? 'Estimated' : /observ|store|SteamDB/i.test(value) ? 'Observed' : /primary|first.party|developer milestone|developer report/i.test(value) ? 'Primary' : 'Reported';
  return <span className={`evidence evidence-${kind.toLowerCase()}`} title={value}>{kind}</span>;
}
function GameArtwork({ game }: { game: GameRecord }) {
  return game.appId ? <SteamArtwork key={game.appId} appId={game.appId} title={game.title} /> : <span className="artwork-placeholder"><Gamepad2 aria-hidden="true" /></span>;
}
function signalText(game: GameRecord) {
  if (game.outcome) return game.outcome.value !== null ? `${compactNumber(game.outcome.value)} ${game.outcome.unit} · ${game.outcome.text}` : game.outcome.text;
  if (game.owners.length) {
    const values = game.owners.map(owner => owner.value);
    return `${compactNumber(Math.min(...values))}–${compactNumber(Math.max(...values))} estimated owners`;
  }
  return game.observed.reviews !== null ? `${game.observed.reviews.toLocaleString('en-US')} observed reviews` : 'Open the evidence record';
}

export function Explorer({ filters, setFilters, visible, selectedId, select, shortlist, setShortlist, openCase, openBuild, openReading, landingId }: {
  filters: ExplorerFilters; setFilters: (next: ExplorerFilters) => void; visible: GameRecord[];
  selectedId: string; select: (id: string) => void; shortlist: string[]; setShortlist: (ids: string[]) => void;
  openCase: (id: string) => void; openBuild: () => void; openReading: (query: string) => void;
  landingId?: string;
}) {
  const selected = visible.find(game => game.id === selectedId) ?? visible[0];
  const selectedComps = shortlist.map(id => gameLibrary.find(game => game.id === id)).filter((game): game is GameRecord => Boolean(game));
  const update = <K extends keyof ExplorerFilters>(key: K, value: ExplorerFilters[K]) => setFilters({ ...filters, [key]: value });
  const toggle = (id: string) => setShortlist(shortlist.includes(id) ? shortlist.filter(item => item !== id) : shortlist.length < 3 ? [...shortlist, id] : shortlist);
  return <section className={`workbench content-view explorer-view ${landingId ? 'game-landing' : ''}`}>
    <div className="workspace-heading"><div><p className="section-kicker"><SlidersHorizontal aria-hidden="true" /> READ THE MARKET. FIND YOUR NEXT BUILD.</p><h1>{landingId && selected ? <>{selected.title}<br /><span className="heading-subtitle">Marketing & market evidence</span></> : <>Many games. Clear evidence.<br />One decision at a time.</>}</h1></div><p className="workspace-note">{gameLibrary.length} curated games, not a representative market sample. “Demo fit” is our judgment for 2 senior developers + 1 artist over 15 working days—not the effort required to clone the full game.</p></div>
    <div className="journey-strip"><button onClick={() => setFilters({ ...defaultExplorerFilters, fit: 'High', sort: 'Demo fit' })}><b>01</b><span><strong>Find a feasible loop</strong><small>Start with high demo fit</small></span><ArrowRight /></button><button onClick={() => setFilters({ ...defaultExplorerFilters, band: '100–200K owner models' })}><b>02</b><span><strong>Check smaller benchmarks</strong><small>100–200K owner estimates</small></span><ArrowRight /></button><button onClick={() => openReading('')}><b>03</b><span><strong>Understand the channel</strong><small>Read cases and disagreements</small></span><ArrowRight /></button><button onClick={openBuild}><b>04</b><span><strong>Design the test</strong><small>Build a three-week brief</small></span><ArrowRight /></button></div>

    <div className="explorer-controls">
      <label className="searchbox"><Search aria-hidden="true" /><span className="sr-only">Search all games, tropes and marketing channels</span><Input maxLength={120} value={filters.query} onChange={event => update('query', event.target.value)} placeholder="Search games, tropes, mechanics or channels…" /></label>
      <div className="select-filters">
        <label>Genre<select value={filters.category} onChange={event => update('category', event.target.value as ExplorerFilters['category'])}>{categories.map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Demo fit<select value={filters.fit} onChange={event => update('fit', event.target.value as ExplorerFilters['fit'])}>{['All scope', 'High', 'Medium', 'Low'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Release<select value={filters.year} onChange={event => update('year', event.target.value as ExplorerFilters['year'])}>{['All years', '2026', '2025', 'Earlier', 'Upcoming'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Evidence filter<select value={filters.band} onChange={event => update('band', event.target.value as ExplorerFilters['band'])}>{['All signals', '100–200K owner models', 'Reported milestone', 'Deep case'].map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Sort<select value={filters.sort} onChange={event => update('sort', event.target.value as ExplorerFilters['sort'])}>{['Curated', 'Newest', 'Reviews', 'Demo fit'].map(value => <option key={value}>{value}</option>)}</select></label>
      </div>
      <div className="results-meta"><span><strong>{visible.length}</strong> of {gameLibrary.length} games · {shortlist.length}/3 comparisons selected</span><button onClick={() => setFilters(defaultExplorerFilters)}>Reset filters</button></div>
    </div>
    {filters.band === '100–200K owner models' && <div className="filter-explanation"><ShieldAlert /><p>At least one retrieved provider estimates 100–200K owners. This is <strong>not</strong> a paid-sales or organic-reach band. Open each record for the full provider spread, date and independent reported milestone. Ranges are model disagreement, not confidence intervals.</p></div>}

    {selectedComps.length > 0 && <section className="comparison-tray" aria-label="Comparison basket"><div className="comparison-heading"><strong>Your comparison basket</strong><span>Choose the same buyer, a similar loop, and a scope warning.</span><Button size="sm" onClick={openBuild}>Use in my brief <ArrowRight /></Button></div><div className="comparison-cards">{selectedComps.map(game => <article key={game.id}><button className="remove-comp" aria-label={`Remove ${game.title} from comparison`} onClick={() => toggle(game.id)}><X /></button><h3>{game.title}</h3><p>{game.genre}</p><div><span className={`fit fit-${game.scopeFit.toLowerCase()}`}>{game.scopeFit} demo fit</span><span>{game.depth}</span></div><small>{signalText(game)}</small><p className="comparison-caveat">{game.caveat}</p></article>)}</div></section>}

    <div className="explorer-layout">
      <div className="game-card-grid" aria-label="Game benchmark results">
        {visible.map(game => <article className={`discovery-card ${selected?.id === game.id ? 'is-selected' : ''}`} key={game.id}>
          <button className="card-main" aria-label={`Open ${game.title} evidence`} onClick={() => select(game.id)}><div className="card-art"><GameArtwork game={game} /><span>{game.releaseDate.startsWith('20') ? game.releaseDate.slice(0, 4) : 'Upcoming'}</span></div><div className="card-content"><div className="card-overline"><span>{game.caseId ? 'Deep marketing case' : game.depth}</span><span className={`fit fit-${game.scopeFit.toLowerCase()}`}>{game.scopeFit} fit</span></div><h3>{game.title}</h3><p className="card-hook">{game.hook}</p><div className="card-tags">{game.tropes.slice(0, 3).map(trope => <span key={trope}>{trope}</span>)}</div><div className="card-signal"><EvidenceBadge value={game.outcome?.evidence ?? (game.owners.length ? 'Estimated' : 'Observed')} /><p>{signalText(game)}</p></div></div></button>
          <div className="card-bottom"><a href={gamePath(game.id)} aria-label={`${game.title} full research page`}>Read case ↗</a><span>{game.events.length} events</span><button disabled={shortlist.length >= 3 && !shortlist.includes(game.id)} aria-pressed={shortlist.includes(game.id)} onClick={() => toggle(game.id)}>{shortlist.includes(game.id) ? <Check /> : <Plus />}{shortlist.includes(game.id) ? 'In comparison' : 'Compare'}</button></div>
        </article>)}
        {!visible.length && <div className="empty-state"><Search /><strong>No games match these filters</strong><span>Try fewer conditions or a broader trope.</span><Button variant="outline" onClick={() => setFilters(defaultExplorerFilters)}>Reset filters</Button></div>}
      </div>

      {selected && <aside className="benchmark-detail" aria-label={`${selected.title} evidence record`} key={selected.id}>
        <div className="benchmark-heading"><span className="section-kicker">EVIDENCE RECORD</span><h3>{selected.title}</h3><p>{selected.genre} · {selected.subgenre}</p><div className="benchmark-links">{selected.appId && <><SourceLink url={`https://store.steampowered.com/app/${selected.appId}/`} label="Steam" /><SourceLink url={`https://steamdb.info/app/${selected.appId}/charts/`} label="SteamDB" /></>}<button onClick={() => openReading(selected.title)}>Related reading <ArrowRight /></button></div></div>
        <dl className="production-facts"><div><dt>Release / status</dt><dd>{selected.releaseDate}</dd></div><div><dt>Mode</dt><dd>{selected.mode}</dd></div><div><dt>Team</dt><dd>{selected.team}</dd></div><div><dt>Production</dt><dd>{selected.devTime}</dd></div></dl>
        {selected.outcome && <section className="milestone-block"><div><EvidenceBadge value={selected.outcome.evidence} /><time>{selected.outcome.date}</time></div><h4>{selected.outcome.value !== null ? `${selected.outcome.value.toLocaleString('en-US')} ${selected.outcome.unit}` : selected.outcome.text}</h4>{selected.outcome.value !== null && <p>{selected.outcome.text}</p>}<p className="metric-scope">{selected.outcome.scope}</p><SourceLink url={selected.outcome.source} label="Open milestone evidence" /></section>}
        <section className="metric-block"><h4>Observed Steam metrics</h4><div className="metric-pair"><div><strong>{selected.observed.reviews?.toLocaleString('en-US') ?? '—'}</strong><span>Total reviews</span></div><div><strong>{selected.observed.peakCCU?.toLocaleString('en-US') ?? '—'}</strong><span>All-time peak CCU</span></div></div><small>Retrieved {selected.observed.asOf}; cached data may lag. “—” = not verified here, not zero. Reviews and CCU are not units or reach.</small><SourceLink url={selected.observed.source} label="Metric source" /></section>
        {(selected.owners.length > 0 || selected.ownerRange) && <section className="metric-block owner-block"><h4>Estimated owners <span>MODELS</span></h4>{selected.owners.length > 0 ? <dl>{selected.owners.map(owner => <div key={owner.provider}><dt>{owner.provider}</dt><dd>{owner.value.toLocaleString('en-US')}</dd></div>)}</dl> : <strong className="owner-range">{selected.ownerRange}</strong>}<small>{selected.ownerMethod} Retrieved {selected.ownerAsOf}. Not organic-attributed demand.</small><SourceLink url={selected.ownerSource} label="Owner-model source" /></section>}
        <div className="benchmark-insight"><h4>Why demand may exist</h4><p>{selected.whyDemand}</p><h4>Transferable move / spin hypothesis</h4><p>{selected.spin}</p><div className="card-tags">{selected.tropes.map(trope => <button key={trope} onClick={() => setFilters({ ...defaultExplorerFilters, query: trope })}>{trope}</button>)}</div></div>
        <div className="benchmark-caveat"><ShieldAlert /><p><strong>Do not overlook this</strong>{selected.caveat}</p></div>
        {selected.storyId && <div className="deep-case-link"><a className="editorial-primary-link" href={`/case-studies/${selected.storyId}/`}>Read the full game story, KPIs & build transfer <ArrowRight /></a></div>}
        {selected.caseId && <div className="deep-case-link"><Button onClick={() => openCase(selected.caseId!)}>Open the technical + marketing deep dive <ArrowRight /></Button></div>}
        <section className="compact-timeline"><h4><Clock3 /> What happened, when and where</h4>{selected.events.map((event, index) => <article key={`${event.date}-${index}`}><div className="compact-event-meta"><span>{String(index + 1).padStart(2, '0')}</span><time>{event.date}</time></div><strong>{event.channel}</strong><p>{event.action}</p><p className="compact-result">{event.result}</p><small>Spend: {event.spend}</small><div><EvidenceBadge value={event.evidence} /><SourceLink url={event.source} /></div></article>)}</section>
        <ReferenceRegister references={gameReferences(selected)} />
      </aside>}
    </div>
  </section>;
}
