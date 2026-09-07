'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  AlertTriangle, ArrowDownToLine, ArrowRight, ArrowUpRight, BarChart3,
  CalendarDays, CheckCircle2, ChevronRight, CircleDollarSign, Clock3,
  Code2, Database, Eye, Filter, Gamepad2, Gauge, Lightbulb, Link2,
  Megaphone, Play, Radar, Search, ShieldAlert, Sparkles, Target,
  Users, XCircle, Zap, BookOpen, Compass, Trees,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  cases, htmagePosts, ideas, marketStats, niches, reachDictionary,
  sourceStack, sprint, steamTiming, type GameCase, type ResearchView,
} from './research-data';
import { Explorer, SourceLink } from './explorer';
import { ReadingRoom } from './reading-room';
import { MarketMap } from './market-map';
import { MarketPeriods, marketPeriods, type MarketPeriod } from './market-periods';
import q1MarketData from './data/market-q1.json';
import q2MarketData from './data/market-q2.json';
import { ResearchBrief, defaultBrief, type BriefInput } from './research-brief';
import { categories, defaultExplorerFilters, filterGames, gameLibrary, marketPatterns, newsletterLibrary, readingLibrary, readingUpdatedAt, readingTopics, type ExplorerFilters, type ReadingTopic } from './discovery-data';
import { viewPaths, publicRoutes, siteUrl, type InitialRoute } from './site-routes';
import { structuredData } from './research-metadata';
import survivalData from './data/survival-research.json';
import fpsSurvivalConcept from './data/fps-survival-concept.json';
import { SteamArtwork } from './steam-artwork';
import { Methodology } from './methodology';
import { SurvivalResearch } from './survival-research';
import { GameStories, OriginalAnalysis, SurvivalDemoGdd } from './editorial';
import { gameStories, findStories, originalAnalysis, survivalDemoGdd, survivalEvidence, editorialUpdatedAt } from './editorial-data';
import { ProgressTracker } from './progress-tracker';
import { progressBoard } from './progress-data';
import { progressCardAuthoringGuide } from './progress-card-authoring-guide';
import { SmallTeamHub, SteamRadar, SoloLab, DeveloperPlaybooks } from './small-team-hub';
import radarSnapshot from './data/radar-snapshot.json';
import hubConcepts from './data/solo-concepts.json';
import hubNiches from './data/hub-niches.json';
import hubArticles from './data/hub-articles.json';
import referenceChecks from './data/reference-checks.json';
import { ReferenceLink, ReferenceRegister, EditorialCredit, referenceMetadata, ideaReferences } from './source-references';

type ModelTool = {
  name: string; title?: string; description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean };
  execute: (input: unknown) => unknown | Promise<unknown>;
};
declare global {
  interface Document {
    modelContext?: { registerTool: (tool: ModelTool, options?: { signal?: AbortSignal }) => void | Promise<void> };
  }
}

const filters = ['All', 'Co-op', 'Solo', '2026', 'Incremental', 'Control'] as const;
type CaseFilter = (typeof filters)[number];
const navItems: { id: ResearchView; label: string; caption: string; icon: typeof Radar }[] = [
  { id: 'hub', label: 'Dev Hub', caption: 'Niches & next steps', icon: Compass },
  { id: 'radar', label: 'Steam Radar', caption: 'Search & compare games', icon: Radar },
  { id: 'solo', label: 'Solo Lab', caption: 'AI-assisted · two weeks', icon: Code2 },
  { id: 'stories', label: 'Game Stories', caption: 'Digested cases & lessons', icon: BookOpen },
  { id: 'guides', label: 'Playbooks', caption: 'Read, decide, execute', icon: BookOpen },
  { id: 'market', label: 'Market Pulse', caption: '2025 + 2026 quarters', icon: BarChart3 },
];
const signalClasses: Record<GameCase['signal'], string> = {
  Viral: 'signal signal-viral', Breakout: 'signal signal-breakout',
  Strong: 'signal signal-strong', Control: 'signal signal-control',
};

function downloadDataset() {
  const payload = {
    asOf: '2026-09-02',
    readingUpdatedAt,
    editorialUpdatedAt, gameStories, originalAnalysis, survivalDemoGdd, survivalEvidence,
    smallTeamHub: { radarSnapshot, catalogUrl: `${siteUrl}/data/radar-catalog.json`, soloConcepts: hubConcepts, nicheBriefs: hubNiches, playbooks: hubArticles },
    methodology: 'Reported sales, observed public metrics and third-party estimates are stored separately. Correlation is not labeled as attribution.',
    referenceChecks, referenceMetadata,
    gameLibrary, cases, marketStats, reachDictionary, niches, quarterlyEvidence: { q1: q1MarketData, q2: q2MarketData }, survivalCraft: { ...survivalData, firstPersonConcept: { id: survivalDemoGdd.id, title: survivalDemoGdd.title, pitch: survivalDemoGdd.pitch, gddPath: '/survival-demo/' }, archivedEarlierConcept: { ...fpsSurvivalConcept, status: 'Superseded by city-escape-demo v0.2; retained as historical context only.' } }, marketPatterns, ideas, readingLibrary, newsletterLibrary, progressBoard, sources: sourceStack,
  };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = `steam-discovery-${readingUpdatedAt}.json`; anchor.click();
  URL.revokeObjectURL(url);
}

function Score({ label, value }: { label: string; value: number }) {
  return <div className="score-item"><div><span>{label}</span><strong>{value}/10</strong></div><div className="score-track"><span style={{ width: `${value * 10}%` }} /></div></div>;
}

export default function Home({ initial = {} }: { initial?: InitialRoute }) {
  const initialGame = gameLibrary.find(game => game.id === initial.gameId);
  const [view, setView] = useState<ResearchView>(initial.view ?? 'hub');
  const [storyId, setStoryId] = useState<string | undefined>(initial.storyId);
  const [analysisId, setAnalysisId] = useState<string | undefined>(initial.analysisId);
  const [storyQuery, setStoryQuery] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<CaseFilter>('All');
  const [selectedId, setSelectedId] = useState(cases[0].id);
  const [selectedIdeaId, setSelectedIdeaId] = useState(ideas[0].id);
  const [explorerFilters, setExplorerFilters] = useState<ExplorerFilters>({ ...defaultExplorerFilters, query: initialGame?.title ?? '' });
  const [explorerSelectedId, setExplorerSelectedId] = useState(initialGame?.id ?? gameLibrary[0].id);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [readingQuery, setReadingQuery] = useState('');
  const [readingId, setReadingId] = useState<string | undefined>(initial.readingId);
  const [readingTopic, setReadingTopic] = useState<ReadingTopic>('All topics');
  const [brief, setBrief] = useState<BriefInput>(defaultBrief);
  const [marketPeriod, setMarketPeriod] = useState<MarketPeriod>(initial.marketPeriod ?? '2025');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedView = params.get('view');
    const requestedPeriod = params.get('period');
    if (requestedView && Object.hasOwn(viewPaths, requestedView)) setView(requestedView as ResearchView);
    if (marketPeriods.includes(requestedPeriod as MarketPeriod)) setMarketPeriod(requestedPeriod as MarketPeriod);
  }, []);
  const visibleGames = useMemo(() => filterGames(explorerFilters), [explorerFilters]);

  useEffect(() => {
    const route = publicRoutes.find(candidate =>
      view === 'market' ? candidate.initial.view === view && candidate.initial.marketPeriod === marketPeriod :
      view === 'explorer' && initial.gameId ? candidate.initial.gameId === explorerSelectedId :
      view === 'reading' && readingId ? candidate.initial.readingId === readingId :
      view === 'stories' && storyId ? candidate.initial.storyId === storyId :
      view === 'guides' && initial.guideId ? candidate.initial.guideId === initial.guideId :
      view === 'analysis' && analysisId ? candidate.initial.analysisId === analysisId : candidate.path === viewPaths[view]);
    if (!route) return;
    const url = siteUrl + route.path;
    const image = route.image ?? `${siteUrl}/og.png`;
    if (window.location.pathname !== route.path) window.history.pushState({}, '', route.path);
    document.title = route.title;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
    const values: Record<string, string> = { description: route.description, 'og:title': route.title, 'twitter:title': route.title, 'og:description': route.description, 'twitter:description': route.description, 'og:url': url, 'og:image': image, 'twitter:image': image, 'og:image:width': route.image ? String(route.imageWidth ?? 460) : '1200', 'og:image:height': route.image ? String(route.imageHeight ?? 215) : '630' };
    for (const [name, value] of Object.entries(values)) document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)?.setAttribute('content', value);
    document.querySelector('meta[name="robots"]')?.setAttribute('content', route.noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large');
    document.querySelector('meta[property="og:type"]')?.setAttribute('content', route.initial.readingId || route.initial.storyId || route.initial.analysisId || route.initial.guideId ? 'article' : 'website');
    const structured = document.querySelector('script[type="application/ld+json"]');
    if (structured) structured.textContent = JSON.stringify(structuredData(route));
  }, [view, marketPeriod, explorerSelectedId, readingId, storyId, analysisId, initial.gameId, initial.guideId]);
  useEffect(() => {
    const restoreRoute = () => window.location.reload();
    window.addEventListener('popstate', restoreRoute);
    return () => window.removeEventListener('popstate', restoreRoute);
  }, []);

  function openExplorer(search = '') { setExplorerFilters({ ...defaultExplorerFilters, query: search }); setView('explorer'); }
  function openReading(search = '') { setReadingId(undefined); setReadingQuery(search); setReadingTopic('All topics'); setView('reading'); }
  function openCase(id: string) { setSelectedId(id); setQuery(''); setFilter('All'); setView('cases'); }
  function openBrief(hypothesis?: string) { if (hypothesis) setBrief(previous => ({ ...previous, hypothesis })); setView('ideas'); }

  const visibleCases = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('en-US');
    return cases.filter((item) => {
      const matchesFilter = filter === 'All' || item.mode === filter ||
        (filter === '2026' && item.period.includes('2026')) ||
        (filter === 'Incremental' && item.genre.toLowerCase().includes('incremental')) ||
        (filter === 'Control' && item.signal === 'Control');
      const haystack = [item.title, item.genre, item.hook, item.productLoop, item.clipHook,
        ...item.events.flatMap((event) => [event.channel, event.title, event.action, event.result])
      ].join(' ').toLocaleLowerCase('en-US');
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [filter, query]);

  const selected = visibleCases.find((item) => item.id === selectedId) ?? visibleCases[0] ?? cases[0];
  const selectedIdea = ideas.find((item) => item.id === selectedIdeaId) ?? ideas[0];
  const currentState = { view, storyId: storyId ?? null, analysisId: analysisId ?? null, storyQuery, visibleStoryIds: findStories(storyQuery).map(story => story.id), query, filter, selectedId: visibleCases.length ? selected.id : null, selectedIdeaId, visibleCaseIds: visibleCases.map(item => item.id), explorerFilters, explorerSelectedId: visibleGames.find(game => game.id === explorerSelectedId)?.id ?? visibleGames[0]?.id ?? null, visibleGameIds: visibleGames.map(game => game.id), comparisonIds, readingQuery, readingTopic, brief, marketPeriod };
  const stateRef = useRef(currentState);
  stateRef.current = currentState;

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const report = (error: unknown) => console.warn('WebMCP registration failed', error);
    const objectInput = (input: unknown, keys: string[]) => {
      if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected an input object.');
      const value = input as Record<string, unknown>;
      if (Object.keys(value).some(key => !keys.includes(key))) throw new Error('Unknown input property.');
      return value;
    };
    const tools: ModelTool[] = [
      {
        name: 'read_progress_card_authoring_guide', title: 'Read the Progress card authoring guide',
        description: 'Read the repository contract for creating or updating Progress cards without changing the page or its data.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: false },
        execute(input) {
          objectInput(input, []);
          return progressCardAuthoringGuide;
        },
      },
      {
        name: 'open_game_story', title: 'Read a digested game story',
        description: 'Open a full game narrative with KPIs, timeline, demand structure and a proposed demo transfer. Does not open an external source.',
        inputSchema: { type: 'object', properties: { storyId: { type: 'string', enum: gameStories.map(story => story.id) } }, required: ['storyId'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const id = objectInput(input, ['storyId']).storyId;
          if (!gameStories.some(story => story.id === id)) throw new Error('Unknown storyId.');
          flushSync(() => { setStoryId(id as string); setView('stories'); });
          return { visibleView: 'stories', storyId: stateRef.current.storyId };
        },
      },
      {
        name: 'filter_game_stories', title: 'Search digested game stories',
        description: 'Search the visible story cards by game, genre, publication, demand or tactic. Empty query restores all stories.',
        inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 } }, required: ['query'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const value = objectInput(input, ['query']).query;
          if (typeof value !== 'string' || value.length > 120) throw new Error('Invalid story query.');
          flushSync(() => { setStoryId(undefined); setStoryQuery(value); setView('stories'); });
          return { visibleView: 'stories', query: stateRef.current.storyQuery, matchingStoryIds: stateRef.current.visibleStoryIds };
        },
      },
      {
        name: 'open_original_analysis', title: 'Read original market analysis',
        description: 'Open one of the three Steam Discovery original essays, including citations and links to the relevant survival demo GDD section.',
        inputSchema: { type: 'object', properties: { articleId: { type: 'string', enum: originalAnalysis.articles.map(article => article.id) } }, required: ['articleId'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const id = objectInput(input, ['articleId']).articleId;
          if (!originalAnalysis.articles.some(article => article.id === id)) throw new Error('Unknown articleId.');
          flushSync(() => { setAnalysisId(id as string); setView('analysis'); });
          return { visibleView: 'analysis', articleId: stateRef.current.analysisId };
        },
      },
      {
        name: 'navigate_research_view', title: 'Open research section',
        description: 'Navigate the visible workspace to digested game stories, original analysis, the survival demo GDD, game explorer, campaign timelines, market pulse, survival research, build lab, source notes, sprint plan, delivery progress or methodology.',
        inputSchema: { type: 'object', properties: { view: { type: 'string', enum: Object.keys(viewPaths) } }, required: ['view'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const candidate = objectInput(input, ['view']).view;
          if (typeof candidate !== 'string' || !Object.hasOwn(viewPaths, candidate)) throw new Error('Unknown research view.');
          flushSync(() => { setStoryId(undefined); setAnalysisId(undefined); setView(candidate as ResearchView); });
          return { visibleView: candidate };
        },
      },
      {
        name: 'filter_marketing_cases', title: 'Filter marketing cases',
        description: 'Update the visible case library using a text query and/or mode filter.',
        inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, filter: { type: 'string', enum: [...filters] } }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const values = objectInput(input, ['query', 'filter']);
          if (values.query !== undefined && (typeof values.query !== 'string' || values.query.length > 120)) throw new Error('query must be a string of at most 120 characters.');
          if (values.filter !== undefined && !filters.includes(values.filter as CaseFilter)) throw new Error('Unknown case filter.');
          flushSync(() => {
            if (typeof values.query === 'string') setQuery(values.query);
            if (values.filter) setFilter(values.filter as CaseFilter);
            setView('cases');
          });
          return { ...stateRef.current };
        },
      },
      {
        name: 'select_marketing_case', title: 'Open a marketing case',
        description: 'Open one game case and its dated campaign timeline in the visible workspace.',
        inputSchema: { type: 'object', properties: { caseId: { type: 'string', enum: cases.map((item) => item.id) } }, required: ['caseId'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const target = cases.find((item) => item.id === objectInput(input, ['caseId']).caseId);
          if (!target) throw new Error('Unknown caseId.');
          flushSync(() => { setQuery(''); setFilter('All'); setSelectedId(target.id); setView('cases'); });
          return { visibleView: 'cases', selectedCase: target.id, title: target.title };
        },
      },
      {
        name: 'select_game_concept', title: 'Open a game concept',
        description: 'Open one of the five ranked three-week game concepts in the visible workspace.',
        inputSchema: { type: 'object', properties: { conceptId: { type: 'string', enum: ideas.map((item) => item.id) } }, required: ['conceptId'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const target = ideas.find((item) => item.id === objectInput(input, ['conceptId']).conceptId);
          if (!target) throw new Error('Unknown conceptId.');
          flushSync(() => { setSelectedIdeaId(target.id); setView('ideas'); });
          return { visibleView: 'ideas', selectedConcept: target.id, title: target.name };
        },
      },
      {
        name: 'filter_game_explorer', title: 'Filter the game benchmark library',
        description: 'Configure the visible game explorer by text, genre, three-week demo fit, release cohort, evidence and sorting. Owner bands are estimates, not sales or reach.',
        inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, category: { type: 'string', enum: [...categories] }, fit: { type: 'string', enum: ['All scope', 'High', 'Medium', 'Low'] }, year: { type: 'string', enum: ['All years', '2026', '2025', 'Earlier', 'Upcoming'] }, band: { type: 'string', enum: ['All signals', '100–200K owner models', 'Reported milestone', 'Deep case'] }, sort: { type: 'string', enum: ['Curated', 'Newest', 'Reviews', 'Demo fit'] } }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const values = objectInput(input, ['query', 'category', 'fit', 'year', 'band', 'sort']);
          if (values.query !== undefined && (typeof values.query !== 'string' || values.query.length > 120)) throw new Error('Invalid query.');
          const enums: Record<string, readonly string[]> = { category: categories, fit: ['All scope', 'High', 'Medium', 'Low'], year: ['All years', '2026', '2025', 'Earlier', 'Upcoming'], band: ['All signals', '100–200K owner models', 'Reported milestone', 'Deep case'], sort: ['Curated', 'Newest', 'Reviews', 'Demo fit'] };
          for (const [key, allowed] of Object.entries(enums)) if (values[key] !== undefined && !allowed.includes(values[key] as string)) throw new Error(`Invalid ${key}.`);
          flushSync(() => { setExplorerFilters({ ...stateRef.current.explorerFilters, ...values } as ExplorerFilters); setView('explorer'); });
          return { visibleView: 'explorer', filters: stateRef.current.explorerFilters, matchingGameIds: stateRef.current.visibleGameIds };
        },
      },
      {
        name: 'select_discovery_game', title: 'Open a game evidence record',
        description: 'Open one game in the Explorer, including metrics, source links, production context and dated marketing events. Clears Explorer filters.',
        inputSchema: { type: 'object', properties: { gameId: { type: 'string', enum: gameLibrary.map(game => game.id) } }, required: ['gameId'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const id = objectInput(input, ['gameId']).gameId;
          if (!gameLibrary.some(game => game.id === id)) throw new Error('Unknown gameId.');
          flushSync(() => { setExplorerSelectedId(id as string); setExplorerFilters(defaultExplorerFilters); setView('explorer'); });
          return { visibleView: 'explorer', selectedGameId: stateRef.current.explorerSelectedId };
        },
      },
      {
        name: 'set_comparison_games', title: 'Choose up to three comparable games',
        description: 'Replace the visible comparison basket with up to three known games, for side-by-side review and the experiment brief. An empty array clears the basket.',
        inputSchema: { type: 'object', properties: { gameIds: { type: 'array', items: { type: 'string', enum: gameLibrary.map(game => game.id) }, maxItems: 3, uniqueItems: true } }, required: ['gameIds'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const ids = objectInput(input, ['gameIds']).gameIds;
          if (!Array.isArray(ids) || ids.length > 3 || new Set(ids).size !== ids.length || ids.some(id => !gameLibrary.some(game => game.id === id))) throw new Error('Use zero to three unique known game IDs.');
          flushSync(() => { setComparisonIds(ids as string[]); setView('explorer'); });
          return { visibleView: 'explorer', comparisonIds: stateRef.current.comparisonIds };
        },
      },
      {
        name: 'filter_reading_room', title: 'Find research articles',
        description: 'Filter the visible article notes by author, game or query, and a topic. Opens the reading room.',
        inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 120 }, topic: { type: 'string', enum: [...readingTopics] } }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const values = objectInput(input, ['query', 'topic']);
          if (values.query !== undefined && (typeof values.query !== 'string' || values.query.length > 120)) throw new Error('Invalid reading query.');
          if (values.topic !== undefined && !readingTopics.includes(values.topic as ReadingTopic)) throw new Error('Invalid reading topic.');
          flushSync(() => { setReadingId(undefined); if (typeof values.query === 'string') setReadingQuery(values.query); if (values.topic) setReadingTopic(values.topic as ReadingTopic); setView('reading'); });
          return { visibleView: 'reading', query: stateRef.current.readingQuery, topic: stateRef.current.readingTopic };
        },
      },
      {
        name: 'configure_research_brief', title: 'Edit the working experiment brief',
        description: 'Update visible draft fields in the Build Lab. This only configures an in-memory working brief; it does not publish, download, save remotely or send marketing messages.',
        inputSchema: { type: 'object', properties: { title: { type: 'string', maxLength: 100 }, hypothesis: { type: 'string', maxLength: 1200 }, audience: { type: 'string', maxLength: 250 }, channel: { type: 'string', enum: ['Tactile short-form + specialist creator trial', 'Specialist long-form + community playtests', 'Co-op group clips + private creator sessions', 'Cozy curators + themed community tests'] } }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const values = objectInput(input, ['title', 'hypothesis', 'audience', 'channel']);
          for (const [key, max] of Object.entries({ title: 100, hypothesis: 1200, audience: 250 })) if (values[key] !== undefined && (typeof values[key] !== 'string' || (values[key] as string).length > max)) throw new Error(`Invalid ${key}.`);
          const channels = ['Tactile short-form + specialist creator trial', 'Specialist long-form + community playtests', 'Co-op group clips + private creator sessions', 'Cozy curators + themed community tests'];
          if (values.channel !== undefined && !channels.includes(values.channel as string)) throw new Error('Invalid channel.');
          flushSync(() => { setBrief({ ...stateRef.current.brief, ...values } as BriefInput); setView('ideas'); });
          return { visibleView: 'ideas', brief: stateRef.current.brief, comparisonIds: stateRef.current.comparisonIds };
        },
      },
      {
        name: 'read_research_state', title: 'Read current research state',
        description: 'Read the currently visible section, case filter, case and concept without changing the page.',
        inputSchema: { type: 'object', properties: {}, additionalProperties: false },
        annotations: { readOnlyHint: true, untrustedContentHint: true },
        execute(input) { objectInput(input, []); return { ...stateRef.current, asOf: '2026-09-02', editorialUpdatedAt }; },
      },
      {
        name: 'select_market_period', title: 'Choose the market evidence period',
        description: 'Show 2025 full-year genre outcomes, published Q1 2026 hit counts, or Q2 2026 coverage and partial evidence. Opens Market Map. These datasets have different coverage and methodology.',
        inputSchema: { type: 'object', properties: { period: { type: 'string', enum: [...marketPeriods] } }, required: ['period'], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input) {
          const period = objectInput(input, ['period']).period;
          if (!marketPeriods.includes(period as MarketPeriod)) throw new Error('Unknown market period.');
          flushSync(() => { setMarketPeriod(period as MarketPeriod); setView('market'); });
          return { visibleView: 'market', period: stateRef.current.marketPeriod };
        },
      },
    ];
    for (const tool of tools) {
      try { void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(report); } catch (error) { report(error); }
    }
    return () => lifecycle.abort();
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <a href="#research-content" className="skip-link">Skip to research</a>
      <header className="topbar">
        <a className="brand-lockup" href="/"><span className="brand-mark"><Radar aria-hidden="true" /></span><div><p className="eyebrow">INDEPENDENT INDIE INTELLIGENCE</p><strong className="brand-name">Steam Discovery</strong></div></a>
        <div className="top-metrics" aria-label="Dataset summary">
          <div><strong>{radarSnapshot.catalogCount.toLocaleString('en-US')}</strong><span>catalog apps</span></div>
          <div><strong>{gameStories.length}</strong><span>digested stories</span></div>
          <div className="freshness"><span className="live-dot" /><strong>{readingUpdatedAt}</strong><span>source check</span></div>
        </div>
      </header>

      <nav className="nav-shell" aria-label="Research sections">
        <div className="view-tabs">{navItems.map((item) => { const Icon = item.icon; return <a key={item.id} href={item.id === 'market' ? `/market/${marketPeriod}/` : viewPaths[item.id]} className={view === item.id ? 'is-active' : ''} aria-current={view === item.id ? 'page' : undefined}><Icon aria-hidden="true" /><span><strong>{item.label}</strong><small>{item.caption}</small></span></a>; })}</div>
        <Button variant="outline" size="sm" onClick={downloadDataset}><ArrowDownToLine aria-hidden="true" /> Export JSON</Button>
      </nav>
      <nav className="research-secondary" aria-label="Supporting research"><a href="/reading/">Sources &amp; Reading</a><a href="/games/">Researched benchmarks</a><a href="/analysis/">Original analysis</a><a href="/research/open-world-survival-craft/">Survival craft</a><a href="/case-studies/">Campaign timelines</a><a href="/about/">Methodology</a><details className="project-menu"><summary>Project workspace</summary><div><a href="/survival-demo/">Demo GDD</a><a href="/progress/">Progress & milestones</a><a href="/build-lab/">Build Lab</a><a href="/sprint-plan/">Sprint Plan</a></div></details></nav>

      <div id="research-content" tabIndex={-1} />
      {view === 'hub' && <SmallTeamHub />}
      {view === 'radar' && <SteamRadar />}
      {view === 'solo' && <SoloLab />}
      {view === 'guides' && <DeveloperPlaybooks articleId={initial.guideId} />}
      {view === 'stories' && <GameStories storyId={storyId} query={storyQuery} setQuery={setStoryQuery} />}
      {view === 'analysis' && <OriginalAnalysis articleId={analysisId} />}
      {view === 'gdd' && <SurvivalDemoGdd />}
      {view === 'explorer' && <Explorer landingId={initial.gameId} filters={explorerFilters} setFilters={setExplorerFilters} visible={visibleGames} selectedId={explorerSelectedId} select={setExplorerSelectedId} shortlist={comparisonIds} setShortlist={setComparisonIds} openCase={openCase} openBuild={() => openBrief()} openReading={openReading} />}
      {view === 'reading' && <ReadingRoom articleId={readingId} query={readingQuery} setQuery={setReadingQuery} topic={readingTopic} setTopic={setReadingTopic} explore={openExplorer} />}
      {view === 'methodology' && <Methodology />}
      {view === 'survival' && <SurvivalResearch build={openBrief} />}

      {view === 'cases' && (
        <section className="workbench">
          <div className="workspace-heading"><div><p className="section-kicker"><Sparkles aria-hidden="true" /> WHAT WORKED, WHEN, WHERE—AND WHY?</p><h1>Trace each game’s path to visibility event by event.</h1></div><p className="workspace-note">Every number carries an evidence type. Developer-reported sales, observed public metrics and model estimates are never silently blended.</p></div>
          <div className="control-row">
            <label className="searchbox"><Search aria-hidden="true" /><span className="sr-only">Search games, channels or tactics</span><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search game, genre, channel or tactic…" /></label>
            <div className="filter-set" aria-label="Case filters"><Filter aria-hidden="true" />{filters.map((item) => <Button key={item} size="sm" variant={filter === item ? 'default' : 'ghost'} onClick={() => setFilter(item)}>{item}</Button>)}</div>
          </div>
          <div className="signal-grid">
            <aside className="case-list" aria-label="Game cases">
              <div className="list-label"><span>Case library</span><span>{visibleCases.length} results</span></div>
              {visibleCases.length ? visibleCases.map((item) => <button key={item.id} className={`case-row ${selected.id === item.id ? 'is-selected' : ''}`} onClick={() => setSelectedId(item.id)}><SteamArtwork appId={item.appId} title={item.title} /><span className="case-copy"><span className="case-title-line"><strong>{item.title}</strong><span className={signalClasses[item.signal]}>{item.signal}</span></span><span className="case-genre">{item.genre}</span><span className="case-metric"><b>{item.headlineMetric}</b> {item.metricLabel}</span></span></button>) : <div className="empty-state"><Search aria-hidden="true" /><strong>No matching case</strong><span>Change the search or filter.</span></div>}
            </aside>
            {visibleCases.length > 0 && <article className="case-detail" key={selected.id}>
              <div className="case-hero"><SteamArtwork key={selected.appId} appId={selected.appId} title={selected.title} priority /><div className="case-hero-overlay" /><div className="case-hero-copy"><div className="hero-badges"><span className={signalClasses[selected.signal]}>{selected.signal}</span><span className="mode-pill"><Gamepad2 aria-hidden="true" /> {selected.mode}</span></div><p>{selected.period}</p><h3>{selected.title}</h3><p className="hook">{selected.hook}</p></div></div>
              <div className="fact-strip four">
                <div><Users aria-hidden="true" /><span><small>Team context</small><strong>{selected.team}</strong></span></div>
                <div><Clock3 aria-hidden="true" /><span><small>Production</small><strong>{selected.devTime}</strong></span></div>
                <div><Zap aria-hidden="true" /><span><small>Headline signal</small><strong>{selected.headlineMetric} {selected.metricLabel}</strong></span></div>
                <div><ShieldAlert aria-hidden="true" /><span><small>Attribution rule</small><strong>Sequence ≠ causality</strong></span></div>
              </div>
              <div className="mechanism-strip">
                <div><Play aria-hidden="true" /><span><small>PRODUCT LOOP</small><p>{selected.productLoop}</p></span></div>
                <div><Code2 aria-hidden="true" /><span><small>TECHNICAL HOOK</small><p>{selected.technicalHook}</p>{selected.technicalSource && <SourceLink url={selected.technicalSource} label="Technical source" />}</span></div>
                <div><Eye aria-hidden="true" /><span><small>CLIP HOOK</small><p>{selected.clipHook}</p></span></div>
              </div>
              <div className="detail-columns">
                <section className="timeline-panel">
                  <div className="panel-heading"><div><CalendarDays aria-hidden="true" /><span><small>CAMPAIGN TRACE</small><strong>Dated timeline</strong></span></div><span>{selected.events.length} sourced events</span></div>
                  <ol className="timeline">{selected.events.map((event,index) => <li key={`${event.date}-${event.title}`}><div className="timeline-node"><span>{String(index + 1).padStart(2,'0')}</span></div><div className="event-card"><div className="event-meta"><time>{event.date}</time><span>{event.channel}</span></div><h4>{event.title}</h4><p>{event.action}</p><div className="event-result"><Zap aria-hidden="true" /><strong>{event.result}</strong></div><div className="event-footer"><div><CircleDollarSign aria-hidden="true" /><span><small>SPEND</small>{event.spend}</span></div><div className="evidence-row"><span className={`evidence evidence-${event.evidence.toLowerCase()}`}>{event.evidence}</span><ReferenceLink url={event.source} label={event.sourceLabel} /></div></div>{event.attribution && <p className="attribution"><AlertTriangle aria-hidden="true" /> {event.attribution}</p>}</div></li>)}</ol>
                </section>
                <aside className="insight-panel">
                  <div className="insight-title"><Target aria-hidden="true" /><span><small>EDITORIAL INTERPRETATION</small><strong>Our explanation to test</strong></span></div>
                  <ul>{selected.why.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>)}</ul>
                  <div className="takeaway"><span>PORTABLE LESSON</span><p>{selected.lesson}</p></div>
                  <div className="caveat"><AlertTriangle aria-hidden="true" /><span><strong>Scope / causality caveat</strong><p>{selected.caveat}</p></span></div>
                  <p className="method-note"><strong>Evidence standard:</strong> Primary = developer/platform statement. Observed = public behavior metric. Reported = reputable source carrying a claim. Estimated = third-party model.</p>
                </aside>
              </div>
              <EditorialCredit />
              <ReferenceRegister references={[...selected.events.map(event => ({ url: event.source, uses: [`Dated event: ${event.date} — ${event.title}`] })), ...(selected.technicalSource ? [{ url: selected.technicalSource, uses: ['Technical features and context; see inline limitations'] }] : [])]} />
            </article>}
          </div>
        </section>
      )}

      {view === 'market' && (
        <section className="workbench content-view">
          <div className="workspace-heading"><div><p className="section-kicker"><Gauge aria-hidden="true" /> MARKET PULSE · AS OF 2 SEP 2026</p><h1>Demand exists. Discoverability is the scarce resource.</h1></div><p className="workspace-note">{marketPeriod === '2025' ? '“Hit rate” means a 2025 launch reached 1,000+ reviews. It is a cohort outcome—not your probability of success.' : marketPeriod === '2026-q1' ? 'Q1 genre counts were measured on 2 April. Genre supply is unpublished; the hit-count discrepancy is retained, not guessed away.' : 'Q2 coverage is incomplete. June-only records use overlapping tags and September review observations—not the HTMAG annual methodology.'}</p></div>
          <div className="stat-grid">{marketStats.map((stat) => <div className="stat-card" key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span><small>{stat.note}</small><SourceLink url={stat.source} /></div>)}</div>
          <div className="editorial-next"><a href="/analysis/fps-zomboid-is-not-an-empty-market/">New: the five-game survival demand comparison <ArrowRight /></a><a href="/survival-demo/">Turn the evidence into a 15-day GDD <ArrowRight /></a></div>
          <div className="market-layout">
            <MarketPeriods period={marketPeriod} setPeriod={setMarketPeriod} />
            <aside className="decision-panel"><p className="section-kicker"><Target aria-hidden="true" /> RISK-ADJUSTED OPENING</p><h3>Build where demand and demo scope overlap.</h3><div className="decision-card"><span>01</span><div><strong>Tactile 3D incremental</strong><p>One physical room, one pressure rule, one visibly multiplying variable.</p></div></div><div className="decision-card"><span>02</span><div><strong>Micro job-sim + contradiction</strong><p>One familiar task plus a secret, risky or absurd second objective.</p></div></div><div className="decision-warning"><AlertTriangle /><p>Open-world survival has the best observed rate here and the worst fit for a 15-day vertical slice. Never optimize genre demand without production reality.</p></div></aside>
          </div>
          <section className="surface-panel reach-panel"><div className="surface-heading"><div><Radar aria-hidden="true" /><span><small>METRIC HYGIENE</small><strong>What does “100–200K organic reach” actually mean?</strong></span></div></div><div className="reach-grid">{reachDictionary.map((item) => <div key={item.metric}><strong>{item.metric}</strong><span>{item.meaning}</span><p>{item.use}</p></div>)}</div><div className="inline-note"><AlertTriangle /><p><strong>Public-data ceiling:</strong> exact Steam organic impressions and source-level conversions live inside the developer’s Steamworks Traffic Breakdown. SteamDB, VG Insights and review multipliers cannot reconstruct them. <a href="https://partner.steamgames.com/doc/marketing/traffic_reporting" target="_blank" rel="noreferrer">Steamworks documentation</a>.</p></div></section>
          <MarketMap explore={openExplorer} build={openBrief} />
        </section>
      )}

      {view === 'ideas' && (
        <section className="workbench content-view">
          <div className="workspace-heading"><div><p className="section-kicker"><Lightbulb aria-hidden="true" /> FIVE CONCEPTS · RANKED FOR THIS TEAM</p><h1>Choose a marketable vertical slice, not a miniature full game.</h1></div><p className="workspace-note">Assumption: 2 senior developers × 15 days, 1 dedicated 3D artist, 1 PM and 1 marketing manager. Scores are decision aids, not sales forecasts.</p></div>
          <ResearchBrief brief={brief} setBrief={setBrief} ids={comparisonIds} explore={() => openExplorer()} />
          <div className="idea-selector">{ideas.map((idea) => <button key={idea.id} className={selectedIdea.id === idea.id ? 'is-selected' : ''} onClick={() => setSelectedIdeaId(idea.id)}><span>{String(idea.rank).padStart(2,'0')}</span><div><strong>{idea.name}</strong><small>{idea.mode} · Risk {idea.risk}</small></div><ChevronRight aria-hidden="true" /></button>)}</div>
          <article className="idea-detail" key={selectedIdea.id}>
            <header className="idea-hero"><div><p>RECOMMENDATION #{selectedIdea.rank}</p><h3>{selectedIdea.name}</h3><span>{selectedIdea.tagline}</span></div><div className="idea-meta"><span>{selectedIdea.mode}</span><span>Delivery risk: {selectedIdea.risk}</span></div></header>
            <div className="idea-score-grid"><Score label="Market signal" value={selectedIdea.score.market} /><Score label="3-week build" value={selectedIdea.score.build} /><Score label="Clip potential" value={selectedIdea.score.clip} /><Score label="Differentiation" value={selectedIdea.score.differentiation} /></div>
            <EditorialCredit kind="proposal" />
            <div className="idea-body"><div className="idea-main">
              <section className="thesis-block"><div><Target /><span><small>WHY THIS BET</small><strong>{selectedIdea.thesis}</strong></span></div><p>{selectedIdea.gap}</p></section>
              <section><div className="section-title"><Play /><span><small>CORE LOOP</small><strong>The smallest complete promise</strong></span></div><ol className="loop-list">{selectedIdea.loop.map((step,index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></section>
              <section><div className="section-title"><Link2 /><span><small>NEAREST COMPARABLES</small><strong>Borrow the proof; change the engine of the joke</strong></span></div><div className="compare-table"><div><span>Comparable</span><span>Borrow</span><span>Your spin</span></div>{selectedIdea.comparables.map((item) => <div key={item.name}><strong>{item.name}</strong><p>{item.borrow}</p><p>{item.spin}</p></div>)}</div></section>
              <div className="dual-panels"><section><div className="section-title"><Gamepad2 /><span><small>15-DAY DEMO</small><strong>Feature envelope</strong></span></div><ul className="check-list">{selectedIdea.mvp.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul></section><section><div className="section-title"><Code2 /><span><small>TECHNICAL PLAN</small><strong>Where to simplify</strong></span></div><ul className="check-list">{selectedIdea.tech.map((item) => <li key={item}><CheckCircle2 />{item}</li>)}</ul></section></div>
              <section><div className="section-title"><Megaphone /><span><small>MARKETING TEST</small><strong>Evidence before polish</strong></span></div><div className="marketing-list">{selectedIdea.marketing.map((item,index) => <div key={item}><span>{String(index + 1).padStart(2,'0')}</span><p>{item}</p></div>)}</div></section>
            </div><aside className="idea-aside"><section className="pros"><h4><CheckCircle2 /> Pros</h4><ul>{selectedIdea.pros.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="cons"><h4><XCircle /> Cons</h4><ul>{selectedIdea.cons.map((item) => <li key={item}>{item}</li>)}</ul></section><section className="kill-gate"><span>KILL / PIVOT GATE</span><p>{selectedIdea.kill}</p></section></aside></div>
            <ReferenceRegister references={ideaReferences(selectedIdea)} />
          </article>
        </section>
      )}

      {view === 'progress' && <ProgressTracker />}

      {view === 'playbook' && (
        <section className="workbench content-view">
          <div className="workspace-heading"><div><p className="section-kicker"><Database aria-hidden="true" /> REPEATABLE RESEARCH + DELIVERY SYSTEM</p><h1>A source stack, a 15-day sprint and hard Steam constraints.</h1></div><p className="workspace-note">The practical system is a living event table: game, date, channel, spend, outcome, evidence type, source URL and attribution caveat.</p></div>
          <section className="timing-grid">{steamTiming.map((item) => <div key={item.title}><span>{item.status}</span><strong>{item.title}</strong><p>{item.detail}</p><SourceLink url={item.url} label="Official source" /></div>)}</section>
          <div className="playbook-layout"><section className="surface-panel sprint-panel"><div className="surface-heading"><div><CalendarDays /><span><small>EXECUTION</small><strong>15 working days</strong></span></div></div><ol>{sprint.map((item,index) => <li key={item.days}><span className="sprint-num">{String(index + 1).padStart(2,'0')}</span><div><time>Days {item.days} · {item.owner}</time><strong>{item.title}</strong><p>{item.exit}</p></div></li>)}</ol><div className="scope-ban"><ShieldAlert /><div><strong>Do not build in this sprint</strong><p>Public matchmaking, dedicated servers, crossplay, runtime procgen, an open world, a meta tree, Content Warning-grade video/audio encoding, R.E.P.O.-grade multi-object network physics, or more than one map.</p></div></div></section><aside className="surface-panel measurement-panel"><div className="surface-heading"><div><Target /><span><small>VALIDATION LADDER</small><strong>Measure the next decision</strong></span></div></div><ol><li><b>01</b><span><strong>Awareness</strong><p>Short views, hold rate, comments that restate the hook.</p></span></li><li><b>02</b><span><strong>Intent</strong><p>Tagged store visits, follows, wishlists and 7-day baseline lift.</p></span></li><li><b>03</b><span><strong>Trial</strong><p>Unique demo users, CCU, median session, completion, replay.</p></span></li><li><b>04</b><span><strong>Launch</strong><p>Units, gross revenue, reviews, refund rate and peak CCU.</p></span></li></ol><div className="inline-note"><AlertTriangle /><p>A 100K-view clip is evidence for the hook only. It becomes marketing evidence when tagged traffic or the wishlist baseline moves with it.</p></div></aside></div>
          <div className="report-download"><div><h3>The complete decision report</h3><p>Market definitions, deep cases, five concept briefs, technical scope, source curriculum and quarterly methodology.</p></div><a href="/Steam-Indie-2026-Decision-Report.md" download><ArrowDownToLine /> Download report</a></div>
          <div className="inline-note"><BookOpen /><p>Continue in the <button className="inline-link" onClick={() => openReading()}>Reading Room</button> for all {readingLibrary.length} article notes, publication profiles, original sources and disagreements.</p></div>
        </section>
      )}
      <footer className="site-footer"><div><Radar /><strong>Steam Discovery</strong></div><p>Independent research · Not affiliated with Valve · Source library checked {readingUpdatedAt}; game snapshots retain their dates.<br />Game artwork belongs to its respective rights holders. Public evidence cannot prove organic attribution.</p><div className="footer-links"><a href="/about/#article-sources">Original articles & references</a><a href="/about/#attribution">Attribution & corrections</a><a href="/feed.xml">Research feed</a><a href="https://github.com/oguzhanozfe/steam-discovery">GitHub</a><a href="/sitemap.xml">Sitemap</a><button onClick={downloadDataset}>Download research <ArrowRight /></button></div></footer>
    </main>
  );
}
