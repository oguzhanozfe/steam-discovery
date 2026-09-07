export type EvidenceLevel = 'Primary' | 'Observed' | 'Reported' | 'Estimated';
export type SignalLevel = 'Breakout' | 'Viral' | 'Strong' | 'Control';
export type ResearchView = 'hub' | 'radar' | 'solo' | 'guides' | 'stories' | 'analysis' | 'gdd' | 'explorer' | 'cases' | 'market' | 'ideas' | 'reading' | 'playbook' | 'progress' | 'survival' | 'methodology';

export type TimelineEvent = {
  date: string;
  channel: string;
  title: string;
  action: string;
  result: string;
  spend: string;
  source: string;
  sourceLabel: string;
  evidence: EvidenceLevel;
  attribution?: string;
};

export type GameCase = {
  id: string;
  title: string;
  appId: string;
  period: string;
  genre: string;
  mode: 'Co-op' | 'Solo';
  team: string;
  devTime: string;
  hook: string;
  headlineMetric: string;
  metricLabel: string;
  signal: SignalLevel;
  productLoop: string;
  technicalHook: string;
  technicalSource?: string;
  clipHook: string;
  why: string[];
  lesson: string;
  caveat: string;
  events: TimelineEvent[];
};

export const cases: GameCase[] = [
  {
    id: 'content-warning',
    title: 'Content Warning',
    appId: '2881650',
    period: 'March–June 2024',
    genre: 'Co-op horror comedy · UGC loop',
    mode: 'Co-op',
    team: '5 credited developers + established Landfall platform',
    devTime: 'Mostly a one-month internal jam; Feb–Apr finish',
    hook: 'Film scary things, survive, then watch your own disastrous viral video together.',
    headlineMetric: '204,439',
    metricLabel: 'all-time peak CCU',
    signal: 'Viral',
    productLoop: 'A free copy recruits the group → voice and ASCII faces create identity → one scarce camera forces risky staging → physics creates unscripted failure → the team recovers the camera → a couch watch-party turns the run into a punchline → the saved WebM escapes the game and recruits the next group.',
    technicalHook: 'Online co-op, voice chat, a working in-game camera and saved recordings are official features. Local capture and clip encoding are possible prototype approaches, but the exact shipped codec and recording toolchain are not verified here.',
    technicalSource: 'https://landfall.se/content-warning-press-kit',
    clipHook: 'Confident intro → monster interruption → cameraman panic → couch replay and comments. The product edits a complete micro-story for the creator.',
    why: [
      'The player objective and the creator objective are identical: come home with an entertaining clip.',
      'The free-to-keep day removed four-player coordination friction and created urgency at the same time.',
      'The post-run watch party rewards failure and adds a second comedy peak.',
      'Low-poly bean silhouettes, ASCII faces and voice-reactive movement are readable at thumbnail size.',
    ],
    lesson: 'Do not copy “camera + monster.” Copy the closed loop that turns normal player behavior into a shareable artifact.',
    caveat: 'Not a clean zero-audience experiment: Landfall had an existing fanbase, an annual April Fools ritual, testing infrastructure and two credited PR/marketing partners. The press kit does not disclose paid-ad spend; zero spend is not established.',
    events: [
      {
        date: '8 Mar 2024', channel: 'Steam store', title: 'Very short public runway',
        action: 'SteamDB first saw the app roughly 24 days before launch.',
        result: 'The launch did not depend on a long public wishlist campaign.', spend: 'Undisclosed',
        source: 'https://steamdb.info/app/2881650/info/', sourceLabel: 'SteamDB', evidence: 'Observed',
        attribution: 'First-seen is a backend/store observation, not proof of the first public announcement.',
      },
      {
        date: '1 Apr 2024', channel: 'Landfall Day · Steam · earned press', title: 'Surprise launch + 24h free-to-keep',
        action: 'Landfall launched the game through its annual April Fools event and made it permanently free to claim for one day.',
        result: '6.6M free claims; the press kit reports about 204K concurrent players on 2 April.', spend: 'Paid advertising and PR costs not disclosed in the cited source',
        source: 'https://landfall.se/content-warning-press-kit', sourceLabel: 'Landfall press kit', evidence: 'Primary',
      },
      {
        date: '2–3 Apr 2024', channel: 'TikTok · X · YouTube · Twitch', title: 'Player clips become the campaign',
        action: 'Complete setup–failure–reaction clips circulated within hours. Archived examples showed roughly 201K–419K views each.',
        result: 'Temporal overlap with the CCU spike; the public data cannot attribute exact sales to individual clips.', spend: 'Sponsorship not disclosed',
        source: 'https://knowyourmeme.com/memes/subcultures/content-warning-video-game', sourceLabel: 'Archived social snapshots', evidence: 'Reported',
        attribution: 'Sequence supports a creator wave, not clip-level causality.',
      },
      {
        date: '2–8 Apr 2024', channel: 'Paid Steam release · word of mouth', title: 'The free spike converts into paid demand',
        action: 'The price switched to $7.99 after the free window.',
        result: '>100K paid copies on the first paid day; >700K during week one.', spend: 'Price: $7.99; media spend undisclosed',
        source: 'https://www.pcgamer.com/games/horror/steam-smash-hit-content-warning-has-sold-over-700000-copies-after-giving-away-6-million-free-copies/', sourceLabel: 'Landfall CEO interview · PC Gamer, 11 Apr', evidence: 'Reported',
      },
      {
        date: '3 Jun 2024', channel: 'Developer milestone · press', title: 'Long-tail milestone',
        action: 'Landfall published a new paid-sales milestone after the initial giveaway.',
        result: '2.2M paid copies and 8.8M total players/owners reported.', spend: 'N/A',
        source: 'https://www.gamedeveloper.com/business/content-warning-sells-2-2-million-copies-nets-8-8m-players-in-two-months', sourceLabel: 'Game Developer', evidence: 'Reported',
      },
    ],
  },
  {
    id: 'repo', title: 'R.E.P.O.', appId: '3241660', period: 'February–March 2025',
    genre: 'Physics extraction horror', mode: 'Co-op', team: 'Small veteran semiwork team', devTime: 'Fast-failure pivot after a six-year prior game',
    hook: 'Tiny robots must physically carry one fragile, oversized valuable together while monsters interrupt.',
    headlineMetric: '271,571', metricLabel: 'all-time peak CCU', signal: 'Viral',
    productLoop: 'Find valuables → several players grip one awkward object → noise and damage destroy value → monsters collide with the same task → extract quota → buy tools and upgrades → repeat deeper.',
    technicalHook: 'Unity + Photon PUN and Photon Voice. Photon simplified rooms, regions and voice, but semiwork says smooth networked physics still required extensive custom work.',
    technicalSource: 'https://blog.photonengine.com/r-e-p-o-multiplayer-success-powered-by-photon/',
    clipHook: 'Three grab-beams fight a grand piano through a doorway; a monster joins the pileup and the value shatters while the robots visibly mouth every scream.',
    why: ['The team killed a haunted-cleaning design because parallel chores split friends apart.', 'A shared heavy object keeps the goal, camera and jokes in the same frame.', 'Voice drives avatar animation, so reactions remain readable even without face-cam.', 'The detailed reveal-to-paid-launch window was only 20 days.'],
    lesson: 'Forced co-presence beats four independent chores. The hero interaction should be impossible to optimize into silence.',
    caveat: 'The store describes four levels and 29 enemies in its current Early Access state as checked 2 September 2026, not necessarily at launch. The multiplayer systems validate the loop, not a three-week production scope.',
    events: [
      {date:'6 Feb 2025',channel:'YouTube · Steam',title:'Compact reveal runway',action:'semiwork published the teaser and opened the detailed public launch arc.',result:'The teaser later showed roughly 130K views in an early-April snapshot.',spend:'Undisclosed',source:'https://www.youtube.com/watch?v=C3IVB0Wnk1s',sourceLabel:'Official teaser',evidence:'Primary'},
      {date:'26 Feb 2025',channel:'Steam Early Access',title:'Paid launch at $9.99',action:'R.E.P.O. released only 20 days after the formal teaser.',result:'The game entered its creator wave without a public demo or Next Fest in this arc.',spend:'Undisclosed',source:'https://store.steampowered.com/app/3241660/REPO/',sourceLabel:'Steam',evidence:'Observed'},
      {date:'26 Feb–19 Mar',channel:'TikTok · X · creators',title:'Repeatable physics punchlines',action:'Large creators and players circulated clips built around fragile-object failures and voice-reactive robots.',result:'Archived examples ranged from roughly 1.2M to 1.9M views.',spend:'No sponsorship evidence; unknown',source:'https://knowyourmeme.com/memes/subcultures/repo',sourceLabel:'Archived social snapshots',evidence:'Reported',attribution:'Views and CCU move together in time; no referral data proves per-clip conversion.'},
      {date:'23 Mar 2025',channel:'Steam network effects',title:'Peak demand',action:'Creator coverage, reviews and multiplayer word of mouth compounded.',result:'SteamDB all-time peak: 271,571 CCU.',spend:'Undisclosed',source:'https://steamdb.info/app/3241660/charts/',sourceLabel:'SteamDB',evidence:'Observed'},
    ],
  },
  {
    id: 'peak', title: 'PEAK', appId: '3527290', period: 'February–August 2025',
    genre: 'Co-op climbing · shared failure', mode: 'Co-op', team: '3 Aggro Crab + 4 Landfall collaborators', devTime: '1-month jam; ~4 months to launch',
    hook: 'Climb one daily mountain together; one exhausted friend can peel the whole human chain off the cliff.',
    headlineMetric: '1M / 6d', metricLabel: 'official early sales milestone', signal: 'Breakout',
    productLoop: 'Shared daily mountain → stamina and afflictions → scarce tools, ropes and rescue → checkpoint → chain-reaction falls → tomorrow’s map resets the conversation.',
    technicalHook: 'A developer explained in June 2025 that maps are generated and baked in advance, then included in the game files for rotation. This is evidence for a bounded content pipeline, not unlimited runtime generation. The exact networking authority model is not established here.',
    technicalSource: 'https://steamcommunity.com/app/3527290/discussions/0/592900729836930200/#c592900729836933748',
    clipHook: 'One scout dangles, two rescuers form a human chain, stamina empties, then everyone ragdolls down the mountain.',
    why: ['One verb—climb—is instantly readable.', 'The rescue mechanic makes another player the scarce resource.', 'A daily seed gives creators a shared topic without building endless content.', 'An 18-second teaser showed the complete social promise four days before launch.'],
    lesson: 'Narrow verb + four players + one daily variation source can outperform feature volume.',
    caveat: 'Two established studios and their audiences are a major distribution confound. The “one-month game” story omits several more months of finishing and polish.',
    events: [
      {date:'12 Jun 2025',channel:'Existing game community · Steam announcement',title:'Reveal and cross-promotion',action:'Aggro Crab announced PEAK to its existing Another Crab’s Treasure Steam community.',result:'The announcement preceded the 16 June launch by four days; no referral conversion metric was disclosed.',spend:'Undisclosed',source:'https://store.steampowered.com/news/app/1887840/view/644691200809369614',sourceLabel:'Official Steam news',evidence:'Primary'},
      {date:'12–14 Jun 2025',channel:'Steam · short-form social',title:'Two micro-teasers',action:'An 18-second reveal and a 21-second follow-up compressed the entire climbing failure fantasy.',result:'The release date was only four days away.',spend:'Undisclosed',source:'https://www.gamedeveloper.com/business/aggro-crab-side-hustle-peak-has-sold-100-000-copies-in-24-hours',sourceLabel:'Game Developer',evidence:'Reported'},
      {date:'16–25 Jun 2025',channel:'Steam launch · creators',title:'Low-price breakout',action:'Launched at a $5 introductory price against a $7.99 list price.',result:'100K copies in 24h, 1M in 6 days, 2M by day 9.',spend:'Undisclosed',source:'https://store.steampowered.com/news/app/3527290?emclan=103582791475178324&emgid=498325386812195119',sourceLabel:'Developer milestone',evidence:'Primary'},
      {date:'11–17 Aug 2025',channel:'Steam update · Discord Quest',title:'Content update reactivates demand',action:'The Mesa update changed the climb and gave the community another shared event.',result:'A new all-time peak of 170,759 CCU on 17 August.',spend:'Undisclosed',source:'https://steamdb.info/app/3527290/charts/',sourceLabel:'SteamDB',evidence:'Observed',attribution:'The timing is clear; exact contribution of the Quest versus update is not public.'},
    ],
  },
  {
    id:'rv-there-yet',title:'RV There Yet?',appId:'3949040',period:'August–November 2025',genre:'Shared-vehicle physics comedy',mode:'Co-op',team:'4-person prototype; experienced veteran team',devTime:'1-week jam + ~8 weeks finish',
    hook:'Four chain-smoking dads must winch one fragile RV through a road that hates them.',headlineMetric:'1.29M',metricLabel:'copies in under one week',signal:'Breakout',
    productLoop:'Drive one RV → spot, winch, bridge and repair together → terrain compounds mistakes → checkpoint or catastrophic tumble → fast recovery/restart.',
    technicalHook:'Unreal, 1–4 players, proximity voice and one shared network-critical vehicle. Concentrating physics authority in one hero object is structurally safer than synchronizing dozens of valuables.',
    clipHook:'Calm dad planning → RV hangs over a canyon → winch slingshots → the only shared asset tumbles while everyone yells.',
    why:['One hero object concentrates attention and blame.', '“Dadcore road trip” gives generic physics comedy a specific identity.', 'The trailer-to-launch gap was only eight days.', 'Failure is mechanically legible even with audio off.'],
    lesson:'For a rapid co-op slice, synchronize one important object and make every role depend on it.',
    caveat:'Still roughly nine weeks, with veteran developers, prior working chemistry and a reported Valve takeover. It is the closest rapid-scope proof here, not a three-week guarantee.',
    events:[
      {date:'Before the Oct 2025 reveal · exact date unverified',channel:'Early store discovery · social',title:'Store presence discovered',action:'A secondary account describes the hidden page being found before the formal reveal and an unfinished-assets post attracting attention.',result:'The cited summary does not establish a precise event date or defensible historical view count.',spend:'Undisclosed',source:'https://gamedev.net/news/4042-you-just-look-at-the-number-and-go-what-happened-the-developers-of-rv-there-yet/',sourceLabel:'GameDev.net summary of GamesIndustry.biz',evidence:'Reported'},
      {date:'13 Oct 2025',channel:'Steam · trailer',title:'Eight-day launch runway',action:'The official announcement led directly into release.',result:'A very short campaign worked because the product hook and existing context were already strong.',spend:'Undisclosed',source:'https://steamdb.info/app/3949040/history/',sourceLabel:'SteamDB history',evidence:'Observed'},
      {date:'21–26 Oct 2025',channel:'Steam · creators · reported takeover',title:'Paid launch at $7.99',action:'The shared-vehicle clips and platform placement compounded rapidly.',result:'100,002 peak CCU; 1,288,515 copies in under one week.',spend:'Undisclosed',source:'https://www.gamedeveloper.com/business/rv-there-yet-has-cruised-towards-1-3-million-sales-in-just-one-week',sourceLabel:'Game Developer',evidence:'Reported'},
    ],
  },
  {
    id:'sir-orc',title:'Sir, We Have an Orc Problem',appId:'4594150',period:'March–August 2026',genre:'Incremental tower defense · crowd physics',mode:'Solo',team:'2 experienced developers',devTime:'A little over 4 months',
    hook:'A familiar tower-defense loop, except the screen fills with tens of thousands of physics-driven orcs.',headlineMetric:'200K',metricLabel:'copies in 20 days',signal:'Breakout',
    productLoop:'Place defenses → visibly multiply damage and crowd size → survive escalating waves → choose upgrades → produce a more absurd screen each run.',
    technicalHook:'The marketing surface is also the engineering challenge: crowd illusion, batching/instancing, simple agents and readable knockback at extreme scale.',
    clipHook:'A calm defense line meets 10,000 orcs; one upgrade triggers a screen-wide physics avalanche.',
    why:['A known Steam loop is readable immediately.', 'The 10,000× visual variable is legible in the first two seconds.', 'Raw work-in-progress Shorts validated the fantasy before the store page.', 'The demo proved playtime, not just views.'],
    lesson:'Start with a familiar loop, exaggerate one visual variable and publish the ugly-but-clear proof early.',
    caveat:'The two-person count hides 10+ years of programming and 5+ years of professional game experience. The final game still took more than four months.',
    events:[
      {date:'Early Apr 2026',channel:'TikTok · Reels · Shorts',title:'Raw WIP clips first',action:'The developers spent roughly 10–15 minutes per day posting direct capture of huge physics crowds.',result:'Several clips passed 100K views; viewers asked for a Steam page.',spend:'Organic; tools/time only',source:'https://howtomarketagame.com/2026/08/18/the-week-of-the-golden-age/',sourceLabel:'HTMAG',evidence:'Reported'},
      {date:'9 Apr 2026',channel:'Steam page',title:'Route existing attention to wishlists',action:'The page went live after the short-form hook was already demonstrated.',result:'900 day-one wishlists; about 3K in two weeks.',spend:'Undisclosed',source:'https://www.reddit.com/r/gamedev/comments/1v9z4vi/we_made_361657_gross_revenue_in_the_first_24/',sourceLabel:'Developer postmortem',evidence:'Primary'},
      {date:'30 Apr–Jun 2026',channel:'Playtest · demo · Next Fest',title:'Trial becomes the durable signal',action:'An open playtest led to creator discovery; the demo then entered Next Fest.',result:'Demo median 1h26m; 36K festival players; +18K festival wishlists; #41 demo.',spend:'$200 showcase test had no measurable lift',source:'https://howtomarketagame.com/2026/08/18/the-week-of-the-golden-age/',sourceLabel:'HTMAG',evidence:'Reported'},
      {date:'28 Jul–17 Aug 2026',channel:'Steam launch',title:'Momentum converted',action:'Launched with roughly 150K wishlists and a 10% discount.',result:'$361,657 gross in 24h; 200K copies in 20 days.',spend:'Undisclosed',source:'https://www.reddit.com/r/gamedev/comments/1v9z4vi/we_made_361657_gross_revenue_in_the_first_24/',sourceLabel:'Developer postmortem',evidence:'Primary'},
    ],
  },
  {
    id:'bills',title:'Bills Must Be Paid',appId:'4421010',period:'January–August 2026',genre:'Tactile 3D incremental · pressure clock',mode:'Solo',team:'2 developers with mobile/web experience',devTime:'7 months',
    hook:'Smash piggy banks and compound your power before the bill deadline catches you.',headlineMetric:'330K',metricLabel:'copies in 20 days',signal:'Breakout',
    productLoop:'Physically break value nodes → buy faster/more satisfying tools → compound cash → race one visible bill deadline → reset stronger.',
    technicalHook:'A small physical space, satisfying breakage, strong feedback and a single escalating economy. The marketability comes from tactile 3D, not from spreadsheet depth.',
    clipHook:'A tiny hammer becomes a room-clearing money machine seconds before the bill timer expires.',
    why:['The demo—not the initial announcement—created the first durable daily wishlist floor.', 'A pressure rule gives generic number growth a story.', 'Low price and tactile destruction made the loop easy to sample.', 'A failed ad test provides unusually useful counterfactual evidence.'],
    lesson:'Paid traffic cannot rescue weak product evidence. Spend after a demo or clip raises the organic baseline, not before.',
    caveat:'Success came after seven months and intensive creator outreach. The revenue numbers are developer-reported gross, not net proceeds.',
    events:[
      {date:'14 Feb–20 Apr 2026',channel:'Steam page · Reddit ads',title:'A weak start stays weak',action:'The page launched and the team tested $200 of trackable Reddit traffic.',result:'528 wishlists in 65 days; only 19 tracked wishlists from ads (~$10.53 each).',spend:'$200 disclosed',source:'https://www.reddit.com/r/gamedev/comments/1va2gtb/releasing_with_61000_wishlists_2_person_what_we/',sourceLabel:'Developer postmortem',evidence:'Primary'},
      {date:'21 Apr–May 2026',channel:'Steam demo · Trending Free',title:'The real inflection: playable proof',action:'The public demo reached enough simultaneous players to enter a Steam discovery surface.',result:'340 first-day peak CCU; roughly 384 wishlists/day afterward; 80K+ demo users and 36m median playtime.',spend:'Undisclosed',source:'https://howtomarketagame.com/2026/08/20/part-2-the-week-of-the-golden-age/',sourceLabel:'HTMAG',evidence:'Reported'},
      {date:'15 Jun 2026',channel:'Steam Next Fest',title:'Festival on top of momentum',action:'The game entered with 15,623 wishlists rather than asking the festival to create demand from zero.',result:'Approximately +7K wishlists during the festival.',spend:'Festival participation',source:'https://howtomarketagame.com/2026/08/20/part-2-the-week-of-the-golden-age/',sourceLabel:'HTMAG',evidence:'Reported'},
      {date:'29 Jul–18 Aug 2026',channel:'Personal Calendar · launch',title:'Calendar + discount conversion',action:'The date was locked early; the game launched at $6.99 with a 30% discount and 61K+ wishlists.',result:'$163,842 gross in 24h; 330K copies in 20 days.',spend:'Undisclosed',source:'https://www.reddit.com/r/gamedev/comments/1va2gtb/releasing_with_61000_wishlists_2_person_what_we/',sourceLabel:'Developer postmortem',evidence:'Primary'},
    ],
  },
  {
    id:'how-many-dudes',title:'How Many Dudes?',appId:'3934270',period:'July 2025–August 2026',genre:'Roguelike autobattler · absurd crowd',mode:'Solo',team:'7-person established studio',devTime:'One year idea-to-launch; ~10 months full production',
    hook:'Build a relic-powered army of hundreds of tiny dudes until the rules visibly break.',headlineMetric:'242K',metricLabel:'copies in 20 days',signal:'Strong',
    productLoop:'Recruit dudes → choose relic synergies → watch a huge readable battle → discover an absurd combo → restart with a new army story.',
    technicalHook:'Large-crowd readability, deterministic simulation and content-rich upgrade combinations; significantly beyond a three-week full-game scope.',
    clipHook:'A normal formation becomes a screen-filling horse-sized-duck or runaway army interaction in seconds.',
    why:['The team used a five-day jam to test whether streamers laughed within ten seconds.', 'Shorts produced spikes, but the long-running demo created the durable baseline.', 'The capsule redesign lifted average CTR 40.4% in their reported tests.', 'Tag repositioning improved who Steam showed the game to.'],
    lesson:'Social is kindling; a good demo and Steam surfaces are the logs. Do not confuse a view spike with a new baseline.',
    caveat:'A seven-person, 14-year-old studio with mature pipelines. Festival increment is reported with two different definitions: +6K above baseline vs 15.8K gross-period wishlists.',
    events:[
      {date:'30 Jul–3 Aug 2025',channel:'GMTK Game Jam',title:'Prototype behavior test',action:'The team built the original loop in five days and watched creators play it.',result:'Streamers laughed within the first 10 seconds and played for roughly 30 minutes.',spend:'Team time',source:'https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/',sourceLabel:'Developer timeline',evidence:'Primary'},
      {date:'8 Aug–Sep 2025',channel:'Steam · Shorts',title:'Small page, useful clip spikes',action:'The first two weeks produced 422 wishlists; two Shorts then tested exaggerated visual moments.',result:'A 40K-view Short added 293 wishlists; a 113K-view Short added 446.',spend:'Organic; production time',source:'https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/',sourceLabel:'Developer timeline',evidence:'Primary'},
      {date:'16–31 Dec 2025',channel:'Steam demo · Shorts · creators',title:'Demo creates a discovery flywheel',action:'The demo launched in a low-competition holiday window; multiple Shorts and creator videos stacked.',result:'+36,946 wishlists in December; demo peak 1,914; year-end total 43,324.',spend:'Undisclosed',source:'https://howtomarketagame.com/2026/08/21/part-3-the-week-of-the-golden-age-how-many-dudes/',sourceLabel:'HTMAG',evidence:'Reported'},
      {date:'30 Jul–21 Aug 2026',channel:'Creators · Personal Calendar · launch',title:'One year of demand converges',action:'Launched with 308,101 wishlists at $14.99 and a 35% discount.',result:'67K copies in 24h; 242K in 20 days; cost recouped in five days.',spend:'Showcases cost thousands; reported weak incremental lift',source:'https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/',sourceLabel:'Developer timeline',evidence:'Primary'},
    ],
  },
  {
    id:'yapyap',title:'YAPYAP',appId:'3834090',period:'July 2025–March 2026',genre:'Voice-driven co-op horror comedy',mode:'Co-op',team:'About 10 people; previous BAPBAP audience',devTime:'Roughly one year to launch',
    hook:'Your voice is not decoration: yelling and spell-like sound are part of the co-op rule set.',headlineMetric:'1M / 6w',metricLabel:'developer-reported sales milestone',signal:'Viral',
    productLoop:'Enter together → make noise/voice decisions that affect the world → trigger social mistakes → survive the escalation → repeat with new group stories.',
    technicalHook:'Online co-op, voice input, proximity chat and live-content maintenance. The voice rule is the differentiator; extraction-horror structure alone is not.',
    clipHook:'A spoken command or scream directly causes the next disaster, so the audio is both caption and punchline.',
    why:['One TikTok concept post reportedly earned 288K likes months before launch.', 'The demo ranked #3 by unique players among 2,900+ October Next Fest demos.', 'The mechanic gives creators a spoken, repeatable challenge.', 'The prior game supplied an initial community and technical base.'],
    lesson:'A social mechanic should change the simulation, not merely add proximity chat to a familiar quota loop.',
    caveat:'About ten people, a prior audience and roughly 900K launch wishlists make this a demand proof—not a five-person, three-week production comparator. The October Medal campaign rewarded wishlisting and demo clips with free keys; those actions were incentivized, not purely unpaid word of mouth.',
    events:[
      {date:'Jul 2025',channel:'TikTok',title:'Concept-level short breaks out',action:'A voice-centered gameplay premise was shown before the public demo.',result:'One post reached roughly 288K likes, according to the developer interview.',spend:'Undisclosed',source:'https://newsletter.gamediscover.co/p/how-yapyap-jammed-its-way-to-1-million',sourceLabel:'GameDiscoverCo interview',evidence:'Reported'},
      {date:'10–20 Oct 2025',channel:'Demo · Steam Next Fest',title:'Trial validates the social hook',action:'The team used the festival to turn broad social interest into play behavior.',result:'#3 by unique demo players among 2,900+ participating demos.',spend:'Festival participation',source:'https://howtomarketagame.com/2025/10/20/steam-next-fest-october-2025-checking-in-on-the-games-that-broke-through/',sourceLabel:'HTMAG',evidence:'Reported'},
      {date:'13–20 Oct 2025',channel:'Medal.tv · incentivized demo clips',title:'Free-key reward campaign',action:'Medal offered full-game Steam keys to the first 3,000 eligible users who wishlisted and posted a demo clip.',result:'The campaign page later states all keys were redeemed. This is an incentive allocation, not 3,000 paid sales or proven incremental wishlists.',spend:'3,000 keys offered; cash partnership costs undisclosed',source:'https://medal.tv/blog/posts/how-to-get-a-free-copy-of-yapyap-from-medal',sourceLabel:'Medal campaign terms',evidence:'Primary',attribution:'Incentivized clips and wishlisting cannot be labeled purely organic. No controlled conversion lift is disclosed.'},
      {date:'3 Feb–18 Mar 2026',channel:'Steam launch · creators',title:'Large wishlist base converts',action:'Released after an estimated 900K launch wishlists. The earlier Medal campaign belongs to the October demo window.',result:'1M copies in about six weeks, reported in the later developer interview.',spend:'Undisclosed',source:'https://newsletter.gamediscover.co/p/how-yapyap-jammed-its-way-to-1-million',sourceLabel:'GameDiscoverCo interview',evidence:'Reported'},
    ],
  },
  {
    id:'roadside-research',title:'Roadside Research',appId:'3643170',period:'2025–February 2026',genre:'Job sim · hidden-role co-op',mode:'Co-op',team:'Development scope undisclosed',devTime:'Not publicly established',
    hook:'Run a familiar gas station while secretly being aliens trying not to look suspicious.',headlineMetric:'300K',metricLabel:'copies in two weeks',signal:'Strong',
    productLoop:'Perform readable service-job chores → pursue a conflicting alien objective → watch suspicion rise → improvise with friends → upgrade the station and repeat.',
    technicalHook:'Job-sim interactions plus co-op state and customer AI. The differentiator is the conflicting secret objective, not the gas-station checklist.',
    clipHook:'A normal customer interaction collapses because one alien performs a clearly inhuman shortcut while the team tries to cover it up.',
    why:['A familiar job fantasy reduces onboarding.', 'The alien objective creates comic contradiction instead of generic task efficiency.', 'A top-50 Next Fest demo established playable demand.', 'Creator stories arise from suspicion and cover-ups.'],
    lesson:'Add one conflicting secret goal to a known job loop; do not just reskin the workplace.',
    caveat:'Production duration and team size are not public enough for a fair scope comparison. Sales are publisher/developer-reported.',
    events:[
      {date:'2025',channel:'Steam demo · Next Fest',title:'Playable discovery first',action:'The game used a public demo and festival exposure before Early Access.',result:'Reported as a top-50 Next Fest demo.',spend:'Undisclosed',source:'https://store.steampowered.com/app/3643170/Roadside_Research/',sourceLabel:'Steam',evidence:'Observed'},
      {date:'12–26 Feb 2026',channel:'Steam Early Access · creators',title:'The contradictory fantasy travels',action:'Creators could explain the premise in one sentence and generate suspicion-driven failures.',result:'300K copies in two weeks; 9K+ peak CCU and 35K DAU reported.',spend:'Undisclosed',source:'https://www.dlh.net/en/news/88152/roadside-research-surpasses-300k-sales-in-two-weeks.html',sourceLabel:'Sales announcement',evidence:'Reported'},
    ],
  },
  {
    id:'how-to-fish',title:'How to Fish',appId:'4001890',period:'August 2026',genre:'Co-op fishing · weapons · gambling',mode:'Co-op',team:'Two co-founders; broader credits not fully established',devTime:'Not publicly established',
    hook:'Catch fish, weaponize the trip, sell the haul and turn a calm hobby into a chaotic group economy.',headlineMetric:'1M / 2d',metricLabel:'reported sales milestone',signal:'Viral',
    productLoop:'Fish → improvise with weapons and trick shots → sell → gamble/reinvest → create a bigger social disaster on the next trip.',
    technicalHook:'The useful market signal is the violent contrast and low-price group proposition; the full shipped scope is not a three-week comparator.',
    clipHook:'A recognizable relaxing activity is interrupted by a weapon, gamble or trick-shot failure that needs no explanation.',
    why:['A globally understood activity is twisted by several high-contrast verbs.', 'The reported $4.95 launch price reduces group friction.', 'The premise produces clips without relying on horror.', 'The August 2026 result shows current co-op-comedy demand, not only a 2024 trend.'],
    lesson:'“Friendslop” demand is broader than dark extraction horror; familiar leisure activities can carry the same social-failure engine.',
    caveat:'The result is extremely recent. Alinea reports that Landfall financially supported the game; this is not an unsupported zero-budget comparator. Public sources do not expose a defensible full marketing timeline or spend breakdown.',
    events:[
      {date:'20 Aug 2026',channel:'Steam launch · creators',title:'Low-price co-op release',action:'Launched as a compact “fish, sell, escalate” multiplayer comedy at a reported $4.95 launch price.',result:'1M copies reported in two days.',spend:'Undisclosed',source:'https://www.gamesradar.com/games/co-op/latest-steam-lottery-winner-how-to-fish-sells-1-million-copies-in-2-days-yes-well-be-adding-more-content/',sourceLabel:'GamesRadar',evidence:'Reported'},
      {date:'25 Aug 2026',channel:'Steam network effects',title:'Large group-demand peak',action:'Streams, reviews and word of mouth compounded after launch.',result:'SteamDB peak reached roughly 374K concurrent players within five days.',spend:'Undisclosed',source:'https://www.gamesradar.com/games/co-op/amid-the-friendslop-renaissance-usd5-co-op-fishing-game-hits-370-000-peak-players-on-steam-in-5-days/',sourceLabel:'GamesRadar / SteamDB',evidence:'Reported'},
    ],
  },
  {
    id:'headliners-control',title:'The Headliners',appId:'3059070',period:'January 2025–September 2026',genre:'Photojournalist co-op horror',mode:'Co-op',team:'Indie team; scope not used as benchmark',devTime:'Not used as benchmark',
    hook:'Photograph monsters as a team of journalists and bring the evidence home.',headlineMetric:'6,315',metricLabel:'all-time peak CCU',signal:'Control',
    productLoop:'Enter dangerous city → take still photos → score evidence → survive/extract → repeat.',
    technicalHook:'Still-image scoring is cheaper than video recording, but it produces a weaker built-in performance artifact.',
    clipHook:'A dangerous photo attempt can create a story, but the game does not automatically package the full setup–failure–reaction arc.',
    why:['It validates that “camera + monsters” alone does not reproduce Content Warning scale.', 'Still photos are easier to implement but less expressive than a replayable video.', 'The comparison is useful as a falsifier, not proof of one causal difference.'],
    lesson:'A thematic clone is not a loop clone. The shareable output must preserve performance and reaction, not only proof of a monster.',
    caveat:'This is not a commercial failure: retrieved owner models are roughly 1.17M–1.22M (estimates, not paid-sales disclosure). Many variables differ from Content Warning, so the comparison cannot isolate recording as the cause. The photo-horror niche is already occupied.',
    events:[
      {date:'30 Jan 2025',channel:'Steam launch',title:'Related fantasy reaches market',action:'A 1–8 player journalist/photo horror game launched with a legible adjacent pitch.',result:'The public timeline does not show a Content Warning-sized breakout.',spend:'Undisclosed',source:'https://store.steampowered.com/app/3059070/The_Headliners/',sourceLabel:'Steam',evidence:'Observed'},
      {date:'2 Feb 2025',channel:'Steam network',title:'Peak benchmark',action:'The launch cohort reached its observed maximum concurrency.',result:'SteamDB all-time peak: 6,315 CCU.',spend:'Undisclosed',source:'https://steamdb.info/app/3059070/charts/',sourceLabel:'SteamDB',evidence:'Observed'},
    ],
  },
];

export const marketStats = [
  { value: '17,480', label: 'Steam releases in 2026 YTD', note: 'SteamDB snapshot, 2 Sep 2026', source: 'https://steamdb.info/stats/releases/' },
  { value: '~26K', label: 'simple annualized pace', note: 'Own arithmetic: 17,480 / 245 × 365. Ignores seasonality.', source: 'https://steamdb.info/stats/releases/' },
  { value: '2.99%', label: '2025 launches with 1,000+ reviews', note: '608 / 20,282 in HTMAG/VGI cohort', source: 'https://howtomarketagame.com/2026/01/27/what-the-hell-happened-in-2025/' },
  { value: '38 : 1', label: '0–9 review games per 1K+ review game', note: 'Q1 2026 young-cohort snapshot', source: 'https://howtomarketagame.com/2026/05/14/2026-q1-games/' },
];

export const reachDictionary = [
  { metric: '100–200K social views', meaning: 'Awareness test', use: 'Good for hook validation only. Pair with tagged Steam visits and same-day wishlist delta.' },
  { metric: '100–200K wishlists', meaning: 'Breakout intent', use: 'A very strong prelaunch outcome—not a realistic three-week baseline.' },
  { metric: '100–200K paid units', meaning: 'Commercial outcome', use: 'Requires a developer/publisher disclosure. Reviews and owner models cannot confirm this threshold.' },
  { metric: '$100–200K gross', meaning: 'Revenue, not reach', use: 'Do not multiply owners by list price. Discounts, regions, refunds, tax and platform share change the economics.' },
  { metric: '100–200K Steam impressions', meaning: 'Private discovery metric', use: 'Only the developer can read exact impressions in Steamworks traffic reports.' },
];

export const niches = [
  { name:'Open-world survival craft', hits:15, supply:72, rate:20.83, fit:'Very low', direction:'Demand strong; scope impossible' },
  { name:'Farming', hits:5, supply:60, rate:8.33, fit:'Low', direction:'Strong but falling from 20.8%' },
  { name:'Roguelike deckbuilder', hits:11, supply:212, rate:5.19, fit:'Medium–low', direction:'Proven; content/balance crowded' },
  { name:'Simulation', hits:43, supply:1048, rate:4.10, fit:'High', direction:'Rising; first-person micro-job is viable' },
  { name:'Management', hits:19, supply:549, rate:3.46, fit:'Medium', direction:'Demand exists; deep systems are risky' },
  { name:'Horror', hits:39, supply:1208, rate:3.23, fit:'Medium', direction:'Hit count rising; generic horror crowded' },
  { name:'Idle / incremental', hits:27, supply:965, rate:2.80, fit:'High', direction:'Stable; tactile visual twist required' },
  { name:'Racing', hits:14, supply:654, rate:2.14, fit:'Medium', direction:'Improving; party sabotage is interesting' },
  { name:'Tower defense', hits:9, supply:511, rate:1.76, fit:'High', direction:'Better when fused with incremental spectacle' },
  { name:'Puzzle', hits:14, supply:4022, rate:0.35, fit:'Low', direction:'Huge supply; needs another demand-bearing genre' },
  { name:'2D platformer', hits:3, supply:1658, rate:0.18, fit:'Very low', direction:'Worst risk-adjusted default for this brief' },
];

export type Idea = {
  rank:number; id:string; name:string; tagline:string; mode:string; risk:string;
  score:{market:number; build:number; clip:number; differentiation:number};
  thesis:string; gap:string; loop:string[]; comparables:{name:string; borrow:string; spin:string}[];
  mvp:string[]; tech:string[]; marketing:string[]; pros:string[]; cons:string[]; kill:string;
};

export const ideas: Idea[] = [
  {
    rank:1,id:'refund-department',name:'REFUND DEPARTMENT',tagline:'Inspect absurd online returns before the products inspect you.',mode:'Solo first-person job sim',risk:'Low–medium',
    score:{market:9,build:9,clip:8,differentiation:9},
    thesis:'The safest intersection is a one-room tactile job sim with horror pressure and gambling-like “open it or refund it” decisions.',
    gap:'Simulation produced 43 ≥1K-review hits in 2025, while horror hit rate rose from 1.81% to 3.23%. The opening is not another convenience-store clone; it is a specific current job plus a conflicting risk decision.',
    loop:['Scan a return and read the customer claim.','Choose safe refund, reject, or risk opening the package.','Physically test an absurd product while the depot changes.','Hit a nightly quota before one cursed/scam item escapes.'],
    comparables:[
      {name:'The Cabin Factory',borrow:'Fast anomaly inspection',spin:'Physical product testing and an economy, not only spot-the-difference.'},
      {name:'Shift at Midnight',borrow:'Night-shift workplace tension',spin:'E-commerce returns, scams and unboxing are more current and item-driven.'},
      {name:'Buckshot Roulette',borrow:'One-room risk clarity',spin:'A workplace decision tree with comedy props instead of a pure duel.'},
    ],
    mvp:['One depot counter and one back-room lane.','10–12 return packages; 3 genuinely dangerous.','Scanner, box cutter, test socket and reject chute.','One 8-minute shift, score screen and instant replay.'],
    tech:['No networking.','Physics only for hero products; fake background parcel volume.','Data-driven claim/product/anomaly table.','One enemy state machine triggered by wrong handling.'],
    marketing:['Day 3: “Customer says it arrived like this” unboxing clip.','Test three props with instantly different silhouettes.','CTA: “Would you refund this?” creates comments before a demo exists.','Target Steam Scream V and 2027 Shop Keeper Fest if timing permits.'],
    pros:['Best three-week delivery confidence.','One artist can own the entire thumbnail surface.','Current scam/AI-junk/return-culture theme.','Expandable through cheap item packs.'],
    cons:['Content density becomes the long-term cost.','Generic anomalies would look derivative.','Tactile handling must feel excellent.'],
    kill:'By day 6, five cold testers must understand the claim-versus-object contradiction in 10 seconds; otherwise replace the job fantasy, not add more packages.',
  },
  {
    rank:2,id:'qa-goblins',name:'1,000 QA GOBLINS vs ONE BUG',tagline:'Ship the build before one bug eats the entire sprint.',mode:'Solo incremental tower defense',risk:'Medium',
    score:{market:8,build:8,clip:10,differentiation:8},
    thesis:'A familiar defense loop plus one visually exaggerated variable is the strongest raw-short formula in the recent Golden Age cases.',
    gap:'Incremental supplied 27 ≥1K-review hits and simulation 43 in 2025. Generic pixel idlers are crowded; a tactile 3D crowd and a visible deadline create a clearer video promise.',
    loop:['Deploy tiny QA goblins around a failing build server.','Reproduce bugs to generate resources.','Turn fixes into increasingly absurd defenses.','Survive the two-minute compile deadline and ship.'],
    comparables:[
      {name:'Sir, We Have an Orc Problem',borrow:'Extreme crowd spectacle',spin:'Defense from the “inside”: QA workers multiply while bugs mutate.'},
      {name:'How Many Dudes?',borrow:'Readable tiny-army comedy',spin:'A short pressure run and workplace satire instead of a content-heavy roguelike.'},
      {name:'Vampire Survivors',borrow:'Instant swarm readability',spin:'Static server-defense composition and a visible software-build fantasy.'},
    ],
    mvp:['One desktop/server arena.','Three goblin roles, three bugs, four upgrades.','Two-minute run plus one catastrophic “ship” button.','Crowd target shown honestly as illusion/instancing, not full physics.'],
    tech:['GPU instancing or impostors for background crowd.','Only 20–40 nearby agents receive full animation/collision.','Grid/flow-field movement; no per-agent complex physics.','Deterministic upgrade table for fast balancing.'],
    marketing:['Post the first 100→1,000 goblin scale test before UI polish.','Three hooks: “one bug,” “Friday deploy,” “AI wrote the tests.”','Captioned build-failure countdown produces a complete 8-second arc.','2026 Auto-Battler RPG Fest is a possible later beat if tagging fits honestly.'],
    pros:['Best silent-GIF readability.','No netcode.','Extremely clear one-variable escalation.','The demo can be content-light.'],
    cons:['Performance work can consume the sprint.','Developer satire may narrow the audience.','If the crowd is visually flat, the whole premise disappears.'],
    kill:'By day 5, a raw capture must make the 10× crowd escalation obvious at phone size. If it does not, abandon the crowd tech before producing art.',
  },
  {
    rank:3,id:'group-chat-exorcist',name:'GROUP CHAT EXORCIST',tagline:'Moderate a cursed group chat while your apartment answers back.',mode:'Solo desk/phone horror',risk:'Low–medium',
    score:{market:8,build:9,clip:7,differentiation:9},
    thesis:'A low-system solo game can use current deepfake, bot and scam anxiety without competing on co-op infrastructure.',
    gap:'Horror demand is rising, but generic corridor jumpscares are oversupplied. UI-investigation games work when information errors change a physical space.',
    loop:['Read photos, voice notes and messages from eight contacts.','Decide who is human, compromised, a bot or already dead.','Reply, mute, invite or exorcise.','Wrong choices physically rewrite the apartment and the next chat thread.'],
    comparables:[
      {name:'Home Safety Hotline',borrow:'Interface-driven horror diagnosis',spin:'Live social relationships and apartment consequences.'},
      {name:'The Operator',borrow:'Cross-checking digital evidence',spin:'Comic group-chat writing and supernatural identity fraud.'},
      {name:"No, I'm not a Human",borrow:'Paranoia and classification',spin:'Remote moderation rather than door-to-door character production.'},
    ],
    mvp:['One apartment desk and one phone interface.','Eight contacts, three nights, 18 authored message beats.','Three apartment-state changes.','One 12–15 minute complete demo path.'],
    tech:['No networking.','Deterministic branching data; no generative AI dependency.','Subtitle-first audio notes; consent-safe fictional voices.','One room with state swaps rather than free-roam levels.'],
    marketing:['Show a funny message, then pan to its impossible physical consequence.','Use “Which one is the bot?” comment prompts.','Publish one contact as a recurring character series.','Do not market with real-person deepfake imitation.'],
    pros:['High build confidence.','Topical premise with strong writing identity.','Cheap to localize structurally.','No multiplayer support burden.'],
    cons:['Writing and UI polish are the content bottleneck.','Less kinetic than physics comedy.','Weak messages make the game feel like a static visual novel.'],
    kill:'By day 6, at least 70% of cold testers should argue about one identity decision without facilitator explanation. This is a proposed internal gate, not an industry benchmark.',
  },
  {
    rank:4,id:'cryptid-newsroom',name:'CRYPTID NEWSROOM',tagline:'Bring back three photos and print the worst possible front page.',mode:'1–4 player co-op horror comedy',risk:'Medium–high',
    score:{market:8,build:6,clip:9,differentiation:8},
    thesis:'Borrow Content Warning’s shareable-output principle but replace full video capture with cheap stills and an auto-composed tabloid artifact.',
    gap:'The Headliners shows that “camera + monster” is not enough. The missing piece is a post-run artifact with performance, editorial choice and a reason to share outside the game.',
    loop:['Enter one haunted suburb with three assigned headlines.','Stage or capture risky cryptid photos.','Return to the van before dawn.','Choose photo + headline + blame line; export a ridiculous front page.'],
    comparables:[
      {name:'Content Warning',borrow:'Capture → return → group review → export',spin:'Still-image tabloid composition avoids WebM/audio-mux complexity.'},
      {name:'The Headliners',borrow:'Journalist fantasy and photo risk',spin:'The newspaper is a designed social artifact, not only a score.'},
      {name:'Phasmophobia',borrow:'Team evidence gathering',spin:'Comedy, staging and publishing replace identification depth.'},
    ],
    mvp:['One modular cul-de-sac.','One cryptid with three states; two hazards.','Three photo assignments and simple framing/proximity scoring.','One tabloid template with five headline combinations.'],
    tech:['Known lobby/invite template only.','Host-authoritative monster and run timer.','Screenshot texture + deterministic layout; no video encoding.','No public matchmaking, servers, reconnect migration or procgen.'],
    marketing:['Every test session should yield one shareable newspaper image.','Seed 20–30 small horror/co-op creators with assigned “front-page missions.”','Trailer uses real group reactions but leads with the artifact.','Track creator-specific Steam links and 7-day wishlist baseline lift.'],
    pros:['A real Content Warning spin rather than a theme clone.','Built-in social output.','One map and one monster can sell the demo.','3D artist and marketer collaborate on the same artifact.'],
    cons:['Netcode and creature AI remain risky.','Photo scoring can feel unfair.','Still-image output must be much funnier than The Headliners’ score loop.'],
    kill:'By day 7, a stranger seeing only the generated front page must understand the run’s joke. If not, the artifact is decoration rather than the product loop.',
  },
  {
    rank:5,id:'dont-drop-cake',name:"DON'T DROP THE CAKE",tagline:'Carry one impossible wedding cake through a hotel built for disaster.',mode:'2–4 player physics ascent',risk:'High',
    score:{market:9,build:4,clip:10,differentiation:8},
    thesis:'PEAK and RV There Yet? show that one shared hero object creates stronger co-presence than four independent tasks.',
    gap:'Physics co-op is crowded, but most games make each body the objective. A fragile shared cake makes damage, blame and the final share image legible.',
    loop:['Each player grips/leans one side of the cake.','Cross a short hotel route with doors, stairs and one elevator failure.','Cake damage changes its silhouette and powers.','Deliver the remaining object and reveal the wedding photo.'],
    comparables:[
      {name:'PEAK',borrow:'Chain-reaction rescue and vertical failure',spin:'One fragile objective must arrive intact; bodies are replaceable.'},
      {name:'RV There Yet?',borrow:'One shared hero object and role dependence',spin:'A human-scale 6–8 minute route with visible damage.'},
      {name:'Chained Together',borrow:'Forced co-presence',spin:'Grip/tilt coordination and a comic delivery score, not only ascent.'},
    ],
    mvp:['One 6–8 minute hotel route.','One cake, three damage states, two hazards.','Two-player online target first; four only if existing netcode is proven.','Instant restart and final damaged-cake portrait.'],
    tech:['Host authority for the cake and run state.','Client authority for harmless avatar presentation.','One hero rigidbody assembly; no pile of synchronized props.','Existing proximity voice solution; amplitude drives face animation.'],
    marketing:['First clip: elevator door closes on the cake while both players blame each other.','Use real test audio, captions and the final portrait as thumbnail.','Pitch creators a 10-minute challenge, not an open-ended sandbox.','If online join is not stable by day 4, ship local/Remote Play video proof instead.'],
    pros:['Highest creator and short-form ceiling.','Simple sentence and visual stakes.','No authored joke dependency.','Final cake portrait is naturally shareable.'],
    cons:['Highest technical risk.','Networked physics can consume all polish time.','Camera and grip feel must be excellent.','Harder to produce enough route variety later.'],
    kill:'Day 4: two remote machines must complete the hero carry. Day 7: a cold group must produce a self-contained laugh clip inside three minutes. Otherwise cut online scope or stop.',
  },
];

export const htmagePosts = [
  {date:'16 Jun',title:'June 2026 Steam Next Fest Start',takeaway:'The first two days are noisy; the recommendation system starts sorting around Wednesday. Ads/outreach begun after the festival starts are usually too late.',url:'https://howtomarketagame.com/2026/06/16/june-2026-steam-next-fest-start/'},
  {date:'25 Jun',title:'How the Steam Personal Calendar affects launch',takeaway:'Set the launch date early enough to enter personalized calendars; two early cases saw 30%+ click-through, but the sample is tiny and personalized.',url:'https://howtomarketagame.com/2026/06/25/how-the-steam-personal-calendar-affects-your-launch/'},
  {date:'30 Jun',title:'Most people will play your demo and not wishlist it and that is ok',takeaway:'Demo-player → wishlist conversion clustered around 15.9%–23.2% (P30–P70); raw demo conversion weakly explained overall festival success.',url:'https://howtomarketagame.com/2026/06/30/nobody-plays-demos-and-that-is-ok/'},
  {date:'9 Jul',title:'You cannot over-expose your game',takeaway:'For indies, insufficient relative excitement is usually the problem—not audience fatigue.',url:'https://howtomarketagame.com/2026/07/09/you-cannot-over-expose-your-game/'},
  {date:'13 Jul',title:'Did AI slop ruin Steam Next Fest?',takeaway:'In a self-reported n=119 sample, games entering above 1K wishlists still performed better; the evidence does not support “slop made discovery impossible.”',url:'https://howtomarketagame.com/2026/07/13/did-ai-slop-ruin-steam-next-fest-june-2026/'},
  {date:'14 Jul',title:'Games that used momentum for Next Fest success',takeaway:'High base + high momentum: 28/34 reached 3K+ festival wishlists; low + low: 3/47. Momentum correlated slightly better than starting size; self-report caveats apply.',url:'https://howtomarketagame.com/2026/07/14/games-that-used-momentum-for-steam-next-fest-success/'},
  {date:'30 Jul',title:'Is friendslop saturated?',takeaway:'Demand still expanded across successive cohorts, but individual hits rapidly lost category share. Networking/support risk is not captured by the chart.',url:'https://howtomarketagame.com/2026/07/30/is-friendslop-saturated/'},
  {date:'11 Aug',title:'The state of virtual third-party festivals',takeaway:'470 festivals featured 31,285 distinct games; median participating game appeared in 2 events, P90 in 6. Festivals are abundant but uneven.',url:'https://howtomarketagame.com/2026/08/11/the-state-of-virtual-3rd-party-festivals-2026/'},
  {date:'18 Aug',title:'Golden Age case: Sir, We Have an Orc Problem',takeaway:'Raw WIP shorts → requested Steam page → playtest → demo → Next Fest → 150K launch wishlists.',url:'https://howtomarketagame.com/2026/08/18/the-week-of-the-golden-age/'},
  {date:'20 Aug',title:'Golden Age case: Bills Must Be Paid',takeaway:'A weak page and failed $200 ad test were overturned by a strong demo, Trending Free, localization and creator outreach.',url:'https://howtomarketagame.com/2026/08/20/part-2-the-week-of-the-golden-age/'},
  {date:'21 Aug',title:'Golden Age case: How Many Dudes?',takeaway:'A year-long chain of jam proof, Shorts, demo discovery, creators, capsule/tag work and personalized Steam visibility—not one viral post.',url:'https://howtomarketagame.com/2026/08/21/part-3-the-week-of-the-golden-age-how-many-dudes/'},
];

export const sourceStack = [
  {name:'Steamworks Traffic & UTM',url:'https://partner.steamgames.com/doc/marketing/utm_analytics',tier:'Owner-only ground truth',good:'Exact store impressions, visits, wishlist events and tagged campaign traffic.',limit:'Not public. Ask teams for exports; public sites cannot reconstruct it.'},
  {name:'Steam / Steamworks docs',url:'https://partner.steamgames.com/doc/home',tier:'Primary rules',good:'Eligibility, visibility mechanics, review timing, demos, festivals and platform constraints.',limit:'Does not expose a competitor’s private funnel.'},
  {name:'Developer postmortems',url:'https://blog.bscotch.net/post/indie-game-dev-timeline-for-how-many-dudes/',tier:'Primary self-report',good:'Dates, spend, wishlist deltas, sales and decisions when screenshots are supplied.',limit:'Survivorship and storytelling bias; definitions may differ.'},
  {name:'SteamDB',url:'https://steamdb.info/',tier:'Observed public data',good:'Release history, price, followers, reviews, CCU, builds and owner-model ranges.',limit:'No exact sales, wishlists, marketing spend or causal attribution.'},
  {name:'How To Market A Game',url:'https://howtomarketagame.com/',tier:'Analyst synthesis',good:'Comparable cohorts, practical Steam mechanics and unusually detailed indie case studies.',limit:'Often self-reported samples; selection bias must be labeled.'},
  {name:'VG Insights / Sensor Tower',url:'https://vginsights.com/',tier:'Modeled market data',good:'Genre cohorts, wishlist studies and modeled owners/revenue.',limit:'Not Valve accounting. Compare provider spread rather than averaging it.'},
  {name:'GameDiscoverCo',url:'https://newsletter.gamediscover.co/',tier:'Interviews + modeled data',good:'Developer/publisher interviews, discovery-source studies and launch analysis.',limit:'Some articles are subscriber-only; model and interview evidence must be separated.'},
  {name:'Gamalytic',url:'https://gamalytic.com/',tier:'Independent owner model',good:'Cross-check owner/revenue ranges and compare tags.',limit:'Estimates are not audited sales and do not establish organic attribution.'},
  {name:'Native social analytics',url:'https://studio.youtube.com/',tier:'Channel observation',good:'Post date, views, likes, watch time and creator identity.',limit:'Without tagged links, a viral post cannot be assigned exact Steam outcomes.'},
  {name:'Press / milestone coverage',url:'https://www.gamedeveloper.com/business',tier:'Reported claim',good:'Time-stamped developer sales milestones and campaign chronology.',limit:'Repeat reporting can look like independent confirmation when it is one original claim.'},
];

export const sprint = [
  {days:'1–2',title:'Choose one sentence, one frame, one failure',owner:'Whole team',exit:'Greybox is understandable in 10 seconds; no lore explanation.'},
  {days:'3–4',title:'Complete the technical spine',owner:'2 senior developers',exit:'Solo loop works—or two remote PCs join and complete the one hero interaction.'},
  {days:'3–5',title:'Publish ugly proof, not a trailer',owner:'Marketing + 3D',exit:'Three hook variants; at least one readable phone-size raw clip.'},
  {days:'5–7',title:'Cold-test the laugh/curiosity moment',owner:'PM + marketing',exit:'A genuine clip moment occurs inside 3 minutes; strangers can restart unaided.'},
  {days:'8–10',title:'Feature lock',owner:'PM',exit:'One room/map, one hazard/enemy, three tools, one progression layer. Everything else cut.'},
  {days:'11–13',title:'Creator-ready closed playtest',owner:'Whole team',exit:'30–50 target testers; crash, join, onboarding and desync issues triaged.'},
  {days:'14–15',title:'Capture and release the proof',owner:'Marketing + art',exit:'Real-play trailer, creator build, store assets and a measured channel baseline.'},
];

export const steamTiming = [
  {status:'Onboarding risk',title:'Check the actual app release controls on day one',detail:'Steam has a 30-day gate for the first few full-game releases and a two-week Coming Soon requirement. Demo docs allow direct release after review; do not assume the full-game gate categorically bans a demo.',url:'https://partner.steamgames.com/doc/store/application/demos?language=english'},
  {status:'Plan 7 business days',title:'Store page and build review',detail:'Valve says review normally takes 3–5 business days; the documentation recommends submitting at least seven business days ahead.',url:'https://partner.steamgames.com/doc/store/Review_Process'},
  {status:'Missed unless registered',title:'October 2026 Next Fest',detail:'The festival runs 19–26 October, but registration closed 31 August—two days before this research snapshot.',url:'https://partner.steamgames.com/doc/marketing/upcoming_events/nextfest/2026october'},
  {status:'Possible later beats',title:'Match the concept honestly',detail:'Steam Scream V: 26 Oct–2 Nov 2026; Auto-Battler RPG Fest: 16–23 Nov 2026; Shop Keeper Fest: 25 Jan–1 Feb 2027; Next Fest: 22 Feb–1 Mar 2027.',url:'https://partner.steamgames.com/doc/marketing/upcoming_events'},
];
