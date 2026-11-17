// POST /api/ask/ {question} -> a grounded answer from the research library.
// Privacy: the question is never logged or stored. Logs carry token counts only.
import { askLibrary, openAiCompatible, ProviderError, type AskResult } from '../app/ask-core.js';
import { passages, cards } from '../app/ask-library.js';

const MAX_QUESTION = 300;
const GEMINI_OPENAI = 'https://generativelanguage.googleapis.com/v1beta/openai';
const json = (status: number, body: unknown) =>
  Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

// ponytail: per-instance memory, so limits reset on cold start and do not add
// up across instances. Use a Vercel Firewall rate-limit rule for a hard limit.
const hits = new Map<string, number[]>();
function limited(ip: string, now = Date.now()) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  const lastMinute = recent.filter((t) => now - t < 60_000).length;
  if (lastMinute >= 5 || recent.length >= 40) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.delete(hits.keys().next().value!);
  return false;
}

const publicResult = ({ audit: _audit, usage: _usage, ...rest }: AskResult) => rest;

const handler = {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json(405, { error: 'Use POST.' });
    const apiKey = process.env.LLM_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) return json(503, { error: 'The assistant is not switched on yet.' });

    const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
    if (limited(ip)) return json(429, { error: 'Too many questions. Try again in a minute.' });

    const raw = await request.text();
    if (raw.length > 2000) return json(413, { error: 'Request too large.' });
    let question = '';
    try {
      const value = (JSON.parse(raw) as { question?: unknown }).question;
      question = typeof value === 'string' ? value.trim() : '';
    } catch {
      return json(400, { error: 'Send JSON: {"question": "..."}' });
    }
    if (question.length < 8 || question.length > MAX_QUESTION)
      return json(400, { error: `Ask a question between 8 and ${MAX_QUESTION} characters.` });

    const model = process.env.LLM_MODEL || 'gemini-3.5-flash-lite';
    const provider = openAiCompatible({
      baseUrl: process.env.LLM_BASE_URL || GEMINI_OPENAI,
      apiKey,
      model,
      maxTokens: 1200,
    });
    const started = Date.now();
    try {
      const result = await askLibrary(question, passages, provider, cards);
      console.log(JSON.stringify({
        event: 'ask',
        model,
        status: result.status,
        reason: result.reason ?? null,
        promptTokens: result.usage.promptTokens,
        completionTokens: result.usage.completionTokens,
        ms: Date.now() - started,
      }));
      return json(200, publicResult(result));
    } catch (error) {
      const status = error instanceof ProviderError ? error.status : 0;
      console.log(JSON.stringify({ event: 'ask-error', model, providerStatus: status, ms: Date.now() - started }));
      return json(503, { error: 'The model is busy or unavailable. Try again in a minute.' });
    }
  },
};

export default handler;
