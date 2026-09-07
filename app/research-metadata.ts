import { readingLibrary, readingUpdatedAt } from './discovery-data';
import { gameStories, originalAnalysis } from './editorial-data';
import { publicRoutes, siteUrl, type SiteRoute } from './site-routes';
import hubArticles from './data/hub-articles.json';
import { gameLibrary } from './discovery-data';
import { cases, ideas } from './research-data';
import hubNiches from './data/hub-niches.json';
import hubConcepts from './data/solo-concepts.json';
import { gameReferences, storyReferences, analysisReferences, gddReferences, ideaReferences, playbookReferences } from './source-references';

export function citationUrls(route: SiteRoute) {
  const game = gameLibrary.find(game => game.id === route.initial.gameId);
  const story = gameStories.find(story => story.id === route.initial.storyId);
  const article = originalAnalysis.articles.find(article => article.id === route.initial.analysisId);
  const extra = game ? gameReferences(game).map(ref => ref.url) : story ? storyReferences(story).map(ref => ref.url) : article ? analysisReferences(article).map(ref => ref.url) : route.initial.view === 'gdd' ? gddReferences().map(ref => ref.url) : route.initial.view === 'hub' ? hubNiches.niches.flatMap(niche => niche.sources) : route.initial.view === 'solo' ? [...hubNiches.niches.flatMap(niche => niche.sources), ...hubConcepts.concepts.flatMap(concept => concept.comparables.map(id => `https://store.steampowered.com/app/${id}/`))] : route.initial.view === 'cases' ? cases.flatMap(game => [...game.events.map(event => event.source), ...(game.technicalSource ? [game.technicalSource] : [])]) : [];
  const proposals = route.initial.view === 'ideas' ? ideas.flatMap(idea => ideaReferences(idea).map(ref => ref.url)) : [];
  const guides = route.initial.view === 'guides' ? hubArticles.articles.filter(article => !route.initial.guideId || article.id === route.initial.guideId).flatMap(article => playbookReferences(article).map(ref => ref.url)) : [];
  return [...new Set([...(route.citations ?? []), ...extra, ...proposals, ...guides])];
}

const publisher = { '@type': 'Organization', '@id': `${siteUrl}/#publisher`, name: 'Steam Discovery Research', url: `${siteUrl}/about/`, sameAs: ['https://github.com/oguzhanozfe/steam-discovery'] };

export function structuredData(route: SiteRoute) {
  const citations = citationUrls(route);
  const url = siteUrl + route.path;
  const article = readingLibrary.find(item => item.id === route.initial.readingId);
  const story = gameStories.find(item => item.id === route.initial.storyId);
  const analysis = originalAnalysis.articles.find(item => item.id === route.initial.analysisId);
  const guide = hubArticles.articles.find(item => item.id === route.initial.guideId);
  const editorial = !!(article || story || analysis || guide);
  const parentPath = guide ? '/playbooks/' : article ? '/reading/' : analysis ? '/analysis/' : story ? '/stories/' : route.initial.gameId ? '/games/' : '/';
  const parent = publicRoutes.find(item => item.path === parentPath);
  const graph: Record<string, unknown>[] = [publisher,
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Steam Discovery', inLanguage: 'en', publisher: { '@id': publisher['@id'] }, description: 'Independent Steam marketing and indie game market research. Not affiliated with Valve.' },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: route.title, description: route.description, inLanguage: 'en', isPartOf: { '@id': `${siteUrl}/#website` }, ...(route.modifiedAt ? { dateModified: route.modifiedAt } : {}), ...(citations.length ? { citation: citations } : {}) },
  ];
  if (route.path !== '/') {
    const crumbs = [{ name: 'Steam Discovery', item: `${siteUrl}/` }, ...(parentPath !== '/' && parent ? [{ name: parent.title.split(' — ')[0], item: siteUrl + parent.path }] : []), { name: route.title.split(' — ')[0], item: url }];
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`, itemListElement: crumbs.map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })) });
  }
  if (editorial) graph.push({
    '@type': 'Article', '@id': `${url}#article`, mainEntityOfPage: { '@id': `${url}#webpage` }, url,
    headline: article ? `Research note: ${article.title}` : story?.headline ?? analysis?.title ?? guide?.title,
    description: article?.summary ?? story?.deck ?? analysis?.deck ?? guide?.synopsis,
    author: { '@id': publisher['@id'] }, publisher: { '@id': publisher['@id'] },
    inLanguage: 'en', ...(route.modifiedAt ? { dateModified: route.modifiedAt } : {}), citation: citations,
    ...(article ? { isBasedOn: { '@type': 'Article', url: article.url, headline: article.title, author: { '@type': 'Person', name: article.author }, ...(article.date ? { datePublished: article.date } : {}) }, articleSection: 'Research notes' } : guide ? { isBasedOn: { '@type': 'Article', url: guide.url, headline: guide.title, ...(guide.publishDate ? { datePublished: guide.publishDate } : {}) }, articleSection: 'Developer playbooks' } : { articleSection: story ? 'Game stories' : 'Original analysis' }),
  });
  if (route.path === '/reading/' || route.path === '/games/') graph.push({ '@type': 'CollectionPage', '@id': `${url}#collection`, url, name: route.title, hasPart: publicRoutes.filter(item => route.path === '/reading/' ? !!item.initial.readingId : !!item.initial.gameId).map(item => ({ '@type': 'WebPage', url: siteUrl + item.path, name: item.title })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export const researchIndex = {
  name: 'Steam Discovery', url: siteUrl, publisher: publisher.name, sourceLibraryCheckedAt: readingUpdatedAt,
  methodology: 'Independent AI-assisted editorial research. Source publication dates, verification dates and metric snapshots are distinct. Public observations, developer reports and model estimates are not interchangeable.',
  correctionUrl: 'https://github.com/oguzhanozfe/steam-discovery/issues',
  pages: publicRoutes.filter(route => !route.noindex).map(route => ({ url: siteUrl + route.path, title: route.title, description: route.description, modifiedAt: route.modifiedAt ?? null, citations: citationUrls(route) })),
};
export const readingMetadata = readingLibrary.map(article => ({ ...article, researchNoteUrl: `${siteUrl}/reading/${article.id}/`, notePublisher: publisher.name, sourcePublishedAt: article.date, sourceCheckedAt: article.checkedAt ?? null }));
