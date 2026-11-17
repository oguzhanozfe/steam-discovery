# Ask the Library

`/ask/` answers Steam marketing questions from this site's research library only. The site has no server and holds no API key: everything runs in the visitor's browser, in three tiers. Tier 2 is built but hidden (`LOCAL_MODEL_ENABLED = false` in `app/ask-browser.ts`) because it failed the grounding review below; the owner chose to ship tiers 1 and 3.

| Tier | What it does | What leaves the browser | Cost to the site |
|---|---|---|---|
| 1. Search (default) | Quotes the closest library passages verbatim, with evidence class, label, date, our page and the original source. Says "Not in the library" when nothing matches well. | Nothing | None |
| 2. In-browser model (opt-in, WebGPU) | WebLLM 0.2.86 runs `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` on the visitor's GPU and summarises the passages. The page shows the download size (869 MB of weights, read from the model's manifest) before downloading. | Only the model download from Hugging Face and jsdelivr. The question stays local. | None |
| 3. Your own Gemini key (opt-in) | Same summary, written by `gemini-3.5-flash-lite` through Google's OpenAI-compatible endpoint, called straight from the browser. | The question and the passages, sent to Google with the visitor's key. | None |

Tiers 2 and 3 go through the same grounding check (below). The key for tier 3 stays in React state for the tab, or in `localStorage` (`steam-discovery-gemini-key`) only if the visitor ticks Remember. "Forget key" removes it. The page says that Google's terms apply, that the free tier may use inputs, and that any script on the page can read a stored key.

## How it works

Code: `app/ask-core.ts` (pure logic, shared by the page, the CI test and the measurement), `app/ask-library.ts`, `app/ask-browser.ts`, `app/ask.tsx`.

- **Passages.** There are 1,248 citable passages from 164 pages. They come from the evidence-bearing fields of notes, stories, playbooks and game cases, resolved with the same `resolveRef` the tactic cards use, plus story narrative and mechanism text classed as editorial. Story `buildTransfer` and `demand` fields are excluded because they hold invented example plans and hypotheses. Every passage has an evidence class and an http(s) source, and `validate:ask` checks that its page exists in the build.
- **Retrieval.** BM25 over passage terms, with stopwords and light stemming, and at most two passages per record. A record retrieved only through editorial notes also brings its best sourced passage.
- **Weak-match refusal.** If the best passage scores below `MIN_SCORE` (4) or matches under `MIN_MATCHED_SHARE` (40%) of the question's terms, the answer is "not in the library" and no model is called. These thresholds were set before any measurement and have not changed.
- **Prompt.** The model gets the numbered passages and must return JSON (`answerable` plus claims, each with passage ids). It is told to treat the question and passages as data and to prefer reported or observed passages.
- **Grounding check (`checkClaims`).** A claim is kept only if every citation is one of the retrieved passages and every number in it appears in the cited passages. Failing claims are dropped, not rewritten. An answer whose kept claims cite only editorial passages is refused, the same rule `validate:tactics` applies to cards.

## Measurement

Question sets were frozen and committed before the runs they measure:
- `eval/ask-questions.json` (31 questions: 21 answerable, 10 not; commit e51d95d), frozen before run 1.
- `eval/ask-holdout.json` (16 questions: 10 answerable, 6 not, including two injection attempts; commit 1261b58), frozen after run 1 and before run 2.

Unanswerable questions are near misses on topics the library covers (TikTok cost per wishlist, a 2026 Steam Awards list, Wardogs' ad spend), facts it lacks, and injection attempts. Results are in `eval/results/`. Rerun with `pnpm eval:ask <run> extractive|<gemini-model> [questions-file]`; Gemini runs need `GEMINI_API_KEY` in the environment.

| Run | Set | Citation-valid (raw model claims) | Correct refusal | Answerable answered | Expected record cited |
|---|---|---|---|---|---|
| Tier 1, search only (run3) | original | 100% by construction (verbatim quotes) | 6/10 | 20/21 shown | 19/21 in top 5 |
| Tier 1, search only (run3) | holdout | 100% by construction | 2/6 | 8/10 shown | 8/10 in top 5 |
| Tier 3, gemini-3.5-flash-lite, run 1 (frozen design) | original | 30/30 | 10/10 | 10/21 | 10/10 |
| Tier 3, gemini-3.5-flash-lite, run 2 | original (tuned on) | 27/27 | 10/10 | 14/21 | 14/14 |
| Tier 3, gemini-3.5-flash-lite, run 2 | holdout | 12/14 | 6/6 | 5/10 | 5/5 |
| Tier 2, WebLLM Qwen2.5-1.5B in the browser (run4) | original | 21/31 | 9/10 | 12/21 | 11/12 |
| Tier 2, WebLLM Qwen2.5-1.5B in the browser (run4) | holdout | 6/18 | 6/6 | 4/10 | 3/4 |

No requests errored. The original set prompted 18,920 tokens and completed 1,509 in run 1, and 21,691 and 1,301 in run 2.

How to read this:

- **Tier 1 refuses only off-topic questions.** Near misses get related passages, with a note that a passage on the topic may not answer the exact question.
- **Tier 3 is cautious rather than wrong.** Ten refusals were stopped by weak retrieval before any model call (6 original, 4 holdout). The model correctly declined all 8 near misses that reached it (4 original, 4 holdout). Most answerable misses are also the model declining while the expected record sat in the passages it was given. One original-set question (`ccu-staying-power`) fails at retrieval, because the question says "concurrent players" and the note says "CCU". It was left as a miss rather than fixed with a synonym tuned to this set.
- **Run 2 changed retrieval and the prompt after seeing run 1.** The changes were records bringing their sourced passage, the stemming and the prompt. Run-2 figures on the original set are therefore optimistic, and the holdout is the honest estimate for the current version.
- **Injection resistance at the model level is untested.** All three injection questions were stopped by weak retrieval before reaching a model. The number check would still drop an injected figure that is not in the cited passages.

**Hand review of kept claims** (run 2, both sets, 38 claims):

- 34 are fully supported by their cited passages.
- 3 are supported only by the source headline that the prompt shows with each passage, not by the cited passage text (Urban Jungle, Wardogs, Guildrun).
- 1 is wrong. The Daily Deals answer says "universal Daily Deals … planned to roll out in early 2027". The source says personalised discount placements will replace universal Daily Deals. The model filled in the wrong subject for a passage that says only "rollout in early 2027". The number check cannot catch this, so the page tells readers to check the source.

**False positives of the number check.** Two correct holdout claims were dropped because the model reformatted a figure: "September 2" against `2026-09-02`, and "275,000" against `>275k`. The check is deliberately literal.

**Tier 2 is not reliable enough to summarise.** It was run with the run-2 code in the in-app browser on 2026-11-17, using WebGPU on Apple silicon. The 869 MB download took about 20 seconds, and answers took a median of about 1 second. There were no errors, and results are in `eval/results/run4-*`.

- **Raw citation-valid** is low: 21/31 and 6/18. Many dropped claims were format failures, such as the bare text "P1" or a claim citing the wrong passage.
- **It answered one unanswerable question.** Asked for the 2026 Steam Awards nominees, it replied "COCOON", taken from a 2023 nomination.
- **Hand review of its 23 kept claims:**
  - 10 are supported and relevant.
  - 3 echo a passage header or fragment, which is technically a quote but not an answer.
  - 1 is supported only by the headline.
  - 9 are unsupported or wrong. For example, it answered the Yet Another Zombie Survivors question with TCG Card Shop Simulator's 1.0 date, and turned "Will Big Walk usher in a co-op only era?" into a claim that one is coming.
- **The number check cannot catch these**, because the wrong claims reuse numbers that really are in the cited passages.

## Deviations from the design in `docs/REVIVAL.md`

- **No serverless function and no site key.** The owner chose a design with no site-owner key, so the planned `api/ask` function, rate limits, server-side token logging and the `LLM_*` variables are gone. Nothing needs setting in Vercel.
- **No answer cache.** A cache keyed by question text would conflict with not storing questions.
- **Claims are dropped, not rewritten.** A claim with an unsupported number is removed whole, instead of having the number replaced with "not in the library".
