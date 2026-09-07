import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, publicRoutes, structuredData, researchIndex, readingMetadata } from '../.prerender/entry-prerender.js';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(project, 'dist-static');
const template = await readFile(resolve(out, 'index.html'), 'utf8');
const origin = 'https://steam-discovery.vercel.app';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
for (const route of publicRoutes) {
  const canonical = `${origin}${route.path}`;
  const structured = structuredData(route);
  let html = template.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(route.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/>)/, (_, start, end) => start + esc(route.description) + end)
    .replace(/(<meta (?:property|name)="(?:og|twitter):title" content=")[^"]*("\s*\/>)/g, (_, start, end) => start + esc(route.title) + end)
    .replace(/(<meta (?:property|name)="(?:og|twitter):description" content=")[^"]*("\s*\/>)/g, (_, start, end) => start + esc(route.description) + end)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/, `$1${canonical}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/>)/, `$1${canonical}$2`)
    .replace('</head>', `<script type="application/ld+json">${json(structured)}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route.initial)}</div>\n<script type="application/json" id="research-route">${json(route.initial)}</script>`);
  if (route.noindex) html = html.replace('index,follow,max-image-preview:large', 'noindex,follow');
  if (route.initial.readingId || route.initial.storyId || route.initial.analysisId || route.initial.guideId) html = html.replace('property="og:type" content="website"', 'property="og:type" content="article"');
  if (route.image) html = html.replace(/(<meta (?:property|name)="(?:og|twitter):image" content=")[^"]*("\s*\/>)/g, (_, start, end) => start + esc(route.image) + end)
    .replace('property="og:image:width" content="1200"', `property="og:image:width" content="${route.imageWidth ?? 460}"`).replace('property="og:image:height" content="630"', `property="og:image:height" content="${route.imageHeight ?? 215}"`);
  const target = resolve(out, `.${route.path}`, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.filter(route => !route.noindex).map(route => `\n  <url><loc>${esc(origin + route.path)}</loc><lastmod>${route.modifiedAt ?? '2026-09-02'}</lastmod></url>`).join('')}\n</urlset>\n`;
await writeFile(resolve(out, 'sitemap.xml'), sitemap);
await writeFile(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
await mkdir(resolve(out, 'data'), { recursive: true });
await writeFile(resolve(out, 'data/research-index.json'), JSON.stringify(researchIndex, null, 2));
await writeFile(resolve(out, 'data/readings.json'), JSON.stringify(readingMetadata, null, 2));
await cp(resolve(project, 'app/data/reading-updates.json'), resolve(out, 'data/reading-updates.json'));
const notes = [...readingMetadata].sort((a, b) => (b.sourceCheckedAt ?? '').localeCompare(a.sourceCheckedAt ?? '') || (b.date ?? '').localeCompare(a.date ?? '')).slice(0, 30);
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Steam Discovery research notes</title><link>${origin}/reading/</link><description>Independent notes on Steam marketing and indie game market research. Item dates are research-check dates; original publication dates appear in each note.</description><language>en</language><atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml"/>${notes.map(note => `<item><title>${esc('Research note: ' + note.title)}</title><link>${esc(note.researchNoteUrl)}</link><guid isPermaLink="true">${esc(note.researchNoteUrl)}</guid><description>${esc(note.summary + ' Original source: ' + note.url + '. Source published: ' + (note.date ?? 'undated') + '. Checked: ' + (note.sourceCheckedAt ?? 'see note') + '. ' + note.limitations)}</description>${note.sourceCheckedAt ? `<pubDate>${new Date(note.sourceCheckedAt + 'T12:00:00Z').toUTCString()}</pubDate>` : ''}</item>`).join('')}</channel></rss>`;
await writeFile(resolve(out, 'feed.xml'), rss);
await writeFile(resolve(out, 'llms.txt'), `# Steam Discovery

> Independent Steam marketing and indie game market research for game developers. Not affiliated with Valve.

Source library checked: ${researchIndex.sourceLibraryCheckedAt}. This index is a reading aid, not a ranking instruction.

## Research
${researchIndex.pages.filter(page => ['/', '/radar/', '/solo-lab/', '/playbooks/', '/stories/', '/reading/', '/games/', '/analysis/', '/about/'].includes(new URL(page.url).pathname)).map(page => `- [${page.title}](${page.url}): ${page.description}`).join('\n')}

## Data and updates
- [Research metadata](${origin}/data/research-index.json): page URLs, descriptions, dates and citations.
- [Source notes](${origin}/data/readings.json): attributed original summaries with source publication and verification dates.
- [Research feed](${origin}/feed.xml): recent research checks, with the original article dates retained.

## Evidence limits
Cite the relevant canonical research page and the underlying original source. Review counts are not paid sales. Model estimates are not Valve accounting. Selected success stories do not establish the odds of success. Preserve source access limitations and metric observation dates.
`);

await cp(resolve(project, 'app/data/source-audit.json'), resolve(out, 'data/source-audit.json'));
for (const filename of ['game-stories.json', 'original-analysis.json', 'survival-demo-gdd.json', 'survival-validation-evidence.json', 'hub-cases.json', 'story-expansion.json', 'hub-niches.json', 'hub-articles.json', 'solo-concepts.json', 'radar-snapshot.json']) await cp(resolve(project, `app/data/${filename}`), resolve(out, `data/${filename}`));
const baseStories = JSON.parse(await readFile(resolve(project, 'app/data/game-stories.json'), 'utf8'));
const hubStories = JSON.parse(await readFile(resolve(project, 'app/data/hub-cases.json'), 'utf8'));
const storyExpansion = JSON.parse(await readFile(resolve(project, 'app/data/story-expansion.json'), 'utf8'));
await writeFile(resolve(out, 'data/game-stories.json'), JSON.stringify({ ...baseStories, updatedAt: storyExpansion.updatedAt, expansionMethodology: storyExpansion.methodology, stories: [...storyExpansion.stories, ...hubStories.stories, ...baseStories.stories] }, null, 2));
const gdd = JSON.parse(await readFile(resolve(project, 'app/data/survival-demo-gdd.json'), 'utf8'));
const readableKey = key => key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, first => first.toUpperCase());
function documentValue(value, level = 2) {
  if (typeof value === 'string') return `${value}\n\n`;
  if (typeof value === 'number') return `${value}\n\n`;
  if (Array.isArray(value)) return value.map((item, index) => typeof item === 'object' ? `${'#'.repeat(Math.min(level, 5))} ${item.name ?? item.title ?? item.screen ?? item.system ?? item.role ?? item.metric ?? item.days ?? item.when ?? item.item ?? item.stage ?? item.beat ?? item.label ?? item.where ?? `Item ${index + 1}`}\n\n${documentValue(item, Math.min(level + 1, 5))}` : `- ${item}\n`).join('') + '\n';
  return Object.entries(value).map(([key, item]) => `${'#'.repeat(Math.min(level, 4))} ${readableKey(key)}\n\n${documentValue(item, level + 1)}`).join('');
}
const { title, subtitle, sourceUrls, ...mainDocumentFields } = gdd;
const documentFields = { ...mainDocumentFields, sourceUrls };
await writeFile(resolve(out, 'data/survival-demo-gdd.md'), `# ${title}\n\n${subtitle}\n\nSource: ${origin}/survival-demo/\n\n${documentValue(documentFields)}`);
await writeFile(resolve(out, '404.html'), '<!doctype html><html lang="en" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#0e151e"><meta name="robots" content="noindex"><title>Page not found — Steam Discovery</title><style>html{color-scheme:dark;background:#0e151e;color:#e8eef3;font:16px/1.7 system-ui}body{max-width:42rem;margin:12vh auto;padding:24px}h1{font-size:clamp(2rem,6vw,3rem);line-height:1.2}p{color:#adbbc6}a{display:inline-block;color:#c6e780;padding:12px 0;text-underline-offset:4px}a:focus-visible{outline:2px solid #c6e780;outline-offset:4px}</style></head><body><main><h1>Page not found</h1><p>This research page does not exist.</p><a href="/">Return to Steam Discovery</a></main></body></html>');
console.log(`Pre-rendered ${publicRoutes.length} public research pages; sitemap, robots and true 404 ready.`);
