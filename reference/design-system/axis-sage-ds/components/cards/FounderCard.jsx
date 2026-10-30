import React from "react";
import { Portrait } from "../content/Portrait.jsx";
/** Founder card: Cloud for Terms, midnight for Moments. Place two in a .founder-grid. */
export function FounderCard({ person, href = "#" }) {
  const m = person.half === "moments";
  return (
    <article className={"founder-card " + (m ? "is-moments on-dark" : "is-terms")}>
      <p className="t-label" style={{ color: m ? "var(--text-muted-dark)" : "var(--text-muted)" }}>{m ? "MOMENTS" : "TERMS"}</p>
      <div className="founder-card-top">
        <Portrait alt={person.name} initials={person.initials} dark={m} src={person.portrait} />
        <div>
          <h3 className="founder-name">{person.name}</h3>
          <p className="founder-role">{person.title}</p>
          <p className="founder-practice t-label">{String(person.practice).toUpperCase()}</p>
        </div>
      </div>
      <p className="founder-line">{person.line}</p>
      <p className="founder-body">{person.cardBody}</p>
      <ul className="founder-proof">{(person.cardProof || []).map((l) => <li key={l}>{l}</li>)}</ul>
      <a className="text-link" href={href}>{person.name.split(" ")[0]}'s profile<span className="text-link-arrow">▸</span></a>
    </article>
  );
}
