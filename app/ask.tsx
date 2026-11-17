import { useEffect, useState } from 'react';
import { ArrowRight, Cpu, KeyRound, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReferenceLink } from './source-references';
import {
  askLibrary,
  extractive,
  ProviderError,
  type AskResult,
  type Passage,
  type Provider,
} from './ask-core';
import {
  geminiProvider,
  GEMINI_MODEL,
  hasWebGpu,
  LOCAL_MODEL,
  LOCAL_MODEL_ENABLED,
  localModelMegabytes,
  localProvider,
} from './ask-browser';

const KEY_STORAGE = 'steam-discovery-gemini-key';
const examples = [
  'Does a demo’s concurrent player count during Next Fest predict sales?',
  'Is it a bad idea to launch a horror game in October?',
  'What should I ask before paying to put my game in a showcase?',
];
type Library = {
  passages: Passage[];
  cards: import('./tactics-model').TacticCard[];
};
let libraryPromise: Promise<Library> | null = null;
const loadLibrary = () =>
  (libraryPromise ??= import('./ask-library').then((m) => ({
    passages: m.passages,
    cards: m.cards,
  })));

const readKey = () => {
  try {
    return localStorage.getItem(KEY_STORAGE) ?? '';
  } catch {
    return '';
  }
};
const writeKey = (value: string | null) => {
  try {
    if (value) localStorage.setItem(KEY_STORAGE, value);
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* storage blocked: the key stays in this tab only */
  }
};

function PassageCard({ passage }: { passage: Passage }) {
  return (
    <li className="ask-passage">
      <blockquote>{passage.text}</blockquote>
      <div className="ask-passage-meta">
        <a href={passage.sitePath}>{passage.recordTitle}</a>
        <span
          className={`tactic-class tactic-class-${passage.evidenceClass ?? 'editorial'}`}
        >
          {passage.evidenceClass}
        </span>
        <span className="ask-label">
          {passage.label}
          {passage.date ? ` · ${passage.date}` : ''}
        </span>
        <ReferenceLink url={passage.sourceUrl} label="Original source" />
      </div>
    </li>
  );
}

export function AskLibrary() {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [found, setFound] = useState<ReturnType<typeof extractive> | null>(
    null,
  );
  const [summary, setSummary] = useState<AskResult | null>(null);
  const [summaryBy, setSummaryBy] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [remember, setRemember] = useState(false);
  const [gpu, setGpu] = useState(false);
  const [modelMb, setModelMb] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const saved = readKey();
      if (saved) {
        setApiKey(saved);
        setRemember(true);
      }
      setGpu(hasWebGpu());
    });
    return () => {
      active = false;
    };
  }, []);

  async function search(text = question) {
    const q = text.trim();
    if (q.length < 8) return;
    setQuestion(q);
    setBusy('Searching the library…');
    setError('');
    setSummary(null);
    const { passages } = await loadLibrary();
    setFound(extractive(q, passages));
    setAsked(q);
    setBusy('');
  }

  async function summarise(provider: Provider, by: string) {
    setError('');
    setSummary(null);
    setBusy(`Asking ${by}…`);
    try {
      const { passages, cards } = await loadLibrary();
      setSummary(await askLibrary(asked, passages, provider, cards));
      setSummaryBy(by);
    } catch (e) {
      const status = e instanceof ProviderError ? e.status : 0;
      setError(
        status === 400 || status === 401 || status === 403
          ? 'Gemini rejected the key.'
          : status === 429
            ? 'Your Gemini quota is used up for now. Try again later.'
            : status
              ? 'Gemini is busy or unavailable. Try again in a minute.'
              : 'The summary failed. The quoted passages above are unaffected.',
      );
    } finally {
      setBusy('');
    }
  }

  async function runLocalModel() {
    if (modelMb === null) {
      setBusy('Checking the model size…');
      setModelMb(await localModelMegabytes().catch(() => 0));
      setBusy('');
      return;
    }
    await summarise(
      localProvider((text) => setBusy(text)),
      'the in-browser model',
    );
  }

  function submitKey() {
    const key = apiKey.trim();
    if (!key) return;
    writeKey(remember ? key : null);
    void summarise(geminiProvider(key), GEMINI_MODEL);
  }

  return (
    <section className="ask" aria-labelledby="ask-title">
      <p className="section-kicker">
        ASK THE LIBRARY · ANSWERS ONLY FROM SOURCES
      </p>
      <h1 id="ask-title">
        Ask the research library a Steam marketing question
      </h1>
      <p className="tactic-lead">
        Search runs in your browser and quotes the library’s passages as they
        are, with their evidence class and source. If nothing matches well, it
        says the library does not cover the question. You can then ask a
        language model to summarise the quoted passages; any sentence it writes
        without a valid citation, or with a number its cited passage does not
        contain, is removed.
      </p>
      <form
        className="ask-form"
        onSubmit={(event) => {
          event.preventDefault();
          void search();
        }}
      >
        <label className="searchbox" htmlFor="ask-question">
          <Search aria-hidden="true" />
          <span className="sr-only">Your question</span>
          <Input
            id="ask-question"
            value={question}
            maxLength={300}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="e.g. Should my demo be out before Next Fest?"
          />
        </label>
        <Button type="submit" disabled={!!busy || question.trim().length < 8}>
          Search
        </Button>
      </form>
      <p className="ask-privacy">
        <ShieldCheck aria-hidden="true" /> Searching never leaves your browser
        and nothing is stored.
      </p>
      {!found && (
        <div className="ask-examples">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => void search(example)}
            >
              {example}
            </button>
          ))}
        </div>
      )}
      <div aria-live="polite">
        {busy && <p className="ask-busy">{busy}</p>}
        {error && <p className="ask-error">{error}</p>}
        {summary && (
          <div className="ask-answer">
            {summary.status === 'answer' ? (
              <>
                <h2>Summary</h2>
                <ul className="ask-claims">
                  {summary.claims.map((claim) => (
                    <li key={claim.text}>
                      {claim.text}{' '}
                      {claim.sources.map((n) => (
                        <a
                          key={n}
                          className="ask-cite"
                          href={`#ask-source-${n}`}
                          aria-label={`Source ${n}`}
                        >
                          [{n}]
                        </a>
                      ))}
                    </li>
                  ))}
                </ul>
                <p className="ask-note">
                  Written by {summaryBy} from the library’s passages; uncited
                  sentences and unsupported numbers were removed. Check the
                  source before you rely on it.
                </p>
                <ol className="ask-sources">
                  {summary.sources.map((source) => (
                    <li key={source.n} id={`ask-source-${source.n}`}>
                      <a href={source.sitePath}>{source.recordTitle}</a>
                      <span
                        className={`tactic-class tactic-class-${source.evidenceClass ?? 'editorial'}`}
                      >
                        {source.evidenceClass}
                      </span>
                      <span className="ask-label">
                        {source.label}
                        {source.date ? ` · ${source.date}` : ''}
                      </span>
                      <ReferenceLink
                        url={source.sourceUrl}
                        label="Original source"
                      />
                    </li>
                  ))}
                </ol>
                {summary.tactics.length > 0 && (
                  <p className="ask-tactics">
                    Related tactic cards:{' '}
                    {summary.tactics.map((card, i) => (
                      <span key={card.id}>
                        {i > 0 && ' · '}
                        <a href={`/tactics/${card.id}/`}>
                          {card.title} <ArrowRight aria-hidden="true" />
                        </a>
                      </span>
                    ))}
                  </p>
                )}
              </>
            ) : (
              <>
                <h2>No summary the library supports</h2>
                <p>
                  {summaryBy} could not write a sentence that its cited passages
                  support. The quoted passages below still stand.
                </p>
              </>
            )}
          </div>
        )}
        {found?.status === 'refused' && (
          <div className="ask-answer">
            <h2>Not in the library</h2>
            <p>
              No passage matches this question well enough to quote. The library
              covers Steam marketing for small teams: demos and festivals,
              wishlists, launches, creators and dated game case studies.
            </p>
          </div>
        )}
        {found?.status === 'passages' && (
          <>
            <h2 className="ask-results-title">What the library says, quoted</h2>
            <p className="ask-note">
              The closest passages to your question, best match first. A passage
              on the topic may still not answer your exact question.
            </p>
            <ol className="ask-passages">
              {found.passages.map((passage) => (
                <PassageCard key={passage.ref} passage={passage} />
              ))}
            </ol>
            <div className="ask-tiers">
              <h2>Optional: summarise with a language model</h2>
              {LOCAL_MODEL_ENABLED && (
                <div className="ask-tier">
                  <h3>
                    <Cpu aria-hidden="true" /> In your browser
                  </h3>
                  {gpu ? (
                    <>
                      <p>
                        Runs {LOCAL_MODEL} on your GPU with WebLLM. The model
                        downloads once from Hugging Face
                        {modelMb
                          ? ` (${modelMb.toLocaleString('en')} MB)`
                          : ''}{' '}
                        and is cached by your browser. Your question stays on
                        this device. Small models summarise less reliably than
                        Gemini.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!!busy}
                        onClick={() => void runLocalModel()}
                      >
                        {modelMb === null
                          ? 'Check download size'
                          : `Download and summarise`}
                      </Button>
                    </>
                  ) : (
                    <p>
                      This browser has no WebGPU, so the in-browser model is not
                      available here.
                    </p>
                  )}
                </div>
              )}
              <div className="ask-tier">
                <h3>
                  <KeyRound aria-hidden="true" /> With your own Gemini key
                </h3>
                <p>
                  Your question and the quoted passages go from your browser
                  straight to Google’s Gemini API ({GEMINI_MODEL}); this site
                  never sees them or your key. Google’s Gemini API terms apply
                  to your key, and on the free tier Google may use what you send
                  to improve its products. The key stays in this tab, or in this
                  browser’s storage if you tick Remember. Any script on this
                  page can read it, so use a key you can revoke.
                </p>
                <form
                  className="ask-key"
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitKey();
                  }}
                >
                  <label className="sr-only" htmlFor="ask-key">
                    Gemini API key
                  </label>
                  <Input
                    id="ask-key"
                    type="password"
                    autoComplete="off"
                    value={apiKey}
                    onChange={(event) => setApiKey(event.target.value)}
                    placeholder="Paste your Gemini API key"
                  />
                  <label className="ask-remember">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                    />{' '}
                    Remember
                  </label>
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={!!busy || !apiKey.trim()}
                  >
                    Summarise
                  </Button>
                  {remember && (
                    <button
                      type="button"
                      className="ask-forget"
                      onClick={() => {
                        writeKey(null);
                        setApiKey('');
                        setRemember(false);
                      }}
                    >
                      Forget key
                    </button>
                  )}
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
