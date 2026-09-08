# Research maintenance

Check the publication archives already listed in `app/data/newsletters.json`, `reading-expansion.json` and `reading-updates.json` weekly. Prioritize new Steam marketing, discovery, genre, launch and small-team production evidence over unrelated industry news.

1. Fetch the latest repository state and preserve other work. Compare candidate URLs and IDs against `readingLibrary` to avoid duplicates.
2. Read the original public page. Record its actual author, publication date, source URL, access limits and the date checked. Do not bypass a paywall or treat a preview as the full article.
3. Add concise original notes using the ReadingArticle fields: id, title, author, publication, date (or null), checkedAt, url, topics, relatedGames, summary, hardData, evidenceType, actionableLesson, limitations, access and sourceUrls. Distinguish new publications from older articles newly added to the library. Use cumulative article records; never discard past notes to replace the latest batch.
4. Add source-check results separately. Keep the latest checkedAt accurate and update the visible addition counts from the actual new batch. A source check does not refresh the underlying game metrics. Record unavailable sources as unavailable.
5. Preserve evidence labels. Model revenue is not audited revenue; reviews are not units; event eligibility is not guaranteed visibility; a successful case is not a success probability. All numerical claims need scope, date and original evidence.
6. Update existing claims only when new evidence supports the change, preserving earlier snapshots and recording the correction. Never fabricate dates, authors, metrics, endorsements, ranking guarantees or source access.
7. Build, type-check, validate research metadata and run the dependency audit. Inspect the changed files before committing. Publish the validated version to the existing Vercel project, then check the live home, new note, feed, sitemap, metadata, and confirm retired project paths return 404.

## Attribution is required for every update

- Cite the exact original article or data query beside every factual claim, metric and timeline event. Keep original titles distinct from Steam Discovery headlines; preserve author, publication date, observation date and access limits.
- Use the shared `ReferenceLink`, `ReferenceLinks` and `ReferenceRegister` components. Pass explicit per-source usage from the source-bearing record, not an inferred association by domain. Include every inline citation in the page register and structured metadata.
- Original reporting, quotes and source arguments remain credited to the original creator. Our synthesis, comparisons, concepts, technical scope and test thresholds must be labeled as editorial interpretation or proposals. Do not imply a cited author endorsed them.
- Write independent, concise analysis. Do not copy or translate entire articles, closely paraphrase their sequence, reproduce paywalled sections, or treat attribution as permission to republish. Mark any necessary short quotation visibly and link it immediately.
- Only record a freshly verified title/author/date/access in `reference-checks.json` after checking the original. Do not guess titles from URL slugs, assign authors from domains, or present preview access as full reading.
- Document substantive corrections publicly. Static citation checks detect omissions, not plagiarism or factual truth; compare new prose with the consulted sources before publication. Do not claim a blanket originality certification.

No content or ranking instructions should be hidden for crawlers. Visible text and structured data must agree. The llms.txt file is an optional reading aid; it does not guarantee inclusion in AI answers. Internal project GDDs, task boards, team assignments and source payloads must not be included in public routes, JavaScript bundles, downloads or repository files. Noindex is not privacy.

Advertising must be visibly separate from research. Availability notices must not imply a real sponsor. Do not enable network scripts, invent publisher credentials, publish placeholder seller records, or introduce tracking without the approved account and appropriate privacy/consent setup. References are never sold as advertising placements.

Keep dependency security fixes narrowly scoped and preserve the lockfile. `pnpm-workspace.yaml` documents temporary patched transitive versions. Remove overrides only after upstream packages provide the fixes and the audit, production build and local development smoke checks pass.
