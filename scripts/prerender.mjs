import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, publicRoutes } from '../.prerender/entry-prerender.js';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(project, 'dist-static');
const template = await readFile(resolve(out, 'index.html'), 'utf8');
const origin = 'https://steam-discovery.vercel.app';
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const json = value => JSON.stringify(value).replace(/</g, '\\u003c');
for (const route of publicRoutes) {
  const canonical = `${origin}${route.path}`;
  const structured = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebSite', '@id': `${origin}/#website`, url: `${origin}/`, name: 'Steam Discovery', inLanguage: 'en', description: 'Independent indie game market research. Not affiliated with Valve.' },
    { '@type': 'WebPage', '@id': `${canonical}#webpage`, url: canonical, name: route.title, description: route.description, inLanguage: 'en', isPartOf: { '@id': `${origin}/#website` }, dateModified: route.modifiedAt ?? '2026-09-02', ...(route.citations ? { citation: route.citations } : {}) },
  ] };
  let html = template.replace(/<title>[^<]*<\/title>/, () => `<title>${esc(route.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*("\s*\/>)/, (_, start, end) => start + esc(route.description) + end)
    .replace(/(<meta (?:property|name)="(?:og|twitter):title" content=")[^"]*("\s*\/>)/g, (_, start, end) => start + esc(route.title) + end)
    .replace(/(<meta (?:property|name)="(?:og|twitter):description" content=")[^"]*("\s*\/>)/g, (_, start, end) => start + esc(route.description) + end)
    .replace(/(<link rel="canonical" href=")[^"]*("\s*\/>)/, `$1${canonical}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*("\s*\/>)/, `$1${canonical}$2`)
    .replace('</head>', `<script type="application/ld+json">${json(structured)}</script>\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${render(route.initial)}</div>\n<script type="application/json" id="research-route">${json(route.initial)}</script>`);
  if (route.image) html = html.replace(/(<meta (?:property|name)="(?:og|twitter):image" content=")[^"]*("\s*\/>)/g, (_, start, end) => start + esc(route.image) + end)
    .replace('property="og:image:width" content="1200"', `property="og:image:width" content="${route.imageWidth ?? 460}"`).replace('property="og:image:height" content="630"', `property="og:image:height" content="${route.imageHeight ?? 215}"`);
  const target = resolve(out, `.${route.path}`, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicRoutes.map(route => `\n  <url><loc>${esc(origin + route.path)}</loc><lastmod>${route.modifiedAt ?? '2026-09-02'}</lastmod></url>`).join('')}\n</urlset>\n`;
await writeFile(resolve(out, 'sitemap.xml'), sitemap);
await writeFile(resolve(out, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
await mkdir(resolve(out, 'data'), { recursive: true });
await cp(resolve(project, 'app/data/source-audit.json'), resolve(out, 'data/source-audit.json'));
for (const filename of ['game-stories.json', 'original-analysis.json', 'survival-demo-gdd.json', 'survival-validation-evidence.json']) await cp(resolve(project, `app/data/${filename}`), resolve(out, `data/${filename}`));
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
await writeFile(resolve(out, '404.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>Page not found — Steam Discovery</title></head><body><h1>Page not found</h1><p>This research page does not exist.</p><a href="/">Return to Steam Discovery</a></body></html>');
console.log(`Pre-rendered ${publicRoutes.length} public research pages; sitemap, robots and true 404 ready.`);
