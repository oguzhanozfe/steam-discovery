import { cp, mkdir, writeFile } from 'node:fs/promises';
import { publicRoutes } from '../.prerender/entry-prerender.js';

// Only the public static build is staged. Never upload the project or .env files.
await mkdir('.vercel/output/static', { recursive: true });
await cp('dist-static', '.vercel/output/static', { recursive: true });
const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const routes = [
  { src: '/(.*)', headers: { 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'SAMEORIGIN' }, continue: true },
  { src: '^/index\\.html$', status: 308, headers: { Location: '/' } },
  ...publicRoutes.flatMap(route => [
    ...(route.path === '/' ? [] : [
      { src: `^${escapeRegex(route.path.slice(0, -1))}$`, status: 308, headers: { Location: route.path } },
      { src: `^${escapeRegex(route.path)}index\\.html$`, status: 308, headers: { Location: route.path } },
    ]),
    { src: `^${escapeRegex(route.path)}$`, dest: `${route.path}index.html` },
  ]),
  { handle: 'filesystem' },
  { src: '/.*', status: 404, dest: '/404.html' },
];
await writeFile('.vercel/output/config.json', JSON.stringify({ version: 3, routes }, null, 2));
console.log(`Staged ${publicRoutes.length} routes with redirects, security headers and a true 404.`);
