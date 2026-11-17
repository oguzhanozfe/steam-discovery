import tacticsJson from './data/tactics.json';
import classesJson from './data/evidence-classes.json';
import newsletters from './data/newsletters.json';
import readingExpansion from './data/reading-expansion.json';
import readingUpdates from './data/reading-updates.json';
import gameStoriesJson from './data/game-stories.json';
import hubCases from './data/hub-cases.json';
import storyExpansion from './data/story-expansion.json';
import hubArticles from './data/hub-articles.json';
import countercases from './data/countercases.json';
import referenceCases from './data/reference-cases.json';
import newsletterGames from './data/newsletter-games.json';
import benchmarks from './data/game-benchmarks.json';
import {
  resolveRef,
  type EvidenceClasses,
  type ResolvedEvidence,
  type SourceRecords,
  type TacticCard,
  type TacticsFile,
} from './tactics-model';

export const tactics = tacticsJson as TacticsFile;
export const evidenceClasses = classesJson as EvidenceClasses;
const records = {
  article: [
    ...newsletters.articles,
    ...readingExpansion.articles,
    ...readingUpdates.articles,
  ],
  story: [
    ...gameStoriesJson.stories,
    ...hubCases.stories,
    ...storyExpansion.stories,
  ],
  playbook: hubArticles.articles,
  case: [
    ...countercases,
    ...referenceCases,
    ...newsletterGames,
    ...benchmarks.games,
  ],
} as unknown as SourceRecords;

export const resolveEvidence = (ref: string): ResolvedEvidence | null =>
  resolveRef(ref, records, evidenceClasses);
export const tacticPath = (id: string) => `/tactics/${id}/`;
export const tacticSources = (card: TacticCard) => [
  ...new Set(
    [...card.evidence, ...card.counter]
      .map(resolveEvidence)
      .filter((item): item is ResolvedEvidence => !!item)
      .map((item) => item.sourceUrl),
  ),
];

/** Public export: each card with its evidence resolved, for data/tactics.json. */
export const tacticExport = {
  updatedAt: tactics.updatedAt,
  methodology: tactics.methodology,
  evidenceClasses: evidenceClasses.classes,
  stages: tactics.stages,
  cards: tactics.cards.map((card) => ({
    ...card,
    url: `https://steam-discovery.vercel.app${tacticPath(card.id)}`,
    evidence: card.evidence.map(resolveEvidence),
    counter: card.counter.map(resolveEvidence),
  })),
};
