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
- Clearly labeled sponsorship availability spaces, separate from research and citations.

Steam Discovery is independent and is not affiliated with Valve. Editorial notes are original, AI-assisted summaries. The linked publications and game artwork retain their respective rights; making this repository public does not grant rights to third-party material.

## Run locally

The interface defaults to dark mode on every route, independent of the device's theme preference. Body copy uses 17–18px-equivalent rem sizes, evidence labels and source links at least 14px, and form fields 16px. Long prose uses a 68ch maximum line width; dense tables keep readable text and scroll inside keyboard-accessible regions. Use the shared semantic colors and typography tokens in `app/globals.css`; keep charts, evidence labels and lime action buttons distinguishable. Avoid introducing white cards or tiny explanatory text in new research views.

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
pnpm validate:readability
pnpm validate:citations
pnpm validate:public
pnpm audit
```

The production build prerenders research pages into `dist-static/`. Every page has a canonical URL, title and description; editorial pages include attributed Article metadata. The build also generates the sitemap, RSS feed, `llms.txt`, research index and source-note JSON. Only public research is included. Private project plans, task boards, their API and downloads have been removed from the current source and build. Historical Git commits and old deployments are separate retention surfaces; this change does not rewrite them.

## Sources and contributions

Follow [CONTENT_MAINTENANCE.md](CONTENT_MAINTENANCE.md) to add research. Suggest a source or correction through [Issues](https://github.com/oguzhanozfe/steam-discovery/issues), including the canonical page, original source and date. Do not paste private analytics or credentials into an issue.

The source data lives in `app/data/`. `app/data/reading-updates.json` holds the latest collection of notes and archive checks. Older observations keep their original dates. Do not add internal project plans, team assignments or credentials to this public repository or its export payload.

References use the shared `app/source-references.tsx` renderer. Original article metadata, contextual source-use mappings, access limits and editorial contribution appear on the research pages. Targeted fresh checks and public corrections are recorded in `app/data/reference-checks.json`; older metadata is explicitly distinguished from fresh verification. `/about/#attribution` explains the policy. `validate:citations` checks citation coverage and export consistency, not plagiarism or factual truth.

## Advertising

`app/ad-slot.tsx` renders labeled availability notices, not paid campaigns or a connected ad network. Do not fabricate sponsors, publisher IDs or ads.txt entries. Connect a real publisher account only after confirming the provider, disclosures and applicable consent setup. Paid creative must identify the advertiser; paid links must use `rel="sponsored noopener noreferrer"`. Keep ads out of citations, KPI tables and research rankings. See `/about/#advertising` for the public policy and official references.

## Refreshing the small-team hub

`node scripts/refresh-radar.mjs` manually refreshes public observations. It respects SteamSpy’s one-per-minute bulk request rate, fetches selected owner-ranked pages (0, 5, 20), and checks curated games against Steam store metadata and review endpoints. `--only-new` checks newly added curated IDs without relabeling existing checks as fresh. No API key is required. Public store metadata uses an undocumented endpoint and can change. The script records request failures and leaves unavailable values unknown.

This union is not a complete Steam or indie-only census. The June release subset retains its original September 2 check, SteamSpy records retain their provider definitions, and curated rows use all-language/all-purchase Steam reviews with off-topic filtering. Owners are estimates, not paid sales; a price or review count does not establish revenue. Growth appears only after comparable review queries on two snapshots. Commit snapshots to retain their history.

The curated snapshot is in `app/data/radar-snapshot.json`; the full client-loaded catalog is in `public/data/radar-catalog.json`. The new editorial files are `hub-cases.json`, `story-expansion.json`, `hub-niches.json`, `hub-articles.json` and `solo-concepts.json`. Preserve dates and access limits when editing. `pnpm validate:research` also validates hub filters, unknown values, links, citations, comparables and exported data. Watchlists live only in local browser storage; export them to keep a copy. There is no scheduled refresh or notification service.

## Deploy to the existing host

The existing production host is Vercel at `steam-discovery.vercel.app`. Git auto-deploy is intentionally disabled. Run `vercel build --prod` followed by `vercel deploy --prebuilt --prod` after checks pass, using the existing linked project and authorized account. Never commit local environment files, Vercel credentials or generated builds. Use the current validated build; do not deploy stale output directories.
