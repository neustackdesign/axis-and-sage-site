"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { SpecialistCard } from "@/components/ds/blocks";
import { specialistCards } from "@/content/engagements";
import { deckQuestions } from "@/content/tools";
import { deckOutline, deckText } from "@/lib/tools/deck";
import { ToolDisclaimer, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolComplete } from "./useTool";

/** Pitch Deck Outline: twelve short questions, twelve slides with the user's words in place. */
export function DeckOutline() {
  const id = useId();
  const complete = useToolComplete("Pitch Deck Outline");
  const [answers, setAnswers] = useState<string[]>(() => deckQuestions.map(() => ""));
  const [copied, setCopied] = useState(false);
  useHashRestore<{ answers: string[] }>(useCallback((r) => { if (Array.isArray(r.answers)) setAnswers(deckQuestions.map((_, i) => String(r.answers[i] || ""))); }, []));
  const filled = answers.filter((a) => a.trim()).length;
  const outline = deckOutline(answers);
  useEffect(() => { if (filled === deckQuestions.length) complete({ filled }, { slides: deckQuestions.length }); }, [filled, complete]);
  const copy = () => navigator.clipboard?.writeText(deckText(answers)).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2400); });

  return (
    <div className="tool-grid-2">
      <ToolPanel>
        <div className="tool-head"><p className="t-label muted">TWELVE QUESTIONS</p><p className="t-label" aria-live="polite">{filled} OF 12</p></div>
        <div style={{ marginTop: 20 }}>
          {deckQuestions.map((q, i) => (
            <div key={q.slide} className="deck-q">
              <span className="t-label muted">{String(i + 1).padStart(2, "0")}</span>
              <div className="field">
                <label className="field-label" htmlFor={`${id}-${i}`}>{q.question}</label>
                <textarea id={`${id}-${i}`} className="field-control" rows={2} style={{ minHeight: 72 }} value={answers[i]} onChange={(e) => { setAnswers((a) => a.map((x, j) => (j === i ? e.target.value : x))); }} />
              </div>
            </div>
          ))}
        </div>
      </ToolPanel>
      <div className="stack-24">
        <ToolPanel>
          <div className="tool-head"><p className="t-label muted">YOUR OUTLINE · 12 SLIDES</p></div>
          <ol className="deck-outline" style={{ marginTop: 20 }} aria-live="polite">
            {outline.map((s) => (
              <li key={s.slide}>
                <span className="t-label muted">{String(s.number).padStart(2, "0")}</span>
                <div>
                  <p className="deck-slide-title">{s.slide}</p>
                  <p className={`deck-slide-words${s.headline ? "" : " is-empty"}`}>{s.headline || "Your headline appears here."}</p>
                  <p className="deck-slide-note">{s.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="tool-actions">
            <button type="button" className="btn btn-secondary" onClick={copy} disabled={!filled}>{copied ? "Copied" : "Copy outline"}</button>
            <ToolEmail tool="Pitch Deck Outline" label="Email me the outline" summary={() => deckText(answers)} result={() => ({ filled })} shareUrl={() => toolShareUrl({ answers })} />
          </div>
          <ToolDisclaimer />
        </ToolPanel>
        <SpecialistCard s={specialistCards[0]} cta={{ label: "Book an Investor Readiness Sprint", href: "/contact?engagement=Investor%20Readiness%20Sprint&source=deck#note" }} />
      </div>
    </div>
  );
}
