import { gameLibrary, readingLibrary, readingUpdatedAt } from './discovery-data';
import type { ResearchView } from './research-data';
import { steamImageUrl, steamImageManifest } from './steam-image-url';
import { gameStories, originalAnalysis, editorialUpdatedAt, storyPath, analysisPath, survivalDemoGdd } from './editorial-data';
import { progressBoard } from './progress-data';
import hubArticles from './data/hub-articles.json';

export const siteUrl = 'https://steam-discovery.vercel.app';
export type InitialRoute = { view?: ResearchView; marketPeriod?: '2025' | '2026-q1' | '2026-q2'; gameId?: string; readingId?: string; storyId?: string; analysisId?: string; guideId?: string };
export type SiteRoute = { path: string; title: string; description: string; initial: InitialRoute; image?: string; imageWidth?: number; imageHeight?: number; citations?: string[]; modifiedAt?: string; noindex?: boolean };
export const viewPaths: Record<ResearchView, string> = {
  hub: '/', radar: '/radar/', solo: '/solo-lab/', guides: '/playbooks/', stories: '/stories/', analysis: '/analysis/', gdd: '/survival-demo/', explorer: '/games/', cases: '/case-studies/', market: '/market/2025/', ideas: '/build-lab/', reading: '/reading/', playbook: '/sprint-plan/', progress: '/progress/', survival: '/research/open-world-survival-craft/', methodology: '/about/',
};
export const gamePath = (id: string) => `/games/${id}/`;
export const readingPath = (id: string) => `/reading/${id}/`;
export const sectionRoutes: SiteRoute[] = [
  { path: '/', title: 'Steam Discovery — Small Team Game Dev Hub', description: 'Find game niches, compare Steam evidence, read developer stories and choose an AI-assisted two-week solo prototype. Practical research for small game teams.', initial: { view: 'hub' }, modifiedAt: '2026-09-08' },
  { path: '/stories/', title: 'Game Stories & Small-Team Build Lessons — Steam Discovery', description: 'Digested game stories from breakouts to modest launches, with dated KPIs, campaign chronology, caveats and proposed solo prototype transfers.', initial: { view: 'stories' }, modifiedAt: editorialUpdatedAt },
  { path: '/radar/', title: 'Steam Radar — Game Discovery & Comparable Evidence', description: 'Search a documented Steam and SteamSpy sample, compare reviews and owner estimates, and save a local watchlist. Dated snapshots, not verified sales or a complete market census.', initial: { view: 'radar' }, modifiedAt: '2026-09-08' },
  { path: '/solo-lab/', title: 'Solo Lab — Two-Week AI-Assisted Game Ideas | Steam Discovery', description: 'Eight original solo game concepts with three comparables each, hard scope cuts, AI workflows, marketing experiments and a 14-day calendar.', initial: { view: 'solo' }, modifiedAt: '2026-09-08' },
  { path: '/playbooks/', title: 'Small-Team Steam Developer Playbooks — Steam Discovery', description: 'Ten digested sources on Steam discovery, compact games, trailers, festivals, launch counterexamples, AI disclosure and market-data interpretation.', initial: { view: 'guides' }, modifiedAt: '2026-09-08' },
  { path: viewPaths.explorer, title: 'Steam Game Benchmark Explorer — Steam Discovery', description: 'Find comparable indie games with dated public metrics, production scope, marketing evidence and clearly labeled limitations.', initial: { view: 'explorer' }, modifiedAt: editorialUpdatedAt },
  { path: viewPaths.analysis, title: 'Original Steam Market Analysis — Steam Discovery', description: 'Three original, sourced arguments on survival-crafting demand, wishlist campaigns and a small-team demo that earns its next production investment.', initial: { view: 'analysis' }, modifiedAt: originalAnalysis.updatedAt },
  { path: viewPaths.gdd, title: 'City Escape: First Outbreak — Survival Demo GDD | Steam Discovery', description: 'A first-person survival demo GDD: home breach, first kill, two zombie herds, vehicle escape, camp building and a boss. UI plans, Gaea/Houdini asset pipeline, 15-day roadmap and sourced game lessons.', initial: { view: 'gdd' }, noindex: true, modifiedAt: survivalDemoGdd.updatedAt, citations: survivalDemoGdd.sourceUrls },
  { path: viewPaths.cases, title: 'Indie Game Marketing Case Studies — Steam Discovery', description: 'Dated marketing timelines, product hooks, production context and attribution caveats for Content Warning, R.E.P.O., PEAK and other indie games.', initial: { view: 'cases' } },
  { path: viewPaths.market, title: '2025 Steam Genre Demand & Supply — Steam Discovery', description: 'Compare published 2025 genre outcomes, review thresholds and development scope. Hit rates describe a historical cohort, not your chance of success.', initial: { view: 'market', marketPeriod: '2025' } },
  { path: '/market/2026-q1/', title: 'Q1 2026 Steam Genre Outcomes — Steam Discovery', description: 'Published Q1 2026 game and genre hit counts, with source discrepancies and missing supply denominators made explicit.', initial: { view: 'market', marketPeriod: '2026-q1' } },
  { path: '/market/2026-q2/', title: 'Q2 2026 Steam Evidence: June Subset — Steam Discovery', description: 'A documented June-only Steam snapshot: 2,102 apps, overlapping genre tags and unresolved review counts. Not a complete Q2 market census.', initial: { view: 'market', marketPeriod: '2026-q2' } },
  { path: viewPaths.ideas, title: 'Three-Week Indie Game Demo Ideas — Steam Discovery', description: 'Five scoped game concepts with comparable games, technical tradeoffs, pros, cons and marketing experiments for a five-person indie team.', initial: { view: 'ideas' } },
  { path: viewPaths.reading, title: 'PC Game Market Reading Room — Steam Discovery', description: 'Read annotated Steam marketing cases, trailer breakdowns and developer postmortems. HTMAG, Derek Lieu, Game World Observer, IMPRESS and more, with practical demo actions and evidence limits.', initial: { view: 'reading' }, modifiedAt: readingUpdatedAt },
  { path: viewPaths.playbook, title: '15-Day Indie Demo & Marketing Plan — Steam Discovery', description: 'A practical research-to-demo sprint, measurement ladder and official Steam release constraints for small indie teams.', initial: { view: 'playbook' } },
  { path: viewPaths.progress, title: 'Delivery Progress & Milestones — Steam Discovery', description: 'A focused view of delivery tasks, owners, priorities, working state, current progress and milestone details.', initial: { view: 'progress' }, noindex: true, modifiedAt: progressBoard.updatedAt },
  { path: viewPaths.survival, title: 'Open-World Survival Craft: Demand, Cases & Demo Scope — Steam Discovery', description: 'OWSC market evidence across 2025 and 2026, sourced game cases, player promises and tightly bounded prototype ideas for small teams.', initial: { view: 'survival' } },
  { path: viewPaths.methodology, title: 'Sources, Methodology & Editorial Disclosure — Steam Discovery', description: 'How Steam Discovery labels reported sales, public observations, model estimates and hypotheses. Source access, image credits and independence disclosure.', initial: { view: 'methodology' }, modifiedAt: readingUpdatedAt },
];
export const publicRoutes: SiteRoute[] = [
  ...sectionRoutes,
  ...hubArticles.articles.map(article => ({ path: `/playbooks/${article.id}/`, title: `${article.title} — Action Playbook | Steam Discovery`, description: article.synopsis.slice(0, 220), initial: { view: 'guides' as const, guideId: article.id }, citations: [article.url, ...article.supportingSources.map(source => source.url)], modifiedAt: article.checkedAt })),
  ...gameStories.map(story => ({ path: storyPath(story.id), title: `${story.title}: ${story.headline} — Steam Discovery`, description: story.deck, initial: { view: 'stories' as const, storyId: story.id }, citations: story.sourceUrls, modifiedAt: story.checkedAt })),
  ...originalAnalysis.articles.map(article => ({ path: analysisPath(article.id), title: `${article.title} — Steam Discovery`, description: article.deck, initial: { view: 'analysis' as const, analysisId: article.id }, citations: article.sourceUrls, modifiedAt: originalAnalysis.updatedAt })),
  ...gameLibrary.map(game => ({ path: gamePath(game.id), title: `${game.title}: Marketing Case & Market Evidence — Steam Discovery`, description: `${game.title} research: ${game.hook} Dated evidence, production scope and source limitations.`.slice(0, 240), initial: { view: 'explorer' as const, gameId: game.id }, citations: game.sources, image: game.appId ? steamImageUrl(game.appId) : undefined, imageWidth: game.appId ? steamImageManifest[game.appId]?.width ?? 460 : undefined, imageHeight: game.appId ? steamImageManifest[game.appId]?.height ?? 215 : undefined, modifiedAt: gameStories.find(story => story.id === game.storyId)?.checkedAt })),
  ...readingLibrary.map(article => ({ path: readingPath(article.id), title: `${article.title} — Research Note | Steam Discovery`, description: `Research note on ${article.publication}: ${article.summary}`.slice(0, 240), initial: { view: 'reading' as const, readingId: article.id }, citations: Array.from(new Set([article.url, ...(article.sourceUrls ?? [])])), modifiedAt: article.checkedAt ?? '2026-09-02' })),
];
export function resolveRoute(pathname: string): SiteRoute | undefined {
  const path = pathname === '/' ? '/' : `${pathname.replace(/\/+$/, '')}/`;
  return publicRoutes.find(route => route.path === path);
}
