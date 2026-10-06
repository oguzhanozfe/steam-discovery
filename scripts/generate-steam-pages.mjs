import {
  readFile,
  writeFile,
  mkdir,
  readdir,
  appendFile,
} from 'node:fs/promises';

// Static, non-hydrated pages for every catalog game (/steam/<appId>/), every
// well-populated tag (/steam/tags/<slug>/) and a directory (/steam/). They are
// generated from committed data, so they never grow the client bundle.
const root = new URL('../', import.meta.url);
const origin = 'https://steam-discovery.vercel.app';
const out = new URL('dist-static/', root);
const read = async (path, fallback) => {
  try {
    return JSON.parse(await readFile(new URL(path, root), 'utf8'));
  } catch (error) {
    if (fallback !== undefined && error.code === 'ENOENT') return fallback;
    throw error;
  }
};
const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ],
  );
const jsonLd = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
const num = (value) =>
  value == null ? 'Unknown' : Math.round(value).toLocaleString('en-US');
const usd = (value) =>
  value == null
    ? 'Unknown'
    : value === 0
      ? 'Free'
      : `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const money = (value) =>
  value >= 1e6
    ? `$${(value / 1e6).toFixed(value >= 1e7 ? 0 : 1)}M`
    : value >= 1e3
      ? `$${Math.round(value / 1e3)}K`
      : `$${Math.round(value)}`;
const compact = (value) =>
  value >= 1e6
    ? `${+(value / 1e6).toFixed(1)}M`
    : value >= 1e3
      ? `${Math.round(value / 1e3)}K`
      : String(value);
// SteamSpy reports owners as "20,000 .. 50,000".
const owners = (value) => {
  const parts = String(value ?? '')
    .split('..')
    .map((part) => Number(part.replace(/[^0-9]/g, '')));
  return parts.length === 2 && parts.every(Number.isFinite) && parts[1] > 0
    ? `${compact(parts[0])}–${compact(parts[1])}`
    : 'Unknown';
};
const pct = (value) => (value == null ? 'Unknown' : `${Math.round(value)}%`);
const slug = (value) =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const i = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[i] : (sorted[i - 1] + sorted[i]) / 2;
};
const day = (iso) => (iso ? new Date(iso).toISOString().slice(0, 10) : null);

// ---------- Load and merge data ----------
const catalog = await read('public/data/radar-catalog.json');
const details = (await read('data/steam/app-details.json', { apps: {} })).apps;
const images = await read('app/data/game-images.json', {});
const stories = [
  ...(await read('app/data/story-expansion.json')).stories,
  ...(await read('app/data/hub-cases.json')).stories,
  ...(await read('app/data/game-stories.json')).stories,
];
const storyByApp = new Map();
for (const story of stories)
  if (story.appId && !storyByApp.has(String(story.appId)))
    storyByApp.set(String(story.appId), story);

const series = new Map(); // `${appId}:${source}` -> [[date, reviews, positive, ccu, price]]
let historyDays = [];
try {
  historyDays = (await readdir(new URL('data/history/', root)))
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
    .sort();
} catch {}
for (const file of historyDays) {
  const { date, rows } = await read(`data/history/${file}`);
  for (const [appId, source, reviews, positive, ccu, price] of rows) {
    const key = `${appId}:${source}`;
    if (!series.has(key)) series.set(key, []);
    series.get(key).push([date, reviews, positive, ccu, price]);
  }
}

const parseRelease = (value) => {
  if (!value) return null;
  const time = Date.parse(
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : `${value} UTC`,
  );
  return Number.isFinite(time) ? time : null;
};
let dataAsOf = catalog.completedAt;
const games = catalog.games.map((base) => {
  const { spy, store } = details[base.appId] ?? {};
  for (const checked of [spy?.checkedAt, store?.checkedAt])
    if (checked && checked > dataAsOf) dataAsOf = checked;
  const source = base.cohort === 'Curated research' ? 'api' : 'spy';
  const points = series.get(`${base.appId}:${source}`) ?? [];
  const latest = points.at(-1);
  // Reviews: newest dated observation of one consistent definition; June-cohort
  // search counts are shown only as a labelled historical fallback.
  const reviews = latest ? latest[1] : base.reviews;
  const positive = latest ? latest[2] : base.positive;
  const reviewNote = latest
    ? `${source === 'api' ? 'Steam appreviews API (all languages, all purchase types, off-topic filtered)' : 'SteamSpy positive + negative (provider cache)'}, checked ${latest[0]}`
    : base.reviews != null
      ? `${base.reviewDefinition}, checked ${day(base.checkedAt)}`
      : null;
  let velocity = null;
  if (points.length >= 2) {
    const [lastDate, lastReviews] = latest;
    const target = Date.parse(lastDate) - 30 * 86400000;
    const earlier =
      [...points].reverse().find(([date]) => Date.parse(date) <= target) ??
      points[0];
    const days = (Date.parse(lastDate) - Date.parse(earlier[0])) / 86400000;
    if (days >= 3)
      velocity = {
        delta: lastReviews - earlier[1],
        days,
        from: earlier[0],
        to: lastDate,
        perDay: (lastReviews - earlier[1]) / days,
      };
  }
  const tags = spy?.tags?.length
    ? spy.tags.map(([name]) => name)
    : (base.tags ?? []);
  const releaseDate = store?.releaseDate || base.releaseDate || null;
  const price =
    store && !store.unavailable
      ? store.priceUsd
      : (spy?.priceUsd ?? base.priceUsd ?? null);
  const status = store?.comingSoon
    ? 'Upcoming'
    : store?.unavailable
      ? 'Store page unavailable'
      : base.status;
  return {
    appId: base.appId,
    slug: slug(store?.name || base.title) || base.appId,
    title: store?.name || base.title,
    developer:
      store?.developers?.join(', ') || spy?.developer || base.developer || null,
    publisher:
      store?.publishers?.join(', ') || spy?.publisher || base.publisher || null,
    tags,
    genres: store?.genres ?? [],
    categories: store?.categories ?? [],
    languages: spy?.languages ?? null,
    releaseDate,
    releaseTime: parseRelease(releaseDate),
    status,
    price,
    free: Boolean(store?.isFree) || price === 0,
    reviews,
    positiveRate:
      reviews && positive != null ? (positive / reviews) * 100 : null,
    reviewNote,
    points,
    velocity,
    owners: spy?.owners ?? base.owners ?? null,
    ccu: spy?.ccu ?? base.ccu ?? null,
    description: store?.shortDescription ?? null,
    image:
      store?.headerImage ?? base.headerImage ?? images[base.appId]?.url ?? null,
    cohort: base.cohort,
    steamUrl: `https://store.steampowered.com/app/${base.appId}/`,
    story: storyByApp.get(base.appId) ?? null,
    spyChecked: day(spy?.checkedAt),
    storeChecked: day(store?.checkedAt),
  };
});
dataAsOf = day(dataAsOf);
const indexable = (game) =>
  game.reviews != null &&
  game.reviews >= 10 &&
  (game.tags.length >= 3 || Boolean(game.description));
const gamePath = (game) => `/steam/${game.appId}/`;

// Tag index uses each game's ten most-voted tags so incidental tags do not dominate.
const tagGames = new Map();
for (const game of games)
  for (const tag of game.tags.slice(0, 10)) {
    if (!tagGames.has(tag)) tagGames.set(tag, []);
    tagGames.get(tag).push(game);
  }
const MIN_TAG_GAMES = 8;
const usedSlugs = new Set();
const tagPages = [...tagGames.entries()]
  .filter(([, list]) => list.length >= MIN_TAG_GAMES)
  .sort((a, b) => b[1].length - a[1].length)
  .map(([tag, list]) => {
    let value = slug(tag) || 'tag';
    while (usedSlugs.has(value)) value += '-2';
    usedSlugs.add(value);
    return { tag, slug: value, games: list };
  });
const tagSlug = new Map(tagPages.map((page) => [page.tag, page.slug]));
const tagLink = (tag) =>
  tagSlug.has(tag)
    ? `<a class="chip" href="/steam/tags/${tagSlug.get(tag)}/">${esc(tag)}</a>`
    : `<span class="chip">${esc(tag)}</span>`;

// ---------- Shared presentation ----------
const css = `:root{color-scheme:dark;--bg:#0d1117;--card:#151b23;--raised:#1c2128;--accent-bg:#16263b;--border:#3d444d;--fg:#f0f6fc;--fg2:#d1d9e0;--muted:#b6c2cf;--link:#79c0ff;--link-hover:#b6e3ff;--green:#7ee787;--amber:#f2cc60;--amber-border:#9e6a03}
*{box-sizing:border-box}html{background:var(--bg)}body{margin:0;background:var(--bg);color:var(--fg);font:1.0625rem/1.7 system-ui,-apple-system,"Segoe UI",sans-serif}
a{color:var(--link);text-underline-offset:4px}a:hover{color:var(--link-hover)}a:focus-visible,[tabindex]:focus-visible{outline:3px solid var(--link);outline-offset:3px}
header.site,footer.site{border-bottom:1px solid var(--border);padding:14px 16px}footer.site{border-top:1px solid var(--border);border-bottom:0;color:var(--muted);font-size:.875rem;margin-top:48px}
.wrap{max-width:1180px;margin:0 auto}nav.site{display:flex;flex-wrap:wrap;gap:6px 20px;align-items:center}nav.site strong a{color:var(--fg);text-decoration:none;font-size:1.125rem}
main{max-width:1180px;margin:0 auto;padding:24px 16px}h1{font-size:clamp(1.9rem,4vw,2.75rem);line-height:1.15;letter-spacing:-.03em;margin:8px 0 12px}h2{font-size:1.5rem;line-height:1.25;margin:40px 0 14px}h3{font-size:1.1875rem;margin:0 0 8px}
p{margin:0 0 16px;max-width:68ch}.lead{color:var(--fg2);font-size:1.125rem}.muted,.note{color:var(--muted);font-size:.9375rem}
.crumbs{font-size:.9375rem;color:var(--muted)}.crumbs a{color:var(--muted)}
.hero{display:grid;grid-template-columns:minmax(0,460px) minmax(0,1fr);gap:28px;align-items:start}.hero img{width:100%;height:auto;border-radius:8px;border:1px solid var(--border);background:var(--card)}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:24px 0}.stat{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:14px 16px}.stat b{display:block;font-size:1.5rem;line-height:1.3}.stat span{color:var(--muted);font-size:.875rem}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.chip{display:inline-block;padding:4px 10px;border-radius:999px;background:var(--accent-bg);border:1px solid var(--border);color:var(--fg2);font-size:.875rem;text-decoration:none}a.chip:hover{border-color:var(--link);color:var(--fg)}
.panel{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:20px 22px;margin:16px 0}.caution{border-left:3px solid var(--amber-border);background:var(--raised);color:var(--amber);padding:12px 14px;font-size:.9375rem;border-radius:0 8px 8px 0;max-width:none}
.pos{color:var(--green)}.table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:10px;margin:12px 0}table{border-collapse:collapse;width:100%;font-size:.9375rem}th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);vertical-align:top}th{background:var(--accent-bg);color:var(--fg2);font-size:.8125rem;text-transform:uppercase;letter-spacing:.02em;white-space:nowrap}td.n,th.n{text-align:right;white-space:nowrap}tr:last-child td{border-bottom:0}
dl.facts{display:grid;grid-template-columns:max-content 1fr;gap:8px 18px;margin:0}dl.facts dt{color:var(--muted);font-size:.9375rem}dl.facts dd{margin:0}
svg.spark{width:100%;max-width:640px;height:auto;display:block}svg.spark text{fill:var(--muted);font-size:12px}
.grid2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
@media (max-width:760px){.hero,.grid2{grid-template-columns:1fr}dl.facts{grid-template-columns:1fr}dl.facts dt{margin-top:8px}}`;
const layout = ({
  path,
  title,
  description,
  body,
  noindex = false,
  image,
  structured,
}) => `<!doctype html>
<html lang="en" class="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="dark"><meta name="theme-color" content="#0d1117">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${origin}${path}"><meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large'}">
<meta property="og:site_name" content="Steam Discovery"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${origin}${path}"><meta property="og:image" content="${esc(image ?? `${origin}/og.png`)}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="alternate" type="application/rss+xml" title="Steam Discovery research notes" href="${origin}/feed.xml">
${structured ? `<script type="application/ld+json">${jsonLd(structured)}</script>` : ''}<link rel="stylesheet" href="/steam/steam.css"></head>
<body><header class="site"><nav class="site wrap" aria-label="Site"><strong><a href="/">Steam Discovery</a></strong><a href="/steam/">Steam games &amp; tags</a><a href="/radar/">Radar</a><a href="/case-studies/">Case studies</a><a href="/playbooks/">Playbooks</a><a href="/about/">Methodology</a></nav></header>
<main>${body}</main>
<footer class="site"><div class="wrap"><p>Steam Discovery is independent and not affiliated with Valve. Game names and store artwork belong to their rights holders. Data is refreshed from public Steam and SteamSpy endpoints; reviews are not sales and SteamSpy owners are estimates. <a href="/about/">Methodology and sources</a>.</p></div></footer></body></html>
`;
const table = (label, headers, rows) =>
  `<div class="table-wrap" role="region" aria-label="${esc(label)}" tabindex="0"><table><thead><tr>${headers.map(([text, cls]) => `<th scope="col"${cls ? ` class="${cls}"` : ''}>${text}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
const gameRow = (game, extra = []) =>
  `<tr><td><a href="${gamePath(game)}">${esc(game.title)}</a>${game.developer ? `<br><span class="muted">${esc(game.developer)}</span>` : ''}</td><td class="n">${num(game.reviews)}</td><td class="n">${pct(game.positiveRate)}</td><td class="n">${usd(game.price)}</td><td>${esc(game.releaseDate ?? 'Unknown')}</td>${extra.map((cell) => `<td class="n">${cell}</td>`).join('')}</tr>`;
const gameHeaders = (extra = []) => [
  ['Game'],
  ['Reviews', 'n'],
  ['Positive', 'n'],
  ['Base price', 'n'],
  ['Release'],
  ...extra.map((text) => [text, 'n']),
];
const sparkline = (points) => {
  if (points.length < 2) return '';
  const w = 640,
    h = 140,
    pad = 28;
  const xs = points.map(([date]) => Date.parse(date)),
    ys = points.map((point) => point[1]);
  const [x0, x1] = [Math.min(...xs), Math.max(...xs)],
    [y0, y1] = [Math.min(...ys), Math.max(...ys)];
  const sx = (x) => pad + ((x - x0) / Math.max(1, x1 - x0)) * (w - pad * 2);
  const sy = (y) => h - pad - ((y - y0) / Math.max(1, y1 - y0)) * (h - pad * 2);
  const line = points
    .map(
      ([date, reviews]) =>
        `${sx(Date.parse(date)).toFixed(1)},${sy(reviews).toFixed(1)}`,
    )
    .join(' ');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" role="img" aria-label="Total reviews from ${num(y0)} on ${points[0][0]} to ${num(ys.at(-1))} on ${points.at(-1)[0]}"><line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#3d444d"/><polyline fill="none" stroke="#79c0ff" stroke-width="2.5" points="${line}"/><text x="${pad}" y="${h - 8}">${points[0][0]}</text><text x="${w - pad}" y="${h - 8}" text-anchor="end">${points.at(-1)[0]}</text><text x="${pad}" y="16">${num(y1)} reviews</text></svg>`;
};
const revenue = (game) =>
  game.free || !game.price || !game.reviews
    ? null
    : {
        low: game.reviews * 20 * game.price * 0.4,
        high: game.reviews * 60 * game.price * 0.8,
        unitsLow: game.reviews * 20,
        unitsHigh: game.reviews * 60,
      };

// Comparables: weighted overlap of the ten strongest tags, ranked tags counting more.
const comparables = (game) => {
  const mine = game.tags.slice(0, 10);
  if (mine.length < 2) return [];
  const weight = new Map(mine.map((tag, i) => [tag, 10 - i]));
  const scores = new Map();
  for (const tag of mine.slice(0, 5))
    for (const other of tagGames.get(tag) ?? []) {
      if (other.appId === game.appId || scores.has(other.appId)) continue;
      const theirs = other.tags.slice(0, 10);
      const score = theirs.reduce(
        (sum, t, i) => sum + (weight.get(t) ?? 0) * (10 - i),
        0,
      );
      scores.set(other.appId, { other, score });
    }
  return [...scores.values()]
    .filter(({ other }) => other.reviews != null)
    .sort(
      (a, b) =>
        b.score - a.score || (b.other.reviews ?? 0) - (a.other.reviews ?? 0),
    )
    .slice(0, 8)
    .map(({ other }) => other);
};

await mkdir(new URL('steam/', out), { recursive: true });
await writeFile(new URL('steam/steam.css', out), css + '\n');

// ---------- Game pages ----------
const sitemap = [];
let gameCount = 0,
  indexedGames = 0;
for (const game of games) {
  const path = gamePath(game);
  const noindex = !indexable(game);
  const rev = revenue(game);
  const comps = comparables(game);
  const v = game.velocity;
  const description =
    `${game.title} Steam stats: ${game.reviews != null ? `${num(game.reviews)} reviews${game.positiveRate != null ? `, ${pct(game.positiveRate)} positive` : ''}` : 'review data pending'}${game.price != null ? `, ${usd(game.price)}` : ''}${game.tags.length ? `. ${game.tags.slice(0, 3).join(', ')}` : ''}. Revenue scenario, review trend and comparable games for indie developers.`.slice(
      0,
      240,
    );
  const body = `<p class="crumbs"><a href="/steam/">Steam games</a>${game.tags[0] && tagSlug.has(game.tags[0]) ? ` / <a href="/steam/tags/${tagSlug.get(game.tags[0])}/">${esc(game.tags[0])}</a>` : ''}</p>
<div class="hero">${game.image ? `<img src="${esc(game.image)}" alt="${esc(game.title)} Steam header artwork" width="460" height="215" loading="eager">` : '<div></div>'}<div>
<h1>${esc(game.title)}</h1>
${game.description ? `<p class="lead">&ldquo;${esc(game.description)}&rdquo; <span class="muted">(Steam store description)</span></p>` : ''}
<div class="chips">${game.tags.slice(0, 12).map(tagLink).join('')}</div>
<p><a href="${game.steamUrl}" rel="noopener">Steam store page</a> · <a href="https://steamdb.info/app/${game.appId}/charts/" rel="noopener">SteamDB charts</a> · <a href="https://steamspy.com/app/${game.appId}" rel="noopener">SteamSpy</a>${game.story ? ` · <a href="/case-studies/${esc(game.story.id)}/"><strong>Read our case study</strong></a>` : ''}</p>
</div></div>
<div class="stats">
<div class="stat"><b>${num(game.reviews)}</b><span>Total reviews</span></div>
<div class="stat"><b class="${game.positiveRate >= 80 ? 'pos' : ''}">${pct(game.positiveRate)}</b><span>Positive</span></div>
<div class="stat"><b>${v ? `${v.delta >= 0 ? '+' : ''}${num(v.delta)}` : 'Not yet'}</b><span>${v ? `Reviews in ${Math.round(v.days)} days` : 'Review trend needs two checks'}</span></div>
<div class="stat"><b>${usd(game.price)}</b><span>US base price</span></div>
<div class="stat"><b>${esc(owners(game.owners))}</b><span>SteamSpy owners (estimate)</span></div>
<div class="stat"><b>${num(game.ccu)}</b><span>Peak players yesterday (SteamSpy)</span></div>
</div>
${game.reviewNote ? `<p class="note">Reviews: ${esc(game.reviewNote)}. Reviews are not copies sold.</p>` : '<p class="note">No comparable review count is available yet for this game.</p>'}
${game.points.length >= 2 ? `<h2>Review trend</h2>${sparkline(game.points)}<p class="note">${game.points.length} dated checks of one review definition. ${v ? `${num(v.perDay)} reviews per day between ${v.from} and ${v.to}.` : ''} Changes are observations, not attributed campaign lift.</p>` : ''}
<div class="grid2">
<section class="panel"><h2 style="margin-top:0">Facts</h2><dl class="facts">
<dt>Developer</dt><dd>${esc(game.developer ?? 'Unknown')}</dd><dt>Publisher</dt><dd>${esc(game.publisher ?? 'Unknown')}</dd>
<dt>Release</dt><dd>${esc(game.releaseDate ?? 'Unknown')} · ${esc(game.status)}</dd>
${game.genres.length ? `<dt>Steam genres</dt><dd>${esc(game.genres.join(', '))}</dd>` : ''}
${game.categories.length ? `<dt>Features</dt><dd>${esc(game.categories.slice(0, 8).join(', '))}</dd>` : ''}
${game.languages ? `<dt>Languages</dt><dd>${esc(game.languages.split(',').length)} listed</dd>` : ''}
<dt>Checked</dt><dd>${esc([game.storeChecked && `store ${game.storeChecked}`, game.spyChecked && `SteamSpy ${game.spyChecked}`].filter(Boolean).join(' · ') || `catalog ${dataAsOf}`)}</dd>
</dl></section>
<section class="panel"><h2 style="margin-top:0">Revenue scenario</h2>${rev ? `<p><b style="font-size:1.5rem">${money(rev.low)} – ${money(rev.high)}</b><br><span class="muted">gross, ${num(rev.unitsLow)} – ${num(rev.unitsHigh)} copies</span></p><p class="caution">Sensitivity scenario, not reported sales: total reviews × 20–60 assumed copies per review × current US base price × 40–80% assumed average selling-price factor. Excludes DLC, other stores, refunds and Valve's share. Same bands as our <a href="/indie-fps/">co-op FPS study</a>, which uses Steam-purchase reviews only.</p>` : `<p class="muted">${game.free ? 'Free-to-play: no copies-based scenario.' : 'Needs a known price and review count.'}</p>`}</section>
</div>
${
  comps.length
    ? `<h2>Comparable games</h2><p class="muted">Ranked by overlap of the ten most-voted Steam tags within our catalog, not the whole store.</p>${table(
        `Games comparable to ${game.title}`,
        gameHeaders(),
        comps.map((other) => gameRow(other)),
      )}`
    : ''
}
${game.story ? `<section class="panel"><h2 style="margin-top:0">Case study: ${esc(game.story.headline ?? game.story.title)}</h2><p>${esc(game.story.deck ?? game.story.hook ?? '')}</p><p><a href="/case-studies/${esc(game.story.id)}/">Read the dated marketing timeline and lessons</a></p></section>` : ''}
${noindex ? '<p class="note">This record has too little public data to be indexed yet. It fills in as the daily refresh reaches it.</p>' : ''}`;
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoGame',
        name: game.title,
        url: `${origin}${path}`,
        sameAs: game.steamUrl,
        gamePlatform: 'PC',
        ...(game.image ? { image: game.image } : {}),
        ...(game.developer
          ? { author: { '@type': 'Organization', name: game.developer } }
          : {}),
        ...(game.publisher
          ? { publisher: { '@type': 'Organization', name: game.publisher } }
          : {}),
        ...(game.tags.length ? { genre: game.tags.slice(0, 5) } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Steam games',
            item: `${origin}/steam/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: game.title,
            item: `${origin}${path}`,
          },
        ],
      },
    ],
  };
  const target = new URL(`.${path}`, out);
  await mkdir(target, { recursive: true });
  await writeFile(
    new URL('index.html', target),
    layout({
      path,
      title: `${game.title} Steam Stats, Revenue Estimate & Comparables | Steam Discovery`,
      description,
      body,
      noindex,
      image: game.image,
      structured,
    }),
  );
  gameCount++;
  if (!noindex) {
    indexedGames++;
    sitemap.push([path, game.spyChecked ?? game.storeChecked ?? dataAsOf]);
  }
}

// ---------- Tag pages ----------
const releasedWithin = (game, days) =>
  game.releaseTime &&
  game.releaseTime <= Date.parse(dataAsOf) &&
  Date.parse(dataAsOf) - game.releaseTime <= days * 86400000;
const tagStats = (list) => {
  const known = list.filter((game) => game.reviews != null);
  const paid = list.filter((game) => game.price > 0).map((game) => game.price);
  return {
    count: list.length,
    known: known.length,
    medianReviews: median(known.map((game) => game.reviews)),
    over100: known.length
      ? (known.filter((game) => game.reviews >= 100).length / known.length) *
        100
      : null,
    over1000: known.length
      ? (known.filter((game) => game.reviews >= 1000).length / known.length) *
        100
      : null,
    medianPrice: median(paid),
    recent: list.filter((game) => releasedWithin(game, 365)).length,
  };
};
for (const page of tagPages) {
  const path = `/steam/tags/${page.slug}/`;
  const stats = tagStats(page.games);
  const top = [...page.games]
    .filter((game) => game.reviews != null)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 25);
  const recent = page.games
    .filter((game) => releasedWithin(game, 365) && game.reviews != null)
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 15);
  const movers = page.games
    .filter((game) => game.velocity && game.velocity.delta > 0)
    .sort((a, b) => b.velocity.perDay - a.velocity.perDay)
    .slice(0, 10);
  const years = new Map();
  for (const game of page.games)
    if (game.releaseTime) {
      const year = new Date(game.releaseTime).getUTCFullYear();
      years.set(year, (years.get(year) ?? 0) + 1);
    }
  const yearRows = [...years.entries()].sort((a, b) => b[0] - a[0]).slice(0, 6);
  const related = new Map();
  for (const game of page.games)
    for (const tag of game.tags.slice(0, 10))
      if (tag !== page.tag && tagSlug.has(tag))
        related.set(tag, (related.get(tag) ?? 0) + 1);
  const relatedTags = [...related.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag);
  const description = `${page.tag} games on Steam: ${stats.count} titles in our sample, median ${num(stats.medianReviews)} reviews, ${pct(stats.over1000)} with 1,000+ reviews. Top games, recent releases and comparables for indie developers.`;
  const body = `<p class="crumbs"><a href="/steam/">Steam games</a> / Tags</p>
<h1>${esc(page.tag)} games on Steam</h1>
<p class="lead">How ${esc(page.tag)} games perform in the Steam Discovery catalog: review reach, prices, recent releases and who is growing now.</p>
<div class="stats">
<div class="stat"><b>${num(stats.count)}</b><span>Games in sample</span></div>
<div class="stat"><b>${num(stats.medianReviews)}</b><span>Median reviews (${num(stats.known)} with data)</span></div>
<div class="stat"><b>${pct(stats.over100)}</b><span>Reached 100+ reviews</span></div>
<div class="stat"><b>${pct(stats.over1000)}</b><span>Reached 1,000+ reviews</span></div>
<div class="stat"><b>${usd(stats.medianPrice)}</b><span>Median base price (paid)</span></div>
<div class="stat"><b>${num(stats.recent)}</b><span>Released in last 12 months</span></div>
</div>
<p class="caution">This is our catalog sample (SteamSpy owner-ranked pages, a June 2026 release subset and curated research games), which over-represents successful games. Shares here are not your odds of success and not a Steam-wide census.</p>
<div class="chips"><span class="muted">Related tags:</span> ${relatedTags.map(tagLink).join('')}</div>
${
  movers.length
    ? `<h2>Growing now</h2>${table(
        `Fastest-growing ${page.tag} games`,
        gameHeaders(['Reviews/day']),
        movers.map((game) => gameRow(game, [num(game.velocity.perDay)])),
      )}<p class="note">Review change between two comparable checks of the same definition.</p>`
    : ''
}
${
  recent.length && !top.every((game) => releasedWithin(game, 365))
    ? `<h2>Released in the last 12 months</h2>${table(
        `Recent ${page.tag} releases`,
        gameHeaders(),
        recent.map((game) => gameRow(game)),
      )}`
    : ''
}
<h2>Most-reviewed ${esc(page.tag)} games</h2>${table(
    `Most-reviewed ${page.tag} games`,
    gameHeaders(),
    top.map((game) => gameRow(game)),
  )}
${
  yearRows.length
    ? `<h2>Releases in the sample by year</h2>${table(
        `${page.tag} releases by year`,
        [['Year'], ['Games', 'n']],
        yearRows.map(
          ([year, count]) =>
            `<tr><td>${year}</td><td class="n">${count}</td></tr>`,
        ),
      )}<p class="note">Counts reflect what our sample contains, not total Steam supply.</p>`
    : ''
}`;
  const target = new URL(`.${path}`, out);
  await mkdir(target, { recursive: true });
  await writeFile(
    new URL('index.html', target),
    layout({
      path,
      title: `${page.tag} Games on Steam: Stats, Top Games & Trends | Steam Discovery`,
      description,
      body,
      structured: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${page.tag} games on Steam`,
        url: `${origin}${path}`,
        isPartOf: { '@type': 'WebSite', name: 'Steam Discovery', url: origin },
      },
    }),
  );
  sitemap.push([path, dataAsOf]);
}

// ---------- Directory ----------
const allMovers = games
  .filter((game) => game.velocity && game.velocity.delta > 0)
  .sort((a, b) => b.velocity.perDay - a.velocity.perDay)
  .slice(0, 25);
const tagRows = tagPages
  .map((page) => ({ ...page, stats: tagStats(page.games) }))
  .sort((a, b) => b.stats.count - a.stats.count);
const directoryBody = `<h1>Steam games &amp; tags for indie developers</h1>
<p class="lead">Every game in our catalog has a page with reviews, price, a transparent revenue scenario and comparable games. Tag pages show how a genre performs and who is growing now.</p>
<div class="stats"><div class="stat"><b>${num(gameCount)}</b><span>Game pages</span></div><div class="stat"><b>${num(tagPages.length)}</b><span>Tag pages</span></div><div class="stat"><b>${num(historyDays.length)}</b><span>Days of history</span></div><div class="stat"><b>${esc(dataAsOf)}</b><span>Latest data check</span></div></div>
<p class="note">Data is refreshed daily from public Steam and SteamSpy endpoints. Coverage is a documented sample, not every Steam game. See <a href="/about/">methodology</a>. Search the full catalog in the <a href="/radar/">Radar</a>.</p>
${
  allMovers.length
    ? `<h2>Growing now</h2>${table(
        'Fastest-growing games',
        gameHeaders(['Reviews/day']),
        allMovers.map((game) => gameRow(game, [num(game.velocity.perDay)])),
      )}`
    : '<h2>Growing now</h2><p class="muted">Review growth appears once the daily refresh has two comparable checks.</p>'
}
<h2>Browse by tag</h2>${table(
  'Steam tags',
  [
    ['Tag'],
    ['Games', 'n'],
    ['Median reviews', 'n'],
    ['1,000+ reviews', 'n'],
    ['Median price', 'n'],
  ],
  tagRows.map(
    (row) =>
      `<tr><td><a href="/steam/tags/${row.slug}/">${esc(row.tag)}</a></td><td class="n">${num(row.stats.count)}</td><td class="n">${num(row.stats.medianReviews)}</td><td class="n">${pct(row.stats.over1000)}</td><td class="n">${usd(row.stats.medianPrice)}</td></tr>`,
  ),
)}`;
await writeFile(
  new URL('steam/index.html', out),
  layout({
    path: '/steam/',
    title: 'Steam Games & Tag Stats for Indie Developers | Steam Discovery',
    description: `Steam stats for ${num(gameCount)} games and ${tagPages.length} tags: reviews, growth, prices, revenue scenarios and comparables, refreshed daily for indie developers.`,
    body: directoryBody,
    structured: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Steam games and tags',
      url: `${origin}/steam/`,
    },
  }),
);
sitemap.unshift(['/steam/', dataAsOf]);

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.map(([path, lastmod]) => `\n  <url><loc>${esc(origin + path)}</loc><lastmod>${lastmod}</lastmod></url>`).join('')}\n</urlset>\n`;
await writeFile(new URL('sitemap-steam.xml', out), xml);
const robots = await readFile(new URL('robots.txt', out), 'utf8');
if (!robots.includes('sitemap-steam.xml'))
  await appendFile(
    new URL('robots.txt', out),
    `Sitemap: ${origin}/sitemap-steam.xml\n`,
  );
console.log(
  `Generated ${gameCount} game pages (${indexedGames} indexable), ${tagPages.length} tag pages and /steam/; data as of ${dataAsOf}, ${historyDays.length} history days.`,
);
