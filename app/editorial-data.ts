import storyData from './data/game-stories.json';
import hubStories from './data/hub-cases.json';
import storyExpansion from './data/story-expansion.json';

export const gameStories = [...storyExpansion.stories, ...hubStories.stories, ...storyData.stories];
export const latestStoryCount = storyExpansion.stories.length;
export const storyMethodology = storyData.methodology;
export const editorialUpdatedAt = storyExpansion.updatedAt;
export type GameStory = typeof gameStories[number];
export const storyPath = (id: string) => `/case-studies/${id}/`;
export function findStories(query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return gameStories.filter(story => {
    const haystack = [story.title, story.headline, story.genre, story.hook, ...story.sourcePublications, story.demand.audience, story.mechanism.observed, story.buildTransfer.miniDemo, ...story.timeline.map(event => event.channel), ...story.kpis.map(kpi => kpi.label), ...story.story.map(section => section.body), 'outcomeBand' in story ? story.outcomeBand : '', 'team' in story ? story.team : ''].join(' ').toLowerCase();
    return terms.every(term => haystack.includes(term));
  });
}
