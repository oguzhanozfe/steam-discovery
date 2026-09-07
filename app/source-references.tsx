import { ArrowUpRight } from 'lucide-react';
import { readingLibrary, gameLibrary, type GameRecord, type ReadingArticle } from './discovery-data';
import {
  gameStories,
  originalAnalysis,
  survivalDemoGdd,
  type GameStory,
} from './editorial-data';
import checks from './data/reference-checks.json';
import { ideas, type Idea } from './research-data';
import nicheData from './data/hub-niches.json';
import conceptData from './data/solo-concepts.json';
import articleData from './data/hub-articles.json';

export type ReferenceUse = { url: string; uses?: string[] };
export type SourceAccess = {
  url: string;
  checkedAt: string;
  access: string;
  note?: string;
};
const origin = 'https://steam-discovery.vercel.app';
const publications: Record<string, string> = {
  'howtomarketagame.com': 'How To Market A Game',
  'newsletter.gamediscover.co': 'GameDiscoverCo',
  'gameworldobserver.com': 'Game World Observer',
  'derek-lieu.com': 'Derek Lieu',
  'partner.steamgames.com': 'Valve Steamworks',
  'store.steampowered.com': 'Steam',
  'steamcommunity.com': 'Steam Community',
  'steamdb.info': 'SteamDB',
  'steamspy.com': 'SteamSpy',
};
export function referenceKey(value: string) {
  const url = new URL(value, origin);
  url.hash = '';
  for (const key of [...url.searchParams.keys()])
    if (key.startsWith('utm_')) url.searchParams.delete(key);
  return url.href.replace(/\/$/, '');
}
const checkedByUrl = new Map(
  checks.sources.map((source) => [referenceKey(source.url), source]),
);
const readingByUrl = new Map(
  readingLibrary.map((source) => [referenceKey(source.url), source]),
);
const gameById = new Map(gameLibrary.map((game) => [String(game.appId), game]));
export function sourceMetadata(url: string) {
  const key = referenceKey(url);
  const fresh = checkedByUrl.get(key);
  const note = readingByUrl.get(key);
  const parsed = new URL(url, origin);
  const host = parsed.hostname.replace(/^www\./, '');
  const appId =
    parsed.pathname.match(/\/(?:app|appreviews)\/(\d+)/)?.[1] ??
    parsed.searchParams.get('appid');
  const game = appId ? gameById.get(appId) : undefined;
  const pageType =
    host === 'steamdb.info'
      ? 'SteamDB game data'
      : parsed.pathname.includes('/appreviews/')
        ? 'Steam review query'
        : host === 'store.steampowered.com'
          ? 'Steam store page'
          : host === 'steamcommunity.com'
            ? 'Steam community / developer announcement'
            : null;
  const title =
    fresh?.title ??
    note?.title ??
    (pageType
      ? `${pageType}${game ? ` — ${game.title}` : appId ? ` — app ${appId}` : ''}`
      : null);
  return {
    url,
    title,
    publication:
      fresh?.publication ?? note?.publication ?? publications[host] ?? host,
    author: fresh?.author ?? note?.author ?? null,
    publishedAt: fresh?.publishedAt ?? note?.date ?? null,
    checkedAt: fresh?.checkedAt ?? note?.checkedAt ?? null,
    access: fresh?.access ?? note?.access ?? null,
    scope: fresh?.scope ?? null,
    authorNote: fresh?.authorNote ?? null,
    metadataStatus: fresh
      ? 'Title and source access checked in this update'
      : note
        ? 'Metadata from our earlier source note; not rechecked in this update'
        : pageType
          ? 'Data-page label, not an article title'
          : 'Article title, author and date not yet recorded; follow the exact URL',
  };
}
export function ReferenceLink({
  url,
  label,
  className = 'source-link',
}: {
  url: string;
  label?: string;
  className?: string;
}) {
  const source = sourceMetadata(url);
  const title = source.title ?? url;
  const prefix =
    label &&
    label !== 'Source' &&
    label !== title &&
    label !== source.publication
      ? `${label} · `
      : '';
  return (
    <a
      className={className}
      href={url}
      target="_blank"
      rel="noreferrer"
      data-reference-url={url}
    >
      {prefix}
      {title}
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}
export function ReferenceLinks({
  urls,
  className = 'editorial-citations',
}: {
  urls: string[];
  className?: string;
}) {
  return urls.length ? (
    <div className={className} aria-label="Original source links">
      {[...new Set(urls)].map((url) => (
        <ReferenceLink key={url} url={url} />
      ))}
    </div>
  ) : null;
}
export function mergeReferenceUses(references: ReferenceUse[]) {
  const merged = new Map<string, ReferenceUse>();
  for (const reference of references) {
    const key = referenceKey(reference.url);
    const previous = merged.get(key);
    merged.set(key, {
      url: previous?.url ?? reference.url,
      uses: [
        ...new Set([...(previous?.uses ?? []), ...(reference.uses ?? [])]),
      ],
    });
  }
  return [...merged.values()];
}
export function ReferenceRegister({
  references,
  access = [],
  id,
}: {
  references: ReferenceUse[];
  access?: SourceAccess[];
  id?: string;
}) {
  const rows = mergeReferenceUses(references);
  if (!rows.length) return null;
  return (
    <section
      className="reference-register"
      id={id}
      aria-label="References and how we used them"
    >
      <h2>References & how we used them</h2>
      <p className="reference-explainer">
        {rows.length} source references. “Used for” identifies where this page
        relies on each source; it does not mean the author endorses our
        interpretation. Historical access notes are not fresh verification.
      </p>
      <ol>
        {rows.map((reference) => {
          const source = sourceMetadata(reference.url);
          const earlier = access.find(
            (item) => referenceKey(item.url) === referenceKey(reference.url),
          );
          return (
            <li
              key={referenceKey(reference.url)}
              data-source-record={reference.url}
            >
              <ReferenceLink url={reference.url} />
              <p className="reference-byline">
                {source.publication} · {source.author ?? 'Author not recorded'}{' '}
                ·{' '}
                {source.publishedAt
                  ? `Published ${source.publishedAt}`
                  : 'Publication date not recorded'}
              </p>
              {source.authorNote && (
                <p className="reference-access">{source.authorNote}</p>
              )}
              <p>
                <strong>Used for:</strong>{' '}
                {reference.uses?.length
                  ? reference.uses.join('; ')
                  : 'Contextual reference attached to this page; no claim-level mapping recorded.'}
              </p>
              {source.scope && (
                <p>
                  <strong>Evidence scope:</strong> {source.scope}
                </p>
              )}
              <p className="reference-access">
                {source.metadataStatus}.
                {source.access && <> {source.access}.</>}
                {source.checkedAt && <> Check date: {source.checkedAt}.</>}
              </p>
              {earlier && (
                <p className="reference-access">
                  Earlier case access record ({earlier.checkedAt}):{' '}
                  {earlier.access}. {earlier.note}
                </p>
              )}
              <a
                className="reference-url"
                href={reference.url}
                target="_blank"
                rel="noreferrer"
              >
                {reference.url}
              </a>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
export function EditorialCredit({
  kind = 'synthesis',
  sourceUrls = [],
}: {
  kind?: 'synthesis' | 'proposal';
  sourceUrls?: string[];
}) {
  return (
    <aside
      className="editorial-credit"
      aria-label="Source and authorship disclosure"
    >
      <strong>
        {kind === 'proposal'
          ? 'Design proposal by Steam Discovery'
          : 'Research synthesis by Steam Discovery'}
      </strong>
      <p>
        {kind === 'proposal'
          ? 'The concept, scope, workflow and test gates are our proposals. Linked games and articles are references, not authors or validators of this plan.'
          : 'Original reporting belongs to the credited authors. We select and paraphrase cited findings, retain their dates and limitations, then add our own comparisons and proposed experiments. We did not conduct these interviews.'}
      </p>
      {sourceUrls.length > 0 && <ReferenceLinks urls={sourceUrls} />}
      <a href="/about/#attribution">
        Attribution policy, access limits & corrections →
      </a>
    </aside>
  );
}
export function storyReferences(story: GameStory): ReferenceUse[] {
  return mergeReferenceUses([
    ...story.sourceUrls.map((url) => ({ url })),
    ...story.story.flatMap((section) =>
      section.sourceUrls.map((url) => ({
        url,
        uses: [`Narrative context: ${section.heading}`],
      })),
    ),
    ...story.kpis.map((kpi) => ({
      url: kpi.source,
      uses: [`KPI: ${kpi.label} (${kpi.window})`],
    })),
    ...story.timeline.map((event) => ({
      url: event.source,
      uses: [`Campaign event: ${event.when} — ${event.channel}`],
    })),
    ...story.demand.sourceUrls.map((url) => ({
      url,
      uses: ['Evidence considered in our demand interpretation'],
    })),
    ...story.mechanism.sourceUrls.map((url) => ({
      url,
      uses: ['Reported mechanism; causal explanation remains our inference'],
    })),
  ]);
}
export function analysisReferences(
  article: (typeof originalAnalysis.articles)[number],
): ReferenceUse[] {
  return mergeReferenceUses([
    ...article.sourceUrls.map((url) => ({ url })),
    ...article.sections.flatMap((section) =>
      section.sourceUrls.map((url) => ({
        url,
        uses: [`Evidence discussed in: ${section.heading}`],
      })),
    ),
    ...article.evidenceCards.flatMap((card) =>
      card.sourceUrl
        ? [{ url: card.sourceUrl, uses: [`Evidence card: ${card.label}`] }]
        : [],
    ),
    ...(article.comparison?.rows.flatMap((row) =>
      row.sourceUrls.map((url) => ({
        url,
        uses: [`Comparison row: ${row.cells[0]}`],
      })),
    ) ?? []),
  ]);
}
export function ArticleSourceCatalog() {
  const urls = [
    ...new Set([
      ...checks.sources.map((source) => source.url),
      ...readingLibrary.map((source) => source.url),
    ]),
  ];
  return (
    <ReferenceRegister
      id="article-sources"
      references={urls.map((url) => ({
        url,
        uses: readingLibrary
          .filter((note) => referenceKey(note.url) === referenceKey(url))
          .map((note) => `Research note: ${note.title}`),
      }))}
    />
  );
}

export function gameReferences(game: GameRecord): ReferenceUse[] {
  return mergeReferenceUses([
    ...game.sources.map((url) => ({ url })),
    {
      url: game.observed.source,
      uses: [`Public metrics observed ${game.observed.asOf}`],
    },
    ...(game.outcome
      ? [
          {
            url: game.outcome.source,
            uses: [`Reported outcome: ${game.outcome.date}`],
          },
        ]
      : []),
    ...(game.owners.length || game.ownerRange
      ? [
          {
            url: game.ownerSource,
            uses: [`Owner estimates (${game.ownerAsOf}); not audited sales`],
          },
        ]
      : []),
    ...game.events.map((event) => ({
      url: event.source,
      uses: [`Event: ${event.date} — ${event.channel}`],
    })),
  ]);
}
export function gddReferences(): ReferenceUse[] {
  const gdd = survivalDemoGdd;
  return mergeReferenceUses([
    ...gdd.sourceUrls.map((url) => ({ url })),
    ...gdd.pipeline.checks.flatMap((check) =>
      check.documentedFacts.map((fact) => ({
        url: fact.sourceURL,
        uses: [`Vendor documentation: ${check.title}`],
      })),
    ),
    ...gdd.lessons.flatMap((lesson) => [
      ...lesson.sourceUrls.map((url) => ({
        url,
        uses: [`Game lesson: ${lesson.role}`],
      })),
      ...lesson.kpis.map((kpi) => ({
        url: kpi.source,
        uses: [`KPI: ${kpi.label} (${kpi.date})`],
      })),
    ]),
    ...gdd.distribution.constraints.map((rule) => ({
      url: rule.sourceURL,
      uses: [`Distribution constraint: ${rule.claim}`],
    })),
  ]);
}
export function ideaReferences(idea: Idea): ReferenceUse[] {
  const normalize = (title: string) => title.toLowerCase().replace(/[^a-z0-9]/g, '');
  return mergeReferenceUses(idea.comparables.flatMap(comparable => {
    const game = gameLibrary.find(game => normalize(game.title) === normalize(comparable.name));
    return game ? gameReferences(game).map(ref => ({ url: ref.url, uses: [`Comparable context: ${comparable.name}. The proposed spin, scores and scope are our hypotheses, not this source's claims.`] })) : [];
  }));
}
export function nicheReferences(niche: typeof nicheData.niches[number]): ReferenceUse[] {
  return mergeReferenceUses([
    ...niche.sources.map(url => ({ url, uses: ['Evidence considered in this niche interpretation; the opening and prototype are our proposals'] })),
    ...niche.comparables.map(game => ({ url: game.source, uses: [`${game.title}: ${game.reviews.toLocaleString('en-US')} reviews observed ${game.asOf}`] })),
  ]);
}
export function conceptReferences(concept: typeof conceptData.concepts[number]): ReferenceUse[] {
  return mergeReferenceUses([
    ...concept.comparables.map(appId => ({ url: `https://store.steampowered.com/app/${appId}/`, uses: ['Reference-game features and design inspiration; not proof of demand for this proposed concept'] })),
    ...(nicheData.niches.find(niche => niche.id === concept.nicheId)?.sources ?? []).map(url => ({ url, uses: ['Underlying niche evidence; this concept and its test gates are our proposal'] })),
  ]);
}
export function playbookReferences(article: typeof articleData.articles[number]): ReferenceUse[] {
  return mergeReferenceUses([
    { url: article.url, uses: ['Source synopsis and attributed takeaways; solo/small-team checklists are our proposed applications'] },
    ...article.supportingSources.map(source => ({ url: source.url, uses: ['Supporting documentation for release review timing'] })),
  ]);
}
export function readingReferences(article: ReadingArticle): ReferenceUse[] {
  return mergeReferenceUses([
    { url: article.url, uses: ['Original article summarized in this research note; hard-data statements retain the source scope'] },
    ...(article.sourceUrls ?? []).filter(url => url !== article.url).map(url => ({ url, uses: ['Supporting context; our application steps are separate proposals'] })),
  ]);
}
export const referenceMetadata = mergeReferenceUses([
  ...checks.sources.map((source) => ({ url: source.url })),
  ...readingLibrary.flatMap(note => readingReferences(note).map(ref => ({ ...ref, uses: ref.uses?.map(use => `${note.title}: ${use}`) }))),
  ...articleData.articles.flatMap(article => playbookReferences(article).map(ref => ({ ...ref, uses: ref.uses?.map(use => `${article.title}: ${use}`) }))),
  ...nicheData.niches.flatMap(niche => nicheReferences(niche).map(ref => ({ ...ref, uses: ref.uses?.map(use => `${niche.title}: ${use}`) }))),
  ...conceptData.concepts.flatMap(concept => conceptReferences(concept).map(ref => ({ ...ref, uses: ref.uses?.map(use => `${concept.title}: ${use}`) }))),
  ...gameStories.flatMap((story) =>
    storyReferences(story).map((ref) => ({
      ...ref,
      uses: ref.uses?.map((use) => `${story.title}: ${use}`),
    })),
  ),
  ...originalAnalysis.articles.flatMap((article) =>
    analysisReferences(article).map((ref) => ({
      ...ref,
      uses: ref.uses?.map((use) => `${article.title}: ${use}`),
    })),
  ),
  ...gameLibrary.flatMap((game) =>
    gameReferences(game).map((ref) => ({
      ...ref,
      uses: ref.uses?.map((use) => `${game.title}: ${use}`),
    })),
  ),
  ...gddReferences().map((ref) => ({
    ...ref,
    uses: ref.uses?.map((use) => `City-escape GDD: ${use}`),
  })),
  ...ideas.flatMap(idea => ideaReferences(idea).map(ref => ({ ...ref, uses: ref.uses?.map(use => `${idea.name}: ${use}`) }))),
]).map((reference) => ({
  ...sourceMetadata(reference.url),
  uses: reference.uses,
}));
