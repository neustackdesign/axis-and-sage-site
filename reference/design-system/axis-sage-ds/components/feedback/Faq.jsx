import React from "react";
/** FAQ: native details/summary, mono index, serif question, + / – control. */
export function Faq({ items = [] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q}>
          <summary><span className="t-label">{String(i + 1).padStart(2, "0")}</span><h3>{f.q}</h3></summary>
          <p className="faq-answer">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
