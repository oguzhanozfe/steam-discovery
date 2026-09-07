import { readingLibrary, readingUpdatedAt } from './discovery-data';
import { gameStories, originalAnalysis } from './editorial-data';
import { publicRoutes, siteUrl, type SiteRoute } from './site-routes';

const publisher = { '@type': 'Organization', '@id': `${siteUrl}/#publisher`, name: 'Steam Discovery Research', url: `${siteUrl}/about/`, sameAs: ['https://github.com/oguzhanozfe/steam-discovery'] };

export function structuredData(route: SiteRoute) {
  const url = siteUrl + route.path;
  const article = readingLibrary.find(item => item.id === route.initial.readingId);
  const story = gameStories.find(item => item.id === route.initial.storyId);
  const analysis = originalAnalysis.articles.find(item => item.id === route.initial.analysisId);
  const editorial = !!(article || story || analysis);
  const parentPath = article ? '/reading/' : analysis ? '/analysis/' : route.initial.gameId ? '/games/' : '/';
  const parent = publicRoutes.find(item => item.path === parentPath);
  const graph: Record<string, unknown>[] = [publisher,
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Steam Discovery', inLanguage: 'en', publisher: { '@id': publisher['@id'] }, description: 'Independent Steam marketing and indie game market research. Not affiliated with Valve.' },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: route.title, description: route.description, inLanguage: 'en', isPartOf: { '@id': `${siteUrl}/#website` }, ...(route.modifiedAt ? { dateModified: route.modifiedAt } : {}), ...(route.citations ? { citation: route.citations } : {}) },
  ];
  if (route.path !== '/') {
    const crumbs = [{ name: 'Steam Discovery', item: `${siteUrl}/` }, ...(parentPath !== '/' && parent ? [{ name: parent.title.split(' — ')[0], item: siteUrl + parent.path }] : []), { name: route.title.split(' — ')[0], item: url }];
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumbs`, itemListElement: crumbs.map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })) });
  }
  if (editorial) graph.push({
    '@type': 'Article', '@id': `${url}#article`, mainEntityOfPage: { '@id': `${url}#webpage` }, url,
    headline: article ? `Research note: ${article.title}` : story?.headline ?? analysis?.title,
    description: article?.summary ?? story?.deck ?? analysis?.deck,
    author: { '@id': publisher['@id'] }, publisher: { '@id': publisher['@id'] },
    inLanguage: 'en', ...(route.modifiedAt ? { dateModified: route.modifiedAt } : {}), citation: route.citations ?? [],
    ...(article ? { isBasedOn: { '@type': 'Article', url: article.url, headline: article.title, author: { '@type': 'Person', name: article.author }, ...(article.date ? { datePublished: article.date } : {}) }, articleSection: 'Research notes' } : { articleSection: story ? 'Game stories' : 'Original analysis' }),
  });
  if (route.path === '/reading/' || route.path === '/games/') graph.push({ '@type': 'CollectionPage', '@id': `${url}#collection`, url, name: route.title, hasPart: publicRoutes.filter(item => route.path === '/reading/' ? !!item.initial.readingId : !!item.initial.gameId).map(item => ({ '@type': 'WebPage', url: siteUrl + item.path, name: item.title })) });
  return { '@context': 'https://schema.org', '@graph': graph };
}

export const researchIndex = {
  name: 'Steam Discovery', url: siteUrl, publisher: publisher.name, sourceLibraryCheckedAt: readingUpdatedAt,
  methodology: 'Independent AI-assisted editorial research. Source publication dates, verification dates and metric snapshots are distinct. Public observations, developer reports and model estimates are not interchangeable.',
  correctionUrl: 'https://github.com/oguzhanozfe/steam-discovery/issues',
  pages: publicRoutes.filter(route => !route.noindex).map(route => ({ url: siteUrl + route.path, title: route.title, description: route.description, modifiedAt: route.modifiedAt ?? null, citations: route.citations ?? [] })),
};
export const readingMetadata = readingLibrary.map(article => ({ ...article, researchNoteUrl: `${siteUrl}/reading/${article.id}/`, notePublisher: publisher.name, sourcePublishedAt: article.date, sourceCheckedAt: article.checkedAt ?? null }));
