"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { scaleLabels, scorecardStatements, scorecardWho } from "@/content/tools";
import { whenOptions } from "@/content/site";
import { caseBySlug } from "@/content/work";
import { blockers, fillStatement, halfScore, relatedCaseSlug, scorecardSummary, unknownNote, verdict } from "@/lib/tools/scorecard";
import { Quadrant, Segmented, Stepper, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolEvents } from "./useTool";

type State = { who: string; otherWho: string; what: string; when: string; outOf10: number; unknown: boolean; monthly: string; answers: Record<string, number> };

const initial: State = { who: "", otherWho: "", what: "", when: "", outOf10: 3, unknown: false, monthly: "", answers: {} };
const statementScreens = [0, 2, 4, 6, 8].map((i) => scorecardStatements.slice(i, i + 2));
const SCREENS = 1 + 1 + statementScreens.length + 1; // action, standing, 5 statement screens, results
const STEP_NAMES = ["The action", "Where things stand", "Ten statements", "Results"];

/** Conversion Scorecard: four steps with a progress bar, then results. All scoring lives in lib/tools/scorecard. */
export function Scorecard({ preset }: { preset?: { who?: string; what?: string; when?: string } }) {
  const id = useId();
  const events = useToolEvents("Conversion Scorecard");
  const [s, setS] = useState<State>(() => {
    const who = scorecardWho.find((w) => w.key === preset?.who?.toLowerCase() || w.label.toLowerCase() === preset?.who?.toLowerCase())?.key || "";
    const whoDef = scorecardWho.find((w) => w.key === who);
    const what = whoDef?.actions.find((a) => a.startsWith(preset?.what || "\u0000")) || "";
    const when = whenOptions.find((w) => w === preset?.when) || "";
    return { ...initial, who, what, when };
  });
  const [screen, setScreen] = useState(0);
  const [touched, setTouched] = useState(false);
  const [copied, setCopied] = useState(false);

  useHashRestore<State>(useCallback((restored) => { setS({ ...initial, ...restored }); setScreen(SCREENS - 1); }, []));

  const whoDef = scorecardWho.find((w) => w.key === s.who);
  const whoLabel = s.who === "other" ? s.otherWho || "they" : whoDef?.label.toLowerCase() || "[who]";
  const actionLabel = s.what || "[act]";
  const set = (patch: Partial<State>) => { events.start(); setS((cur) => ({ ...cur, ...patch })); };
  const stepIndex = screen === 0 ? 0 : screen === 1 ? 1 : screen < SCREENS - 1 ? 2 : 3;
  const progress = (screen / (SCREENS - 1)) * 100;

  const terms = halfScore(s.answers, "terms");
  const moments = halfScore(s.answers, "moments");
  const v = verdict(terms, moments);
  const unknown = unknownNote(s.unknown);
  const lowest = useMemo(() => blockers(s.answers), [s.answers]);
  const related = caseBySlug(relatedCaseSlug(s.who));
  const sentence = `We need ${whoLabel} to ${actionLabel}${s.when && s.when !== "no date yet" ? ` by ${s.when}` : ""}.`;
  const isResults = screen === SCREENS - 1;

  useEffect(() => { if (isResults) events.complete({ verdict: v.key, terms, moments }); }, [isResults, events, v.key, terms, moments]);

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
    events.step(n === SCREENS - 1 ? "results" : n >= 2 ? `statements-${n - 1}` : STEP_NAMES[n]);
    window.scrollTo({ top: (document.getElementById(`${id}-top`)?.offsetTop || 0) - 80, behavior: "smooth" });
  };
  const back = () => { setTouched(false); setScreen((n) => Math.max(0, n - 1)); };

  const shareLink = () => {
    const url = toolShareUrl(s);
    navigator.clipboard?.writeText(url).then(() => setCopied(true), () => window.prompt("Copy this link", url));
  };

  const summary = () => scorecardSummary({ sentence, unknown: s.unknown, outOf10: s.outOf10, monthly: s.monthly, answers: s.answers, who: whoLabel, action: actionLabel });
  const diagnosticHref = `/contact?who=${encodeURIComponent(whoLabel)}&what=${encodeURIComponent(actionLabel)}&when=${encodeURIComponent(s.when)}&engagement=diagnostic#note`;

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
                <input id={`${id}-otherwho`} className={`ms-input${s.otherWho ? " is-filled" : ""}`} placeholder="who" value={s.otherWho} onChange={(e) => set({ otherWho: e.target.value })} />
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
                <input id={`${id}-what`} className={`ms-input${s.what ? " is-filled" : ""}`} placeholder="do what" value={s.what} onChange={(e) => set({ what: e.target.value })} disabled={!s.who} />
              )}
            </span>
            <span className="ms-slot"><span aria-hidden="true">BY</span>
              <label className="sr-only" htmlFor={`${id}-when`}>By when</label>
              <span className={`ms-select${s.when ? " is-chosen" : ""}`}>
                <select id={`${id}-when`} value={s.when} onChange={(e) => set({ when: e.target.value })} aria-invalid={touched && !s.when}>
                  <option value="">choose</option>
                  {whenOptions.map((w) => <option key={w} value={w}>{w}</option>)}
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
                <label className="field-label" htmlFor={`${id}-ten`}>Out of every 10 {whoLabel} who reach the point of deciding, how many {actionLabel} today?</label>
                <span className="slider-value" aria-hidden="true">{s.unknown ? "?" : `${s.outOf10} / 10`}</span>
              </div>
              <input id={`${id}-ten`} type="range" min={0} max={10} step={1} value={s.outOf10} disabled={s.unknown} onChange={(e) => set({ outOf10: Number(e.target.value) })} aria-valuetext={`${s.outOf10} out of 10`} />
              <div className="slider-scale t-label"><span>0</span><span>10</span></div>
              <label className="check"><input type="checkbox" checked={s.unknown} onChange={(e) => set({ unknown: e.target.checked })} /><span>I don&apos;t know</span></label>
            </div>
            <div className="field" style={{ maxWidth: 320 }}>
              <label className="field-label" htmlFor={`${id}-monthly`}>How many reach that point in a typical month? <span className="req">Optional</span></label>
              <input id={`${id}-monthly`} className="field-control" type="number" inputMode="numeric" min={0} value={s.monthly} onChange={(e) => set({ monthly: e.target.value })} />
            </div>
          </div>
        </ToolPanel>
      ) : null}

      {screen >= 2 && !isResults ? (
        <ToolPanel className="tool-body">
          <p className="t-label muted">STEP 3 · TEN STATEMENTS · {screen - 1} OF {statementScreens.length}</p>
          <p className="tool-note" style={{ marginTop: 8 }}>How true is each statement today?</p>
          <div style={{ marginTop: 24 }}>
            {statementScreens[screen - 2].map((st) => {
              const text = fillStatement(st.text, whoLabel, actionLabel);
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
            <p className="t-body-l muted" style={{ maxWidth: 720 }}>{v.line}</p>
            {unknown ? <div className="callout" style={{ maxWidth: 720 }}><span className="t-label">{unknown.headline.toUpperCase()}</span><span>{unknown.line}</span></div> : null}
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
                      <span>{fillStatement(st.text, whoLabel, actionLabel)}<span className="blocker-check" style={{ display: "block" }}>What we&apos;d check first: {st.check}</span></span>
                    </li>
                  ))}
                </ol>
                {related ? <p style={{ marginTop: 20 }} className="t-small">Related case: <Link className="text-link" href={`/work/${related.slug}`}>{related.name}<span className="text-link-arrow" aria-hidden="true">▸</span></Link></p> : null}
              </div>
            </div>
          </div>
          <div className="tool-actions">
            <Link className="btn btn-primary" href={diagnosticHref}>Book a Diagnostic with this sentence</Link>
            <ToolEmail tool="Conversion Scorecard" label="Email me this report" summary={summary} result={() => ({ ...s, terms, moments, verdict: v.key })} shareUrl={() => toolShareUrl(s)} diagnosticUrl={() => `${window.location.origin}${diagnosticHref}`} />
            <button type="button" className="btn btn-secondary" onClick={shareLink}>{copied ? "Link copied" : "Share result link"}</button>
          </div>
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
