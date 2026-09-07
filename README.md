# Steam Discovery

Independent Steam marketing and indie game market research for game developers.

**[Explore the site](https://steam-discovery.vercel.app/)** · [Source notes](https://steam-discovery.vercel.app/reading/) · [Methodology](https://steam-discovery.vercel.app/about/) · [RSS](https://steam-discovery.vercel.app/feed.xml)

## What is here

- Game case studies with dated marketing events, KPIs and evidence limits.
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

## Publishing

The existing production host is Vercel at `steam-discovery.vercel.app`. Git auto-deploy is intentionally disabled. Run `vercel build --prod` followed by `vercel deploy --prebuilt --prod` after checks pass, using the existing linked project and authorized account. Never commit local environment files, Vercel credentials or generated builds. `scripts/stage-vercel.mjs` is a legacy static-only helper and must not be used for releases that include `/api/progress`.
