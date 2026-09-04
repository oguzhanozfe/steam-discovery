import { ArrowRight, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';
import concept from './data/fps-survival-concept.json';
import { survivalDemoGdd as gdd } from './editorial-data';
import { SourceLink } from './explorer';
import { SteamArtwork } from './steam-artwork';

export function FpsSurvivalConcept({ build }: { build: (hypothesis?: string) => void }) {
  return <section id={concept.id} className="fps-concept survival-section" aria-labelledby="fps-concept-title">
    <div className="fps-concept-heading"><span><Footprints aria-hidden="true" /> CURRENT CONCEPT · FIRST-PERSON SURVIVAL</span><p>Revised around the team's existing gameplay systems.</p></div>
    <div className="fps-pitch"><div><span className="fps-eyebrow">HOME → CITY ESCAPE → FIRST CAMP</span><h2 id="fps-concept-title">{gdd.title}</h2><p className="fps-hook">{gdd.pitch}</p><p>{gdd.playerPromise}</p><a className="editorial-primary-link" href="/survival-demo/">Open the complete GDD <ArrowRight /></a></div><aside aria-label="Demo boundary"><span className="fps-eyebrow">PLAYABLE SCENARIO</span><h3>First kill.<br />City escape.<br />Camp defense.</h3><p>{gdd.target}</p><span className="fps-meta">Proposed production plan—not a built or announced game.</span></aside></div>
    <ol className="fps-loop" aria-label="Proposed scene sequence">{gdd.sequence.map((beat,index)=><li key={beat.id}><span>{String(index+1).padStart(2,'0')}</span><p><strong>{beat.beat}.</strong> {beat.objective}</p></li>)}</ol>
    <div className="fps-subheading"><h3>Three real comparables. An occupied niche.</h3><p>{concept.demandLimit}</p></div>
    <div className="fps-comparables">{concept.comparables.map(game=><article key={game.appId}><a className="survival-art" href={game.source} target="_blank" rel="noreferrer"><SteamArtwork appId={game.appId} title={game.title} /></a><div><span className="fps-eyebrow">{game.role}</span><h4>{game.title}</h4><span className="fps-meta">{game.status}</span><p>{game.observation}</p><SourceLink url={game.source} label="Official game & feature source" /><div className="fps-market-signal"><strong>{game.peakCCU.toLocaleString('en-US')}</strong><span>All-time peak concurrent Steam players</span><span className="fps-meta">Peak: {game.peakDate} · checked {concept.asOf}</span><SourceLink url={game.metricSource} label="SteamDB observation" /><p>{game.metricCaveat}</p></div></div></article>)}</div>
    <div className="editorial-next"><a href="/survival-demo/#gdd-lessons">Seven source-backed lessons for this exact demo <ArrowRight /></a><a href="/survival-demo/#gdd-ui">UI, inventory and vehicle screen plans <ArrowRight /></a></div>
    <p className="fps-meta">Comparable metrics retain their 2 September 2026 snapshot. The revised GDD, asset pipeline and additional evidence were checked on 3 September. The earlier shortcut-only concept is no longer the active demo plan.</p>
    <Button onClick={()=>build(gdd.playerPromise)}>Use the new promise in an experiment brief <ArrowRight /></Button>
  </section>;
}
