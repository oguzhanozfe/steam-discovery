# Steam Discovery

Independent Steam marketing and indie game market research for game developers.

**[Explore the site](https://steam-discovery.vercel.app/)** · [Source notes](https://steam-discovery.vercel.app/reading/) · [Methodology](https://steam-discovery.vercel.app/about/) · [RSS](https://steam-discovery.vercel.app/feed.xml)

## What is here

- Game case studies with dated marketing events, KPIs and evidence limits.
- A Steam Radar sample with search, release-state/evidence filters, three-game comparison and a browser-local watchlist/export.
- Eight niche briefs and eight original AI-assisted solo concepts, with explicit two-week scope, exclusions, validation gates and release constraints.
- Developer Playbooks: source arguments converted into separate solo and 2–5-person action plans, with counterexamples and uncertainty retained.
- Genre demand and comparable-game research, separating reports, observations and estimates.
- Annotated expert readings with original links, publication dates and access disclosures.
- Original analysis and a secondary project workspace for the demo GDD and delivery tracker.

Steam Discovery is independent and is not affiliated with Valve. Editorial notes are original, AI-assisted summaries. The linked publications and game artwork retain their respective rights; making this repository public does not grant rights to third-party material.

## Run locally

Use Node.js 24 LTS and pnpm 11.19.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

## Build and verify

```sh
pnpm build:vercel
pnpm exec tsc --noEmit
pnpm validate:research
pnpm audit
```

The production build prerenders research pages into `dist-static/`. Every page has a canonical URL, title and description; editorial pages include attributed Article metadata. The build also generates the sitemap, RSS feed, `llms.txt`, research index and source-note JSON. Project GDD and progress pages stay accessible under Project workspace and are excluded from indexing; this is not authentication.

## Sources and contributions

Follow [CONTENT_MAINTENANCE.md](CONTENT_MAINTENANCE.md) to add research. Suggest a source or correction through [Issues](https://github.com/oguzhanozfe/steam-discovery/issues), including the canonical page, original source and date. Do not paste private analytics or credentials into an issue.

The source data lives in `app/data/`. `app/data/reading-updates.json` holds the latest collection of notes and archive checks. Older observations keep their original dates. The Progress board remains in `app/data/progress-tracker.json` and is fetched from the public repository on page load without a token.

## Refreshing the small-team hub

`node scripts/refresh-radar.mjs` manually refreshes public observations. It respects SteamSpy’s one-per-minute bulk request rate, fetches selected owner-ranked pages (0, 5, 20), and checks curated games against Steam store metadata and review endpoints. `--only-new` checks newly added curated IDs without relabeling existing checks as fresh. No API key is required. Public store metadata uses an undocumented endpoint and can change. The script records request failures and leaves unavailable values unknown.

This union is not a complete Steam or indie-only census. The June release subset retains its original September 2 check, SteamSpy records retain their provider definitions, and curated rows use all-language/all-purchase Steam reviews with off-topic filtering. Owners are estimates, not paid sales; a price or review count does not establish revenue. Growth appears only after comparable review queries on two snapshots. Commit snapshots to retain their history.

The curated snapshot is in `app/data/radar-snapshot.json`; the full client-loaded catalog is in `public/data/radar-catalog.json`. The new editorial files are `hub-cases.json`, `story-expansion.json`, `hub-niches.json`, `hub-articles.json` and `solo-concepts.json`. Preserve dates and access limits when editing. `pnpm validate:research` also validates hub filters, unknown values, links, citations, comparables and exported data. Watchlists live only in local browser storage; export them to keep a copy. There is no scheduled refresh or notification service.

## Deploy to the existing host

The existing production host is Vercel at `steam-discovery.vercel.app`. Git auto-deploy is intentionally disabled. Run `vercel build --prod` followed by `vercel deploy --prebuilt --prod` after checks pass, using the existing linked project and authorized account. Never commit local environment files, Vercel credentials or generated builds. `scripts/stage-vercel.mjs` is a legacy static-only helper and must not be used for releases that include `/api/progress`.
