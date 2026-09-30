"use client";

import Link from "next/link";
import { useState } from "react";
import { readinessBand, readinessGroups, readinessValue, type ReadinessAnswer } from "@/content/tools";
import { Segmented, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";

const options: { key: ReadinessAnswer; label: string }[] = [{ key: "yes", label: "Yes" }, { key: "partly", label: "Partly" }, { key: "no", label: "No" }];
const total = readinessGroups.reduce((n, g) => n + g.checks.length, 0);

/** Investor Readiness Score: twenty-five checks in five groups, answered yes, partly or no. */
export function ReadinessScore() {
  const [answers, setAnswers] = useState<Record<string, ReadinessAnswer>>({});
  const [showResult, setShowResult] = useState(false);
  const answered = Object.keys(answers).length;
  const score = (keys: string[]) => keys.length ? Math.round((keys.reduce((n, k) => n + (answers[k] ? readinessValue[answers[k]] : 0), 0) / keys.length) * 100) : 0;
  const allKeys = readinessGroups.flatMap((g) => g.checks.map((_, i) => `${g.key}-${i}`));
  const overall = score(allKeys);
  const band = readinessBand(overall);
  const gaps = readinessGroups.flatMap((g) => g.checks.map((c, i) => ({ group: g.label, text: c, a: answers[`${g.key}-${i}`] }))).filter((x) => x.a !== "yes");
  const summary = () => [`Overall: ${overall}%`, ...readinessGroups.map((g) => `${g.label}: ${score(g.checks.map((_, i) => `${g.key}-${i}`))}%`), "", "Gaps:", ...gaps.map((g) => `- [${g.group}] ${g.text} (${g.a || "not answered"})`)].join("\n");

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
                  const k = `${g.key}-${i}`;
                  return (
                    <div key={k} className="readiness-row">
                      <span className="t-label muted">{gi * 5 + i + 1}</span>
                      <span>{c}</span>
                      <Segmented label={c} value={answers[k] || null} onChange={(v) => setAnswers((s) => ({ ...s, [k]: v }))} options={options} />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <div className="tool-actions">
          <button type="button" className="btn btn-dark" onClick={() => setShowResult(true)}>See my score</button>
          {answered < total ? <p className="tool-note" style={{ alignSelf: "center" }}>Unanswered checks count as no.</p> : null}
        </div>
      </ToolPanel>

      {showResult ? (
        <ToolPanel>
          <p className="t-label muted">YOUR SCORE</p>
          <p className="verdict" style={{ marginTop: 12 }}>{overall}% · {band.headline}</p>
          <p className="t-body-l muted" style={{ marginTop: 12, maxWidth: 720 }}>{band.line}</p>
          <div className="group-scores" style={{ marginTop: 28 }}>
            {readinessGroups.map((g) => { const s = score(g.checks.map((_, i) => `${g.key}-${i}`)); return <div key={g.key}><span className="t-label muted">{g.label.toUpperCase()}</span><span className="num">{s}%</span><div className="result-bar" style={{ background: "var(--paper-100)" }}><div style={{ width: `${s}%` }} /></div></div>; })}
          </div>
          <p className="t-label" style={{ marginTop: 32 }}>YOUR GAPS · {gaps.length}</p>
          {gaps.length ? <ol className="blockers">{gaps.map((g, i) => <li key={g.text}><span>{String(i + 1).padStart(2, "0")}</span><span>{g.text} <span className="t-label muted">· {g.group.toUpperCase()} · {(g.a || "not answered").toUpperCase()}</span></span></li>)}</ol> : <p className="muted" style={{ marginTop: 12 }}>No gaps. Every check is a yes.</p>}
          <div className="tool-actions">
            <Link className="btn btn-primary" href="/contact?engagement=Investor%20Readiness%20Sprint#note">Book an Investor Readiness Sprint</Link>
            <ToolEmail tool="Investor Readiness Score" label="Download the checklist" summary={summary} successText="Done. The checklist is on its way to your inbox." />
          </div>
        </ToolPanel>
      ) : null}
    </div>
  );
}
