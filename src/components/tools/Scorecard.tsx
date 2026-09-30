"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { SCORECARD_FREE_TEXT_MAX, scaleLabels, scorecardRateQuestion, scorecardStatements, scorecardVolumeQuestion, scorecardWhen, scorecardWho } from "@/content/tools";
import { caseBySlug } from "@/content/work";
import { blockers, fill, halfScore, relatedCaseSlug, scorecardSummary, sentenceFor, unknownNote, verdict, whoForms } from "@/lib/tools/scorecard";
import { Quadrant, Segmented, Stepper, ToolDisclaimer, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolComplete } from "./useTool";

type State = { who: string; otherWho: string; what: string; when: string; rate: number; unknown: boolean; volume: string; answers: Record<string, number> };

const initial: State = { who: "", otherWho: "", what: "", when: "", rate: 3, unknown: false, volume: "", answers: {} };
const statementScreens = [scorecardStatements.filter((s) => s.half === "terms"), scorecardStatements.filter((s) => s.half === "moments")];
const SCREENS = 1 + 1 + statementScreens.length + 1; // action, standing, Terms, Moments, results
const STEP_NAMES = ["The action", "Where things stand", "Ten statements", "Results"];

/** Conversion Scorecard: four steps with a progress bar, then results. All scoring lives in lib/tools/scorecard. */
export function Scorecard({ preset }: { preset?: { who?: string; what?: string; when?: string } }) {
  const id = useId();
  const complete = useToolComplete("Conversion Scorecard");
  const [s, setS] = useState<State>(() => {
    const who = scorecardWho.find((w) => w.key === preset?.who?.toLowerCase() || w.label.toLowerCase() === preset?.who?.toLowerCase())?.key || "";
    const whoDef = scorecardWho.find((w) => w.key === who);
    const what = whoDef?.actions.find((a) => a.startsWith(preset?.what || "\u0000")) || "";
    const when = scorecardWhen.find((w) => w === preset?.when) || "";
    return { ...initial, who, what, when };
  });
  const [screen, setScreen] = useState(0);
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);

  useHashRestore<State>(useCallback((restored) => { setS({ ...initial, ...restored }); setScreen(SCREENS - 1); }, []));

  const whoDef = scorecardWho.find((w) => w.key === s.who);
  const forms = whoForms(s.who, s.otherWho);
  const actionLabel = s.what.trim() || "act";
  const set = (patch: Partial<State>) => setS((cur) => ({ ...cur, ...patch }));
  const stepIndex = screen === 0 ? 0 : screen === 1 ? 1 : screen < SCREENS - 1 ? 2 : 3;
  const progress = (screen / (SCREENS - 1)) * 100;

  const terms = halfScore(s.answers, "terms");
  const moments = halfScore(s.answers, "moments");
  const v = verdict(terms, moments, forms, actionLabel);
  const unknown = unknownNote(s.unknown);
  const lowest = useMemo(() => blockers(s.answers), [s.answers]);
  const related = caseBySlug(relatedCaseSlug(s.who));
  const sentence = sentenceFor(forms.who, actionLabel, s.when);
  const isResults = screen === SCREENS - 1;

  useEffect(() => {
    if (isResults) complete({ who: s.who === "other" ? "something else" : s.who, action: s.what, when: s.when, rate: s.unknown ? null : s.rate, volume: s.volume || null, answers: s.answers }, { terms, moments, verdict: v.key, blockers: lowest.map((b) => b.id.toUpperCase()) });
  }, [isResults, complete, s, terms, moments, v.key, lowest]);

  const screenValid = () => {
    if (screen === 0) return !!s.who && (s.who !== "other" || !!s.otherWho.trim()) && !!s.what.trim() && !!s.when;
    if (screen >= 2 && screen < SCREENS - 1) return statementScreens[screen - 2].every((st) => typeof s.answers[st.id] === "number");
    return true;
  };
  const next = () => {
    setTouched(true);
    if (!screenValid()) return;
    setTouched(false);
    const n = Math.min(SCREENS - 1, screen + 1);
    setScreen(n);
    window.scrollTo({ top: (document.getElementById(`${id}-top`)?.offsetTop || 0) - 80, behavior: "smooth" });
  };
  const back = () => { setTouched(false); setScreen((n) => Math.max(0, n - 1)); };

  const shareLink = () => {
    const url = toolShareUrl(s);
    navigator.clipboard?.writeText(url).then(() => setCopied(true), () => window.prompt("Copy this link", url));
  };

  const summary = () => scorecardSummary({ sentence, unknown: s.unknown, rate: s.rate, volume: s.volume, answers: s.answers, forms, action: actionLabel });
  const diagnosticHref = `/contact?who=${encodeURIComponent(forms.who)}&what=${encodeURIComponent(actionLabel)}&when=${encodeURIComponent(s.when)}&engagement=diagnostic&source=scorecard#note`;

  return (
    <div id={`${id}-top`}>
      <Stepper steps={STEP_NAMES} active={stepIndex} progress={progress} />

      {screen === 0 ? (
        <ToolPanel className="tool-body">
          <p className="t-label muted">STEP 1 · THE ACTION</p>
          <h2 className="t-h3" style={{ marginTop: 8 }}>Who needs to act, and what do you need them to do?</h2>
          <div className="method-sentence method-sentence-sm" style={{ marginTop: 28 }}>
            <span className="ms-slot"><span aria-hidden="true">WE NEED</span>
              <label className="sr-only" htmlFor={`${id}-who`}>Who needs to act</label>
              <span className={`ms-select${s.who ? " is-chosen" : ""}`}>
                <select id={`${id}-who`} value={s.who} onChange={(e) => set({ who: e.target.value, what: "" })} aria-invalid={touched && !s.who}>
                  <option value="">choose</option>
                  {scorecardWho.map((w) => <option key={w.key} value={w.key}>{w.label}</option>)}
                </select>
              </span>
            </span>
            {s.who === "other" ? (
              <span className="ms-slot"><label className="sr-only" htmlFor={`${id}-otherwho`}>Who, in your words</label>
                <input id={`${id}-otherwho`} className={`ms-input${s.otherWho ? " is-filled" : ""}`} placeholder="who" maxLength={SCORECARD_FREE_TEXT_MAX} value={s.otherWho} onChange={(e) => set({ otherWho: e.target.value })} />
              </span>
            ) : null}
            <span className="ms-slot"><span aria-hidden="true">TO</span>
              <label className="sr-only" htmlFor={`${id}-what`}>What you need them to do</label>
              {whoDef && whoDef.actions.length ? (
                <span className={`ms-select${s.what ? " is-chosen" : ""}`}>
                  <select id={`${id}-what`} value={s.what} onChange={(e) => set({ what: e.target.value })} aria-invalid={touched && !s.what}>
                    <option value="">choose</option>
                    {whoDef.actions.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </span>
              ) : (
                <input id={`${id}-what`} className={`ms-input${s.what ? " is-filled" : ""}`} placeholder="do what" maxLength={SCORECARD_FREE_TEXT_MAX} value={s.what} onChange={(e) => set({ what: e.target.value })} disabled={!s.who} />
              )}
            </span>
            <span className="ms-slot"><span aria-hidden="true">BY</span>
              <label className="sr-only" htmlFor={`${id}-when`}>By when</label>
              <span className={`ms-select${s.when ? " is-chosen" : ""}`}>
                <select id={`${id}-when`} value={s.when} onChange={(e) => set({ when: e.target.value })} aria-invalid={touched && !s.when}>
                  <option value="">choose</option>
                  {scorecardWhen.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </span>
            </span>
          </div>
          {touched && !screenValid() ? <p className="form-status is-error" role="alert" style={{ marginTop: 16 }}>✕ Finish the sentence: who, what and when.</p> : null}
        </ToolPanel>
      ) : null}

      {screen === 1 ? (
        <ToolPanel className="tool-body">
          <p className="t-label muted">STEP 2 · WHERE THINGS STAND</p>
          <p className="t-label" style={{ marginTop: 16 }}>{sentence.toUpperCase()}</p>
          <div className="tool-inputs" style={{ marginTop: 28 }}>
            <div className="slider-field">
              <div className="slider-head">
                <label className="field-label" htmlFor={`${id}-ten`}>{fill(scorecardRateQuestion, forms, actionLabel)}</label>
                <span className="slider-value" aria-hidden="true">{s.unknown ? "?" : `${s.rate} / 10`}</span>
              </div>
              <input id={`${id}-ten`} type="range" min={0} max={10} step={1} value={s.rate} disabled={s.unknown} onChange={(e) => set({ rate: Number(e.target.value) })} aria-valuetext={`${s.rate} out of 10`} />
              <div className="slider-scale t-label"><span>0</span><span>10</span></div>
              <label className="check"><input type="checkbox" checked={s.unknown} onChange={(e) => set({ unknown: e.target.checked })} /><span>I don&apos;t know</span></label>
            </div>
            <div className="field" style={{ maxWidth: 320 }}>
              <label className="field-label" htmlFor={`${id}-volume`}>{scorecardVolumeQuestion} <span className="req">Optional</span></label>
              <input id={`${id}-volume`} className="field-control" type="number" inputMode="numeric" min={0} step={1} value={s.volume} onChange={(e) => set({ volume: e.target.value.replace(/\D/g, "") })} />
            </div>
          </div>
        </ToolPanel>
      ) : null}

      {screen >= 2 && !isResults ? (
        <ToolPanel className="tool-body">
          <p className="t-label muted">STEP 3 · TEN STATEMENTS · {screen === 2 ? "TERMS" : "MOMENTS"} · {screen - 1} OF {statementScreens.length}</p>
          <p className="tool-note" style={{ marginTop: 8 }}>How true is each statement today?</p>
          <div style={{ marginTop: 24 }}>
            {statementScreens[screen - 2].map((st) => {
              const text = fill(st.text, forms, actionLabel);
              return (
                <fieldset key={st.id} className="statement" style={{ border: 0, borderTop: "1px solid var(--charcoal-900)", margin: 0, padding: "20px 0 0" }}>
                  <p className="statement-tag t-label">{st.half === "terms" ? "TERMS" : "MOMENT"}</p>
                  <legend className="sr-only">{text}</legend>
                  <p className="statement-text" aria-hidden="true">{text}</p>
                  <Segmented label={text} value={s.answers[st.id] ? String(s.answers[st.id]) : null} onChange={(val) => set({ answers: { ...s.answers, [st.id]: Number(val) } })} options={scaleLabels.map((l, i) => ({ key: String(i + 1), label: l }))} />
                  {touched && typeof s.answers[st.id] !== "number" ? <p className="form-status is-error" role="alert" style={{ marginTop: 8 }}>✕ Choose one answer.</p> : null}
                </fieldset>
              );
            })}
          </div>
        </ToolPanel>
      ) : null}

      {isResults ? (
        <div className="tool-body">
          <div className="tool-results-head">
            <p className="t-label muted">YOUR RESULT · {sentence.toUpperCase()}</p>
            <h2 className="verdict">{v.headline}</h2>
            <p className="t-body-l muted" style={{ maxWidth: 720 }}>{v.body}</p>
            {unknown ? <div className="callout" style={{ maxWidth: 720 }}><span className="t-label">{unknown.headline.toUpperCase()}</span><span>{unknown.body}</span></div> : null}
          </div>
          <div className="result-panel">
            <div className="result-scores">
              <div className="result-score"><span className="t-label">TERMS SCORE</span><span className="result-score-num">{terms}<span> / 100</span></span><div className="result-bar"><div style={{ width: `${terms}%` }} /></div></div>
              <div className="result-score"><span className="t-label">MOMENTS SCORE</span><span className="result-score-num">{moments}<span> / 100</span></span><div className="result-bar"><div style={{ width: `${moments}%` }} /></div></div>
            </div>
            <div className="result-body">
              <div><Quadrant terms={terms} moments={moments} /></div>
              <div>
                <p className="t-label">YOUR THREE BLOCKERS</p>
                <ol className="blockers">
                  {lowest.map((st, i) => (
                    <li key={st.id}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span>{fill(st.text, forms, actionLabel)}<span className="blocker-check" style={{ display: "block" }}>What we&apos;d check first: {fill(st.check, forms, actionLabel)}</span></span>
                    </li>
                  ))}
                </ol>
                {related ? <p style={{ marginTop: 20 }} className="t-small">Related case: <Link className="text-link" href={`/work/${related.slug}`}>{related.name}<span className="text-link-arrow" aria-hidden="true">▸</span></Link></p> : null}
              </div>
            </div>
          </div>
          <div className="tool-actions">
            <Link className="btn btn-primary" href={diagnosticHref}>Book a Diagnostic with this sentence</Link>
            <ToolEmail tool="Conversion Scorecard" label="Email me this report" summary={summary} result={() => ({ sentence, rate: s.unknown ? null : s.rate, terms, moments, verdict: v.headline, blockers: lowest.map((b) => b.id.toUpperCase()) })} shareUrl={() => toolShareUrl(s)} diagnosticUrl={() => `${window.location.origin}${diagnosticHref}`} />
            <button type="button" className="btn btn-secondary" onClick={shareLink}>{copied ? "Link copied" : "Share result link"}</button>
          </div>
          <ToolDisclaimer />
          <p style={{ marginTop: 24 }}><button type="button" className="text-link" style={{ background: "none", border: 0, padding: 0 }} onClick={() => { setS(initial); setScreen(0); history.replaceState(null, "", window.location.pathname); }}>Start again</button></p>
        </div>
      ) : null}

      {!isResults ? (
        <div className="tool-actions">
          {screen > 0 ? <button type="button" className="btn btn-secondary" onClick={back}>Back</button> : null}
          <button type="button" className="btn btn-primary" onClick={next}>{screen === SCREENS - 2 ? "See my result" : "Continue"}</button>
        </div>
      ) : null}
    </div>
  );
}
