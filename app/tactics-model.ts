// Pure logic for tactic cards. No JSON imports here so that the validator
// (node --experimental-strip-types) and the site share one resolver.

export type Stage =
  | 'idea'
  | 'page'
  | 'demo'
  | 'festival'
  | 'launch'
  | 'post-launch';
export type TeamSize = 'solo' | 'small';
export type EvidenceClass =
  | 'reported'
  | 'observed'
  | 'estimate'
  | 'analysis'
  | 'editorial';

export type TacticCard = {
  id: string;
  title: string;
  stages: Stage[];
  teamSizes: TeamSize[];
  channel: string;
  summary: string;
  try: string[];
  evidence: string[];
  counter: string[];
  cannotProve: string;
  checkedAt: string;
};

export type TacticsFile = {
  updatedAt: string;
  methodology: string;
  stages: { id: Stage; label: string; question: string }[];
  channels: string[];
  cards: TacticCard[];
};

export type EvidenceClasses = {
  classes: Record<EvidenceClass, { label: string; description: string }>;
  labels: Record<string, EvidenceClass>;
};

type Rec = Record<string, unknown>;
export type SourceRecords = {
  article: Rec[];
  story: Rec[];
  playbook: Rec[];
  case: Rec[];
};

export type ResolvedEvidence = {
  ref: string;
  kind: keyof SourceRecords;
  recordTitle: string;
  sitePath: string;
  quote: string;
  caveat: string | null;
  label: string;
  evidenceClass: EvidenceClass | null;
  sourceUrl: string;
  date: string | null;
};

// Labels for record parts that carry no evidence label of their own.
export const DATED_EVENT = 'Dated event in the cited source';
export const PUBLIC_METRIC = 'Public metric observation';
export const SITE_EDITORIAL = 'Steam Discovery editorial note';

const sitePaths: Record<keyof SourceRecords, (id: string) => string> = {
  article: (id) => `/reading/${id}/`,
  story: (id) => `/case-studies/${id}/`,
  playbook: (id) => `/playbooks/${id}/`,
  case: (id) => `/games/${id}/`,
};

const str = (value: unknown): string =>
  value === null || value === undefined
    ? ''
    : typeof value === 'object'
      ? JSON.stringify(value)
      : String(value as string | number | boolean);
const join = (...parts: unknown[]) => parts.map(str).filter(Boolean).join(' ');

/** Parse `kind:recordId#field.index`. Returns null when malformed. */
export function parseRef(ref: string) {
  const match =
    /^(article|story|playbook|case):([a-z0-9-]+)#([A-Za-z]+)(?:\.(\d+))?$/.exec(
      ref,
    );
  if (!match) return null;
  return {
    kind: match[1] as keyof SourceRecords,
    id: match[2],
    field: match[3],
    index: match[4] === undefined ? null : Number(match[4]),
  };
}

export function resolveRef(
  ref: string,
  records: SourceRecords,
  classes: EvidenceClasses,
): ResolvedEvidence | null {
  const parsed = parseRef(ref);
  if (!parsed) return null;
  const record = records[parsed.kind].find((item) => item.id === parsed.id);
  if (!record) return null;
  const raw = record[parsed.field];
  const part =
    parsed.index === null
      ? raw
      : Array.isArray(raw)
        ? raw[parsed.index]
        : undefined;
  if (
    part === undefined ||
    part === null ||
    (parsed.index === null && Array.isArray(raw))
  )
    return null;
  const recordTitle = str(record.title);
  const base = {
    ref,
    kind: parsed.kind,
    recordTitle,
    sitePath: sitePaths[parsed.kind](parsed.id),
  };
  let quote = '';
  let caveat: string | null = null;
  let label = '';
  let sourceUrl = '';
  let date: string | null = null;

  if (typeof part === 'string') {
    quote = part;
    sourceUrl =
      str(record.url) || str((record.sourceUrls as string[] | undefined)?.[0]);
    date = str(record.date || record.publishDate) || null;
    const editorialFields = [
      'actionableLesson',
      'applicationSteps',
      'limitations',
      'soloChecklist',
      'smallTeamChecklist',
      'cannotProve',
      'caveat',
      'spin',
      'scopeFit',
    ];
    label = editorialFields.includes(parsed.field)
      ? SITE_EDITORIAL
      : str(record.evidenceType || record.evidenceClassification);
  } else if (typeof part === 'object') {
    const p = part as Rec;
    if (parsed.field === 'kpis') {
      quote = `${str(p.label)}: ${join(p.value, p.unit)} (${str(p.window)})`;
      caveat = str(p.caveat) || null;
      label = str(p.evidence);
      sourceUrl = str(p.source);
      date = str(p.window) || null;
    } else if (
      parsed.field === 'timeline' ||
      parsed.field === 'marketingEvents'
    ) {
      const when = str(p.when || p.date);
      const outcome = p.outcome ?? p.result;
      quote = `${when} · ${str(p.channel)}: ${str(p.action)}${outcome ? ` → ${str(outcome)}` : ''}`;
      caveat = str(p.caveat || p.attribution) || null;
      label = str(p.evidence) || str(p.evidenceType) || DATED_EVENT;
      sourceUrl = str(p.source);
      date = when || null;
    } else if (parsed.field === 'reportedOutcome') {
      quote = `${str(p.metric)}: ${join(p.value, p.unit)} (${str(p.date)})`;
      caveat = str(p.scope) || null;
      label = str(p.evidence);
      sourceUrl = str(p.source);
      date = str(p.date) || null;
    } else if (parsed.field === 'observedMetrics') {
      quote = `${str(p.reviews)} Steam reviews; peak concurrent players ${str(p.peakCCU)} (as of ${str(p.asOf)})`;
      label = PUBLIC_METRIC;
      sourceUrl = str(p.source);
      date = str(p.asOf) || null;
    } else return null;
  } else return null;

  if (!quote.trim() || !sourceUrl) return null;
  return {
    ...base,
    quote,
    caveat,
    label,
    evidenceClass: classes.labels[label] ?? null,
    sourceUrl,
    date,
  };
}

/** Numbers written in a card's own text, normalised (commas removed). */
export function numbersIn(text: string): string[] {
  return [...text.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) =>
    m[0].replace(/,/g, '').replace(/\.0+$/, ''),
  );
}

export function cardText(card: TacticCard) {
  return [card.title, card.summary, ...card.try, card.cannotProve].join('\n');
}

export function cardsFor(
  cards: TacticCard[],
  filter: {
    stage: Stage | 'all';
    team: TeamSize | 'all';
    channel: string;
    query: string;
  },
) {
  const words = filter.query.toLowerCase().split(/\s+/).filter(Boolean);
  return cards.filter(
    (card) =>
      (filter.stage === 'all' || card.stages.includes(filter.stage)) &&
      (filter.team === 'all' || card.teamSizes.includes(filter.team)) &&
      (filter.channel === 'all' || card.channel === filter.channel) &&
      words.every((word) =>
        [card.title, card.summary, card.channel, ...card.try]
          .join(' ')
          .toLowerCase()
          .includes(word),
      ),
  );
}

export const stageOrder: Stage[] = [
  'idea',
  'page',
  'demo',
  'festival',
  'launch',
  'post-launch',
];

/** Markdown launch plan: chosen cards grouped by their earliest stage. */
export function planMarkdown(
  cards: TacticCard[],
  stages: TacticsFile['stages'],
  origin: string,
  resolve: (ref: string) => ResolvedEvidence | null,
) {
  const lines = [
    '# My launch plan',
    '',
    `From Steam Discovery tactic cards (${origin}/tactics/). Each tactic links to its sources; the evidence limits travel with it.`,
    '',
  ];
  for (const stage of stageOrder) {
    const chosen = cards.filter(
      (card) => stageOrder.find((s) => card.stages.includes(s)) === stage,
    );
    if (!chosen.length) continue;
    lines.push(`## ${stages.find((s) => s.id === stage)?.label ?? stage}`, '');
    for (const card of chosen) {
      lines.push(`### ${card.title}`, '', card.summary, '');
      for (const step of card.try) lines.push(`- [ ] ${step}`);
      lines.push(
        '',
        `Cannot prove: ${card.cannotProve}`,
        '',
        `Sources: ${[
          ...new Set(
            card.evidence
              .map(resolve)
              .filter(Boolean)
              .map((e) => e!.sourceUrl),
          ),
        ].join(' · ')}`,
        `Card: ${origin}/tactics/${card.id}/`,
        '',
      );
    }
  }
  return lines.join('\n');
}
