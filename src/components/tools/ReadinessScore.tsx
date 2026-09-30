"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { readinessGroups, type ReadinessAnswer } from "@/content/tools";
import { checkKey, readinessGaps, readinessScore } from "@/lib/tools/readiness";
import { Segmented, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolEvents } from "./useTool";

const options: { key: ReadinessAnswer; label: string }[] = [{ key: "yes", label: "Yes" }, { key: "partly", label: "Partly" }, { key: "no", label: "No" }];
const total = readinessGroups.reduce((n, g) => n + g.checks.length, 0);
type State = { answers: Record<string, ReadinessAnswer>; showResult: boolean };

/** Investor Readiness Score: twenty-five checks scored 2 / 1 / 0. All scoring in lib/tools/readiness. */
export function ReadinessScore() {
  const events = useToolEvents("Investor Readiness Score");
  const [s, setS] = useState<State>({ answers: {}, showResult: false });
  useHashRestore<State>(useCallback((r) => setS({ answers: r.answers || {}, showResult: true }), []));
  const answered = Object.keys(s.answers).length;
  const score = readinessScore(s.answers);
  const gaps = readinessGaps(s.answers);
  useEffect(() => { if (s.showResult) events.complete({ pct: score.pct }); }, [s.showResult, events, score.pct]);

  const summary = () => [`Overall: ${score.pct}% · ${score.band.headline}`, score.band.line, "", ...score.groups.map((g) => `${g.label}: ${g.pct}% (${g.points}/${g.max})`), "", `Gaps (${gaps.length}):`, ...gaps.map((g) => `- [${g.group}] ${g.text} (${g.answer || "not answered"})`)].join("\n");

  return (
    <div>
      <ToolPanel>
        <div className="tool-head"><p className="t-label muted">TWENTY-FIVE CHECKS</p><p className="t-label" aria-live="polite">{answered} OF {total} ANSWERED</p></div>
        <div className="progress-bar" style={{ marginTop: 12 }} role="progressbar" aria-label="Checks answered" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}><div style={{ width: `${(answered / total) * 100}%` }} /></div>
        <div style={{ marginTop: 32 }}>
          {readinessGroups.map((g, gi) => (
            <section key={g.key} className="readiness-group" aria-labelledby={`rg-${g.key}`}>
              <h2 id={`rg-${g.key}`} className="t-h3">{String(gi + 1).padStart(2, "0")} · {g.label}</h2>
              <div style={{ marginTop: 8 }}>
                {g.checks.map((c, i) => {
                  const k = checkKey(g.key, i);
                  return (
                    <div key={k} className="readiness-row">
                      <span className="t-label muted">{gi * 5 + i + 1}</span>
                      <span>{c}</span>
                      <Segmented label={c} value={s.answers[k] || null} onChange={(v) => { events.start(); setS((cur) => ({ ...cur, answers: { ...cur.answers, [k]: v } })); }} options={options} />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <div className="tool-actions">
          <button type="button" className="btn btn-dark" onClick={() => { events.step("results"); setS((cur) => ({ ...cur, showResult: true })); }}>See my score</button>
          {answered < total ? <p className="tool-note" style={{ alignSelf: "center" }}>Unanswered checks count as no.</p> : null}
        </div>
      </ToolPanel>

      {s.showResult ? (
        <ToolPanel>
          <p className="t-label muted">YOUR SCORE</p>
          <p className="verdict" style={{ marginTop: 12 }}>{score.pct}% · {score.band.headline}</p>
          <p className="t-body-l muted" style={{ marginTop: 12, maxWidth: 720 }}>{score.band.line}</p>
          <div className="group-scores" style={{ marginTop: 28 }}>
            {score.groups.map((g) => <div key={g.key}><span className="t-label muted">{g.label.toUpperCase()}</span><span className="num">{g.pct}%</span><div className="result-bar" style={{ background: "var(--paper-100)" }}><div style={{ width: `${g.pct}%` }} /></div></div>)}
          </div>
          <p className="t-label" style={{ marginTop: 32 }}>YOUR GAPS · {gaps.length}</p>
          {gaps.length ? <ol className="blockers">{gaps.map((g, i) => <li key={g.text}><span>{String(i + 1).padStart(2, "0")}</span><span>{g.text} <span className="t-label muted">· {g.group.toUpperCase()} · {(g.answer || "not answered").toUpperCase()}</span></span></li>)}</ol> : <p className="muted" style={{ marginTop: 12 }}>No gaps. Every check is a yes.</p>}
          <div className="tool-actions">
            <Link className="btn btn-primary" href="/contact?engagement=Investor%20Readiness%20Sprint#note">Book an Investor Readiness Sprint</Link>
            <ToolEmail tool="Investor Readiness Score" label="Email me the checklist" summary={summary} result={() => ({ answers: s.answers, pct: score.pct })} shareUrl={() => toolShareUrl({ answers: s.answers })} />
          </div>
        </ToolPanel>
      ) : null}
    </div>
  );
}
