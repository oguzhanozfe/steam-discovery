import benchmarkData from './data/game-benchmarks.json';
import referenceData from './data/reference-cases.json';
import newsletterData from './data/newsletters.json';
import readingExpansion from './data/reading-expansion.json';
import newsletterGames from './data/newsletter-games.json';
import deepMetrics from './data/deep-case-metrics.json';
import countercaseData from './data/countercases.json';
import { cases, htmagePosts } from './research-data';
import { gameStories } from './editorial-data';

export const snapshot = '2026-09-02';
export const categories = ['All genres', 'Co-op & party', 'Incremental', 'Horror & inspection', 'Survival & crafting', 'Simulation', 'Strategy & roguelike', 'Cozy & puzzle'] as const;
export type Category = typeof categories[number];
export type ScopeFit = 'High' | 'Medium' | 'Low';
export type DiscoveryEvent = { date: string; channel: string; action: string; result: string; source: string; evidence: string; spend: string };
export type GameRecord = {
  id: string; title: string; appId: string | null; releaseDate: string;
  genre: string; subgenre: string; categories: Category[]; tropes: string[];
  mode: string; scopeFit: ScopeFit; team: string; devTime: string;
  hook: string; whyDemand: string; spin: string; caveat: string; depth: string;
  observed: { reviews: number | null; peakCCU: number | null; asOf: string; source: string };
  outcome: { text: string; value: number | null; unit: string; date: string; scope: string; evidence: string; source: string } | null;
  owners: { provider: string; value: number }[];
  ownerRange: string | null; ownerMethod: string; ownerSource: string; ownerAsOf: string;
  events: DiscoveryEvent[]; sources: string[]; caseId?: string; storyId?: string;
};

type RawRecord = {
  id: string; title: string; appId?: string | number | null; releaseDate: string;
  genre: string; subgenre: string; tropes: string[]; mode: string; scopeFit: string;
  team: string; devTime: string | null; hook: string; whyDemand: string; spin: string; caveat: string; depth: string;
  observedMetrics?: { reviews?: number | null; peakCCU?: number | null; asOf?: string; source?: string } | null;
  reportedOutcome?: { metric: string; value?: number | null; unit?: string; date: string; scope?: string; source: string; evidence?: string } | null;
  estimatedOwners?: { VGI?: number | null; PlayTracker?: number | null; Gamalytic?: number | null; range?: string; method?: string; asOf?: string; source?: string } | null;
  marketingEvents: { date: string; channel: string; action: string; outcome?: string | null; result?: string | null; source: string; evidence?: string; evidenceType?: string; spend?: string | null }[];
  sourceUrls: string[];
};

function classify(raw: Pick<RawRecord, 'genre' | 'subgenre' | 'tropes' | 'mode'>): Category[] {
  const text = `${raw.genre} ${raw.subgenre} ${raw.tropes.join(' ')} ${raw.mode}`.toLowerCase();
  const matches: Category[] = [];
  if (/co-op|coop|multiplayer|party|friendslop|crewlike/.test(text)) matches.push('Co-op & party');
  if (/incremental|idle|clicker/.test(text)) matches.push('Incremental');
  if (/horror|inspection|anomal|paranoi|dread/.test(text)) matches.push('Horror & inspection');
  if (/survival|crafting/.test(text)) matches.push('Survival & crafting');
  if (/simulat|job|management|tactile|machine/.test(text)) matches.push('Simulation');
  if (/strateg|roguel|deckbuild|autobattl|auto-battl|tower defense|tactic/.test(text)) matches.push('Strategy & roguelike');
  if (/cozy|cosy|puzzle|detective|productivity|life sim/.test(text)) matches.push('Cozy & puzzle');
  return matches.length ? matches : ['Simulation'];
}

export function normalizeGame(raw: RawRecord): GameRecord {
  const chart = raw.appId ? `https://steamdb.info/app/${raw.appId}/charts/` : raw.sourceUrls[0];
  const models = raw.estimatedOwners;
  const outcome = raw.reportedOutcome;
  const owners = (['VGI', 'PlayTracker', 'Gamalytic'] as const).flatMap(provider => {
    const value = models?.[provider];
    return typeof value === 'number' ? [{ provider, value }] : [];
  });
  return {
    ...raw, appId: raw.appId ? String(raw.appId) : null, devTime: raw.devTime ?? 'Not publicly established',
    categories: classify(raw), scopeFit: raw.scopeFit === 'High' ? 'High' : raw.scopeFit === 'Low' ? 'Low' : 'Medium',
    observed: { reviews: raw.observedMetrics?.reviews ?? null, peakCCU: raw.observedMetrics?.peakCCU ?? null, asOf: raw.observedMetrics?.asOf ?? snapshot, source: raw.observedMetrics?.source ?? chart },
    outcome: outcome ? { text: outcome.metric, value: outcome.value ?? null, unit: outcome.unit ?? '', date: outcome.date, scope: outcome.scope ?? 'Preserve the platform and time window stated in the claim.', evidence: outcome.evidence ?? 'Reported', source: outcome.source } : null,
    owners, ownerRange: models?.range ?? null,
    ownerMethod: models?.method ?? 'Independent owner-model snapshots displayed by SteamDB. Not verified paid units; do not average providers.',
    ownerSource: models?.source ?? chart, ownerAsOf: models?.asOf ?? snapshot,
    events: raw.marketingEvents.map(event => ({ date: event.date, channel: event.channel, action: event.action, result: event.result ?? event.outcome ?? 'No channel-level outcome disclosed.', source: event.source, evidence: event.evidenceType ?? event.evidence ?? 'Reported', spend: event.spend ?? 'Not disclosed' })),
    sources: raw.sourceUrls,
  };
}

const deepContext: Record<string, { date: string; fit: ScopeFit; tropes: string[] }> = {
  'content-warning': { date: '2024-04-01', fit: 'Low', tropes: ['friendslop', 'proximity voice', 'found footage', 'shareable artifact', 'workplace horror'] },
  'repo': { date: '2025-02-26', fit: 'Low', tropes: ['extraction', 'fragile loot', 'proximity voice', 'physics comedy'] },
  'peak': { date: '2025-06-16', fit: 'Medium', tropes: ['shared journey', 'climbing', 'rescue', 'physical comedy'] },
  'rv-there-yet': { date: '2025-10-21', fit: 'Medium', tropes: ['one shared vehicle', 'road trip', 'forced cooperation'] },
  'sir-orc': { date: '2026-07-28', fit: 'High', tropes: ['crowd spectacle', 'incremental', 'tower defense', 'one arena'] },
  'bills': { date: '2026-07-29', fit: 'High', tropes: ['debt', 'one room', 'job simulator', 'physical interface'] },
  'how-many-dudes': { date: '2026-07-30', fit: 'High', tropes: ['crowd spectacle', 'autobattler', 'absurd escalation'] },
  'yapyap': { date: '2026-02-03', fit: 'Low', tropes: ['voice spells', 'sabotage', 'magic', 'shared chaos'] },
  'roadside-research': { date: '2026-02-12', fit: 'Medium', tropes: ['roadside job', 'risk reward', 'physical comedy'] },
  'how-to-fish': { date: '2026-08-20', fit: 'Medium', tropes: ['fishing', 'group adventure', 'physical comedy'] },
  'headliners-control': { date: '2025-01-30', fit: 'Medium', tropes: ['photography', 'newspaper', 'horror', 'shareable artifact'] },
};

const deepGames: GameRecord[] = cases.map(item => {
  const context = deepContext[item.id] ?? { date: item.period.includes('2026') ? '2026' : item.period, fit: 'Medium' as ScopeFit, tropes: item.genre.split(' · ') };
  const metrics = deepMetrics.find(row => String(row.appId) === item.appId);
  const headline = item.events.find(event => event.result.includes(item.headlineMetric.split(' / ')[0])) ?? item.events[item.events.length - 1];
  const raw: RawRecord = {
    ...item, releaseDate: metrics?.releaseDate ?? context.date, subgenre: item.genre, tropes: context.tropes, scopeFit: context.fit,
    observedMetrics: metrics ? { reviews: metrics.reviews, peakCCU: metrics.peakCCU, source: metrics.source, asOf: metrics.asOf } : null,
    estimatedOwners: metrics ? { ...metrics.owners, asOf: metrics.asOf, source: metrics.source, method: metrics.ownersNote } : null,
    whyDemand: `Analysis: ${item.why.join(' ')}`, spin: item.lesson, depth: 'Deep marketing case',
    reportedOutcome: { metric: `${item.headlineMetric} ${item.metricLabel}`, date: item.metricLabel.toLowerCase().includes('peak') && metrics ? metrics.peakCCUDate : headline.date, source: item.metricLabel.toLowerCase().includes('peak') && metrics ? metrics.source : headline.source, evidence: item.metricLabel.toLowerCase().includes('peak') ? 'Observed' : 'Reported', scope: 'Headline has its own date/window. See the dated case timeline for the exact claim and attribution caveats.' },
    marketingEvents: item.events.map(event => ({ ...event, evidence: event.evidence, outcome: event.result })),
    sourceUrls: Array.from(new Set([...item.events.map(event => event.source), ...(item.technicalSource ? [item.technicalSource] : [])])),
  };
  return { ...normalizeGame(raw), caseId: item.id };
});

const earlierGames: GameRecord[] = [
  ...deepGames,
  ...(benchmarkData.games as RawRecord[]).map(normalizeGame),
  ...(referenceData as RawRecord[]).map(normalizeGame),
  ...(newsletterGames as RawRecord[]).map(normalizeGame),
  ...(countercaseData as RawRecord[]).map(normalizeGame),
];

const storyReleaseDates: Record<string, string> = { dreadmoor: 'Unreleased · Q4 2026 planned', 'design-and-conjure': 'Unreleased · Coming soon', hauntii: '2024-05-23', 'into-the-radius': '2020-07-20', sheepherds: '2025-11-17', 'dosa-divas': '2026-04-14', freerunners: '2026-03-04', inkbound: '2024-04-09' };
const storyGames: GameRecord[] = gameStories.filter(story => !earlierGames.some(game => game.appId === String(story.appId))).map(story => {
  const review = story.kpis.find(kpi => /total reviews|aggregate Steam reviews/i.test(kpi.label));
  const peak = story.kpis.find(kpi => /all-time Steam peak/i.test(kpi.label));
  const milestone = story.kpis.find(kpi => kpi.value !== null && /self-report|announcement/.test(kpi.evidence) && !/review/i.test(kpi.label));
  return {
    ...normalizeGame({ id: story.id, title: story.title, appId: story.appId, releaseDate: storyReleaseDates[story.id], genre: story.genre, subgenre: story.playerPromise, tropes: [story.hook], mode: story.id === 'inkbound' || story.id === 'sheepherds' ? 'Solo / co-op' : 'Solo', scopeFit: 'Low', team: 'Team size not established in this record', devTime: null, hook: story.hook, whyDemand: `Analysis: ${story.demand.opening}`, spin: story.buildTransfer.miniDemo, caveat: `${story.demand.notProven} Full reference-game scope is not a three-week commitment; the story proposes a much smaller experiment.`, depth: 'Digested game story', observedMetrics: { reviews: typeof review?.value === 'number' ? review.value : null, peakCCU: typeof peak?.value === 'number' ? peak.value : null, asOf: story.checkedAt }, reportedOutcome: milestone ? { metric: `${milestone.label}: ${milestone.value} ${milestone.unit}`, date: milestone.window, source: milestone.source, evidence: milestone.evidence, scope: milestone.caveat } : null, marketingEvents: story.timeline.map(event => ({ date: event.when, channel: event.channel, action: event.action, outcome: event.outcome, source: event.source, evidence: 'Sourced timeline; see story caveats', spend: event.spend })), sourceUrls: story.sourceUrls }),
    storyId: story.id,
  };
});
export const gameLibrary: GameRecord[] = [...earlierGames.map(game => ({ ...game, storyId: gameStories.find(story => String(story.appId) === game.appId)?.id })), ...storyGames];

export const readingUpdatedAt = readingExpansion.checkedAt;
export const readingStarterPath = readingExpansion.starterPath;
export const newReadingCount = readingExpansion.articles.length;
export const newsletterLibrary = {
  ...newsletterData,
  readingUpdatedAt,
  expansionMethodology: readingExpansion.methodology,
  sources: [...newsletterData.sources, ...readingExpansion.sources],
  articles: [...newsletterData.articles, ...readingExpansion.articles],
  crossSourceSynthesis: {
    ...newsletterData.crossSourceSynthesis,
    disagreementsAndResolution: [...newsletterData.crossSourceSynthesis.disagreementsAndResolution, ...readingExpansion.disagreementsAndResolution],
  },
};
export type ReadingArticle = Omit<typeof newsletterData.articles[number], 'date'> & {
  date: string | null;
  checkedAt?: string;
  applicationSteps?: string[];
  sourceUrls?: string[];
  gameSources?: Partial<Record<string, string>>;
};
const monthIndex: Record<string, string> = { Jun: '06', Jul: '07', Aug: '08', Sep: '09' };
export const readingLibrary: ReadingArticle[] = [
  ...newsletterLibrary.articles,
  ...htmagePosts.map((post, index) => {
    const [day, month] = post.date.split(' ');
    return {
      id: `htmag-${index}`, title: post.title, author: 'Chris Zukowski', publication: 'How To Market A Game',
      date: `2026-${monthIndex[month] ?? '06'}-${day.padStart(2, '0')}`, url: post.url,
      topics: ['Steam marketing', /festival|fest/i.test(post.title) ? 'Next Fest' : 'Discovery'], relatedGames: [],
      summary: post.takeaway, hardData: [] as string[], evidenceType: 'Practitioner analysis / developer case data',
      actionableLesson: 'Read the original methodology and cross-check the lesson against the case library before using it as a rule.',
      limitations: 'Cohorts and interviews are observational. Public correlation is not Steam algorithm documentation or channel attribution.',
      access: 'Public full article · priority three-month window',
    };
  }),
].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

export const readingTopics = ['All topics', 'Co-op', 'Incremental', 'Next Fest', 'Creators', 'Trailers & positioning', 'Campaign execution', 'Measurement integrity', 'Niche demand', 'Revenue & pricing', 'Counter-cases'] as const;
export type ReadingTopic = typeof readingTopics[number];
const topicPatterns: Record<ReadingTopic, RegExp> = {
  'All topics': /./, 'Co-op': /co-op|friendslop|multiplayer/i, Incremental: /incremental|clicker|idler|idle|small games/i,
  'Next Fest': /next fest|festival|demo/i, Creators: /creator|short video|short-form|long-form|showcase|postmortem/i,
  'Trailers & positioning': /trailer|positioning|player motivation|mechanic readability/i,
  'Campaign execution': /campaign|outreach|cross-promotion|press kit|capture planning/i,
  'Measurement integrity': /measurement integrity|definition|conflicting|inconsistent|denominator|attribution|estimate/i,
  'Niche demand': /niche|genre|tavern|productivity|hybrid|audience/i,
  'Revenue & pricing': /revenue|pricing|price|copies|forecast|market|units|gross/i,
  'Counter-cases': /counter.case|concentration|exclusion|bias|disagreement|disappoint|misread/i,
};
export function matchesReading(article: ReadingArticle, query: string, topic: ReadingTopic) {
  const text = [article.title, article.author, article.publication, article.summary, article.actionableLesson, article.limitations, ...article.topics, ...article.relatedGames].join(' ');
  return (!query.trim() || normalizeSearch(text).includes(normalizeSearch(query))) && (topic === 'All topics' || topicPatterns[topic].test(text));
}

export function normalizeSearch(value: string) { return value.normalize('NFKD').toLowerCase().replace(/&/g, ' and ').replace(/[’‘']/g, '').replace(/[^a-z0-9]+/g, ' ').trim(); }
export type ExplorerFilters = { query: string; category: Category; fit: 'All scope' | ScopeFit; year: 'All years' | '2026' | '2025' | 'Earlier' | 'Upcoming'; band: 'All signals' | '100–200K owner models' | 'Reported milestone' | 'Deep case'; sort: 'Curated' | 'Newest' | 'Reviews' | 'Demo fit' };
export const defaultExplorerFilters: ExplorerFilters = { query: '', category: 'All genres', fit: 'All scope', year: 'All years', band: 'All signals', sort: 'Curated' };
export function filterGames(filters: ExplorerFilters) {
  const found = gameLibrary.filter(game => {
    const text = [game.title, game.genre, game.subgenre, game.mode, game.hook, game.whyDemand, ...game.tropes, ...game.events.flatMap(e => [e.channel, e.action])].join(' ').toLowerCase();
    const year = game.releaseDate.match(/^20\d{2}/)?.[0];
    const upcoming = /unreleased|to be announced|planned/i.test(game.releaseDate);
    return (!filters.query.trim() || normalizeSearch(text).includes(normalizeSearch(filters.query))) &&
      (filters.category === 'All genres' || game.categories.includes(filters.category)) &&
      (filters.fit === 'All scope' || game.scopeFit === filters.fit) &&
      (filters.year === 'All years' || (filters.year === 'Upcoming' ? upcoming : !upcoming && (filters.year === 'Earlier' ? Number(year) < 2025 : year === filters.year))) &&
      (filters.band === 'All signals' || (filters.band === '100–200K owner models' && game.owners.some(owner => owner.value >= 100000 && owner.value <= 200000)) || (filters.band === 'Reported milestone' && game.outcome && !/estimated|observed/i.test(game.outcome.evidence)) || (filters.band === 'Deep case' && Boolean(game.caseId || game.storyId)));
  });
  if (filters.sort === 'Newest') found.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  if (filters.sort === 'Reviews') found.sort((a, b) => (b.observed.reviews ?? -1) - (a.observed.reviews ?? -1));
  if (filters.sort === 'Demo fit') found.sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.scopeFit] - { High: 0, Medium: 1, Low: 2 }[b.scopeFit]));
  return found;
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

export const marketPatterns = [
  { id: 'tactile-jobs', name: 'One-room jobs, under pressure', family: 'Simulation × horror / absurdity', fit: 'High', trope: 'A familiar task with an unacceptable second objective.', query: 'one room', comps: ['Bills Must Be Paid', 'The Cabin Factory', 'Quarantine Zone: The Last Check', 'Iron Nest: Heavy Turret Simulator'], evidence: 'The Cabin Factory reported 20K wishlists in ten days; Iron Nest disclosed >365K copies by day five. Different scales, both concentrated around readable physical actions.', source: 'https://newsletter.gamediscover.co/p/how-iron-nest-sold-250k-copies-in', source2: 'https://newsletter.gamediscover.co/p/revealed-new-data-on-steam-wishlist', gap: 'Hypothesis: returns inspection with morally absurd approval rules. A fantasy and rule twist—not proof the niche is empty.', build: 'One counter, 10–12 objects, one shift, authored surprises. Reuse the room; vary procedures.', channel: 'Test close-up tactile shorts, then small simulation/horror creators with a complete shift.', risk: 'A satisfying interaction needs sound and animation. Full store management and NPC simulation are outside the slice.' },
  { id: 'finite-incrementals', name: 'Finite, physical incrementals', family: 'Incremental × spectacle', fit: 'High', trope: 'Make one small action become impossibly large.', query: 'incremental', comps: ['Sir, We Have an Orc Problem', 'Horripilant', 'Outhold', 'A Game About Digging A Hole'], evidence: 'Horripilant reported 50K copies in month one; its retrieved owner models range from 115.6K to 162.2K. Outhold reported 50K in week one; current models span 193.3K–220.6K.', source: 'https://steamcommunity.com/app/3525970?l=german', source2: 'https://steamdb.info/patchnotes/21257975/', gap: 'Hypothesis: absurd QA goblins visibly multiply while solving the wrong problem. The opportunity is a fresh readable fantasy, not another upgrade menu.', build: 'One arena, one repeated action, three unlocks, a visible before/after within two minutes.', channel: 'Before/after shorts → playable loop → incremental specialists. Make the clip show progress, not a spreadsheet.', risk: 'Cheap entry does not imply cheap tuning. Repetition without a satisfying end state feels like a prototype.' },
  { id: 'luck-machines', name: 'A machine that makes luck tangible', family: 'Roguelite × chance × tactile UI', fit: 'Medium', trope: 'The player can see the stakes, probabilities and disastrous reversal.', query: 'gambling', comps: ['Buckshot Roulette', 'CloverPit', 'RACCOIN: Coin Pusher Roguelike', 'Slots & Daggers'], evidence: 'Slots & Daggers reported 100K copies in ten days. Balatro’s developer documented 208,401 launch wishlists and 119K Steam units on launch day; that is a long iteration story, not instant genre validation.', source: 'https://steamcommunity.com/app/3631290/announcements/', source2: 'https://localthunk.com/blog/balatro-timeline-3aarh', gap: 'Hypothesis: a visibly rigged office raffle or haunted vending machine whose rules can be bent. Test the decision, not just the visual skin.', build: 'One machine, one round structure, five modifiers, clear readable probabilities. Fictional stakes only.', channel: 'Clips for the reversal; long-form strategy creators for the decisions and replayability.', risk: 'Balancing synergies can exceed the entire sprint. Avoid real-money gambling, paid random rewards and large content pools.' },
  { id: 'shared-burden', name: 'Friends + one shared burden', family: 'Social co-op × physical comedy', fit: 'Medium', trope: 'Everyone wants the same thing; everyone can ruin it.', query: 'co-op', comps: ['RV There Yet?', 'Chained Together', 'PEAK', 'Content Warning'], evidence: 'The references show shared vehicles, chains, rescues and footage turning coordination into comedy. Content Warning’s 6.6M free claims and established Landfall distribution are major confounds.', source: 'https://landfall.se/content-warning-press-kit', source2: 'https://app.pressengine.net/newsdesk/bastion/stories/news-chained-together-links-up-with-secret-mode-for-future-development', gap: 'Hypothesis: carry one enormous wedding cake or fragile moving-day object. Replace quota extraction with a very different shared goal.', build: 'One hero object, one room/route, private two-player lobby. Validate remote interaction by day four.', channel: 'Real group voice clips with a complete setup → failure → reaction, then small co-op creator groups.', risk: 'Without a proven networking stack, fit is Low. R.E.P.O.-scale object physics and Content Warning-grade recording are not three-week features.' },
  { id: 'legible-paranoia', name: 'Ordinary places, one wrong detail', family: 'Horror × observation / inspection', fit: 'High', trope: 'The viewer spots the danger one second before the player.', query: 'horror', comps: ['The Exit 8', 'No, I’m not a Human', 'The Cabin Factory', 'Shift At Midnight'], evidence: 'The Exit 8’s publisher reported >500K PC downloads in April 2024; its developer described deliberate scope reduction. Later inspection games show continuing demand but increasingly crowded supply.', source: 'https://playism.com/en/news/2024/0417/1559/', source2: 'https://store.steampowered.com/app/2653790/', gap: 'Hypothesis: a work chat where a non-human colleague is trying to get invited into the room. The interaction grammar must be distinct.', build: 'One room, an authored message-state machine, six escalating rules, one finale. No generative dialogue dependency.', channel: 'Horror creators and short puzzle-like anomalies; show the rule early enough for viewers to participate.', risk: 'Content consumption is fast. A few jump scares are not replayability, and clones compete with familiar incumbents.' },
  { id: 'cozy-rituals', name: 'Small rituals, specific audiences', family: 'Cozy × puzzle / productivity', fit: 'High', trope: 'Care, tidy, arrange or accompany—not generic “cozy”.', query: 'cozy', comps: ['Creature Kitchen', 'My Little Life', 'Tiny Bookshop', 'Is This Seat Taken?'], evidence: 'My Little Life’s developer reported 30K copies after launch; current owner models span 68.6K–136K. The productivity study found nine of 34 selected games above 500 reviews, with exclusions.', source: 'https://www.reddit.com/r/LifeSimulators/comments/1inp6uc/my_mini_lifesim_that_lives_on_the_bottom_of_your/', source2: 'https://opgamemarketing.substack.com/p/the-rise-of-productivity-games-on', gap: 'Hypothesis: an oddly comforting overnight ritual for remote workers. Validate a specific use context and emotional payoff.', build: 'One ritual, three characters or objects, one progression session. Focus on feel and a single polished vignette.', channel: 'Cozy curators, lifestyle/focus creators, themed festivals and customization sharing.', risk: 'Art taste, writing and comfort are the product. Tiny Bookshop-scale narrative content does not fit three weeks.' },
  { id: 'strategy-hybrids', name: 'A requested mode inside a familiar genre', family: 'Autobattler × PvE / roguelite', fit: 'Medium', trope: '“I love X, but wish it had Y” from an identifiable community.', query: 'autobattler', comps: ['Guildrun', 'How Many Dudes?', 'Balatro', 'Keep Driving'], evidence: 'Guildrun disclosed >275K demo players and 3h55 median playtime. Specialist long-form creators worked; short-form did not. Paid creators and ads also contributed.', source: 'https://newsletter.gamediscover.co/p/how-guildrun-genre-mashed-its-way', source2: 'https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/', gap: 'Hypothesis: a tiny PvE drafting system for a community asking for that mode. Confirm the complaint before inventing a new genre mashup.', build: 'One encounter chain, six units, a single decision loop. Balance telemetry matters more than cinematic presentation.', channel: 'Specialist long-form videos, repeated community playtests and clear decision examples.', risk: 'These successes took months or years of iteration. A complex synergy system is usually a poor first three-week bet.' },
  { id: 'visual-comedy', name: 'A joke that is also a toy', family: 'Physics × puzzle / party', fit: 'High', trope: 'One ridiculous verb with visible consequences.', query: 'comedy', comps: ['Horse Magnifier: The Full Horse', 'Super Battle Golf', 'A Game About Digging A Hole'], evidence: 'Horse Magnifier’s retrieved owner models span 20.3K–39K—useful demand without a megahit assumption. Super Battle Golf reported 100K copies in 48 hours after 4.5 months of development.', source: 'https://steamdb.info/app/4585340/', source2: 'https://www.pcgamer.com/games/sports/that-golf-game-with-orbital-death-lasers-sold-100k-copies-in-two-days-we-made-super-battle-golf-together-in-4-5-months-and-are-so-happy/', gap: 'Hypothesis: one absurd manipulation tool with at least three genuinely different uses. The caption should be understandable without current meme knowledge.', build: 'One room, one verb, five authored challenges. Solo first; no online competition in the first slice.', channel: 'Raw clips with a visible before/after. Watch whether people ask to play, not merely react to the joke.', risk: 'A one-post joke can exhaust demand. Prove that a second session is different before expanding production.' },
];
