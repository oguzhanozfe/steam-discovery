# Steam Indie 2026: Decision Report for a Marketable Demo in Three Weeks

**Research cut-off:** September 2, 2026  
**Team assumption:** one 3D artist, two senior developers, one product manager, one marketing manager; 15 full-time workdays  
**Objective:** not a finished game. The target is a playable, recordable vertical slice that can support a Steam page, creator outreach, and short-form validation.

---

## 1. Executive decision

### Recommendation

The best risk-adjusted choice is **Refund Department**. It should compete against **1000 QA Goblins vs One Bug** during the first 48 hours: each senior developer builds one grey-box prototype while product and marketing test silent, ten-second clips. On day three, only the winner continues.

The ranking below is a decision model, not an observed market statistic. Weighting: three-week feasibility 30%, clip potential 25%, demonstrated Steam demand 20%, differentiation 15%, operational risk 10%.

| Rank | Concept | Score / 10 | Why now | Principal risk |
|---:|---|---:|---|---|
| 1 | **Refund Department** | **8.8** | First-person “physically do the job” simulation + anomaly horror + gambling-like risk, all possible in one room | It becomes repetitive if the team cannot produce enough distinct packages and anomalies |
| 2 | **1000 QA Goblins vs One Bug** | **8.3** | Incremental/tower-defense demand plus an exaggerated number that reads instantly in short video; no networking | A naïve crowd implementation destroys performance and schedule |
| 3 | **Group Chat Exorcist** | **7.8** | Horror/narrative demand, current deepfake–bot–scam anxiety, and low systems cost | Weak writing or UI pacing makes it visually inert |
| 4 | **Cryptid Newsroom** | **7.2** | Applies Content Warning’s “play creates content” lesson while replacing video capture with a cheap shareable newspaper artifact | Online co-op and creature behavior remain risky in three weeks |
| 5 | **Don’t Drop the Cake** | **6.6** | Clear physics comedy in the PEAK / RV There Yet? / Chained Together lineage | Networked physics, camera, and control feel are too risky unless foundations already exist |

If the developers already possess a production-tested stack for lobby, relay, reconnect, proximity voice, and networked physics, **Cryptid Newsroom rises to 8.1** and **Don’t Drop the Cake to 7.8**. Without that foundation, online co-op is more likely to consume the demo than to market it.

### What the market says

- Steam is growing, but the bottom of the market is becoming harsher. In SteamDB’s September 2 snapshot, Steam received **18,469 games in 2024**, **21,320 in 2025**, and **17,480 year-to-date in 2026**. The 2025 count was about **15.4%** above 2024. Straight-line annualization of the first 245 days of 2026 produces roughly 26,000 releases, but that is only a crude projection and ignores seasonality. Source: [SteamDB — releases by year](https://steamdb.info/stats/releases/).
- The money pool is also growing. Alinea Analytics, not Valve, estimates **$11.1 billion** in Steam game gross revenue for H1 2026, up **14.5% year over year**. That is not indie revenue and not new-release revenue; it includes the wider catalogue and major games. Source: [Tom’s Hardware summary of the Alinea estimate](https://www.tomshardware.com/video-games/pc-gaming/steam-sales-reportedly-topped-usd11-billion-during-h1-2026-due-to-shifting-trends-staggering-growth-driven-by-influx-of-chinese-players-and-booming-legacy-catalogues).
- Valve said at GDC 2026 that **5,863 games earned more than $100,000 during calendar 2025**. This refers to games across the catalogue earning that amount during the year, not necessarily games released in 2025; it must not be compared directly with a launch-cohort hit rate. Source: [PC Gamer’s report on Valve’s data](https://www.pcgamer.com/gaming-industry/valve-says-over-5000-games-made-over-usd100k-on-steam-last-year/).
- The genre evidence in Section 3 favors simulation, horror, and incremental loops for this team—not because they are safe, but because their audiences buy multiple compact games and their core promises can be shown quickly.

### The correct meaning of “100K–200K organic reach”

Reach is not a native Steam metric. The same number can describe four incompatible outcomes:

1. **Awareness:** views on TikTok, Reels, Shorts, Twitch, or creator videos.
2. **Intent:** store visits, follows, and wishlists.
3. **Trial:** demo unique players, demo median playtime, and demo CCU.
4. **Commercial outcome:** units, revenue, reviews, and paid-game CCU.

For this team and timeframe, the honest validation target is **100K–200K qualified, unpaid aggregate short-form/creator views**, accompanied by measurable downstream intent. A target of 100K–200K wishlists or units is a breakout outcome, not a three-week demo KPI. How Many Dudes?’ event-level results in Section 7 demonstrate why video views and wishlists must be tracked separately. Views alone are not demand proof.

The research tool should classify “organic” into four types:

- **Cold organic:** algorithmic discovery without spend or a pre-existing audience.
- **Borrowed organic:** discovery through a creator’s audience.
- **Owned organic:** an existing studio/community audience. Landfall and Butterscotch had this advantage.
- **Platform organic:** Steam surfaces such as a festival, Popular Upcoming, Personal Calendar, or Trending Free.

Most celebrated cases blend several of these. “We spent no money” is therefore not evidence of cold-organic causality.

---

## 2. Method and evidence standard

### Evidence classes used in this report

| Label | Meaning | Example | Reliability |
|---|---|---|---|
| **Official** | Valve, Steamworks, or a studio’s official press kit | Steam process timing; Content Warning team and claim count | High, although definitions still matter |
| **Developer-reported** | A postmortem, studio blog, or attributable developer post | Wishlists, demo uniques, first-day gross revenue | High–medium; selective reporting and survivorship bias remain |
| **Platform telemetry** | Public Steam/SteamDB observations | CCU, reviews, followers, price, dates | High for the measured field; not equivalent to sales |
| **Third-party estimate** | VG Insights, GameDiscoverCo, Gamalytic, Alinea | Owners, sales, revenue, source mix | Medium; not the private Steam backend |
| **Analyst synthesis** | Cohort/postmortem analysis such as HTMAG | Genre hit rates, festival and momentum analysis | Medium–high; sample and definition matter |
| **Report inference** | A product judgment derived from the evidence | Which concept fits the team | A testable hypothesis, not a market fact |

### Thresholds that must not be mixed

- **HTMAG’s 1,000-review hit rate** uses games released in a given year and Zukowski’s genre assignment. He observes that 1,000 reviews often correlates with $150K+ revenue, but it is not a revenue formula.
- **WeLoveIt/Boxleiter’s $100K hit rate** estimates lifetime revenue from reviews, a multiplier, and price, and associates a game with a tag only when it is one of its six most popular tags. Reported hit rates were sandbox 27.3%, FPS 21.6%, RPG 19.4%, simulation 16.9%, visual novel 16.5%, horror 16.1%, strategy 16.1%, and racing 15.8%. These are estimates, not Valve accounting, and cannot be compared directly with HTMAG’s launch-cohort figures. Source: [PC Gamer’s methodology and results summary](https://www.pcgamer.com/gaming-industry/steam-week-in-review-here-are-the-top-10-most-popular-genres-on-steam/).
- **CCU** means concurrent players, not buyers, total players, or monthly active users.
- **Review count** can be a rough ownership proxy, but price, free claims, region, and genre materially alter the multiplier.
- **Wishlists** signal intent and help certain Steam surfaces; they do not guarantee sales. VGI finds an association between earlier store-page availability and wishlist growth, but it remains observational. Source: [VGI Wishlist Report, July 2025](https://vginsights.com/assets/reports/VGI_Wishlist_Report_July_2025.pdf).

### Survivorship bias

Content Warning, PEAK, R.E.P.O., YAPYAP, and the 2026 “Golden Age” examples are documented because they won. We do not see the hundreds of projects that used similar tactics without breaking through. In addition:

- Landfall, Aggro Crab, and Butterscotch Shenanigans had an existing brand, creator relationships, and production experience.
- “Made by two people” does not mean “made by two inexperienced people.” The Sir, We Have an Orc Problem team brought 10+ years of programming and professional game-development experience.
- A short initial production does not imply short support. Viral multiplayer launches create crash, matchmaking, moderation, and content obligations.

The repeatable element is not the outcome but the **validation sequence**: rough prototype → understandable ten-second funny image → store page → playable test/demo → systems that let creators generate their own stories → measurement → scope lock.

---

## 3. Steam 2026 market baseline

### Supply: more crowded and increasingly bottom-heavy

HTMAG’s April 2 VG Insights sample found **5,971 Q1 releases** and projected 25,799 for the full year, 23.7% above its own 2025 basis. The public chart’s underlying counts give **3,686/5,971 = 61.7% with 0–9 reviews** and **96/5,971 = 1.61% with 1,000+**, a **38.4:1** ratio between these two groups. The page’s static canvas fallback incorrectly says 63.2% for the first group; the chart’s runtime calculation and raw counts support 61.7%. Source: [HTMAG — 2026 Q1 Games](https://howtomarketagame.com/2026/05/14/2026-q1-games/). Annual SteamDB and HTMAG totals differ because cut-off date, release definition, removals/additions, and provider differ; they should not be stitched into one continuous series. Appendix C explains the quarterly genre-data limits.

The actionable signal is the distribution’s shape. A good game silently dropped onto Steam can still vanish. Marketing is therefore not a launch-week department; it is part of product validation from the first prototype.

### Demand: room remains for small, sharp games

HTMAG’s 2025 release cohort had **608 of 20,282 titles reach 1,000 reviews (2.99%)**. The genre results were:

| Genre | 1,000+ review games | 2025 releases | Rate | Meaning for this team |
|---|---:|---:|---:|---|
| Open-world survival craft | 15 | 72 | 20.8% | Strong demand, but incompatible with a three-week scope |
| Farming | 5 | 60 | 8.3% | Relatively strong, but content/system heavy |
| Roguelike deckbuilder | 11 | 212 | 5.1% | Attractive rate, but underuses the 3D artist and comedy-video objective |
| Simulation | 43 | 1,048 | 4.1% | **Strong base for Refund Department** |
| Management | 19 | 549 | 3.4% | A clear job fantasy; first-person physical work is the more current expression |
| Horror | 39 | 1,208 | 3.2% | Crowded but omnivorous and clip-friendly; differentiation is mandatory |
| Idle/incremental | 27 | 965 | 2.79% | **Strong base for QA Goblins**, although supply is rising |
| Tower defense | 9 | 511 | 1.76% | Needs an exaggerated visual/incremental spin rather than generic TD |
| Puzzle | 14 | 4,022 | 0.34% | Avoid positioning primarily as a broad puzzle game |
| 2D platformer | 3 | 1,658 | 0.18% | Poor match for this team and objective |

Source, genre filters, and mistagging caveats: [HTMAG’s 2025 annual analysis](https://howtomarketagame.com/2026/01/27/what-the-hell-happened-in-2025/).

Hybrid labels cannot be multiplied into a probability. The correct use is: choose a loop Steam customers already understand, then add one visually legible, unusually large variable.

### Product patterns visible in Q1 2026

HTMAG’s Q1 review highlights first-person physical-work simulation, idle/incremental, friendslop, horror-adjacent experiences, and gambling-like loops. It also argues that bullet heaven is no longer a quick production win. The report’s inference is to combine an understood task with one visually surprising variable, rather than seek a broad “empty genre.”

Source: [HTMAG — 2026 Q1 Games](https://howtomarketagame.com/2026/05/14/2026-q1-games/).

### Is friendslop saturated?

In HTMAG’s selected basket of 16 friendslop games, combined CCU was roughly **197K** in the Lethal Company era, **281K** around R.E.P.O., and **350K** in the 2026 Meccha Chameleon era. A major new winner typically captured about half of the basket and then faded toward 10% over 3–9 months. Mage Arena’s maximum share was only 11.75%, yet Alinea reported 624K first-week sales and GameDiscoverCo estimated roughly $3.7M net revenue. Source and full caveats: [HTMAG — Is Friendslop saturated?](https://howtomarketagame.com/2026/07/30/is-friendslop-saturated/).

The audience is hungry, but the category is not technically cheap. Networking, lobby, proximity voice, griefing, host migration, crash recovery, and post-launch support are hidden costs. The gap is not “another co-op horror game.” It is a **new social job that fits in one sentence** and produces an automatic end-of-run artifact.

### Festivals and Steam surfaces

In 2026, Zukowski counted 470 third-party Steam festivals featuring 31,285 distinct games. The median participating game appeared in two events, P90 in six, and P95 in ten; cozy, narrative, building, and management were overrepresented. A festival is a distribution surface, not a strategy. Source: [HTMAG — The state of virtual third-party festivals 2026](https://howtomarketagame.com/2026/08/11/the-state-of-virtual-3rd-party-festivals-2026/).

Two early Steam Personal Calendar cases showed roughly 0.81%–1.56% CTR from Popular Upcoming versus about 31%–34% from Personal Calendar, but this is a sample of two and a personalized surface. Using followers × 10 as a rough wishlist proxy, Zukowski estimated early entry points around 8K wishlists at P30, 28K at the median, and 66K at P70. These are analyst proxies, not Valve rules. Source: [HTMAG — How the Steam Personal Calendar affects your launch](https://howtomarketagame.com/2026/06/25/how-the-steam-personal-calendar-affects-your-launch/).

### 2026 commercial comparators: disclosed sales and modeled owners are separate fields

The table below is a **September 2, 2026 decision snapshot**, not a representative genre cohort. It deliberately includes compact single-player games alongside social breakouts and a lower-scale meme game. SteamDB links support the public review/CCU observations and the third-party owner models displayed there; the separate milestone links support developer/publisher statements. Metrics can change intraday. **K = thousand; M = million.**

| Game / product angle | Developer or publisher-reported milestone | VGI owners, estimate | PlayTracker owners, estimate | Gamalytic owners, estimate | SteamDB reviews | All-time peak CCU |
|---|---|---:|---:|---:|---:|---:|
| [Sir, We Have an Orc Problem](https://steamdb.info/app/4594150/charts/) — extreme-count tower defense | [200K copies in 20 days](https://howtomarketagame.com/2026/08/18/the-week-of-the-golden-age/) | 206.1K | 226.0K | 241.5K | 3,769 | 7,684 |
| [Bills Must Be Paid](https://steamdb.info/app/4421010/charts/) — compact financial-pressure sim | [330K copies in 20 days](https://howtomarketagame.com/2026/08/20/part-2-the-week-of-the-golden-age/) | 369.2K | 390.6K | 446.1K | 8,873 | 8,143 |
| [How Many Dudes?](https://steamdb.info/app/3934270/charts/) — absurd-army autobattler | [242K copies by the August 21 case report](https://howtomarketagame.com/2026/08/21/part-3-the-week-of-the-golden-age-how-many-dudes/) | 230.6K | 215.5K | 296.2K | 2,893 | 9,818 |
| [YAPYAP](https://steamdb.info/app/3834090/charts/) — voice/spell co-op comedy | [1M copies in six weeks, confirmed March 18](https://newsletter.gamediscover.co/p/how-yapyap-jammed-its-way-to-1-million) | 1.27M | 1.04M | 1.47M | 9,815 | 14,775 |
| [Super Battle Golf](https://steamdb.info/app/4069520/charts/) — simultaneous golf plus sabotage | [100K copies in 48 hours](https://www.pcgamer.com/games/sports/that-golf-game-with-orbital-death-lasers-sold-100k-copies-in-two-days-we-made-super-battle-golf-together-in-4-5-months-and-are-so-happy/); [1M in just over a month](https://www.gamesradar.com/games/sports/pvp-indie-golf-game-with-93-percent-very-positive-reviews-hits-1-million-copies-sold-on-steam-in-just-over-a-month-so-many-friendships-ended/) | 1.45M | 1.59M | 1.49M | 11,584 | 20,421 |
| [Roadside Research](https://steamdb.info/app/3643170/charts/) — ordinary gas-station work, except you are undercover aliens | [Publisher-reported 300K sales in two weeks](https://www.dlh.net/en/news/88152/roadside-research-surpasses-300k-sales-in-two-weeks.html) | 637.9K | 573.6K | 696.0K | 4,753 | 9,348 |
| [Creature Kitchen](https://steamdb.info/app/3097300/charts/) — creepy-cozy cooking/creature fantasy | No confirmed unit disclosure found | 95.7K | 237.4K | 129.7K | 9,618 | 553 |
| [Horse Magnifier: The Full Horse](https://steamdb.info/app/4585340/charts/) — instantly readable absurdist puzzle joke | No confirmed unit disclosure found | 23.4K | 39.7K | 19.8K | 1,444 | 160 |
| [Waterpark Simulator](https://steamdb.info/app/3293260/charts/) — first-person management plus ragdoll spectacle | No confirmed unit disclosure found; 2026 1.0, but 2025 Early Access | 463.8K | 553.5K | 643.6K | 13,774 | 13,126 |
| [Gamblers Table](https://steamdb.info/app/3618390/charts/) — coin-flip incremental/automation | No confirmed unit disclosure found | 253.2K | 245.1K | 276.5K | 2,853 | 9,309 |
| [RACCOIN](https://steamdb.info/app/3784030/charts/) — coin-pusher roguelike and synergies | [Publisher-reported 100K units within 24 hours](https://www.linkedin.com/posts/wangjintao_raccoin-hit-100k-units-sold-in-less-than-activity-7445078418062385152-_kK1) | 691.4K | 706.2K | 800.6K | 4,613 | 11,626 |

**Cohort caveat:** Waterpark Simulator's 1.0 date is July 31, 2026, but its Early Access date is August 22, 2025. Its cumulative reviews and modeled owners therefore include a longer commercial runway. Similarly, February games have had more selling time than late-July/August games. This table must not be used to rank standardized first-month performance. Source: [Waterpark Simulator release metadata](https://steamdb.info/app/3293260/charts/).

**There is no clean, publicly verified “100K–200K sales generated organically” cohort in this research.** Private impression/source attribution and paid-spend histories are usually unavailable. Developer milestones identify outcomes, not the causal acquisition channel; current owner estimates identify neither exact paid sales nor the date a game crossed a threshold. “Organic-first” is only appropriate where the documented marketing history supports it, and still permits creator, platform, and owned-audience contributions.

Creature Kitchen is the most useful near-band example, but its **95.7K–237.4K provider spread** straddles both requested boundaries. That roughly **2.5× disagreement** is not a statistical confidence interval and should not be averaged into a supposedly exact 154K result. Its public reviews and modest 553 peak CCU also demonstrate why a large review count or low concurrent peak cannot be translated with one universal sales multiplier. The defensible claim is that a sharply differentiated creepy-cozy fantasy has substantial visible interest—not that it verifiably sold a particular number through organic reach. Source: [Creature Kitchen's provider estimates and telemetry](https://steamdb.info/app/3097300/charts/).

Horse Magnifier provides a useful **roughly 20K–40K modeled-owner counterexample**: a highly legible joke and positive reception do not automatically create a 100K+ commercial result. It is a recently released, lower-scale observation, not a proven failure. Its exact paid sales, production cost, and attribution are unknown. Source: [Horse Magnifier's provider estimates and telemetry](https://steamdb.info/app/4585340/charts/).

The actionable pattern is **understood loop + conspicuous spin**: undercover aliens inside shop work; sabotage inside golf; physics spectacle inside management; extreme counts inside defense; a machine/synergy fantasy inside gambling-like play. These cases demonstrate audience response to those combinations, not an empty market. Gamblers Table's approximately 73.9% raw positive reviews are also a warning that an attention-grabbing premise and sizable commercial estimates can coexist with mixed product satisfaction. Source: [Gamblers Table review telemetry](https://steamdb.info/app/3618390/charts/).

The commercial objective for this team is therefore to earn evidence of a viable niche at demo scale. We should not reverse-engineer a guaranteed sales target from a selected set of hits.

---

## 4. HTMAG’s last three months: synthesis of all 11 posts

**Window:** June 2 through September 2, 2026, inclusive. Eleven posts appeared in this interval. The last was August 21; there were no new posts from August 22 through September 2.

| Date | Post | Most useful evidence | Action for this project | Limitation |
|---|---|---|---|---|
| Jun 16 | [June 2026 Steam Next Fest start](https://howtomarketagame.com/2026/06/16/june-2026-steam-next-fest-start/) | The first two festival days are noisy; algorithmic sorting becomes clearer around Wednesday. Starting ads/outreach after the festival begins is too late. | Complete creator outreach and demo testing before the event. | Next Fest behavior does not represent every launch. |
| Jun 25 | [How the Steam Personal Calendar affects your launch](https://howtomarketagame.com/2026/06/25/how-the-steam-personal-calendar-affects-your-launch/) | In two early cases, Calendar exposure corresponded to roughly 300–3,000 wishlists/day; effects appeared about two months before and one month after launch. | Lock a credible date early once the store is ready. | Only two examples; personalization and overlap prevent clean causality. |
| Jun 30 | [Most people will play your demo and not wishlist it and that is ok](https://howtomarketagame.com/2026/06/30/nobody-plays-demos-and-that-is-ok/) | Demo-player-to-wishlist distribution: P30 15.9%, median 19.3%, P70 23.2%; conversion related weakly to overall festival performance. | Use the demo for product proof, creator access, and momentum, not merely direct conversion. | Self-reported Next Fest sample; “unique” definitions can vary. |
| Jul 9 | [You cannot over expose your game](https://howtomarketagame.com/2026/07/09/you-cannot-over-expose-your-game/) | Small indies rarely suffer true overexposure; the larger problem is being less exciting than adjacent content. | Cut many hooks from the same mechanic without fear of “showing too much.” | Does not generalize to spoiler-heavy major IP. |
| Jul 13 | [Did AI slop ruin Steam Next Fest June 2026?](https://howtomarketagame.com/2026/07/13/did-ai-slop-ruin-steam-next-fest-june-2026/) | Despite 4,000+ games, n=119 self-reports showed weak results below a 1K-wishlist base; upper bands did not deteriorate versus February, and recent momentum correlated somewhat more. | Build momentum before the festival instead of blaming catalogue volume. | Small, self-selected sample. |
| Jul 14 | [Games that used momentum for Steam Next Fest success](https://howtomarketagame.com/2026/07/14/games-that-used-momentum-for-steam-next-fest-success/) | 28 of 34 high-base/high-momentum games earned 3K+ festival wishlists, versus 3 of 47 low/low. Spearman correlation: momentum .81, base .76. | Treat the 2–3 weeks before a demo/event as a momentum window. | Correlation is not causation; product quality can drive both. |
| Jul 30 | [Is Friendslop saturated?](https://howtomarketagame.com/2026/07/30/is-friendslop-saturated/) | The audience rotates to new games; leaders take about 50% share and fade toward 10% in 3–9 months. | Bring a fresh social job and shareable result, not generic co-op horror. | Selected 16-game CCU basket; does not measure development cost. |
| Aug 11 | [The state of virtual third-party festivals 2026](https://howtomarketagame.com/2026/08/11/the-state-of-virtual-3rd-party-festivals-2026/) | 470 festivals and 31,285 games; median participating game appeared twice, P90 six times. | Select three events with real theme/tag fit rather than entering everything. | Event impact varies widely. |
| Aug 18 | [The week of the Golden Age](https://howtomarketagame.com/2026/08/18/the-week-of-the-golden-age/) | Sir Orc: raw short video → requested Steam page → playtest → creators → demo → ~150K launch wishlists. | Share rough WIP in week one; accelerate a store/playtest only after demand appears. | A hit selected after the fact, made by experienced developers. |
| Aug 20 | [Part 2: Bills Must Be Paid](https://howtomarketagame.com/2026/08/20/part-2-the-week-of-the-golden-age/) | Only 528 wishlists in the first 65 days; the demo’s Trending Free exposure changed velocity. $200 Reddit ads yielded 19 tracked wishlists. | Validate the playable product before assuming paid acquisition will rescue it. | Demo, Calendar, sale, and Steam surfaces overlapped. |
| Aug 21 | [Part 3: How Many Dudes?](https://howtomarketagame.com/2026/08/21/part-3-the-week-of-the-golden-age-how-many-dudes/) | A jam prototype made streamers laugh in ten seconds; Shorts, demo, creators, Chinese localization, capsule, and Calendar accumulated into 308K launch wishlists. | Repeat one “wow variable” in many clips, then convert with page/demo/capsule. | A 14-year-old studio, seven people, and roughly one year—not three weeks. |

### Shared formula across the 11 posts

**A known Steam loop + a one-line funny fantasy + one visually exaggerated variable + raw short-form content + an early playable demo or playtest.**

The five concepts in this report therefore do not attempt to invent new genres. Each starts with a legible loop and changes one large variable.

---

## 5. The research product: Steam Discovery

A static list of links cannot answer “who marketed what, when, where, and what happened next?” The useful product is a living case database.

### Data model

Store the following fields for every game:

- Identity: title, AppID, developer, team size, prior games/owned audience, engine, production duration.
- Product: price, launch discount, primary tags, one-line hook, core loop, clip moment, networking requirements.
- Steam timeline: store-page launch, release-date lock, playtest/demo, festivals, launch, updates.
- Marketing event: timestamp, channel, format, account/creator, organic type, spend, creative description, source URL.
- Before/after outcomes: views, retention, clicks, store visits, follower/wishlist delta, demo uniques, demo CCU, median playtime, launch units/revenue/reviews/CCU.
- Attribution context: preceding seven-day baseline; 24h/72h/7d windows; concurrent creator/festival/store events; country/language mix.
- Evidence: URL, archived screenshot, source type, publication date, access date, confidence.
- Decision notes: repeatable mechanism, non-repeatable advantage, estimated prototype days, next test.

### Source/tool stack

| Source | Best question it answers | What it cannot answer alone | Cadence |
|---|---|---|---|
| [Steamworks documentation](https://partner.steamgames.com/doc/home) | Rules, review timing, demo/festival eligibility, private wishlist reporting | Competitor sales and creator impact | Every operational decision |
| [SteamDB](https://steamdb.info/) | Release, CCU, reviews/followers, price, patch history | True sales, revenue, wishlists | Daily/weekly snapshots |
| [How To Market A Game](https://howtomarketagame.com/) | Postmortem synthesis, Steam surfaces, genre/festival analysis | Valve backend; the invisible failure population | Weekly reading, monthly synthesis |
| [GameDiscoverCo](https://newsletter.gamediscover.co/) | Source mix, creator/WOM signals, launch estimates | Audited financials | One-month research sprint + newsletter |
| [VG Insights / Sensor Tower](https://vginsights.com/) | Cohort export, owner/revenue estimates, tag comparisons | Exact revenue and organic attribution | Monthly CSV snapshot |
| [Gamalytic](https://gamalytic.com/) | Competitor sales/revenue estimates and filters | Exact Steam backend data | Cross-check VGI or GDCo |
| [Alinea Analytics](https://alineaanalytics.com/) | Market-level and audience estimates | Precise small-game daily attribution | Quarterly / major trends |
| [SteamDB calendar](https://steamdb.info/calendar/) | Release collisions and competing dates | Your own conversion | Weekly |
| Native YouTube/TikTok/Reels analytics | Hold, completion, profile click | Steam wishlists unless links/UTMs connect the chain | 24h and 72h after every asset |
| Twitch/SullyGnome/Streams Charts | Creator broadcast timing/viewership | Causal sales impact | Around creator events |
| Google Trends / TikTok Creative Center | Theme and phrase momentum | Purchase intent | Weekly idea radar |
| [presskit.gg field guides](https://presskit.gg/field-guides/tiktok-indie-game-marketing) | Practical short-form and creator workflows | Competitors’ private funnels | Process template |

Zukowski explicitly recommends buying only one month of GameDiscoverCo, VG Insights, or Gamalytic, exporting the last 2–3 years by tag and estimated revenue, and walking down the ranking until the team finds games it could genuinely make. Source: [Is Friendslop saturated?](https://howtomarketagame.com/2026/07/30/is-friendslop-saturated/).

### Three required product views

1. **Case timeline:** store page, every short/creator beat, demo, festival, launch, and update on one axis, with before/after metrics.
2. **Market pulse:** 90/365-day tag cuts, release count, median reviews, 1,000-review share, estimated revenue bands, team/time, and “could we make this?” flag.
3. **Idea scorecard:** three nearest comps, differentiation, MVP days, technical risk, intended video format, and kill criteria.

### Attribution rule

A marketing event should be stored in a form such as the following **fictional illustration, not an observed case**:

> Aug 12, TikTok, 18 seconds, cold organic, $0. Prior seven-day median: 24 wishlists/day. Next 72h: +312. No festival or creator that day. UTM: 418 visits / 93 wishlists. Likely contribution high; causality not certain.

“The video went viral and the game succeeded” is unusable. The minimum record needs a baseline, a time window, concurrent events, and an explicit unit.

---

## 6. Deep case study: Content Warning

### What is directly known

Landfall’s official press kit says Content Warning was made from February through April 2024 by **five developers**, with most development occurring during a **one-month internal game jam** in Seoul. It launched free for 24 hours on April 1 and became $7.99 the next day. Landfall reports **6.6 million claims** and a **204K all-time peak CCU** on April 2. Future Friends and Popagenda provided additional marketing/PR support. Source: [Landfall’s Content Warning press kit](https://landfall.se/content-warning-press-kit).

The September 2, 2026 SteamDB snapshot shows roughly **163K reviews**, a 92.63% SteamDB rating, and the same 204,439 peak. Claims, paid units, and reviews are different measures. Source: [Content Warning on SteamDB](https://steamdb.info/app/2881650/charts/).

### Core loop

1. Choose equipment in a bright, safe house.
2. Descend into the Old World with friends.
3. Under limited oxygen and camera time, film monsters and friends’ disasters.
4. Bring the camera home; take more risk to improve footage without losing it.
5. Upload to SpöökTube and watch the recording together.
6. Receive views/comments/ad revenue, buy tools, and pursue a larger quota.

The marketing power comes from making “gameplay” and “marketing content” the same event. When a monster appears, the player is not merely asked to escape; the camera operator is rewarded for making the socially wrong decision and keeping a friend in frame.

### Why it worked

- **One-line cultural hook:** “Film monsters and go viral on SpöökTube.” Players and creators understand the job before reading a feature list.
- **Goal conflict:** survival and good footage pull in opposite directions. The system produces blame and stories between friends.
- **Diegetic replay:** everyone watches the same recap after the run, so the funniest event is experienced twice. A developer confirmed that proximity voice near the camera is meant to be heard in playback. Source: [Content Warning developer response](https://steamcommunity.com/app/2881650/discussions/0/4336483797756225851/).
- **Contrast and pacing:** the colorful safe house and monochrome danger zone provide relief, session rhythm, and thumbnail variety.
- **Low price plus free launch shock:** 6.6M claims created instant ownership density within friend groups and enormous creator inventory.
- **Landfall distribution advantage:** the April Fools tradition and prior hits supplied owned attention. This was not a cold-organic zero-audience launch.
- **Creator-role fit:** a content creator played a game about making content; the product and channel were naturally aligned.

### The expensive technical surfaces

Landfall has not publicly documented its internal architecture. The following are feature-implied engineering surfaces, not claims about its exact implementation:

- 1–4-player lobby, host/client state, joins/leaves, and synchronized enemy/player events.
- Live proximity voice plus time-aligned audio for camera playback.
- Per-camera capture, limited recording budget, memory/disk handling, and playback.
- Event tagging to score which monster/action is in frame; this does not require computer vision, but it requires authored scoring data.
- Physics/ragdoll, item ownership, and readable comedy under latency.
- Failure cases around host disconnects, differing frame rates, microphones, and corrupt recordings.

The dangerous lesson for a fresh three-week team is “we should also record video.” The correct lesson is **give the player an end-of-run artifact worth sharing**. Cryptid Newsroom substitutes a single still image and newspaper layout for continuous video and synchronized voice.

### Seven reusable design principles

1. Separate a safe social hub from a short risk expedition.
2. Put the team objective in conflict with an individual comic impulse.
3. Use a scarce resource: time, film, oxygen, grip, or patience.
4. Create a natural role such as camera operator, carrier, or dispatcher.
5. Reunite everyone around the same payoff screen.
6. Make that payoff a shareable file, headline, image, or score.
7. Optimize for “retellable events” per 5–10 minutes, not monster count.

### What not to copy

- The generic “cheap low-poly co-op horror” surface.
- A promise of procedural levels, many monsters, and proximity voice in one month.
- The assumption that a free giveaway alone creates durable demand.
- An analysis that removes Landfall’s brand, creator relationships, and operations from the causal story.

---

## 7. Comparative case studies

### 7.1 R.E.P.O. — object physics creates social roles

After Semiwork spent six years on Voidigo and saw strong reviews but disappointing sales, it approached R.E.P.O. with a “fail quickly” mindset. Source: [PC Gamer’s R.E.P.O. creation interview](https://www.pcgamer.com/games/horror/lets-just-fail-quickly-this-time-semiwork-took-a-big-risk-on-repo-after-its-first-game-took-6-years-to-make-and-didnt-sell-very-well/).

R.E.P.O.’s meaningful spin is not merely horror; players must physically carry valuable, awkward objects together. Fragility, door geometry, weight, and enemies naturally generate “you take the front, I take the back” roles and blame. The September 2 SteamDB snapshot shows **271,571 all-time peak CCU**, roughly **422K reviews**, and a 95.09% SteamDB rating. Owner models range from about 15M to 20M, but those are estimates rather than reported sales. Source: [R.E.P.O. on SteamDB](https://steamdb.info/app/3241660/charts/).

**Primary technical evidence:** Photon’s April 2025 case study says the prototype began as a **single-player cleaning-horror game in Unity** and pivoted toward multiplayer activities that encouraged teamwork—the path toward its shared-carry identity. Semiwork chose **Photon PUN**, following Landfall’s recommendation, and used **Photon Voice**; voice data also drove character animation. The studio reported that smooth client physics took substantial time and customization because PUN did not supply much networked-physics behavior out of the box. Photon’s hosting-region controls and editor playtests helped iteration and scaling. This is a first-party vendor case with direct developer statements, not an independent benchmark; its product recommendations have a commercial incentive. Source: [Photon — R.E.P.O.: Multiplayer Success Powered by Photon](https://blog.photonengine.com/r-e-p-o-multiplayer-success-powered-by-photon/).

The important distinction is that **lobby setup was easy; smooth multiplayer physics was not**. For this team, a “cleaning → shared carry” pivot is a useful design lesson, while “install a networking package and physics is solved” is explicitly contradicted by the case.

The design reason for that pivot is especially relevant: separate cleaning tasks encouraged players to split into different rooms. Awkward, breakable valuables gave them a reason to stand together and coordinate. This is a developer-video account reported by PC Gamer, distinct from the vendor's networking claims. **Choose one shared problem, not four parallel solo chores.** Source: [PC Gamer on Semiwork's cleaning-to-carrying pivot](https://www.pcgamer.com/games/horror/lets-just-fail-quickly-this-time-semiwork-took-a-big-risk-on-repo-after-its-first-game-took-6-years-to-make-and-didnt-sell-very-well/).

**Copy:** a shared physical job that assigns roles without a class-selection screen.  
**Do not copy:** “proximity-chat horror” as the differentiator; the object-handling system and expressive failures are doing much of the work.

### 7.2 PEAK — one goal, legible body comedy, narrow scope

Game Developer reports that three Aggro Crab and four Landfall developers shaped PEAK during a month-long Seoul jam; by month-end the core gameplay was mostly complete. The budget was under $200K. The game was announced and launched within roughly a week, sold 100K units in 24 hours, and two million in nine days. Source: [Game Developer’s PEAK production case](https://www.gamedeveloper.com/production/how-co-op-climbing-hit-peak-achieved-2-million-sales-for-less-than-200-000-).

SteamDB shows a later all-time peak of **170,759 CCU** and roughly **366K reviews**. Source: [PEAK on SteamDB](https://steamdb.info/app/3527290/charts/).

**Copy:** “reach the summit together,” stamina/help systems, and visible falling-body comedy.  
**Non-repeatable advantage:** two experienced studios, seven core jam participants, and existing creator/audience networks.

### 7.3 RV There Yet? — the vehicle becomes the shared boss

A 2026 developer interview says the game began as a one-week prototype made by four people while much of the studio was away and took roughly eight additional weeks to finish. The studio expected about 20K units in a year; it passed two million in eight days. Some team members had worked together for more than a decade, an important hidden variable behind the speed. Source: [GameDev.net’s GamesIndustry.biz summary](https://gamedev.net/news/4042-you-just-look-at-the-number-and-go-what-happened-the-developers-of-rv-there-yet/).

SteamDB records **100,002 all-time peak CCU**, about 84K reviews, and owner estimates ranging from 5.7M to 7.1M. Source: [RV There Yet? on SteamDB](https://steamdb.info/app/3949040/charts/).

**Copy:** every player is attached to the same broken object—the RV—while winch, map, bridge, and driving create natural roles. The name, “dadcore” characters, and smoking gag establish tone immediately.  
**Risk:** networked vehicle/rope physics and launch-scale crash support.

### 7.4 YAPYAP — the image went viral before the loop was final

GameDiscoverCo’s case says Maison Bap, roughly ten people, began in early 2025 targeting a 3–6-month production. An early July 2025 TikTok received **288K likes** while the team still had not fully defined what players did. At the October Next Fest, it ranked third by unique players among 2,900+ demos. It entered its February 3, 2026 launch with roughly **900K wishlists** and confirmed one million copies by March 18. Source: [GameDiscoverCo — How YAPYAP jammed its way to one million](https://newsletter.gamediscover.co/p/how-yapyap-jammed-its-way-to-1-million).

GameDiscoverCo’s source mix over-indexed on short video and word of mouth and under-indexed on traditional media/forums.  
**Copy:** a raw visual fantasy can validate demand before every mechanic is final, and the product can sharpen around that response.  
**Risk:** the final content/retention must fulfill the viral promise; ten people and months of momentum are not equivalent to this project.

### 7.5 Sir, We Have an Orc Problem — the right “one big number”

HTMAG and the developer postmortem describe two experienced developers working for roughly four months. A March pivot led to raw TikToks/Reels/Shorts above 100K views in early April, and viewers asked for a Steam page. The April 9 page produced about 900 day-one wishlists and 3K in two weeks; daily content took 10–15 minutes. The April 30 Steam Playtest reached 200 first-day CCU. One to two weeks later YouTubers helped lift wishlist velocity to roughly 1K/day. The May 2 demo reached 1K CCU on day two and 5K+ wishlists that day; median demo playtime was 1h26m. Next Fest brought 36K players and +18K wishlists. The July 28 launch had roughly 150K wishlists and a 10% discount; the developer reported $361,657 first-day gross and 200K units in 20 days. Sources: [HTMAG’s case synthesis](https://howtomarketagame.com/2026/08/18/the-week-of-the-golden-age/) and [developer postmortem](https://www.reddit.com/r/gamedev/comments/1v9z4vi/we_made_361657_gross_revenue_in_the_first_24/).

A $200 Best Indie Games showcase generated no measurable benefit.  
**Copy:** one visually excessive variable—10K to 100K enemies—inside a familiar tower-defense loop solved the first second of short-form.  
**Do not copy:** the belief that “two people” means a novice team can reproduce it.

### 7.6 Bills Must Be Paid — the demo became the visibility engine

Two developers worked for seven months. The February 14 store page generated 11 day-one wishlists and only 528 over the first 65 days, or 1–7/day. The April 21 demo reached Steam’s Trending Free surface. The developers reported 80K+ uniques, 161 reviews at 92% positive, and 36-minute median playtime; wishlist velocity rose to roughly 384/day and reached 8,952 three weeks later. The game entered June 15 Next Fest with 15,623 wishlists and added about 7K.

$200 in UTM-tracked Reddit ads produced only 19 attributable wishlists—about $10.53 each—and no visible organic lift. Date lock/Calendar periods later increased velocity, but demo, Calendar, Summer Sale, and other Steam surfaces overlapped, so no single event can be credited cleanly. The July 29 launch had 61K+ wishlists, a $6.99 price, and 30% discount; the developer reported $163,842 first-day gross and 330K units in 20 days. Sources: [HTMAG Part 2](https://howtomarketagame.com/2026/08/20/part-2-the-week-of-the-golden-age/) and [developer postmortem](https://www.reddit.com/r/gamedev/comments/1va2gtb/releasing_with_61000_wishlists_2_person_what_we/).

**Copy:** a quiet store-page start is not a death sentence; a watchable, playable demo can change platform behavior.  
**Caveat:** “every demo reaches Trending Free” is not a valid conclusion.

### 7.7 How Many Dudes? — a year-long stack of momentum

HTMAG reports a seven-person team, roughly one year from idea to launch, around ten months of full production, and a studio with 14 years of history. In its July 30–August 3, 2025 GMTK jam, streamers laughed within ten seconds and played roughly 30 minutes. The August 8 Steam page produced 422 wishlists in 14 days. A September 17 Short with 40K views was associated with +293 wishlists; a “horse-sized duck” Short with 113K views with +446.

The December 16 demo launched at 7,624 wishlists. From December 16–25, Shorts at 110K and 400K views, resurfacing older posts, and creator momentum added 10,877 wishlists; the game closed December at 43,324 and January at 150,292. Chinese localization/Douyin contributed a 700K-view signal. April tag repositioning and a May capsule change raised average CTR 40.4%, up to 74% on some placements. Personal Calendar and a coordinated creator embargo overlapped in launch week. At its July 30, 2026 launch it had 308,101 wishlists. The developer reported 67K units in 24 hours, 100K in 50 hours, 242K in 20 days, and recouping cost in five days. Sources: [HTMAG Part 3](https://howtomarketagame.com/2026/08/21/part-3-the-week-of-the-golden-age-how-many-dudes/) and [Butterscotch’s development timeline](https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/).

**Copy:** repeat one strong visual joke in many variants, then compound it with demo, creators, localization, capsule, and Steam surfaces.  
**Do not copy:** attributing 308K wishlists to a single viral clip.

### 7.8 How to Fish — the latest proof that the audience still rotates

Dazed Games’ official site describes a two-founder studio and a 1–4-player co-op game. The team explicitly permits streaming and monetization and says it does not distribute creator keys, reducing impersonation/scam friction. Source: [Dazed Games](https://dazed.games/). GamesRadar reports one million units in two days at a $4.95 launch price and, five days after launch, roughly **374K peak CCU**. Its pitch is radically legible—fish, kill fish, sell fish—with guns, gambling, and trick shots layered onto a familiar social task. Sources: [one million in two days](https://www.gamesradar.com/games/co-op/latest-steam-lottery-winner-how-to-fish-sells-1-million-copies-in-2-days-yes-well-be-adding-more-content/) and [peak CCU report](https://www.gamesradar.com/games/co-op/amid-the-friendslop-renaissance-usd5-co-op-fishing-game-hits-370-000-peak-players-on-steam-in-5-days/).

This is very recent and therefore particularly vulnerable to incomplete long-tail evidence. It does, however, contradict the claim that the social audience stopped buying new compact games in 2026.

### 7.9 GUNTOUCHABLES — free claims are not active demand or paid sales

GUNTOUCHABLES was free to keep for its first 24 hours on August 7, 2025. Its publisher/PR statement reported **more than two million claims**, but SteamDB records an all-time peak of **16,284 concurrent players**. At the September 2, 2026 snapshot it had **4,146 reviews**, with 84.6% positive raw reviews. Sources: [official August 8 giveaway milestone](https://www.mynewsdesk.com/uk/swipe-right/pressreleases/guntouchables-hits-over-2m-downloads-in-the-first-24-hours-3398663) and [SteamDB telemetry](https://steamdb.info/app/2543510/charts/).

The current ownership models are unusually divergent: approximately **117.3K Gamalytic**, **678.2K VG Insights**, and **2.13M PlayTracker**. None should be called paid units; the known giveaway makes that especially misleading. This is a countercase to “copy Content Warning's free-day tactic and get its result,” not proof that GUNTOUCHABLES lost money. Budget, paid-unit revenue, and acquisition mix are not public. It had Ghost Ship Publishing and PR support; “zero marketing” would be wrong. It is also a top-down co-op roguelite, not a controlled same-genre experiment. Never divide peak CCU by free claims and label the result an activation or retention rate: concurrency is not a cohort of unique players.

### 7.10 The Headliners — a relevant competitor does not need megahit CCU

The Headliners launched January 30, 2025 around essentially the same commercial fantasy as part of Cryptid Newsroom: a team of reckless journalists photographing creatures. Its September 2 SteamDB snapshot shows **6,315 all-time peak CCU**, **10,433 reviews**, 86.3% raw positive reviews, and owner estimates of **1.17M PlayTracker / 1.21M Gamalytic / 1.22M VG Insights**. It also recorded a **65,111 Twitch viewer peak**. Source: [The Headliners on SteamDB](https://steamdb.info/app/3059070/charts/).

This is not a failure case. It is a counterexample to two bad shortcuts: “low CCU compared with Content Warning means commercial failure,” and “photographing monsters is an unoccupied niche.” Public data supports a substantial, smaller-scale competitor, but not a clean attribution model. Cryptid Newsroom must therefore distinguish itself through its **editorial/headline artifact and decisions**, not merely its camera or journalist premise. Modeled owners are not verified paid sales, and production cost is unknown.

The design distinction is that a photo-based scoring task does not automatically create Content Warning's temporal setup → panic → punchline → group replay. That is a product hypothesis, not an explanation proven by the CCU difference: price, launch giveaway, brand, creator seeding, timing, and execution are confounders. The official [The Headliners store page](https://store.steampowered.com/app/3059070/The_Headliners/) confirms the dangerous-photography premise; it does not establish which mechanic caused the commercial outcome.

### Shared mechanism across the cases

| Case | Known loop | One large spin | Distribution engine | Non-repeatable advantage |
|---|---|---|---|---|
| Content Warning | Co-op extraction horror | Film danger and become famous in-game | Free launch + built-in replay + creators | Landfall brand, April Fools ritual, experienced team |
| R.E.P.O. | Co-op extraction horror | Physically carry valuables together | Proximity/physics clips + WOM | Accumulated production knowledge from the prior game |
| PEAK | Co-op climbing | Shared stamina/help and comic falling | Short reveal-to-launch + creators | Two studios, seven people, owned audience |
| RV There Yet? | Co-op traversal/vehicle | Entire team rescues one broken RV | Name, dadcore, streamer stories | Long-standing team cohesion and studio infrastructure |
| YAPYAP | Co-op horror | Voice/spell comedy | TikTok + Next Fest + WOM | Roughly ten people and long momentum |
| Sir Orc | Tower defense/incremental | 10K–100K physical enemies | Raw shorts + playtest + demo | Highly experienced pair, four months |
| Bills | Job/finance sim | Compact daily-pressure loop | Trending Free demo + Calendar | Seven months plus stacked Steam surfaces |
| How Many Dudes? | Autobattler/roguelike | Absurd dude army and synergies | Shorts + demo + creators + China + capsule | 14-year studio, seven people, one year |
| How to Fish | Co-op fishing | Guns/gambling/tricks inside a basic task | Ultra-clear low-price social fantasy | Recent outlier; full production and audience history not yet clear |

---

## 8. Actionable demand–supply gaps

“Horror is open” or “co-op is open” is not useful. An opening is the intersection of a proven loop with a fantasy that has not yet become standardized.

These are **testable product-positioning hypotheses**, not measured claims that no competitor exists. The evidence supports adjacent demand; the proposed spin and its incremental demand must be validated with the team's prototypes and cold-audience tests.

| Micro-gap | Demand evidence | Market risk | Three-week fit | Judgment |
|---|---|---|---|---|
| **First-person tactile workplace + anomaly/risk** | Simulation/horror cohort in Section 3; Shift At Midnight’s 2026 “job + impostor” reception | Exit-8/anomaly fast-follows are crowded | Very high: one room, data-driven events | **Best opening if “returns/unboxing” is visibly distinct** |
| **Exaggerated-count incremental + current work-culture joke** | Detailed Sir Orc and HMD cases | Idle supply is rising; no visual wow means invisibility | High with the correct rendering approach | **Second-best opening** |
| **Current digital anxiety + desk/interface horror** | Home Safety Hotline and the narrative/horror comparison set | Writing/content burden; lower kinetic energy | Very high | **Low-technical-risk fallback** |
| **Co-op capture mission + automatic social artifact** | Content Warning and The Headliners; rotating friendslop audience | Many co-op horror fast-follows | Medium; still image reduces scope | **Attractive only with existing netcode** |
| **Shared fragile-object co-op traversal** | PEAK, RV There Yet?, Chained Together | Physics co-op clones are increasing | Low–medium | **Strong only when multiplayer foundations exist** |

The most important gap is not more content. It is **higher clip density**: at least two readable, retellable reversals in every 5–10-minute session.

---

## 9. Five concepts

## 9.1 Refund Department

**One line:** On the night shift at an e-commerce returns depot, scan each claim and choose refund, reject, or open; some packages are scams, some are alive, and some refuse to be returned.

**Ten-second promise:** A box labeled “air fryer — return reason: haunted” is opened; a legged air fryer leaps out and chases the player’s barcode gun.

### Market thesis

The first-person work and compact horror/risk evidence in Section 3 supports this hypothesis: combine job fantasy, anomaly detection, and “is opening this worth the risk?” in one narrow loop. The proposed opportunity is the specific returns/unboxing task, not an unproven claim that the broad horror market is empty.

### Three nearest comparables

| Comparable | Borrow | Avoid | Distinct spin |
|---|---|---|---|
| [Shift At Midnight](https://store.steampowered.com/app/3722330/Shift_At_Midnight/) | Physical workplace tasks plus identifying non-human customers | Co-op, 13 shifts, and base-defense scope | Packages rather than people; unboxing, returns fraud, and consumer junk |
| [The Cabin Factory](https://store.steampowered.com/app/3311740/The_Cabin_Factory/) | Clear safe/danger decision and compact location | A pure “spot the difference” walking loop | Barcode, weight, claim form, test bench, and economic risk |
| [Buckshot Roulette](https://store.steampowered.com/app/2835570/Buckshot_Roulette/) | One room, short round, readable risk, iconic props | Copying an abstract shell game | Physically testing strange products inside a job sim |

### Core loop

1. Take a package from the conveyor; inspect claim, weight, and scan data.
2. Choose immediate refund, rejection, or inspection-table opening.
3. Test the item: plug it in, shake it, match a serial number, use UV light.
4. Correct decisions earn cash/reputation; wrong ones cause chargebacks or incidents.
5. End the shift with an “incident report” share card and choose one tool for the next shift.

### Fifteen-day demo scope

- One depot room, one conveyor, three stations.
- **10–12 packages total in one shift**, using a small reusable prop set; normal, scam, and paranormal variants reuse those prefabs rather than adding separate content counts.
- One active chase/containment event; other anomalies react at the table.
- One 8–10-minute shift, simple score, two upgrades.
- One onboarding package, one hero package, one share card.
- English-first, data-driven, localization-ready UI.

### Technical scope

- Offline single-player; no networking.
- Physics only for held products and the inspection table; no general sandbox.
- Data-driven package definition: correct item, claim text, weight range, anomaly event, score.
- Simple anomaly state machine: dormant → tell → trigger → resolution.
- Share card from fixed-camera render and shift data; no video capture.
- Save only settings and high score in the demo.

### Marketing thesis and tests

Three hooks from the same prototype:

1. “Would you refund this?” — forces an audience decision.
2. “Customer says unused” — reveal a wildly used or living object.
3. “POV: e-commerce returns night shift.”

Run the same 12-second structure for 48 hours while changing only the opening line and package. Measure 3-second hold → completion → profile/store click → wishlist with UTMs.

**Pros:** lowest technical risk; highly visible 3D prop work; one location; many shorts from the same system; easy testing and support.  
**Cons:** content-dependent; weak tactile feel looks like an asset flip; generic anomaly rules create “Cabin Factory clone” perception.  
**Kill criterion — day 3:** stop if fewer than 9 of 12 people can say “I am evaluating a return” after a silent ten-second clip, if fewer than two of three packages trigger a laugh/surprise, or if the team cannot storyboard three distinct clips from the same system.

---

## 9.2 1000 QA Goblins vs One Bug

**One line:** Release the build before morning by sending thousands of QA goblins against a bug army in two-minute incremental tower-defense runs.

**Ten-second promise:** One giant NullReferenceException stands on one side; a count rising from ten to one thousand QA goblins on the other; pressing FIX sends the entire swarm forward.

### Market thesis

The Sir Orc and How Many Dudes? cases support a hypothesis that visible scale and absurd synergy can drive repeated short-form creative. The opening is not merely “many enemies”; it is the 2026 culture of AI coding, QA, layoffs, crunch, and broken production builds expressed as a legible power curve.

### Three nearest comparables

| Comparable | Borrow | Avoid | Distinct spin |
|---|---|---|---|
| [Sir, We Have an Orc Problem](https://store.steampowered.com/app/4594150/Sir_We_Have_an_Orc_Problem/) | Visually excessive crowd and incremental upgrade | Orc/military theme and thousands of real rigidbodies | QA goblins, bug icons, compile deadline, software jokes |
| [How Many Dudes?](https://store.steampowered.com/app/3934270/How_Many_Dudes/) | Readable unit families and broken-synergy fantasy | 42 units and 850K combinations | Only three roles/four upgrades; the count is the hero |
| [Outhold](https://store.steampowered.com/app/3767740/Outhold/) | Compact incremental tower-defense structure | Deep meta tree in the prototype | Two-minute “ship the build” run and live build gags |

### Core loop

1. Defend the build server from bug waves.
2. Use manual Reproduce, Assign, and Hotfix abilities on critical targets.
3. Spend ticket points on QA goblins, automation bots, and a senior wizard.
4. On failure, convert tech-debt points into one permanent upgrade.
5. Replay the same 120 seconds with a dramatically larger count.

### Fifteen-day demo scope

- One build-server arena.
- Three friendly archetypes, three bug types, one “Production-only bug” boss.
- Four upgrades and two active abilities.
- 120-second runs; power fantasy completed in 3–4 runs.
- Debug-log comic kill feed and one share stat: bugs closed / goblins sacrificed.

### Technical scope

- Do not create one NavMeshAgent/Rigidbody per visible unit.
- Use group/flow-field movement; GPU instancing or an already-proven ECS/DOTS pipeline; animate the closest 50–100, use lower-cost impostors/LOD behind them.
- Aggregate collision/damage instead of precise individual physics.
- Pool all units/effects; cap corpses and particles.
- Use deterministic wave data; no real code editor or LLM.

### Marketing thesis and tests

- “How many QA testers does it take to fix one bug?”
- A visible 10 → 100 → 1,000 → 10,000 progression.
- “AI wrote the code. Goblins have to ship it.”

The number and bug must be readable in frame one. Test different count thresholds and include non-developer viewers; the joke cannot rely only on software-industry vocabulary.

**Pros:** no network; two-minute loop; instant visual wow; repeated shorts; plausible Steam strategy/incremental event fit.  
**Cons:** theme may stay inside a developer bubble; a wrong rendering architecture can consume the sprint; it still needs physical comedy rather than abstract UI.  
**Kill criterion — day 2:** stop if 1,000 visible units cannot approach 60 fps on the minimum target, if most non-developer testers miss the joke, or if the 10→1,000 escalation is not visually dramatic.

---

## 9.3 Group Chat Exorcist: Seen at 3:13 AM

**One line:** Moderate a cursed group chat by comparing messages, photos, voice notes, and a live room feed; misidentify the bot/deepfake and the horror enters your room.

**Ten-second promise:** A friend texts “I’m home,” while the room camera shows the same friend standing outside the door.

### Market thesis

Home Safety Hotline demonstrates the readability of an operator job fused with authored horror. The proposed opening is not another VHS interface; it is current anxiety around bots, deepfakes, scams, AI voice, and group trust expressed as an authored deduction loop.

The specific chat/deepfake angle is a **theme hypothesis**, not a quantified Steam demand result in this research. The adjacent games validate the deduction/horror format; the ten-second tests must establish whether this contemporary framing adds interest.

### Three nearest comparables

| Comparable | Borrow | Avoid | Distinct spin |
|---|---|---|---|
| [Home Safety Hotline](https://store.steampowered.com/app/2357910/Home_Safety_Hotline/) | Desk workflow, authored catalogue, responsibility | A 1990s phone imitation | Modern chat and cross-checking photos/voice notes |
| [The Operator](https://store.steampowered.com/app/1771980/The_Operator/) | Linking multiple evidence sources in one investigation UI | A large case and character scope | One night, eight contacts, immediate room consequences |
| [No, I’m not a Human](https://store.steampowered.com/app/3180070/No_Im_not_a_Human/) | Human/not-human judgment and costly mistakes | Repeating the visitor-at-the-door rhythm | Digital identity and group trust; messages change the physical room |

### Core loop

1. Receive group messages, photos, and short voice notes.
2. Compare them with profiles, history, and the room camera.
3. Mark a member human, compromised, or unknown; reply or remain silent.
4. A wrong decision changes the room; a correct decision opens evidence.
5. At dawn, learn who remained real and which response invited the curse.

### Fifteen-day demo scope

- One desk/room and one phone/PC UI.
- Eight contacts, three authored mini-arcs, 25–35 messages.
- Six photos, four short voice notes, three physical room events.
- One 15–20-minute night and two endings.
- No generative AI; all text, audio, and images are authored.

### Technical scope

- Event graph/state machine fed by a JSON/data table.
- Message queue, notification, evidence pinning, and decision state.
- Prefab/state swaps for room changes; no complex enemy AI.
- Pre-recorded voice notes; no voice cloning.
- One checkpoint and localization-ready message IDs.

### Marketing thesis and tests

- “Which friend is the bot?” asks viewers to solve it in comments.
- Three pieces of evidence with a reveal at second 12.
- “POV: your dead friend is typing…”

Comment prompts must be rooted in a genuinely solvable clue rather than fake engagement. Measure completion and comments, but also store clicks.

**Pros:** very low asset and engineering load; current theme; proven horror/narrative audience; creators can complete a chapter quickly.  
**Cons:** demands excellent writing and UI rhythm; less kinetic in feeds; real generative AI/voice cloning would add ethical and disclosure risk, so keep it authored.  
**Kill criterion — day 4:** redesign or stop if 70% of testers miss at least two of the three critical clues, if the reveal feels arbitrary, or if a 15-second silent clip is incomprehensible.

---

## 9.4 Cryptid Newsroom

**One line:** One to four tabloid photographers enter a disaster-struck suburb, capture the right monster moment, and return to a van where the game turns the best images into an absurd front page.

**Ten-second promise:** A blurry shot of a friend running from a monster becomes the headline “LOCAL MAN INSISTS THIS IS FINE.”

### Market thesis

Content Warning proves that a camera task can turn danger into comedy. The Headliners proves that players will buy a photographer/journalist horror fantasy. The gap is therefore not “take pictures of a monster.” It is eliminating continuous video-capture cost and producing an **automatic shareable tabloid artifact** that feeds back into the run.

### Three nearest comparables

| Comparable | Borrow | Avoid | Distinct spin |
|---|---|---|---|
| [Content Warning](https://store.steampowered.com/app/2881650/Content_Warning/) | Camera role, risky framing, common payoff | Video/voice recording stack and SpöökTube imitation | Three stills + front page + editorial choice |
| [The Headliners](https://store.steampowered.com/app/3059070/The_Headliners/) | Reckless journalists in a creature-filled space | Merely asking for more photo points | Headline construction and the paper’s consequence |
| [Phasmophobia](https://store.steampowered.com/app/739630/Phasmophobia/) | Evidence search and role distribution | Many ghosts, tools, and maps | One cryptid, one suburb block, one editorial deadline |

### Core loop

1. Select three assignments in the van: face, event, evidence.
2. Enter one small map; frame the cryptid and environmental incidents.
3. Spend only three exposures and limited flash; choose between baiting and saving a friend.
4. Return and combine a selected photo with authored headline fragments.
5. The front page sets sales/credibility and the next tool.

### Fifteen-day demo scope

- One suburb street, one house interior, one van.
- One cryptid, two attack states, three environmental gags.
- Three assignments; a 6–8-minute run.
- Twelve headline fragments, three front-page templates, PNG export.
- Solo by default; 2–4 players only if the network foundation exists. Otherwise use a bot companion or local/Remote Play footage without promising online co-op.

### Technical scope

- No continuous video. On shutter: RenderTexture → background JPEG/PNG encoding.
- Score photos from tagged entities/events in camera frustum, screen coverage, distance, and occlusion—not computer vision.
- Do not stream image bytes continuously. Keep scoring/meta on host and transfer only selected results.
- Host-authoritative cryptid/event state; clients send input and camera events.
- Proximity voice is not an MVP requirement and should not appear in the store promise.

### Marketing thesis and tests

- “Take the photo or save your friend?”
- Before/after: chaotic screenshot → polished tabloid front page.
- A weekly community headline challenge turns the player’s PNG into a distribution asset.

**Pros:** applies the product-as-content lesson at lower technical cost; the share card is a real marketing object; strong use of the 3D artist.  
**Cons:** inevitable Content Warning/The Headliners comparisons; online QA; one monster must generate enough events.  
**Kill criterion — day 5:** cut multiplayer if a two-hour network test produces critical desync/crash; stop or redesign if fewer than seven of ten runs create a meaningfully different shareable front page or if photo scoring feels arbitrary.

---

## 9.5 Don’t Drop the Cake

**One line:** Four incompetent caterers carry a giant wedding cake through a collapsing hotel; each controls a different grip point, and every mistake permanently damages the cake.

**Ten-second promise:** The team jams the cake in a revolving door; the top tier slides into an elevator, and everyone celebrates because it technically survived.

### Market thesis

PEAK’s shared goal/body comedy, RV There Yet?’s shared fragile vehicle, and Chained Together’s forced coordination prove demand. The gap is not “another obstacle course.” It is a **shared fragile object** whose accumulated damage becomes the final portrait.

### Three nearest comparables

| Comparable | Borrow | Avoid | Distinct spin |
|---|---|---|---|
| [PEAK](https://store.steampowered.com/app/3527290/PEAK/) | Simple shared goal, assistance, falling comedy | Copying climbing/stamina and broad routes | Cake deformation and four-corner carrying |
| [RV There Yet?](https://store.steampowered.com/app/3949040/RV_There_Yet/) | One object as the entire team’s problem | Vehicle/winch and valley scope | Interior doors, elevators, stairs, wedding deadline |
| [Chained Together](https://store.steampowered.com/app/2567870/Chained_Together/) | One player’s motion affects everyone | Long vertical rage-platforming | Short route and visible final-object condition |

### Core loop

1. Each player chooses a grip; the team lifts.
2. Balance the center of mass through doors, stairs, elevators, and a swinging kitchen.
3. If someone releases, others can compensate; tiers slide and decorations fall.
4. Use one-shot tape, spatula, and serving cart tools.
5. After 6–8 minutes, pose for a wedding photo; remaining tiers, dirt, and decorations form the score.

### Fifteen-day demo scope

- One 6–8-minute hotel route and five obstacle rooms.
- One cake rig with three visual damage states; no soft-body simulation.
- Two tools and one final photo.
- Two-player minimum; four-player target only with proven infrastructure.
- Decide the local/Steam Remote Play fallback before production.

### Technical scope

- Use a kinematic main body with four limited-angle grip constraints, not a freely simulated multi-body cake.
- Trigger damage from collision impulse and time-over-tilt thresholds; swap authored tier/decoration states instead of mesh deformation.
- Host-authoritative cake transform; prediction only for player movement. Avoid a networked rigidbody chain.
- Camera collision and narrow-door readability are as critical as physics.
- No built-in voice requirement.

### Marketing thesis and tests

- “Four friends. One wedding cake.”
- Every clip asks the same legible question: how many tiers reach the wedding?
- The final wedding photo is a natural share card.

**Pros:** universal, language-light slapstick; instantly understandable; natural final artifact; highly visible 3D work.  
**Cons:** highest control/camera/network risk; “PEAK but…” perception; annoying physics kills retention.  
**Kill criterion — day 3:** stop if two players cannot carry it through one doorway for 20 minutes without synchronization problems, if failures are unreadable to a viewer, or if players fight the camera more than the cake.

---

## 10. Fifteen-workday production and marketing sprint

### Days 1–2: controlled competition between two concepts

- **Developer A:** Refund Department — take, scan, open, one anomaly.
- **Developer B:** QA Goblins — 10→1,000 visible agents, one attack, one upgrade.
- **3D artist:** one hero prop/character and an identifying color script for each; no final assets.
- **PM:** decision rubric, risk register, 12-person test schedule, observation form.
- **Marketing:** three 10–15-second hook storyboards per concept; comparable/creator list.

Choose one at the end of day two based on performance, ten-second comprehension, and the ability to generate three distinct clips.

### Day 3: greenlight / kill gate

- Twelve people watch a silent ten-second clip before seeing the build and answer “what do you do?”
- A project-specific greenlight target—not an industry benchmark—is 9/12 correctly identifying the core action.
- The system must produce at least three distinct video storyboards.
- Write the one-line Steam short description and first capsule sketch.

### Days 4–5: complete the loop

- Start → action/decision → fail/success → result → replay works end to end.
- Marketing posts platform-native raw WIP daily; do not dump the same watermarked horizontal trailer everywhere.
- Create UTM links and record 24h/72h results.
- Artist locks the hero asset, one environment module, and lighting.

### Days 6–9: content and feel

- Feature freeze on day six: no new systems.
- Maximum three tools/upgrades; only content variants thereafter.
- Add audio feedback, reactions, camera feedback, and UI readability.
- Test with 20 remote players; collect first-session duration, quit point, and clip timestamps.
- Marketing contacts 30–50 micro/mid creators with a personalized one-line hook, 15-second clip, and frictionless playtest/build access.

### Days 10–12: external playtest and store package

- Test crashes, input, resolution, alt-tab, save, and low-spec performance.
- Produce two capsule directions, six screenshots, and a short trailer shot list.
- No logo before gameplay. A durable HTMAG creative rule is to show gameplay in the first two seconds: [60 Mistakes ebook](https://howtomarketagame.com/wp-content/uploads/2023/05/Zukowski_60MistakesEbookV1.pdf).
- With permission, record the three best creator/tester moments and exact timestamps.

### Day 13: release candidate

- No new content; blocker/critical fixes only.
- Thirty-minute soak test, ten consecutive runs, clean-machine install.
- Define demo median playtime and wishlist conversion consistently. HTMAG’s Next Fest sample had a 19.3% median player-to-wishlist rate; do not turn it into a guaranteed KPI.

### Day 14: video and store assets

- 30–45-second trailer: 0–2s hook, 2–12s core action, 12–25s escalation, 25–35s payoff, then CTA.
- Three 9:16 shorts: raw, text-led, reaction-led.
- Test whether the title and fantasy remain readable at small capsule size.

### Day 15: delivery and continuation decision

- If Steam operations are ready, ship the reviewed playtest/demo; otherwise deliver a private creator build, public video, and Coming Soon submission.
- One-page metric snapshot: spend, views, hold, completion, clicks, wishlist/signup, demo uniques, median playtime, crash rate.
- Decide **continue / pivot / stop**. “Add more content” is not the automatic answer.

### Role ownership

| Role | Primary ownership | Success output |
|---|---|---|
| Senior Developer A | Core loop and interaction | Complete 5–10-minute run |
| Senior Developer B | Systems/performance, builds, analytics | Stable build and event telemetry |
| 3D Artist | Hero prop/character, one environment, lighting, capsule support | A distinctive image readable in frame one |
| Product Manager | Scope gates, testing, schedule, risk | Decisions made on days 3, 6, and 13 |
| Marketing Manager | Hook testing, creator CRM, UTM, store copy/assets | Timeline showing which message moved which metric |

---

## 11. Marketing plan and decision gates

### Plan for 100K–200K reach

Distribute the target across a portfolio rather than one lottery ticket:

- 12–15 raw WIP shorts, each showing one mechanic with motion in frame one.
- Platform-specific caption and cover for TikTok, Reels, and Shorts.
- 30–50 small/mid creators selected through actual comparable-game coverage.
- 20–50 external testers; use a shareable window where practical.
- Treat 100K–200K **aggregate qualified views** as a stronger green signal only if at least two different assets each clear 20K. This is a project rule to avoid one-outlier dependence, not an industry benchmark.

### Funnel dashboard

| Layer | Metric | Question | Wrong inference |
|---|---|---|---|
| Hook | 1s/3s hold, thumb-stop | Is the concept readable immediately? | High views mean buyers exist |
| Interest | Completion, replay, share/comment | Does escalation/payoff work? | Comments equal wishlists |
| Intent | Profile/store CTR, UTM visits, wishlist/signup | Does the viewer seek the game? | Wishlist equals day-one sale |
| Trial | Demo unique, completion, median playtime, replay | Does the product fulfill the clip? | CCU equals total players |
| Quality | Crash rate, negative themes, reviews | Can momentum persist? | One average score explains the cause |

### Creative rules

- Gameplay in the first two seconds; no studio logo or lore dump.
- One question per video: “Would you open it?”, “Which friend is the bot?”, “How many cake tiers survive?”
- Do not hide the core loop behind cinematic mystery.
- Raw WIP is a testing surface, not an embarrassment. Sir Orc began with 10–15-minute daily content production.
- Do not turn on paid acquisition before cold-organic and demo/store intent are measurable. Bills’ $200/19-wishlist result does not support ads as the default.
- Creator outreach begins before a festival/launch, with playable access and an embargo plan.

### Continue / pivot / kill matrix

These are project gates, not universal benchmarks:

| Day | Continue | Pivot | Kill |
|---:|---|---|---|
| 3 | 9/12 identify core action; three clip stories exist | Hook reads but payoff is weak | Core action still requires explanation |
| 6 | End-to-end 5–10-minute loop, no critical blocker | Loop works after removing one system | Core loop remains incomplete |
| 10 | Most of 20 testers express replay/show-someone intent; crashes low | Interest exists but onboarding/pace is weak | Same quit point and no comic event across sessions |
| 15 | More than one creative shows reach plus downstream intent; build stable | Views but no intent: reposition/capsule pivot | Neither reach/intent nor product quality appears |

Do not impose a universal view-to-wishlist ratio. The HMD events in Section 7 are successful examples, not a conversion formula. Your own baseline is the correct benchmark.

---

## 12. Steam operating calendar: the hard three-week constraint

Today is September 2, 2026. A three-week Steam demo is a conditional target, not a guarantee: onboarding, store approval, and demo review must run in parallel from day one. The full-game waiting period must not be incorrectly described as a documented blanket ban on demos.

- For the first few full-game releases, onboarding documents a **30-day waiting period** after the app fee and at least **two weeks** of public Coming Soon presence. Source: [Steamworks onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding?pubDate=20250411).
- Store and build review typically takes **3–5 business days**; Valve recommends allowing at least seven. Source: [Steamworks Review Process](https://partner.steamgames.com/doc/store/Review_Process).
- Demo documentation separately allows skipping its upcoming phase and releasing directly once fully reviewed, provided the base game is publicly Coming Soon. It does not explicitly state a separate 30-day demo wait. Verify the actual partner/AppID release checklist before making a date commitment. A demo can trigger one wishlist notification within a two-week window. Source: [Steamworks Demos](https://partner.steamgames.com/doc/store/application/demos?l=english&language=english).
- Submit a Coming Soon page for review at least seven business days before the intended public date. Source: [Steamworks Coming Soon](https://partner.steamgames.com/doc/store/coming_soon?l=english).

### Two operating scenarios

**A. Partner/AppID/store process already exists:** prepare the page and demo review package on day one in parallel with production. A public Steam Playtest/demo may be possible, with revision buffer.

**B. Everything begins now:** start onboarding and page review immediately. Treat the public Steam demo as a stretch target conditional on the actual release controls, and guarantee these fallback deliverables:

- private Windows creator build,
- public 30–45-second trailer and three shorts,
- Coming Soon store package/submission,
- demo review submission and the earliest confirmed public-demo date,
- tester signup, Discord, or mailing-list capture.

### Events

- October 2026 Steam Next Fest runs October 19–26, but the official registration deadline was **August 31**. As of September 2, it is missed unless the title was already registered; do not base the plan on a hypothetical exception. Source: [Steam Next Fest October 2026](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest/2026october).
- The next general Next Fest is listed for February 22–March 1, 2027. Steam Scream V runs October 26–November 2; Auto-Battler RPG Fest November 16–23; 2027 Shop Keeper Fest January 25–February 1; Couch Co-op Fest February 8–15. Eligibility depends on actual gameplay/tags. Source: [Steamworks upcoming events](https://partner.steamgames.com/doc/marketing/upcoming_events).
- A title can participate in only one Next Fest, so store/demo readiness should be planned deliberately. Source: [Steam Next Fest documentation](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest?l=english&language=english).

### Visibility misconceptions

Steam uses sales and player-interest signals across different surfaces. Its documentation says store-page conversion rate is not a visibility factor, and once review score is above Mixed (40%+), score alone is not a visibility factor. This does not make capsule or reviews unimportant; it means the algorithm should not be reduced to one mythical ratio. Source: [Steamworks Visibility](https://partner.steamgames.com/doc/marketing/visibility?language=english).

---

## 13. Risk register

| Risk | Likelihood | Impact | Early signal | Mitigation |
|---|---|---|---|---|
| Multiplayer consumes the sprint | High | Very high | Lobby/authority unstable on day 2 | Choose one of the first three concepts; require an existing stack for co-op |
| Generic friendslop-clone perception | High | High | Comments mention only a comparable | Put the new social job/share artifact in frame one |
| Views without store intent | Medium–high | High | High completion, low CTR/wishlist | Align clip, capsule, and short description; use UTMs |
| Feature creep | High | High | New mechanics still entering after day 6 | Feature freeze; content variants only |
| Too little content | Medium | Medium–high | Everything is seen in three runs | Data-driven variants, one hero event, cheap combinations |
| Capsule is unreadable | Medium | High | Fantasy disappears at small size | Two concepts and controlled traffic test |
| Steam review timing slips | Medium | High | No AppID/page now | Commit to a creator build, not public Steam demo, in the zero-start scenario |
| Viral launch overwhelms support | Low but critical | Very high | Tester crashes/desync; no support owner | Incident plan, crash telemetry, clear support ownership |
| Topical joke ages quickly | Medium | Medium | People react only to the meme | Make the underlying mechanic fun without the reference |

---

## 14. Final recommendation

### First choice: Refund Department

It best fits the actual team: the two developers focus on loop and polish, the artist on one environment and memorable props, the PM on rapid tests, and marketing on turning every package/anomaly into a new short. It enters the demonstrated simulation/horror/risk intersection without multiplayer risk.

Keep the MVP promise this narrow:

> “On an eight-minute night shift, scan and open returns. Refund the wrong package and the warehouse refunds you.”

### Second choice: QA Goblins

It may have the higher viral ceiling if crowd performance and visual comprehension are proven in the first 48 hours. Kill it immediately if the technology experiment becomes the product.

### Multiplayer decision

Cryptid Newsroom and Don’t Drop the Cake are attractive marketing ideas but rational only with a tested multiplayer base. The lesson from Content Warning is not “make co-op horror.” It is **make the player generate a marketing artifact as part of play**. Refund Department’s incident report, QA Goblins’ casualty/build report, and Group Chat Exorcist’s “who was real?” case summary apply the same principle with much less technical exposure.

---

## 15. Source index

### Official and platform sources

- [SteamDB — Steam Game Releases by Year](https://steamdb.info/stats/releases/)
- [Steamworks — Onboarding](https://partner.steamgames.com/doc/gettingstarted/onboarding?pubDate=20250411)
- [Steamworks — Review Process](https://partner.steamgames.com/doc/store/Review_Process)
- [Steamworks — Coming Soon](https://partner.steamgames.com/doc/store/coming_soon?l=english)
- [Steamworks — Demos](https://partner.steamgames.com/doc/store/application/demos?l=english&language=english)
- [Steamworks — Next Fest](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest?l=english&language=english)
- [Steamworks — October 2026 Next Fest](https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest/2026october)
- [Steamworks — Upcoming Events](https://partner.steamgames.com/doc/marketing/upcoming_events)
- [Steamworks — Visibility](https://partner.steamgames.com/doc/marketing/visibility?language=english)
- [Steamworks — Wishlist Reporting](https://partner.steamgames.com/doc/marketing/wishlist/reporting?language=english)
- [Landfall — Content Warning press kit](https://landfall.se/content-warning-press-kit)

### HTMAG primary analysis

- [What the hell happened in 2025?](https://howtomarketagame.com/2026/01/27/what-the-hell-happened-in-2025/)
- [2026 Q1 Games](https://howtomarketagame.com/2026/05/14/2026-q1-games/)
- [June 2026 Steam Next Fest start](https://howtomarketagame.com/2026/06/16/june-2026-steam-next-fest-start/)
- [How the Steam Personal Calendar affects your launch](https://howtomarketagame.com/2026/06/25/how-the-steam-personal-calendar-affects-your-launch/)
- [Most people will play your demo and not wishlist it and that is ok](https://howtomarketagame.com/2026/06/30/nobody-plays-demos-and-that-is-ok/)
- [You cannot over expose your game](https://howtomarketagame.com/2026/07/09/you-cannot-over-expose-your-game/)
- [Did AI slop ruin Steam Next Fest June 2026?](https://howtomarketagame.com/2026/07/13/did-ai-slop-ruin-steam-next-fest-june-2026/)
- [Games that used momentum for Steam Next Fest success](https://howtomarketagame.com/2026/07/14/games-that-used-momentum-for-steam-next-fest-success/)
- [Is Friendslop saturated?](https://howtomarketagame.com/2026/07/30/is-friendslop-saturated/)
- [The state of virtual third-party festivals 2026](https://howtomarketagame.com/2026/08/11/the-state-of-virtual-3rd-party-festivals-2026/)
- [The week of the Golden Age — Sir Orc](https://howtomarketagame.com/2026/08/18/the-week-of-the-golden-age/)
- [Part 2 — Bills Must Be Paid](https://howtomarketagame.com/2026/08/20/part-2-the-week-of-the-golden-age/)
- [Part 3 — How Many Dudes?](https://howtomarketagame.com/2026/08/21/part-3-the-week-of-the-golden-age-how-many-dudes/)

### Cases and market data

- [GameDiscoverCo — YAPYAP case](https://newsletter.gamediscover.co/p/how-yapyap-jammed-its-way-to-1-million)
- [Game Developer — PEAK production case](https://www.gamedeveloper.com/production/how-co-op-climbing-hit-peak-achieved-2-million-sales-for-less-than-200-000-)
- [PC Gamer — R.E.P.O. creation](https://www.pcgamer.com/games/horror/lets-just-fail-quickly-this-time-semiwork-took-a-big-risk-on-repo-after-its-first-game-took-6-years-to-make-and-didnt-sell-very-well/)
- [Photon — R.E.P.O. multiplayer implementation](https://blog.photonengine.com/r-e-p-o-multiplayer-success-powered-by-photon/)
- [GUNTOUCHABLES — official August 8, 2025 milestone](https://www.mynewsdesk.com/uk/swipe-right/pressreleases/guntouchables-hits-over-2m-downloads-in-the-first-24-hours-3398663)
- [GUNTOUCHABLES — giveaway milestone](https://www.pcgamer.com/games/roguelike/more-than-2-million-people-grabbed-co-op-roguelike-guntouchables-when-it-was-free-for-24-hours/)
- [GUNTOUCHABLES on SteamDB](https://steamdb.info/app/2543510/charts/)
- [The Headliners on SteamDB](https://steamdb.info/app/3059070/charts/)
- [GameDev.net / GamesIndustry.biz — RV There Yet?](https://gamedev.net/news/4042-you-just-look-at-the-number-and-go-what-happened-the-developers-of-rv-there-yet/)
- [Butterscotch — How Many Dudes? timeline](https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/)
- [Sir Orc developer postmortem](https://www.reddit.com/r/gamedev/comments/1v9z4vi/we_made_361657_gross_revenue_in_the_first_24/)
- [Bills Must Be Paid developer postmortem](https://www.reddit.com/r/gamedev/comments/1va2gtb/releasing_with_61000_wishlists_2_person_what_we/)
- [R.E.P.O. on SteamDB](https://steamdb.info/app/3241660/charts/)
- [PEAK on SteamDB](https://steamdb.info/app/3527290/charts/)
- [RV There Yet? on SteamDB](https://steamdb.info/app/3949040/charts/)
- [Content Warning on SteamDB](https://steamdb.info/app/2881650/charts/)
- [Sir, We Have an Orc Problem on SteamDB](https://steamdb.info/app/4594150/charts/)
- [Bills Must Be Paid on SteamDB](https://steamdb.info/app/4421010/charts/)
- [How Many Dudes? on SteamDB](https://steamdb.info/app/3934270/charts/)
- [YAPYAP on SteamDB](https://steamdb.info/app/3834090/charts/)
- [Super Battle Golf on SteamDB](https://steamdb.info/app/4069520/charts/)
- [Roadside Research on SteamDB](https://steamdb.info/app/3643170/charts/)
- [Creature Kitchen on SteamDB](https://steamdb.info/app/3097300/charts/)
- [Horse Magnifier on SteamDB](https://steamdb.info/app/4585340/charts/)
- [Waterpark Simulator on SteamDB](https://steamdb.info/app/3293260/charts/)
- [Gamblers Table on SteamDB](https://steamdb.info/app/3618390/charts/)
- [RACCOIN on SteamDB](https://steamdb.info/app/3784030/charts/)
- [Super Battle Golf — reported first 100K copies](https://www.pcgamer.com/games/sports/that-golf-game-with-orbital-death-lasers-sold-100k-copies-in-two-days-we-made-super-battle-golf-together-in-4-5-months-and-are-so-happy/)
- [Super Battle Golf — reported million-copy milestone](https://www.gamesradar.com/games/sports/pvp-indie-golf-game-with-93-percent-very-positive-reviews-hits-1-million-copies-sold-on-steam-in-just-over-a-month-so-many-friendships-ended/)
- [Roadside Research — publisher's 300K milestone](https://www.dlh.net/en/news/88152/roadside-research-surpasses-300k-sales-in-two-weeks.html)
- [VGI Wishlist Report, July 2025](https://vginsights.com/assets/reports/VGI_Wishlist_Report_July_2025.pdf)
- [Alinea H1 2026 estimate summary](https://www.tomshardware.com/video-games/pc-gaming/steam-sales-reportedly-topped-usd11-billion-during-h1-2026-due-to-shifting-trends-staggering-growth-driven-by-influx-of-chinese-players-and-booming-legacy-catalogues)
- [WeLoveIt Steam genre study summary](https://www.pcgamer.com/gaming-industry/steam-week-in-review-here-are-the-top-10-most-popular-genres-on-steam/)
- [Valve 2025 $100K catalogue count summary](https://www.pcgamer.com/gaming-industry/valve-says-over-5000-games-made-over-usd100k-on-steam-last-year/)

---

## Appendix: minimum event-level CSV schema

```text
game,appid,developer,team_size,prior_audience,production_months,event_date,event_type,channel,creative_hook,organic_type,spend_usd,views_24h,views_72h,store_visits,wishlist_delta,demo_unique,demo_peak_ccu,demo_median_minutes,launch_wishlists,units_24h,gross_24h,peak_ccu,reviews_snapshot,evidence_type,evidence_url,attribution_confounds,confidence,replicable_mechanism,non_replicable_advantage
```

Each row is a marketing event, not a final game result. Storing the event sequence is what makes the product answer: **what was done, where, when, and what changed afterward?**

---

## Appendix B: expanded reading curriculum, historical references, and execution workflow

This appendix extends the case library rather than changing the five-concept ranking. Its purpose is to make Steam Discovery a decision workspace: read enough to form a hypothesis, identify contrary evidence, then run a bounded experiment. The historical games below explain mechanisms; they are **not a 2026 launch cohort**. Recommendations, scope judgments and proposed gates are this report's analysis unless explicitly attributed.

### B1. Read in an order that produces decisions

Do not read every newsletter chronologically before starting. Give each reading session a question and require one usable output. The following curriculum complements the HTMAG review in Section 4.

| Reading step | Read first | What to extract into Steam Discovery |
|---|---|---|
| 1. Understand what the numbers describe | [GameDev Reports' Newzoo digest](https://gamedevreports.substack.com/p/newzoo-the-gaming-market-in-2026), then the underlying report when available | Geography, platform, forecast versus actual, spending definition. This is a market-context source, not the addressable revenue of our game. |
| 2. Locate changing buyer preferences | [GameDiscoverCo's 2021–2025 genre comparison](https://newsletter.gamediscover.co/p/how-have-the-genres-of-hit-pc-games) | Candidate tags and adjacent games. Its successful-game cohorts reveal the composition of winners, not the chance of becoming one. |
| 3. Inspect a narrow audience | [OP Game Marketing's turn-based study](https://opgamemarketing.substack.com/p/how-well-do-turn-based-combat-games), plus its [tavern](https://opgamemarketing.substack.com/p/how-tavern-games-are-quietly-printing) or [productivity](https://opgamemarketing.substack.com/p/the-rise-of-productivity-games-on) scan | The included and excluded games, median rather than mean, and the actual player fantasy. The latter two articles predate the priority three-month window. |
| 4. Reconstruct acquisition | GameDiscoverCo on [Iron Nest](https://newsletter.gamediscover.co/p/how-iron-nest-sold-250k-copies-in) and [Guildrun](https://newsletter.gamediscover.co/p/how-guildrun-genre-mashed-its-way); Alinea on [Dear Passengers](https://alineaanalytics.substack.com/p/another-friendslop-challenger-enters) | Which asset appeared first, who played next, whether spend was disclosed, and what the measured outcome actually was. Compare short-video discovery with specialist long-form coverage. |
| 5. Stress-test festival assumptions | [Game Marketing Intel's Next Fest study](https://gamemarketing.substack.com/p/heres-what-actually-predicts-next), [Alinea's June assessment](https://alineaanalytics.substack.com/p/steam-next-fests-winners-and-why), and [HTMAG's momentum analysis](https://howtomarketagame.com/2026/07/14/games-that-used-momentum-for-steam-next-fest-success/) | Starting interest, recent growth, demo engagement, estimation method and exclusions. Record disagreement instead of choosing the most optimistic chart. |
| 6. Learn the production and downside story | [Butterscotch's first-party timeline and CSV](https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/) and [Push to Talk's Arco interview](https://www.pushtotalk.gg/p/are-old-games-killing-new-games) | Failed experiments, prior experience, costs that are missing, and misleading presentation. Arco's interview is a historical counter-case, not current market telemetry. |

Use [GameDev Reports' milestone roundups](https://gamedevreports.substack.com/p/games-and-numbers-august-12-august) as an inbox: follow each original announcement before promoting a number into a decision. Use developer blogs for chronology and practitioner newsletters for interpretation. An article that links another analyst's estimate is not an independent second measurement.

**Arco's later outcome matters:** on August 18, 2026, composer José Ramón confirmed that the project had recouped its development costs after more than 100,000 worldwide copies over approximately two years. This is a **cross-platform** milestone covering a game sold on Steam, Nintendo Switch, Mac App Store and Epic Games Store; most sales came through Steam, but no exact Steam unit count was disclosed. Keep its difficult 2024 launch and subsequent recovery as separate dated events. [Game Developer's direct follow-up](https://www.gamedeveloper.com/business/arco-breaks-even-after-topping-100-000-sales).

For ongoing operation, a **proposed reading budget** is two focused sessions per week: one new cohort or case, and one attempted disconfirmation of the current concept. The PM owns evidence quality; marketing owns channel implications; a developer owns the “what does this cost to reproduce?” annotation. Archive a short original summary and a link, not a substitute copy of a paid article.

### B2. Where good sources disagree—and how to resolve it

**Wishlist stock versus momentum.** Game Marketing Intel's larger, proxy-based June sample associates starting wishlist stock more strongly with gains; HTMAG's self-reported sample finds recent momentum modestly stronger. Different populations and measurement methods can produce both results. Our resolution is to track both stock and velocity, without treating either as Valve's ranking specification. [Game Marketing Intel](https://gamemarketing.substack.com/p/heres-what-actually-predicts-next), [HTMAG](https://howtomarketagame.com/2026/07/14/games-that-used-momentum-for-steam-next-fest-success/).

**“Wishlists are vanity” versus “wishlists predict sales.”** Alinea questions blanket conversion expectations in its June festival article, but reports strong conversion for selected low-priced co-op games in July. This is not a universal contradiction: audience, acquisition source, price and conversion window differ. Keep incentivized wishlists separate from self-motivated interest; compare seven-day and thirty-day conversions only within the same defined cohort. [June analysis](https://alineaanalytics.substack.com/p/steam-next-fests-winners-and-why), [July co-op analysis](https://alineaanalytics.substack.com/p/another-friendslop-challenger-enters).

**Short-form versus specialist creators.** Iron Nest's tactile machinery suited short clips, while Guildrun's developer account says short-form was not a major driver and describes specialist coverage alongside paid activity. Therefore, “viral shorts first” remains a hypothesis for our funny physical concepts—not a requirement for every strategy game. Show a visible reversal in short-form; let a relevant long-form creator explain strategic depth. [Iron Nest](https://newsletter.gamediscover.co/p/how-iron-nest-sold-250k-copies-in), [Guildrun](https://newsletter.gamediscover.co/p/how-guildrun-genre-mashed-its-way).

**Promising niche versus inflated success rate.** OP Game Marketing's tavern sample is handpicked; its broader turn-based study still excludes games below $500 estimated revenue. The latter reports a $7,744 median versus $776,940 average. Neither sample licenses a headline such as “most games in this niche succeed.” The resolution is to keep the denominator and exclusions visible, then add weaker releases before judging the gap. [Taverns](https://opgamemarketing.substack.com/p/how-tavern-games-are-quietly-printing), [turn-based cohort](https://opgamemarketing.substack.com/p/how-well-do-turn-based-combat-games).

The practical common ground is narrower than the headlines: **match an audience, demonstrate the promise, measure the right unit, and budget for the actual production—not its screenshot.**

### B3. Eight historical reference games: transferable lesson versus scope trap

The milestones below have different units and elapsed times. They are anchors for reading the associated case, not a league table. “High/Medium/Low” is our three-week **demo** assessment for two developers and one artist; it does not assess full-game feasibility.

| Historical reference | Sourced anchor | Marketing lesson to test | Scope trap / demo fit |
|---|---|---|---|
| **Lethal Company (2023)** | [240,817 peak Steam CCU](https://steamdb.info/app/1966720/charts/); development was already documented in [June 2022](https://www.patreon.com/zeekerss/posts/end-of-first-of-68118367) | A shared job can alternate calm planning with sudden, personal disaster. Let players generate the story. | **Medium**, only with proven networking. One facility and one creature, not procedural breadth; “solo” does not mean a short build. |
| **Buckshot Roulette (Steam 2024)** | [Publisher reported 6M+ Steam copies by May 8, 2025](https://store.steampowered.com/news/app/2835570/view/496069147391688786); [multiplayer arrived October 31, 2024](https://steamdb.info/patchnotes/16252076/) | Make the next decision understandable to a spectator; expansion can create a later marketing beat. | **High** for a solo table prototype. Do not treat later multiplayer features as part of the original compact scope. |
| **Balatro (2024)** | [Developer reports 208,401 launch wishlists and 119,000 launch-day Steam units](https://localthunk.com/blog/balatro-timeline-3aarh) | Familiar rules plus unfamiliar combinations can support repeat creator coverage. | **High** for one tiny run, not equivalent depth; the [timeline begins in December 2021](https://localthunk.com/blog/balatro-timeline-3aarh). |
| **Schedule I (2025)** | [459,075 peak Steam CCU](https://steamdb.info/app/3164500/charts/); [GameDiscoverCo reports roughly three years' development](https://newsletter.gamediscover.co/p/schedule-is-solo-smash-hit-and-the?open=false) | A playable free sample lets people demonstrate a business fantasy before purchase. | **Low** for comparable breadth. Extract one physical work loop; omit the town, vehicles, employees and online expansion. |
| **The Exit 8 (2023)** | [Developer reported 30K+ first-day copies](https://automaton-media.com/en/news/20231201-23610/); [design interview explains cutting gun/camera reporting interactions](https://gamemakers.jp/article/2024_02_14_60602/) | Let the audience participate in one visual question: what changed? | **High** for one original corridor and limited anomalies. Art ambiguity must not masquerade as an intended clue. |
| **Chained Together (2024)** | [Secret Mode reported 10M+ Steam copies on June 2, 2026](https://app.pressengine.net/newsdesk/bastion/stories/news-chained-together-links-up-with-secret-mode-for-future-development) | A visible shared constraint explains cooperation and blame in the same frame. | **Medium**, conditional on networked physics. Exact launch headcount and duration were not verified; do not fill them with guesses. |
| **Duck Detective: The Secret Salami (2024)** | [Developer reports 60K+ prelaunch wishlists and about 15K during Next Fest](https://www.reddit.com/r/gamedev/comments/1cwlf2s/we_got_over_60k_wishlists_in_6_months_this_is_how/) | A serious profession plus an incongruous character can communicate tone instantly. | **High** for one solvable scene. Distinctive writing, readable deductions and performance are the product, not optional polish. |
| **Keep Driving (2025)** | [YCJY reports 100K+ buyers and over five years' development](https://store.steampowered.com/news/app/2756920/view/538852710067208317) | A familiar life fantasy can differentiate a management/RPG loop without conventional combat. | **Medium** for one route. Restrict encounter permutations and bespoke content; a compact-looking screen can hide years of design. |

### B4. From comparative basket to a decision—not endless research

**1. Build a comparative basket.** Start with the player's action, not a broad genre label. For Refund Department, the starting query is “physically inspect an object, make a risky decision, experience a visible consequence.” Tag the results by loop, fantasy, emotional tone and social mode. Keep three groups: mechanical neighbors, audience/channel neighbors, and production neighbors. A visual match can be a poor production match.

**Proposed research gate:** assemble 12–20 released comparisons and at least five relevant upcoming games before expanding the shortlist. Include weaker releases, not just recognizable hits. These counts are a manageable research target, not a statistically representative sample.

**2. Check the denominator.** Use one provider, time window and release definition per comparison. Display the complete count, median, low-performing share, free/paid distinction and age since release. Separate Early Access history from 1.0. If team cost is unknown, profitability remains unknown. Do not manufacture a “market gap score” from a handful of winners. Preserve disagreement between owner models as a range of model outputs, not a confidence interval.

**3. Write one falsifiable hypothesis.** Use this proposed template: “Players who enjoy **A** want **B**, but current comparisons lack **C**; our slice delivers **C** through **one interaction**, and we will test it through **channel X**.” Example: “Inspection-horror viewers will understand and share a cursed returns-counter decision because the absurd item and its consequence are visible before dialogue.” That is a product hypothesis, not a discovered market fact. Name the observation that would disprove it: repeated explanation, no meaningful choices, or viewers enjoying the clip without wanting the game.

**4. Make the three-week demo answer that hypothesis.** Reuse Sections 10–12 rather than opening a second production plan. Every task must improve comprehension, consequence, replay, stability or measurement. Place speculative features in a parking lot. For networked concepts, prove two remote clients and the central interaction immediately; if that fails, reduce the social scope before adding content. Deliver a truthful clip from a playable sequence, not a cinematic promise the build cannot support.

**5. Run measured channel experiments.** Compare two messages using the same core footage, then two formats using the stronger message. Log posting time, account, audience, cost, link, 24h/72h outcomes and overlapping events. Separate new viewers, existing followers, creator audiences and Steam discovery. A creator's coverage without a payment disclosure is **unknown spend**, not automatically free coverage.

**Proposed experiment gate:** require at least two independent signals before extending production—for example, one creative with downstream store intent plus external testers who voluntarily replay. Use the existing 9/12 comprehension gate and day-six end-to-end-loop gate from Section 11; do not silently replace them with a newly invented universal conversion rate. Small samples are directional. If reach rises without intent, test positioning; if intent rises but players quit at the same point, fix the experience; if neither improves, stop or materially change the hypothesis.

The tool's most important output is therefore a one-page decision record: **evidence for, evidence against, production cost, next experiment, owner and decision date**. The case library earns its value when it changes what the team builds—or prevents a costly build—not when it merely contains more success stories.

---

## Appendix C: quarterly genre demand and supply—what is actually comparable

### C1. Q1 2026: published hit counts, not genre success rates

Chris Zukowski's May 14 article uses a VG Insights snapshot taken **April 2, 2026**, covering Steam releases dated **January 1–March 31**. It is not indie-only. Its hit threshold is at least 1,000 reviews; qualifying games receive one manually assigned genre. The public page embeds exact numeric chart data, allowing extraction without estimating bar lengths. [Original Q1 study](https://howtomarketagame.com/2026/05/14/2026-q1-games/).

The embedded table contains **42 genre rows whose 2026 counts sum to 74**, whereas the whole-Steam review-distribution chart reports **96** qualifying releases. The article does not reconcile the **22-game gap**. Preserve both published measures and flag the discrepancy; do not invent an “other” category or scale the genre counts to match. Crucially, the article does **not publish release supply per genre**, and no public game-level cohort export was located. Therefore, every quarterly genre denominator and hit-rate cell remains unavailable, not zero. [Published chart data and methodology](https://howtomarketagame.com/2026/05/14/2026-q1-games/).

The practical interpretation is deliberately limited. A genre's hit count can identify titles worth studying, but cannot reveal the chance that a new release reaches the threshold. Ten hits among fifty releases and ten among five thousand imply very different opportunity. Likewise, a zero-hit row does not prove an absent audience: the sample may be small, releases immature, or the chosen threshold unsuitable for that niche.

### C2. Release maturity and measurement rules

The April 2 cutoff gives late-March launches only days to accumulate reviews while January launches have months. Comparing those results directly with an older annual cohort rewards elapsed time as well as demand. A later snapshot would answer a different question; preserve its observation date instead of silently replacing the original numbers.

A defensible quarterly comparison needs the **complete release cohort**, consistent paid/free and Early Access rules, the same genre taxonomy, and matching observation rules. Publish a fixed-cutoff view and, where historical data permits, a fixed-age view such as reviews ninety days after each launch. Record exclusions and unavailable histories. The numerator must be a subset of its denominator: do **not** divide HTMAG's manually classified hits by a separately collected Steam-tag supply count. Steam tags overlap, while the study assigns one genre per game.

Review totals also need a reproducible definition: lifetime versus recent, language coverage, purchase types, and relevant API filters. Valve distinguishes readable reviews from the reviews included in a product's aggregate score. The report's 1,000-review threshold is an analyst convention—not a documented Valve visibility unlock, a revenue figure, or proof of organic acquisition. [Steamworks user-review documentation](https://partner.steamgames.com/doc/store/reviews).

### C3. Q2 status and the next evidence gate

The website includes a separately labelled **June-only public Steam catalogue proxy**, detailed in C4 below. It is **not** full Q2 coverage. Its 2,102 included app records cannot be extrapolated to April–June. Current store tags, September review counts and displayed release dates also differ from HTMAG's hand-classified April snapshot; the two datasets must not be spliced together.

Until a complete, same-taxonomy Q2 export exists, use the quarterly views to generate research questions—not rank “best genres” by fabricated rates. The next gate is reconciliation: identify every release, classify supply and hits together, document the cutoff, and explain unmatched records before interpreting any apparent market gap.


### C4. June-only evidence available in the website

The Q2 view also includes a separately labelled public-store subcohort: 2,102 unique apps with displayed June 2026 release dates. In the September 2 capture, 45 already displayed at least 1,000 scored reviews, 677 had a non-language-specific numerical count below the threshold, and 1,380 remained unresolved. Missing numerical tooltips were not converted to zero. Twenty-four overlapping tag rows are available. These are original counts from the included public records, not published HTMAG figures or full-Q2 totals.

The capture saved 30 consecutive public search pages whose dates bracketed June, then stopped after an HTTP error. April and most of May are missing. Anonymous US catalogue visibility can omit products; displayed 1.0 release dates can follow earlier Early Access, and lifetime reviews may predate June. Exact hit rates remain unavailable. The website offers the app-level evidence export with request URLs, retrieval timestamps, exclusion decisions and source-response hashes. Raw local paths are omitted.

Sources: [Steam public catalogue](https://store.steampowered.com/search/?sort_by=Released_DESC&category1=998&l=english&cc=us), [Valve review-score definitions](https://partner.steamgames.com/doc/store/reviews), [Valve tag definitions](https://partner.steamgames.com/doc/store/tags). Use these records for further verification, not as evidence of a complete or causal market-demand estimate.
