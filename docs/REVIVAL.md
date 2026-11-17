# Reviving Steam Discovery

Status: proposal, November 17, 2026. Nothing below has been built yet. Phase 2 starts after the owner picks a direction.

## What is already valuable

The research is good, and it is careful in ways most indie marketing content is not. Every number has a date, a source and an evidence label. Estimates are kept apart from reported sales. Counterexamples and "cannot prove" notes stay next to the success stories. Every count below was taken from `app/data/` on November 17, 2026.

| Asset | Where | Size | Why a developer cares |
| --- | --- | --- | --- |
| Source notes with a lesson and limits | `newsletters.json`, `reading-expansion.json`, `reading-updates.json` | 57 notes. Each has `actionableLesson` and `limitations`. There are 76 dated `applicationSteps` in total. | They condense HTMAG, GameDiscoverCo, How To Market A Game, Game Marketing Insights and similar sources into "what to do" plus "what this does not prove". |
| Game stories | `game-stories.json`, `hub-cases.json`, `story-expansion.json` | 60 stories, 211 dated timeline events and 129 KPIs. 21 of those KPIs concern wishlists (18 games). | Shows what a campaign looked like over time (announce, demo, festival, launch) with sourced outcomes. Each story also has a `buildTransfer` field: what a small team could borrow and what it should cut. |
| Playbooks | `hub-articles.json` | 10 playbooks with 40 checklist items (separate solo and 2–5-person lists) and a `cannotProve` line each. | Already shaped as actionable checklists. |
| Market context | `market-q1.json`, `market-q2.json`, `survival-research.json` | For example, Q1 2026 had 5,971 releases, and 96 of them (1.61%) reached 1,000+ reviews (HTMAG count). | Base rates that temper the success stories. |
| Co-op FPS study | `fps-market.json`, `fps-model.ts` | 94 games (69 in the study, 25 for context) with a disclosed revenue scenario formula. | The only genre with a full, comparable cohort. |
| Steam Radar | `public/data/radar-catalog.json` | 5,197 apps (SteamSpy/Steam observations) | Lets a developer look up comparable games. |
| Definition corrections | for example `impress-steam-benchmarks-definition-check` | | One example: the "0.2 median" figure is first-week units divided by prelaunch wishlists. It is not a 20% wishlist conversion rate. Corrections like this protect developers from bad planning maths. |

## Why it does not land today

- **It reads like an archive, not a tool.** The navigation has 12+ sibling sections (Dev Hub, Indie FPS, Radar, Solo Lab, Stories, Reading, Benchmarks, Survival, Campaign timelines, Build Lab, Sprint Plan, About). The same games appear in several files. For example, Balatro, Lethal Company and Buckshot Roulette are each in two case files. A developer with a question ("should I do Next Fest with a 2k-wishlist page?") has to read across five pages to answer it.
- **The answers are in the data, but the data is not queryable.** Evidence labels are free text, with 57 distinct strings on KPIs alone. Timeline `channel` values are free text too. Wishlist and sales figures sit inside `hardData` sentences rather than typed fields.
- **The live site is stale.** The production export still reports September 28. Ten notes prepared in October were never deployed because the audit gate blocked publication (`docs/maintenance/`). That gate was cleared on November 17: `pnpm audit` now reports 0 advisories. Deployment is still manual (`vercel deploy --prebuilt --prod`).

## Three directions

### A. Tactic Deck: searchable cards from the research (recommended)

One card per tactic, for example "Ship the demo weeks before Next Fest", "Run a closed playtest to grow wishlists" or "Price below the genre median at launch". Each card holds:

- what was done, by whom and when;
- the outcome, quoted from the source record with its evidence label;
- a counterexample where one exists;
- what the source cannot prove;
- links to the original sources.

Filters are stage (no page yet, page live, demo, festival, launch, post-launch), team size, channel and evidence strength.

- **Who it serves:** a solo developer or 2–5-person team deciding what to do this month.
- **What it reuses:** 57 lessons with limitations, 76 application steps, 40 checklist items, 211 timeline events, 60 build transfers and 2 counter-cases. Cards link to existing records by id, so every number stays in its original record with its source.
- **Effort:** 1–2 weeks (scope below). It stays fully static: no backend, no API keys, no running cost.
- **Why it would delight rather than be another blog:**
  - It answers "what should I do at my stage?" in one screen.
  - Every card shows its receipts and its counterexample, which marketing advice almost never does.
  - "Add to my plan" builds a personal launch checklist that is ordered by stage, stored locally and exportable as Markdown.
  - New cards each week become the "what worked" feed through the existing RSS.

### B. Launch Reality Check: an interactive "will my game sell?" calculator

The developer enters a genre, price, wishlists at launch, and whether they plan a demo or Next Fest. The site does not answer with a prediction. It answers with "where you sit among documented launches":

- your wishlists against the 18 games with a sourced wishlist KPI;
- the Q1 2026 review-bucket base rate;
- the Next Fest cohort figures from Game Marketing Insights (e.g. 1,241 of 4,175 games under 100 estimated wishlists; follower × 12 proxy);
- a revenue range that uses the same disclosed scenario formula as `fps-model.ts` (reviews × 20–60 × price × 40–80%), labelled as an assumption.

- **Who it serves:** developers 3–12 months from launch, and the publishers and investors they pitch to.
- **What it reuses:** `fps-model.ts`, `market-q1.json`, the wishlist KPIs, and the Next Fest notes.
- **Effort:** 2–3 weeks. The inputs it needs (wishlist and sales ratios) are scattered across `hardData` text. They would have to be retyped into structured fields, and each value checked against its source. Most of that time goes into data cleanup and wording reviews, not UI.
- **Why it would delight:**
  - It is the most shareable option ("my plan vs 18 real launches").
  - A reverse mode ("what would $50k gross imply in reviews?") teaches the maths.
- **Risk:** this is the easiest option to misuse. `CONTENT_MAINTENANCE.md` says a successful case is not a success probability, and that model revenue is not audited revenue. The tool would need hard guardrails (ranges only, a visible sample size, definition warnings) or it would contradict the site's own method. It is better built on top of A's structured data.

### C. Ask the Library: an assistant that answers only from the research

A chat box that retrieves from the notes, stories and playbooks and answers with inline citations to the site's own pages. If the library does not cover a question, it says so instead of improvising.

- **Who it serves:** developers with a specific question who will not browse.
- **What it reuses:** all editorial JSON. `llms.txt` and the research index already exist.
- **Effort:** 2+ weeks. It needs a serverless function and a paid model key, because the site is static today. It also needs rate limits, abuse protection and a citation-faithfulness check, plus an ongoing cost and a privacy and consent decision.
- **Why it would delight:** questions like "what happened to co-op games that skipped Next Fest?" get a sourced answer in seconds. It is also the strongest AI-engineering portfolio piece of the three.
- **Risk:** a wrong but confident answer under this brand undoes the site's main asset, which is trust. The retrieval quality also depends on the same normalization A requires.

A **Steam page teardown checklist** fits inside A, as cards for the "page live" stage built from the playbook checklists. A live teardown of any Steam URL would need a backend to fetch store pages, so it is out of scope for now.

## Recommendation: A, Tactic Deck, in 1–2 weeks

A ships something useful with the least risk to the site's credibility, and it adds no running cost. It also produces the structured, evidence-classed data that B and C would need anyway. B becomes a two-to-three-day add-on once cards and KPIs are typed, and C gets clean retrieval units.

### Scope

**Week 1: data and the validator**

1. Add `app/data/tactics.json`. Each card has `id`, `title`, `stage[]`, `teamSize[]`, `channel`, `summary` (editorial, labelled as such), `evidenceRefs[]` (`{file, recordId, field}` pointers into the existing records), `counterRefs[]`, `cannotProve`, `sourceUrls[]` and `checkedAt`.
2. Add `app/data/evidence-classes.json`. It maps the existing free-text labels onto five classes: reported, observed, estimate, editorial inference, proposal. The owner reviews this table once.
3. Draft 30–40 cards from existing records only. Write no new statistics. Numbers on a card are rendered from the referenced record, never retyped.
4. Add `pnpm validate:tactics`. It fails the build if:
   - a reference does not resolve;
   - a card has no source URL or no `cannotProve`;
   - a card's own text contains a number that is not in its referenced records.

**Week 2: interface**

5. Add a `/tactics/` route with a card grid, stage and team-size filters, search, and filter state kept in the URL. Each card gets its own prerendered page for search and sharing, through the existing `site-routes.ts` and `prerender.mjs` pattern.
6. The card back shows the evidence class, source links, the counterexample and "cannot prove".
7. Add "My launch plan": selected cards ordered by stage, kept in `localStorage`, exportable as Markdown. It needs no account and no tracking.
8. Simplify the home page to three entry points: **Tactics**, **Game stories**, **Sources**. The other sections stay reachable but stop competing on the first screen.
9. Add new cards to the existing RSS feed and `llms.txt`.

**Out of scope:** the calculator, the AI assistant, live Steam fetching, analytics, accounts, and any change to existing research records, sources or `RIGHTS.md`.

**Done means:** every `validate:*` script passes, including the new one, and so do both builds and the audit. At least 30 cards are live, and each shows its sources and limits. Five developers are asked to plan their next month with it; their feedback is recorded in an issue.

### Owner decisions before Phase 2

- Which direction: A, B or C. This document recommends A.
- Who deploys, and when. Ten research notes from October and these dependency fixes are still not live.
- Whether `docs/maintenance/` stays. It holds three "publication blocked" logs whose blocker is now resolved. This document does not change those logs or `CONTENT_MAINTENANCE.md`.
