import tacticsJson from './data/tactics.json' with { type: 'json' };
import classesJson from './data/evidence-classes.json' with { type: 'json' };
import newsletters from './data/newsletters.json' with { type: 'json' };
import readingExpansion from './data/reading-expansion.json' with { type: 'json' };
import readingUpdates from './data/reading-updates.json' with { type: 'json' };
import gameStoriesJson from './data/game-stories.json' with { type: 'json' };
import hubCases from './data/hub-cases.json' with { type: 'json' };
import storyExpansion from './data/story-expansion.json' with { type: 'json' };
import hubArticles from './data/hub-articles.json' with { type: 'json' };
import countercases from './data/countercases.json' with { type: 'json' };
import referenceCases from './data/reference-cases.json' with { type: 'json' };
import newsletterGames from './data/newsletter-games.json' with { type: 'json' };
import benchmarks from './data/game-benchmarks.json' with { type: 'json' };
import {
  resolveRef,
  type EvidenceClasses,
  type ResolvedEvidence,
  type SourceRecords,
  type TacticCard,
  type TacticsFile,
} from './tactics-model.js';

export const tactics = tacticsJson as TacticsFile;
export const evidenceClasses = classesJson as EvidenceClasses;
export const records = {
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
