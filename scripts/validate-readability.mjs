import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { publicRoutes } from '../.prerender/entry-prerender.js';

const require = createRequire(import.meta.url);
const postcss = createRequire(require.resolve('@tailwindcss/postcss'))(
  'postcss',
);
const read = (path) => readFile(new URL('../' + path, import.meta.url), 'utf8');
const css = await read('app/globals.css');
const ast = postcss.parse(css);
const tokens = {};
ast.walkRules(':root', (rule) =>
  rule.walkDecls((d) => {
    tokens[d.prop] = d.value;
  }),
);
function value(selector, property) {
  let result;
  ast.walkRules((rule) => {
    if (
      rule.parent.type !== 'root' ||
      !rule.selector
        .split(',')
        .map((s) => s.trim())
        .includes(selector)
    )
      return;
    rule.walkDecls(property, (d) => {
      result = d.value;
    });
  });
  return result?.replace(/var\((--[\w-]+)\)/g, (_, name) => tokens[name]);
}
function luminance(hex) {
  const c = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
function contrast(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
for (const bg of [
  '--background',
  '--card',
  '--surface-raised',
  '--surface-hover',
  '--surface-green',
  '--surface-amber',
]) {
  for (const fg of ['--foreground', '--text-secondary', '--muted-foreground'])
    assert(
      contrast(tokens[fg], tokens[bg]) >= 7,
      `${fg} on ${bg}: readable research text`,
    );
}
assert(contrast(tokens['--accent'], tokens['--accent-foreground']) >= 7);
assert(
  contrast(tokens['--accent'], tokens['--input']) >= 3,
  'Visible chart fill',
);
assert(
  contrast(tokens['--input'], tokens['--card']) >= 3,
  'Visible form border',
);
for (const selector of [
  'body',
  '.hub-view',
  '.editorial-view',
  '.event-card h4',
  '.reading-application>p',
])
  assert.equal(value(selector, 'font-size'), '1.0625rem', selector);
assert.equal(value('.editorial-prose', 'font-size'), '1.125rem');
assert.equal(value('.editorial-prose', 'max-width'), '68ch');
for (const selector of [
  '.hub-sources a',
  '.editorial-citations a',
  '.radar-cell-note',
  '.workspace-note',
])
  assert.equal(value(selector, 'font-size'), '.875rem', selector);
for (const selector of [
  '.radar-table',
  '.quarter-table tbody td',
  '.niche-row strong',
])
  assert.equal(value(selector, 'font-size'), '1rem', selector);
assert.equal(value('.case-title-line strong', 'white-space'), 'normal');
assert.equal(value('.radar-game-title', 'font-size'), '1.125rem');
assert.equal(
  value('.hub-view button', 'font-size'),
  undefined,
  'Do not shrink Radar titles with a more specific control rule',
);
assert.match(
  css,
  /@media \(max-width:760px\)[\s\S]*?\.case-hero-copy \{ position:relative; \}/,
  'Mobile hero text must remain in flow',
);
assert.equal(value('.radar-scroll-region', 'overflow-x'), 'auto');
assert.equal(
  value(".radar-scroll-region>[data-slot='table-container']", 'overflow'),
  'visible',
);
assert.match(css, /@media \(max-width:1100px\)[\s\S]*?\.hub-compare-grid/);
assert.match(
  css,
  /\.radar-pagination \{ align-items:flex-start; flex-wrap:wrap;/,
);

for (const route of publicRoutes) {
  const html = await read('dist-static/' + route.path.slice(1) + 'index.html');
  assert.match(
    html,
    /<html[^>]*class="dark"/,
    'Keep the deployed dark theme: ' + route.path,
  );
  assert(html.includes('rel="stylesheet"'), 'Styles available: ' + route.path);
}
for (const [path, name] of [
  ['market/2025/', '2025 genre demand and supply'],
  ['market/2026-q1/', 'Q1 2026 genre outcomes'],
  ['market/2026-q2/', 'June 2026 tag evidence'],
  ['radar/', 'Steam Radar game results'],
]) {
  const html = await read('dist-static/' + path + 'index.html');
  assert(
    html.includes(
      `role="region" aria-label="${name} — scroll horizontally for all columns"`,
    ),
    path,
  );
  assert(
    /tabindex="0" role="region"/.test(html),
    'Keyboard-scrollable table: ' + path,
  );
}
console.log(
  `Readability validated: scalable text, 68ch prose, 7:1 core text contrast, table reflow and dark theme across ${publicRoutes.length} routes.`,
);
