import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRight,
  Check,
  ClipboardList,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  tactics,
  evidenceClasses,
  resolveEvidence,
  tacticPath,
} from './tactics-data';
import {
  cardsFor,
  planMarkdown,
  stageOrder,
  type EvidenceClass,
  type ResolvedEvidence,
  type Stage,
  type TacticCard,
  type TeamSize,
} from './tactics-model';
import {
  ReferenceLink,
  ReferenceRegister,
  EditorialCredit,
} from './source-references';

const PLAN_KEY = 'steam-discovery-plan-v1';
const origin = 'https://steam-discovery.vercel.app';
type Filters = {
  stage: Stage | 'all';
  team: TeamSize | 'all';
  channel: string;
  query: string;
};
const defaults: Filters = {
  stage: 'all',
  team: 'all',
  channel: 'all',
  query: '',
};
const stageLabel = (id: Stage) =>
  tactics.stages.find((s) => s.id === id)?.label ?? id;

function readPlan(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(PLAN_KEY) ?? '[]');
    return Array.isArray(value)
      ? value.filter((id) => tactics.cards.some((card) => card.id === id))
      : [];
  } catch {
    return [];
  }
}
function usePlan() {
  const [plan, setPlan] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) setPlan(readPlan());
    });
    return () => {
      active = false;
    };
  }, []);
  const save = (next: string[]) => {
    setPlan(next);
    try {
      window.localStorage.setItem(PLAN_KEY, JSON.stringify(next));
    } catch {
      /* storage blocked: plan lasts for this visit only */
    }
  };
  const toggle = (id: string) =>
    save(plan.includes(id) ? plan.filter((x) => x !== id) : [...plan, id]);
  return { plan, toggle, clear: () => save([]) };
}

function ClassChip({ cls }: { cls: EvidenceClass | null }) {
  if (!cls) return null;
  return (
    <span
      className={`tactic-class tactic-class-${cls}`}
      title={evidenceClasses.classes[cls].description}
    >
      {evidenceClasses.classes[cls].label}
    </span>
  );
}

function strength(card: TacticCard) {
  const counts = new Map<EvidenceClass, number>();
  for (const item of card.evidence.map(resolveEvidence))
    if (item?.evidenceClass)
      counts.set(item.evidenceClass, (counts.get(item.evidenceClass) ?? 0) + 1);
  return [...counts.keys()];
}

function PlanButton({
  id,
  plan,
  toggle,
}: {
  id: string;
  plan: string[];
  toggle: (id: string) => void;
}) {
  const added = plan.includes(id);
  return (
    <Button
      size="sm"
      variant={added ? 'default' : 'outline'}
      aria-pressed={added}
      onClick={() => toggle(id)}
    >
      {added ? <Check aria-hidden="true" /> : <Plus aria-hidden="true" />}
      {added ? 'In my plan' : 'Add to my plan'}
    </Button>
  );
}

function TacticSummary({
  card,
  plan,
  toggle,
}: {
  card: TacticCard;
  plan: string[];
  toggle: (id: string) => void;
}) {
  return (
    <article className="tactic-card">
      <div className="tactic-meta">
        <span>{card.stages.map(stageLabel).join(' · ')}</span>
        <span>{card.channel}</span>
      </div>
      <h2>
        <a href={tacticPath(card.id)}>{card.title}</a>
      </h2>
      <p>{card.summary}</p>
      <div className="tactic-classes" aria-label="Evidence types">
        {strength(card).map((cls) => (
          <ClassChip key={cls} cls={cls} />
        ))}
        {card.counter.length > 0 && (
          <span className="tactic-class tactic-class-counter">
            Counterexample
          </span>
        )}
      </div>
      <div className="tactic-actions">
        <PlanButton id={card.id} plan={plan} toggle={toggle} />
        <a href={tacticPath(card.id)}>
          Evidence & limits <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function EvidenceItem({ item }: { item: ResolvedEvidence }) {
  return (
    <li className="tactic-evidence">
      <div className="tactic-evidence-head">
        <ClassChip cls={item.evidenceClass} />
        <span>{item.label}</span>
        {item.date && <time>{item.date}</time>}
      </div>
      <blockquote>{item.quote}</blockquote>
      {item.caveat && (
        <p className="tactic-caveat">
          <ShieldAlert aria-hidden="true" /> {item.caveat}
        </p>
      )}
      <div className="tactic-evidence-links">
        <ReferenceLink url={item.sourceUrl} label="Original source" />
        <a href={item.sitePath}>Our note: {item.recordTitle}</a>
      </div>
    </li>
  );
}

function PlanPanel({ plan, clear }: { plan: string[]; clear: () => void }) {
  const [copied, setCopied] = useState(false);
  const chosen = tactics.cards.filter((card) => plan.includes(card.id));
  const markdown = () =>
    planMarkdown(chosen, tactics.stages, origin, resolveEvidence);
  function download() {
    const url = URL.createObjectURL(
      new Blob([markdown()], { type: 'text/markdown' }),
    );
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-launch-plan.md';
    a.click();
    URL.revokeObjectURL(url);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      download();
    }
  }
  return (
    <aside className="tactic-plan" aria-label="My launch plan" id="my-plan">
      <h2>
        <ClipboardList aria-hidden="true" /> My launch plan
      </h2>
      {chosen.length === 0 ? (
        <p>
          Add cards to build a checklist ordered by stage. It stays in this
          browser; nothing is sent anywhere.
        </p>
      ) : (
        <>
          <ol>
            {stageOrder.flatMap((stage) =>
              chosen
                .filter(
                  (card) =>
                    stageOrder.find((s) => card.stages.includes(s)) === stage,
                )
                .map((card) => (
                  <li key={card.id}>
                    <small>{stageLabel(stage)}</small>
                    <a href={tacticPath(card.id)}>{card.title}</a>
                  </li>
                )),
            )}
          </ol>
          <div className="tactic-plan-actions">
            <Button size="sm" onClick={download}>
              <ArrowDownToLine aria-hidden="true" /> Download Markdown
            </Button>
            <Button size="sm" variant="outline" onClick={copy}>
              {copied ? 'Copied' : 'Copy Markdown'}
            </Button>
            <Button size="sm" variant="ghost" onClick={clear}>
              <Trash2 aria-hidden="true" /> Clear
            </Button>
          </div>
        </>
      )}
    </aside>
  );
}

function TacticDetail({
  card,
  plan,
  toggle,
}: {
  card: TacticCard;
  plan: string[];
  toggle: (id: string) => void;
}) {
  const evidence = card.evidence
    .map(resolveEvidence)
    .filter((item): item is ResolvedEvidence => !!item);
  const counter = card.counter
    .map(resolveEvidence)
    .filter((item): item is ResolvedEvidence => !!item);
  const references = [
    ...evidence.map((item) => ({
      url: item.sourceUrl,
      uses: [`Evidence for this tactic: ${item.quote.slice(0, 140)}`],
    })),
    ...counter.map((item) => ({
      url: item.sourceUrl,
      uses: [`Counterexample or limit: ${item.quote.slice(0, 140)}`],
    })),
  ];
  return (
    <article className="tactic-detail">
      <a className="hub-action" href="/tactics/">
        ← All tactics
      </a>
      <div className="tactic-meta">
        <span>{card.stages.map(stageLabel).join(' · ')}</span>
        <span>{card.channel}</span>
        <span>
          {card.teamSizes
            .map((t) => (t === 'solo' ? 'Solo' : '2–5 people'))
            .join(' · ')}
        </span>
      </div>
      <h1>{card.title}</h1>
      <p className="tactic-lead">{card.summary}</p>
      <PlanButton id={card.id} plan={plan} toggle={toggle} />
      <section>
        <h2>Try this</h2>
        <ul className="tactic-steps">
          {card.try.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Evidence</h2>
        <ol className="tactic-evidence-list">
          {evidence.map((item) => (
            <EvidenceItem key={item.ref} item={item} />
          ))}
        </ol>
      </section>
      {counter.length > 0 && (
        <section>
          <h2>Counterexample or limit</h2>
          <ol className="tactic-evidence-list">
            {counter.map((item) => (
              <EvidenceItem key={item.ref} item={item} />
            ))}
          </ol>
        </section>
      )}
      <section className="tactic-cannot">
        <h2>
          <ShieldAlert aria-hidden="true" /> Cannot prove
        </h2>
        <p>{card.cannotProve}</p>
      </section>
      <p className="tactic-checked">
        Card checked {card.checkedAt}. Evidence dates are the source’s own.
      </p>
      <EditorialCredit />
      <ReferenceRegister references={references} />
    </article>
  );
}

export function TacticDeck({ tacticId }: { tacticId?: string }) {
  const { plan, toggle, clear } = usePlan();
  const [filters, setFilters] = useState<Filters>(defaults);
  const selected = tactics.cards.find((card) => card.id === tacticId);
  useEffect(() => {
    if (selected) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const params = new URLSearchParams(window.location.search);
      const stage = params.get('stage') as Stage | null;
      const team = params.get('team') as TeamSize | null;
      const channel = params.get('channel');
      setFilters({
        stage: stage && stageOrder.includes(stage) ? stage : 'all',
        team: team === 'solo' || team === 'small' ? team : 'all',
        channel:
          channel && tactics.channels.includes(channel) ? channel : 'all',
        query: (params.get('q') ?? '').slice(0, 120),
      });
    });
    return () => {
      active = false;
    };
  }, [selected]);
  function update(next: Partial<Filters>) {
    const merged = { ...filters, ...next };
    setFilters(merged);
    const params = new URLSearchParams();
    if (merged.stage !== 'all') params.set('stage', merged.stage);
    if (merged.team !== 'all') params.set('team', merged.team);
    if (merged.channel !== 'all') params.set('channel', merged.channel);
    if (merged.query) params.set('q', merged.query);
    const search = params.toString();
    window.history.replaceState(
      {},
      '',
      `/tactics/${search ? `?${search}` : ''}`,
    );
  }
  const visible = useMemo(() => cardsFor(tactics.cards, filters), [filters]);
  const stageInfo = tactics.stages.find((s) => s.id === filters.stage);

  if (selected)
    return (
      <section className="workbench hub-view tactic-view">
        <div className="tactic-layout">
          <TacticDetail card={selected} plan={plan} toggle={toggle} />
          <PlanPanel plan={plan} clear={clear} />
        </div>
      </section>
    );
  return (
    <section className="workbench hub-view tactic-view">
      <header className="hub-heading">
        <p className="section-kicker">TACTIC DECK · WHAT TO DO AT YOUR STAGE</p>
        <h1>Pick your stage. See what worked, and what it cannot prove.</h1>
        <p>
          {tactics.cards.length} tactics drawn from this library’s source notes,
          game stories and playbooks. Every number is quoted from a dated source
          with its evidence type; every card keeps its limits and, where we have
          one, a counterexample.
        </p>
      </header>
      <div className="tactic-stages" role="group" aria-label="Stage">
        <Button
          variant={filters.stage === 'all' ? 'default' : 'outline'}
          aria-pressed={filters.stage === 'all'}
          onClick={() => update({ stage: 'all' })}
        >
          All stages
        </Button>
        {tactics.stages.map((stage) => (
          <Button
            key={stage.id}
            variant={filters.stage === stage.id ? 'default' : 'outline'}
            aria-pressed={filters.stage === stage.id}
            onClick={() => update({ stage: stage.id })}
          >
            {stage.label}
          </Button>
        ))}
      </div>
      {stageInfo && <p className="tactic-question">{stageInfo.question}</p>}
      <div className="tactic-toolbar">
        <label className="hub-search" htmlFor="tactic-search">
          <Search size={18} aria-hidden="true" />
          <span className="sr-only">Search tactics</span>
          <Input
            id="tactic-search"
            maxLength={120}
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
            placeholder="Wishlists, trailer, playtest, price…"
          />
        </label>
        <div className="hub-audience" role="group" aria-label="Team size">
          {(
            [
              ['all', 'Any team'],
              ['solo', 'Solo'],
              ['small', '2–5 people'],
            ] as const
          ).map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={filters.team === value ? 'default' : 'outline'}
              aria-pressed={filters.team === value}
              onClick={() => update({ team: value })}
            >
              {label}
            </Button>
          ))}
        </div>
        <label className="tactic-select" htmlFor="tactic-channel">
          <span>Channel</span>
          <select
            id="tactic-channel"
            value={filters.channel}
            onChange={(e) => update({ channel: e.target.value })}
          >
            <option value="all">All channels</option>
            {tactics.channels
              .filter((c) => tactics.cards.some((card) => card.channel === c))
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>
        </label>
      </div>
      <div className="tactic-layout">
        <div>
          <p className="tactic-count" aria-live="polite">
            {visible.length} of {tactics.cards.length} tactics
          </p>
          <div className="tactic-grid">
            {visible.map((card) => (
              <TacticSummary
                key={card.id}
                card={card}
                plan={plan}
                toggle={toggle}
              />
            ))}
          </div>
          {visible.length === 0 && (
            <p>
              No tactic matches.{' '}
              <button className="inline-link" onClick={() => update(defaults)}>
                Clear filters
              </button>
            </p>
          )}
          <p className="tactic-method">
            {tactics.methodology}{' '}
            <a href="/about/#attribution">How we attribute sources</a>.
          </p>
        </div>
        <PlanPanel plan={plan} clear={clear} />
      </div>
    </section>
  );
}
