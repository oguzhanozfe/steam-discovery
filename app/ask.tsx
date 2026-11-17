import { useState } from 'react';
import { ArrowRight, Search, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReferenceLink } from './source-references';
import type { AskResult } from './ask-core';

type Reply = Omit<AskResult, 'audit' | 'usage'>;
const examples = [
  'Does a demo’s concurrent player count during Next Fest predict sales?',
  'Is it a bad idea to launch a horror game in October?',
  'What should I ask before paying to put my game in a showcase?',
];

export function AskLibrary() {
  const [question, setQuestion] = useState('');
  const [reply, setReply] = useState<Reply | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function ask(event?: { preventDefault(): void }, text = question) {
    event?.preventDefault();
    if (text.trim().length < 8 || busy) return;
    setQuestion(text);
    setBusy(true);
    setError('');
    setReply(null);
    try {
      const response = await fetch('/api/ask/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: text.trim() }),
      });
      const body = (await response.json().catch(() => ({}))) as Reply & { error?: string };
      if (!response.ok) setError(body.error ?? 'The assistant is unavailable right now.');
      else setReply(body);
    } catch {
      setError('Could not reach the assistant. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="ask" aria-labelledby="ask-title">
      <p className="section-kicker">ASK THE LIBRARY · ANSWERS ONLY FROM SOURCES</p>
      <h1 id="ask-title">Ask the research library a Steam marketing question</h1>
      <p className="tactic-lead">
        The assistant searches this site’s notes, game stories and playbooks, and answers only with sentences it can tie to a cited
        passage. Any sentence without a valid citation, or with a number the cited passage does not contain, is removed. If nothing
        survives, it says the library does not cover the question.
      </p>
      <form className="ask-form" onSubmit={ask}>
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
        <Button type="submit" disabled={busy || question.trim().length < 8}>
          {busy ? 'Searching…' : 'Ask'}
        </Button>
      </form>
      <p className="ask-privacy">
        <ShieldAlert aria-hidden="true" /> Your question is sent to Google’s Gemini API to write the answer. On Gemini’s free tier
        Google may use what you send to improve its products, so do not include anything private. This site does not store your
        question; it logs only token counts.
      </p>
      {!reply && !busy && !error && (
        <div className="ask-examples">
          {examples.map((example) => (
            <button key={example} type="button" onClick={() => void ask(undefined, example)}>
              {example}
            </button>
          ))}
        </div>
      )}
      <div aria-live="polite">
        {error && <p className="ask-error">{error}</p>}
        {reply?.status === 'refused' && (
          <div className="ask-answer">
            <h2>The library does not answer this</h2>
            <p>No passage in the library supports an answer, so the assistant has none to give.</p>
            {reply.closest.length > 0 && (
              <>
                <p>Closest notes, in case they help:</p>
                <ul>
                  {reply.closest.map((item) => (
                    <li key={item.sitePath}>
                      <a href={item.sitePath}>{item.title}</a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
        {reply?.status === 'answer' && (
          <div className="ask-answer">
            <h2>What the library says</h2>
            <ul className="ask-claims">
              {reply.claims.map((claim) => (
                <li key={claim.text}>
                  {claim.text}{' '}
                  {claim.sources.map((n) => (
                    <a key={n} className="ask-cite" href={`#ask-source-${n}`} aria-label={`Source ${n}`}>
                      [{n}]
                    </a>
                  ))}
                </li>
              ))}
            </ul>
            <p className="ask-note">Written by a language model from the passages below. Check the source before you rely on it.</p>
            <h3>Sources</h3>
            <ol className="ask-sources">
              {reply.sources.map((source) => (
                <li key={source.n} id={`ask-source-${source.n}`}>
                  <a href={source.sitePath}>{source.recordTitle}</a>
                  <span className={`tactic-class tactic-class-${source.evidenceClass ?? 'editorial'}`}>{source.evidenceClass}</span>
                  <span className="ask-label">
                    {source.label}
                    {source.date ? ` · ${source.date}` : ''}
                  </span>
                  <ReferenceLink url={source.sourceUrl} label="Original source" />
                </li>
              ))}
            </ol>
            {reply.tactics.length > 0 && (
              <p className="ask-tactics">
                Related tactic cards:{' '}
                {reply.tactics.map((card, i) => (
                  <span key={card.id}>
                    {i > 0 && ' · '}
                    <a href={`/tactics/${card.id}/`}>
                      {card.title} <ArrowRight aria-hidden="true" />
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
