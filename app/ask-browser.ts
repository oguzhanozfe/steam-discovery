// Optional summarisers for Ask the Library. Both run from the visitor's
// browser; the site has no server and holds no key.
import { answerSchema, openAiCompatible, type Provider } from './ask-core';

// Tier 3: the visitor's own Gemini key, sent straight to Google (CORS allowed).
export const GEMINI_OPENAI =
  'https://generativelanguage.googleapis.com/v1beta/openai';
export const GEMINI_MODEL = 'gemini-3.5-flash-lite';
export const geminiProvider = (apiKey: string): Provider =>
  openAiCompatible({
    baseUrl: GEMINI_OPENAI,
    apiKey,
    model: GEMINI_MODEL,
    maxTokens: 1200,
    timeoutMs: 60_000,
  });

// Tier 2: an in-browser model via WebLLM and WebGPU, loaded only on request.
const WEBLLM_URL = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.86/+esm';
export const LOCAL_MODEL = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
// Hidden for now: in testing, 9 of this model's 23 kept claims were unsupported
// or wrong (docs/ASK.md). Re-enable after a stronger model passes the eval.
export const LOCAL_MODEL_ENABLED = false;
export const hasWebGpu = () =>
  typeof navigator !== 'undefined' && 'gpu' in navigator;

/** Download size of the model weights, read from its manifest before downloading. */
export async function localModelMegabytes() {
  const response = await fetch(
    `https://huggingface.co/mlc-ai/${LOCAL_MODEL}/resolve/main/ndarray-cache.json`,
  );
  const manifest = (await response.json()) as { records: { nbytes: number }[] };
  return Math.round(manifest.records.reduce((n, r) => n + r.nbytes, 0) / 1e6);
}

type Engine = {
  chat: {
    completions: {
      create: (request: unknown) => Promise<{
        choices: { message?: { content?: string | null } }[];
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      }>;
    };
  };
};
let engine: Promise<Engine> | null = null;

export function localProvider(onProgress: (text: string) => void): Provider {
  engine ??= (
    import(/* @vite-ignore */ WEBLLM_URL) as Promise<{
      CreateMLCEngine: (model: string, options: unknown) => Promise<Engine>;
    }>
  ).then((webllm) =>
    webllm.CreateMLCEngine(LOCAL_MODEL, {
      initProgressCallback: (report: { text: string }) =>
        onProgress(report.text),
    }),
  );
  engine.catch(() => (engine = null));
  return async (messages) => {
    const reply = await (
      await engine!
    ).chat.completions.create({
      messages,
      temperature: 0,
      max_tokens: 800,
      response_format: {
        type: 'json_object',
        schema: JSON.stringify(answerSchema),
      },
    });
    return {
      text: reply.choices[0]?.message?.content ?? '',
      promptTokens: reply.usage?.prompt_tokens,
      completionTokens: reply.usage?.completion_tokens,
    };
  };
}
