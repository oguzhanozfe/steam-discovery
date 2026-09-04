'use client';
import { ArrowRight, Compass, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { marketPatterns } from './discovery-data';
import { SourceLink } from './explorer';

export function MarketMap({ explore, build }: { explore: (query: string) => void; build: (hypothesis: string) => void }) {
  return <section className="market-map-section">
    <div className="workspace-heading"><div><p className="section-kicker"><Compass /> GENRE → NICHE → TROPE → TEST</p><h2>Eight opportunity hypotheses.<br />None is an empty market.</h2></div><p className="workspace-note">A genre is the ruleset. A niche is the buyer + use case. A trope is the instantly recognizable promise. The opening is a differentiated testable combination—not a high tag count.</p></div>
    <div className="pattern-grid">{marketPatterns.map((pattern, index) => <article className="pattern-card" key={pattern.id}><div className="pattern-topline"><span>0{index + 1} · {pattern.family}</span><span className={`fit fit-${pattern.fit.toLowerCase()}`}>{pattern.fit} demo fit</span></div><h3>{pattern.name}</h3><p className="pattern-trope">{pattern.trope}</p><div className="pattern-comps">{pattern.comps.map(comp => <button key={comp} onClick={() => explore(comp)}>{comp}<ArrowRight /></button>)}</div><div className="pattern-proof"><span>DEMAND EVIDENCE</span><p>{pattern.evidence}</p><SourceLink url={pattern.source} label="Evidence 1" /><SourceLink url={pattern.source2} label="Evidence 2" /></div><dl><div><dt>Potential opening</dt><dd>{pattern.gap}</dd></div><div><dt>Three-week slice</dt><dd>{pattern.build}</dd></div><div><dt>Channel test</dt><dd>{pattern.channel}</dd></div></dl><div className="pattern-risk"><ShieldAlert /><p>{pattern.risk}</p></div><Button variant="outline" size="sm" onClick={() => build(pattern.gap)}>Turn this into a test brief <ArrowRight /></Button></article>)}</div>
  </section>;
}
