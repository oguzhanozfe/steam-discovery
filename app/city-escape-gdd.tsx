import type { ReactNode } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { survivalDemoGdd as gdd, gameStories, storyPath } from './editorial-data';
import { EvidenceLinks } from './editorial';
import { SteamArtwork } from './steam-artwork';

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section id={id} className="editorial-section"><p className="section-kicker">{number} · CITY ESCAPE GDD</p><h2>{title}</h2>{children}</section>;
}
function Points({ title, items }: { title: string; items: string[] }) {
  return <div className="editorial-box"><h3>{title}</h3><ul>{items.map(item => <li key={item}>{item}</li>)}</ul></div>;
}
function Facts({ rows }: { rows: [string, string][] }) {
  return <dl className="editorial-facts">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}
const chapters = [
  ['gdd-sequence','Scene by scene'],['gdd-positioning','Player promise'],['gdd-pipeline','Asset pipeline'],
  ['gdd-ui','UI plan'],['gdd-combat','Combat & resources'],['gdd-systems','System contracts'],
  ['gdd-roadmap','15-day roadmap'],['gdd-lessons','Lessons from games'],['gdd-marketing','Marketing'],
  ['gdd-gates','Test gates'],['gdd-release','Release & risks'],
];
export function CityEscapeGdd() {
  return <section className="workbench editorial-view gdd-view city-gdd">
    <header className="original-heading"><p className="section-kicker">DEMO GDD · V{gdd.version} · {gdd.updatedAt}</p><h1>{gdd.title}</h1><p className="editorial-deck">{gdd.pitch}</p><p>{gdd.premise}</p><a className="editorial-primary-link" href="/data/survival-demo-gdd.md" download><Download aria-hidden="true" /> Download the complete GDD</a></header>
    <p className="editorial-status">{gdd.changeNote}</p>
    <div className="city-brief-strip"><div><strong>18–23 min</strong><span>Proposed active-play target</span></div><div><strong>8 story beats</strong><span>Home breach → boss killed</span></div><div><strong>11 UI specs</strong><span>HUD, bag, driving, camp & recovery</span></div><div><strong>15 workdays</strong><span>Integrate the existing foundation</span></div></div>
    <nav className="editorial-jumps" aria-label="GDD contents">{chapters.map(([id,label]) => <a key={id} href={'#'+id}>{label}</a>)}</nav>
    <Section id="gdd-sequence" number="01" title="Your demo, scene by scene.">
      <p className="editorial-lead">{gdd.decision}</p><p className="editorial-meta">{gdd.target}</p>
      <ol className="city-beat-strip" aria-label="Demo progression">{gdd.sequence.map((beat,i)=><li key={beat.id}><a href={'#beat-'+beat.id}><span>{String(i+1).padStart(2,'0')}</span><strong>{beat.beat}</strong><small>{beat.time}</small></a></li>)}</ol>
      <div className="city-scenes">{gdd.sequence.map((beat,i)=><article id={'beat-'+beat.id} key={beat.id} className="city-scene"><header><span>BEAT {String(i+1).padStart(2,'0')} · {beat.time}</span><h3>{beat.beat}</h3><p>{beat.objective}</p></header><div className="city-scene-body"><p className="editorial-lead">{beat.actions}</p><Facts rows={[['Direction & staging',beat.staging],['Start / completion trigger',beat.trigger],['UI at this moment',beat.ui],['Sound & captions',beat.audio],['Failure protection',beat.failSafe],['Checkpoint',beat.checkpoint]]} /></div></article>)}</div>
    </Section>
    <Section id="gdd-positioning" number="02" title="The survival promise inside the action.">
      <p className="editorial-lead">{gdd.playerPromise}</p><div className="editorial-two"><div className="editorial-box"><h3>Target player</h3><p>{gdd.audience}</p></div><div className="editorial-box"><h3>Not a new foundation project</h3><p>{gdd.nonGoals}</p></div></div>
      <div className="gdd-system-grid">{gdd.pillars.map(pillar=><article className="editorial-box" key={pillar.name}><h3>{pillar.name}</h3><p>{pillar.rule}</p><p className="gdd-acceptance"><b>Visible proof:</b> {pillar.proof}</p></article>)}</div>
      <h3>Scope contract</h3><dl className="editorial-facts">{gdd.scope.map(item=><div key={item.item}><dt><span className="editorial-meta">{item.priority}</span><br />{item.item}</dt><dd>{item.boundary}</dd></div>)}</dl>
      <h3>A playable route inside a larger-looking city</h3><div className="gdd-system-grid">{gdd.spaces.map(space=><article className="editorial-box" key={space.name}><h3>{space.name}</h3><p>{space.content}</p><p className="editorial-caution">{space.boundary}</p></article>)}</div>
      <Facts rows={[['Mood',gdd.artDirection.mood],['Asset consistency',gdd.artDirection.consistency],['Readability',gdd.artDirection.readability],['Characters',gdd.artDirection.characters],['Interiors',gdd.artDirection.interiors]]} />
    </Section>
    <Section id="gdd-pipeline" number="03" title="Gaea → city kit → Houdini interiors → playable route.">
      <p>Ready-made systems and art are the starting assets. The work below connects them into the same game and verifies the result.</p>
      <ol className="city-pipeline">{gdd.pipelineFlow.map((step,i)=><li key={step.stage}><span>{String(i+1).padStart(2,'0')}</span><div><h3>{step.stage}</h3><p className="editorial-meta">{step.owner}</p><p>{step.output}</p><p><b>Acceptance:</b> {step.gate}</p></div></li>)}</ol>
      <h3>Reuse status and proof required</h3>{gdd.assumptions.map(item=><article className="gdd-metric" key={item.system}><p className="section-kicker">{item.status}</p><h3>{item.system}</h3><p>{item.work}</p><p><b>Proof:</b> {item.proof}</p><p className="editorial-meta">Owner: {item.owner}</p></article>)}
      <p className="editorial-caution">{gdd.pipeline.versionCaveat}</p>
      <h3>Eight vendor-backed pipeline checks</h3><div className="city-checks">{gdd.pipeline.checks.map(check=><details className="city-check" key={check.id}><summary><span>{check.priority}</span>{check.title}</summary><div><h4>What the documentation establishes</h4>{check.documentedFacts.map(fact=><div key={fact.sourceURL}><p>{fact.text}</p><EvidenceLinks urls={[fact.sourceURL]} /></div>)}<h4>Our acceptance test</h4><p>{check.recommendedAcceptanceCheck}</p><p><b>Pass evidence:</b> {check.passEvidence}</p><p><b>Fallback:</b> {check.fallback}</p><p className="editorial-caution">{check.caveat}</p></div></details>)}</div>
      <Facts rows={[['Hardware target',gdd.performance.target],['Measurement',gdd.performance.measure],['Optimization priority',gdd.performance.priority],['Quality gate',gdd.performance.qualityGate]]} /><Points title="Record these before production expands" items={gdd.pipeline.unverifiedItemsToRecord} />
    </Section>
    <Section id="gdd-ui" number="04" title="UI that follows the player’s current task.">
      <Points title="UI rules" items={gdd.uiPrinciples} />
      <div className="city-ui-map" role="group" aria-label="On-foot HUD layout specification, not a game screenshot"><p className="city-ui-map-label">ON-FOOT HUD · LAYOUT SPECIFICATION</p><div className="city-ui-goal"><span>TOP LEFT</span><strong>Current objective</strong><p>One destination or action</p></div><div className="city-ui-boss"><span>TOP CENTER · CONDITIONAL</span><strong>Brute health / charge cue</strong><p>Only during the boss encounter</p></div><div className="city-ui-center"><span>CENTER</span><strong>Crosshair + interaction</strong><p>Keep the target visible</p></div><div className="city-ui-health"><span>BOTTOM LEFT</span><strong>Health · quick heal</strong></div><div className="city-ui-captions"><span>LOWER CENTER SAFE AREA</span><strong>Sound / dialogue captions</strong><p>Source + direction when important</p></div><div className="city-ui-ammo"><span>BOTTOM RIGHT</span><strong>Magazine / reserve</strong></div></div>
      <div className="gdd-system-grid">{gdd.uiScreens.map((screen,i)=><article className="editorial-box city-ui-spec" key={screen.id}><p className="section-kicker">UI {String(i+1).padStart(2,'0')}</p><h3>{screen.screen}</h3><p><b>Placement:</b> {screen.placement}</p><p><b>Content:</b> {screen.content}</p><p><b>States:</b> {screen.states}</p><p><b>Interaction:</b> {screen.interaction}</p><p className="gdd-acceptance"><b>Done when:</b> {screen.acceptance}</p></article>)}</div>
    </Section>
    <Section id="gdd-combat" number="05" title="Two herds, one camp defense, one killed boss.">
      <p className="editorial-lead">{gdd.resourcePlan.principle}</p>
      <div className="editorial-table-wrap" tabIndex={0} role="region" aria-label="Proposed encounter tuning"><table className="editorial-table"><thead><tr><th>Encounter</th><th>Total roster</th><th>Active at once</th><th>Purpose & rule</th></tr></thead><tbody>{gdd.encounters.map(encounter=><tr key={encounter.name}><td>{encounter.name}</td><td>{encounter.count}</td><td>{encounter.active}</td><td>{encounter.purpose}<p>{encounter.rule}</p></td></tr>)}</tbody></table></div>
      <p className="editorial-caution">All enemy counts, durations, ranges and ammunition values are starting balance proposals. The user’s required sequence stays intact when counts are reduced after testing.</p>
      <h3>Ammunition continuity</h3><p>{gdd.resourcePlan.ammo.label}</p><div className="city-ammo-strip">{gdd.resourcePlan.ammo.allocations.map(item=><div key={item.where}><strong>{item.rounds}</strong><span>{item.where}</span></div>)}</div><p>{gdd.resourcePlan.ammo.caveat}</p>
      <div className="editorial-two"><Points title="Inventory capacity contract" items={gdd.resourcePlan.inventoryRules} /><Points title="Checkpoint loadouts: no unwinnable retry" items={gdd.resourcePlan.readiness} /></div>
      <h3>Materials and crafting</h3><Facts rows={gdd.resourcePlan.materials.map(item=>[item.item,item.required+' required in this example. '+item.source+' '+item.purpose])} /><div className="editorial-two">{gdd.resourcePlan.recipes.map(recipe=><div className="editorial-box" key={recipe.name}><h3>{recipe.name}</h3><p><b>Cost:</b> {recipe.cost}</p><p>{recipe.effect}</p></div>)}</div><Points title="No invisible resource traps" items={gdd.resourcePlan.rules} />
      <h3 className="city-subtitle">The brute: one rule, clearly paid off</h3><p>{gdd.boss.identity}</p><Points title="Boss loop" items={gdd.boss.loop} /><Facts rows={[['Camp advantage',gdd.boss.defense],['Recoverable fallback',gdd.boss.fallback],['Ending contract',gdd.boss.killContract],['Starting tune',gdd.boss.tuning]]} />
    </Section>
    <Section id="gdd-systems" number="06" title="Integration contracts—not a replacement player system.">
      <div className="gdd-system-grid">{gdd.systems.map(system=><article className="editorial-box" key={system.name}><p className="editorial-meta">{system.owner}</p><h3>{system.name}</h3><p>{system.implementation}</p><p className="gdd-acceptance"><b>Done when:</b> {system.acceptance}</p></article>)}</div>
    </Section>
    <Section id="gdd-roadmap" number="07" title="15 working days, with owners and exit gates.">
      <p className="editorial-lead">{gdd.capacity.assumption}</p><Facts rows={gdd.capacity.roles.map(role=>[role.role+' · '+role.days+' days',role.allocation])} /><p className="editorial-caution">{gdd.capacity.reserve}</p><p>{gdd.capacity.budget}</p><Points title="Day-one dependencies" items={gdd.capacity.dependencies} />
      <div className="gdd-roadmap">{gdd.roadmap.map(phase=><article key={phase.days}><header><span>DAYS {phase.days}</span><h3>{phase.outcome}</h3></header><dl>{[['Developer A',phase.devA],['Developer B',phase.devB],['3D artist',phase.artist],['Product manager',phase.pm],['Marketing manager',phase.marketing]].map(([role,task])=><div key={role}><dt>{role}</dt><dd>{task}</dd></div>)}</dl><p className="gdd-phase-gate"><b>Exit gate:</b> {phase.gate}</p></article>)}</div>
    </Section>
    <Section id="gdd-lessons" number="08" title="What these game stories change in our demo.">
      <p>Seven evidence transfers across eight games. The metric shows the source’s context; it does not prove that the proposed design choice caused that outcome.</p>
      <div className="city-lessons">{gdd.lessons.map(lesson=><article className="city-lesson" key={lesson.id}><header><div className="city-lesson-art">{lesson.games.map(game=><SteamArtwork key={game.appId} appId={String(game.appId)} title={game.title} />)}</div><div><p className="section-kicker">{lesson.games.map(game=>game.title).join(' + ')}</p><h3>{lesson.role}</h3><p className="editorial-meta">Applies to: {lesson.applyTo.join(' · ')}</p></div></header><div className="city-lesson-body"><p><b>Source finding:</b> {lesson.sourceFacts}</p><div className="city-lesson-kpis">{lesson.kpis.map(kpi=><div key={kpi.label}><strong>{typeof kpi.value==='number'?kpi.value.toLocaleString('en-US'):kpi.value}</strong><span>{kpi.label} · {kpi.unit}</span><p className="editorial-meta">{kpi.date} · {kpi.evidence}</p>{'window' in kpi && <p className="editorial-meta">{kpi.window}</p>}<EvidenceLinks urls={[kpi.source]} /></div>)}</div><h4>Our application</h4><p>{lesson.application}</p><h4>Test it in this build</h4><p>{lesson.successTest}</p><p className="editorial-caution">{lesson.doNotInfer}</p><EvidenceLinks urls={lesson.sourceUrls} /><div className="city-story-links">{lesson.games.flatMap(game=>{const story=gameStories.find(s=>s.appId===game.appId);return story?[<a key={story.id} href={storyPath(story.id)}>Read the {story.title} story <ArrowRight /></a>]:[];})}</div></div></article>)}</div>
      <Points title="The crucial failure tests" items={gdd.crucialLessons} />
    </Section>
    <Section id="gdd-marketing" number="09" title="Capture a survival consequence, not just a city montage.">
      <div className="gdd-system-grid">{gdd.marketing.map(step=><article className="editorial-box" key={step.when}><p className="editorial-meta">{step.when}</p><h3>{step.action}</h3><p>{step.deliverable}</p><p className="editorial-caution">{step.avoid}</p></article>)}</div>
    </Section>
    <Section id="gdd-gates" number="10" title="What the team measures before committing further.">
      {gdd.metrics.map(metric=><article className="gdd-metric" key={metric.metric}><h3>{metric.metric}</h3><p><b>Definition:</b> {metric.definition}</p><p><b>Collection:</b> {metric.collection}</p><p><b>Decision:</b> {metric.decision}</p></article>)}
      <div className="editorial-box"><h3>Event vocabulary</h3><div className="gdd-event-tags">{gdd.events.map(event=><code key={event}>{event}</code>)}</div><p>{gdd.instrumentation}</p></div><div className="gdd-system-grid">{gdd.gates.map(gate=><article className="editorial-box" key={gate.when}><h3>{gate.when}</h3><p><b>Pass:</b> {gate.pass}</p><p><b>Revise:</b> {gate.revise}</p><p><b>Stop / hold:</b> {gate.stop}</p></article>)}</div><p className="editorial-caution">{gdd.gateCaveat}</p>
    </Section>
    <Section id="gdd-release" number="11" title="Deliver the complete scenario. Separate release eligibility.">
      <p className="editorial-lead">{gdd.distribution.committedDeliverable}</p><p>{gdd.distribution.candidate}</p><div className="city-checks">{gdd.distribution.constraints.map(rule=><details className="city-check" key={rule.id}><summary>{rule.claim}</summary><div><p>{rule.definition}</p><p>{rule.caveat}</p><EvidenceLinks urls={[rule.sourceURL]} /></div></details>)}</div>
      <h3>Risk register</h3><dl className="editorial-facts">{gdd.risks.map(risk=><div key={risk.risk}><dt>{risk.risk}<br /><span className="editorial-meta">{risk.owner}</span></dt><dd>{risk.response}<p><b>First cut:</b> {risk.cut}</p></dd></div>)}</dl><h3>After this demo</h3><Facts rows={gdd.nextSteps.map(step=>[step.stage,step.decision])} />
    </Section>
    <p className="editorial-method">{gdd.status} Vendor facts and game metrics carry citations; the scenario, UI, balance and test plan are our proposed application to the team's brief.</p><details className="editorial-sources"><summary>Full source register · {gdd.sourceUrls.length} references</summary><ol>{gdd.sourceUrls.map(url=><li key={url}><a href={url} target="_blank" rel="noreferrer">{url}</a></li>)}</ol></details><div className="editorial-next"><a href="/data/survival-demo-gdd.md" download>Download complete GDD <Download /></a><a href="/">Back to game stories <ArrowRight /></a></div>
  </section>;
}
