import { gameLibrary, readingLibrary, readingUpdatedAt } from './discovery-data';
import type { ResearchView } from './research-data';
import { steamImageUrl, steamImageManifest } from './steam-image-url';
import { gameStories, originalAnalysis, editorialUpdatedAt, storyPath, analysisPath, survivalDemoGdd } from './editorial-data';

export const siteUrl = 'https://steam-discovery.vercel.app';
export type InitialRoute = { view?: ResearchView; marketPeriod?: '2025' | '2026-q1' | '2026-q2'; gameId?: string; readingId?: string; storyId?: string; analysisId?: string };
export type SiteRoute = { path: string; title: string; description: string; initial: InitialRoute; image?: string; imageWidth?: number; imageHeight?: number; citations?: string[]; modifiedAt?: string };
export const viewPaths: Record<ResearchView, string> = {
  stories: '/', analysis: '/analysis/', gdd: '/survival-demo/', explorer: '/games/', cases: '/case-studies/', market: '/market/2025/', ideas: '/build-lab/', reading: '/reading/', playbook: '/sprint-plan/', survival: '/research/open-world-survival-craft/', methodology: '/about/',
};
export const gamePath = (id: string) => `/games/${id}/`;
export const readingPath = (id: string) => `/reading/${id}/`;
export const sectionRoutes: SiteRoute[] = [
  { path: '/', title: 'Steam Discovery — Game Stories, Market Evidence & Demo Plans', description: 'Digested indie game stories with dated KPIs, campaign timelines, demand analysis and production lessons. Original Steam market research and a three-week survival demo GDD.', initial: { view: 'stories' }, modifiedAt: editorialUpdatedAt },
  { path: viewPaths.explorer, title: 'Steam Game Benchmark Explorer — Steam Discovery', description: 'Find comparable indie games with dated public metrics, production scope, marketing evidence and clearly labeled limitations.', initial: { view: 'explorer' }, modifiedAt: editorialUpdatedAt },
  { path: viewPaths.analysis, title: 'Original Steam Market Analysis — Steam Discovery', description: 'Three original, sourced arguments on survival-crafting demand, wishlist campaigns and a small-team demo that earns its next production investment.', initial: { view: 'analysis' }, modifiedAt: editorialUpdatedAt },
  { path: viewPaths.gdd, title: 'City Escape: First Outbreak — Survival Demo GDD | Steam Discovery', description: 'A first-person survival demo GDD: home breach, first kill, two zombie herds, vehicle escape, camp building and a boss. UI plans, Gaea/Houdini asset pipeline, 15-day roadmap and sourced game lessons.', initial: { view: 'gdd' }, modifiedAt: survivalDemoGdd.updatedAt, citations: survivalDemoGdd.sourceUrls },
  { path: viewPaths.cases, title: 'Indie Game Marketing Case Studies — Steam Discovery', description: 'Dated marketing timelines, product hooks, production context and attribution caveats for Content Warning, R.E.P.O., PEAK and other indie games.', initial: { view: 'cases' } },
  { path: viewPaths.market, title: '2025 Steam Genre Demand & Supply — Steam Discovery', description: 'Compare published 2025 genre outcomes, review thresholds and development scope. Hit rates describe a historical cohort, not your chance of success.', initial: { view: 'market', marketPeriod: '2025' } },
  { path: '/market/2026-q1/', title: 'Q1 2026 Steam Genre Outcomes — Steam Discovery', description: 'Published Q1 2026 game and genre hit counts, with source discrepancies and missing supply denominators made explicit.', initial: { view: 'market', marketPeriod: '2026-q1' } },
  { path: '/market/2026-q2/', title: 'Q2 2026 Steam Evidence: June Subset — Steam Discovery', description: 'A documented June-only Steam snapshot: 2,102 apps, overlapping genre tags and unresolved review counts. Not a complete Q2 market census.', initial: { view: 'market', marketPeriod: '2026-q2' } },
  { path: viewPaths.ideas, title: 'Three-Week Indie Game Demo Ideas — Steam Discovery', description: 'Five scoped game concepts with comparable games, technical tradeoffs, pros, cons and marketing experiments for a five-person indie team.', initial: { view: 'ideas' } },
  { path: viewPaths.reading, title: 'PC Game Market Reading Room — Steam Discovery', description: 'Read annotated Steam marketing cases, trailer breakdowns and developer postmortems. HTMAG, Derek Lieu, Game World Observer, IMPRESS and more, with practical demo actions and evidence limits.', initial: { view: 'reading' }, modifiedAt: readingUpdatedAt },
  { path: viewPaths.playbook, title: '15-Day Indie Demo & Marketing Plan — Steam Discovery', description: 'A practical research-to-demo sprint, measurement ladder and official Steam release constraints for small indie teams.', initial: { view: 'playbook' } },
  { path: viewPaths.survival, title: 'Open-World Survival Craft: Demand, Cases & Demo Scope — Steam Discovery', description: 'OWSC market evidence across 2025 and 2026, sourced game cases, player promises and tightly bounded prototype ideas for small teams.', initial: { view: 'survival' } },
  { path: viewPaths.methodology, title: 'Sources, Methodology & Editorial Disclosure — Steam Discovery', description: 'How Steam Discovery labels reported sales, public observations, model estimates and hypotheses. Source access, image credits and independence disclosure.', initial: { view: 'methodology' }, modifiedAt: readingUpdatedAt },
];
export const publicRoutes: SiteRoute[] = [
  ...sectionRoutes,
  ...gameStories.map(story => ({ path: storyPath(story.id), title: `${story.title}: ${story.headline} — Steam Discovery`, description: story.deck, initial: { view: 'stories' as const, storyId: story.id }, citations: story.sourceUrls, modifiedAt: editorialUpdatedAt })),
  ...originalAnalysis.articles.map(article => ({ path: analysisPath(article.id), title: `${article.title} — Steam Discovery`, description: article.deck, initial: { view: 'analysis' as const, analysisId: article.id }, citations: article.sourceUrls, modifiedAt: editorialUpdatedAt })),
  ...gameLibrary.map(game => ({ path: gamePath(game.id), title: `${game.title}: Marketing Case & Market Evidence — Steam Discovery`, description: `${game.title} research: ${game.hook} Dated evidence, production scope and source limitations.`.slice(0, 240), initial: { view: 'explorer' as const, gameId: game.id }, citations: game.sources, image: game.appId ? steamImageUrl(game.appId) : undefined, imageWidth: game.appId ? steamImageManifest[game.appId]?.width ?? 460 : undefined, imageHeight: game.appId ? steamImageManifest[game.appId]?.height ?? 215 : undefined, modifiedAt: game.storyId ? editorialUpdatedAt : undefined })),
  ...readingLibrary.map(article => ({ path: readingPath(article.id), title: `${article.title} — Research Note | Steam Discovery`, description: `Research note on ${article.publication}: ${article.summary}`.slice(0, 240), initial: { view: 'reading' as const, readingId: article.id }, citations: Array.from(new Set([article.url, ...(article.sourceUrls ?? [])])), modifiedAt: article.checkedAt ?? '2026-09-02' })),
];
export function resolveRoute(pathname: string): SiteRoute | undefined {
  const path = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  return publicRoutes.find(route => route.path === path);
}
