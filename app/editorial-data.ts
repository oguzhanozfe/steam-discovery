import storyData from './data/game-stories.json';
import analysisData from './data/original-analysis.json';
import gddData from './data/survival-demo-gdd.json';
import survivalEvidenceData from './data/survival-validation-evidence.json';

export const gameStories = storyData.stories;
export const storyMethodology = storyData.methodology;
export const editorialUpdatedAt = storyData.updatedAt;
export const originalAnalysis = analysisData;
export const survivalDemoGdd = gddData;
export const survivalEvidence = survivalEvidenceData;
export type GameStory = typeof gameStories[number];
export const storyPath = (id: string) => `/case-studies/${id}/`;
export const analysisPath = (id: string) => `/analysis/${id}/`;
export function findStories(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return gameStories.filter(story => {
    const haystack = [story.title, story.headline, story.genre, story.hook, ...story.sourcePublications, story.demand.audience, story.mechanism.observed, story.buildTransfer.miniDemo].join(' ').toLowerCase();
    return terms.every(term => haystack.includes(term));
  });
}
