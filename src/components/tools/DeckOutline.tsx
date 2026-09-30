"use client";

import { useId, useState } from "react";
import { SpecialistCard } from "@/components/ds/blocks";
import { specialistCards } from "@/content/engagements";
import { deckQuestions } from "@/content/tools";
import { ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";

/** Pitch Deck Outline: twelve short questions, twelve slides with the user's words in place. */
export function DeckOutline() {
  const id = useId();
  const [answers, setAnswers] = useState<string[]>(() => deckQuestions.map(() => ""));
  const [copied, setCopied] = useState(false);
  const filled = answers.filter((a) => a.trim()).length;
  const text = () => deckQuestions.map((q, i) => `${String(i + 1).padStart(2, "0")} ${q.slide}\n${answers[i].trim() || "[to write]"}\nNote: ${q.note}`).join("\n\n");
  const copy = () => navigator.clipboard?.writeText(text()).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2400); });

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
                <textarea id={`${id}-${i}`} className="field-control" rows={2} style={{ minHeight: 72 }} value={answers[i]} onChange={(e) => setAnswers((a) => a.map((x, j) => (j === i ? e.target.value : x)))} />
              </div>
            </div>
          ))}
        </div>
      </ToolPanel>
      <div className="stack-24">
        <ToolPanel>
          <div className="tool-head"><p className="t-label muted">YOUR OUTLINE · 12 SLIDES</p></div>
          <ol className="deck-outline" style={{ marginTop: 20 }} aria-live="polite">
            {deckQuestions.map((q, i) => (
              <li key={q.slide}>
                <span className="t-label muted">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="deck-slide-title">{q.slide}</p>
                  <p className={`deck-slide-words${answers[i].trim() ? "" : " is-empty"}`}>{answers[i].trim() || "Your words appear here."}</p>
                  <p className="deck-slide-note">{q.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="tool-actions">
            <button type="button" className="btn btn-secondary" onClick={copy} disabled={!filled}>{copied ? "Copied" : "Copy"}</button>
            <ToolEmail tool="Pitch Deck Outline" label="Email me the outline" summary={text} successText="Done. The outline is on its way to your inbox." />
          </div>
        </ToolPanel>
        <SpecialistCard s={specialistCards[0]} cta={{ label: "Book an Investor Readiness Sprint", href: "/contact?engagement=Investor%20Readiness%20Sprint#note" }} />
      </div>
    </div>
  );
}
