// Measure Ask the Library against a real model on the frozen question set.
// Needs LLM_API_KEY or GEMINI_API_KEY in the environment (never written out).
// Run: node --import ./scripts/ts-hook.mjs scripts/eval-ask.mjs <run-name> [model] [questions-file]
import { readFile, writeFile } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';
import { askLibrary, openAiCompatible, ProviderError } from '../app/ask-core.ts';
import { passages, cards } from '../app/ask-library.ts';

const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error('Set LLM_API_KEY or GEMINI_API_KEY');
const run = process.argv[2];
if (!run) throw new Error('Name the run, e.g. run1');
const model = process.argv[3] || process.env.LLM_MODEL || 'gemini-3.5-flash-lite';
const questionsFile = process.argv[4] || 'eval/ask-questions.json';
const baseUrl = process.env.LLM_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
const provider = openAiCompatible({ baseUrl, apiKey, model, maxTokens: 1200, timeoutMs: 60_000 });
const { questions } = JSON.parse(await readFile(new URL(`../${questionsFile}`, import.meta.url), 'utf8'));

const rows = [];
for (const item of questions) {
  let result = null;
  let error = null;
  for (let attempt = 0; attempt < 4 && !result; attempt++) {
    try {
      result = await askLibrary(item.q, passages, provider, cards);
    } catch (e) {
      error = e instanceof ProviderError ? `HTTP ${e.status}` : String(e.message ?? e);
      if (!(e instanceof ProviderError) || ![429, 500, 503].includes(e.status)) break;
      await sleep(15_000 * (attempt + 1));
    }
  }
  const records = result ? [...new Set(result.sources.map((s) => s.ref.split('#')[0]))] : [];
  rows.push({
    id: item.id,
    answerable: item.answerable,
    status: result ? result.status : 'error',
    reason: result?.reason ?? null,
    error: result ? null : error,
    claims: result?.claims.map((c) => ({ text: c.text, sources: c.sources })) ?? [],
    sources: result?.sources.map((s) => ({ n: s.n, ref: s.ref, label: s.label, evidenceClass: s.evidenceClass })) ?? [],
    expectedHit: item.expect ? records.some((r) => item.expect.includes(r)) : null,
    injectionHeld: item.mustNotContain
      ? !(result?.claims ?? []).some((c) => item.mustNotContain.some((bad) => c.text.toLowerCase().includes(bad.toLowerCase())))
      : null,
    audit: result?.audit ?? null,
    usage: result?.usage ?? null,
  });
  console.log(`${item.id}: ${rows.at(-1).status}${rows.at(-1).reason ? ` (${rows.at(-1).reason})` : ''}${error && !result ? ` ${error}` : ''}`);
  await sleep(4_000);
}

const ok = rows.filter((r) => r.status !== 'error');
const ans = ok.filter((r) => r.answerable);
const unans = ok.filter((r) => !r.answerable);
const raw = ok.flatMap((r) => r.audit?.checks ?? []);
const rawValid = raw.filter((c) => c.citesValid && c.ungroundedNumbers.length === 0);
const pct = (a, b) => (b ? `${a}/${b} (${Math.round((100 * a) / b)}%)` : 'n/a');
const summary = {
  run,
  model,
  questionsFile,
  ranAt: new Date().toISOString().slice(0, 10),
  questions: rows.length,
  errors: rows.length - ok.length,
  citationValidRaw: pct(rawValid.length, raw.length),
  correctRefusal: pct(unans.filter((r) => r.status === 'refused').length, unans.length),
  answeredWhenAnswerable: pct(ans.filter((r) => r.status === 'answer').length, ans.length),
  expectedRecordCited: pct(ans.filter((r) => r.expectedHit).length, ans.filter((r) => r.status === 'answer').length),
  injectionHeld: pct(rows.filter((r) => r.injectionHeld === true).length, rows.filter((r) => r.injectionHeld !== null).length),
  refusalReasons: Object.fromEntries(
    [...new Set(ok.map((r) => r.reason).filter(Boolean))].map((k) => [k, ok.filter((r) => r.reason === k).length]),
  ),
  tokens: {
    prompt: ok.reduce((n, r) => n + (r.usage?.promptTokens ?? 0), 0),
    completion: ok.reduce((n, r) => n + (r.usage?.completionTokens ?? 0), 0),
  },
};
const out = new URL(`../eval/results/${run}-${model.replace(/[^a-z0-9.-]/gi, '_')}.json`, import.meta.url);
await writeFile(out, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
