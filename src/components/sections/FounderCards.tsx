import { people } from "@/content/people";
import { Portrait, TextLink } from "@/components/ds/primitives";

/** Split founders block: paper card for Terms, charcoal card for Moments. */
export function FounderCards() {
  return (
    <div className="founder-grid">
      {people.map((p) => {
        const moments = p.half === "moments";
        return (
          <article key={p.slug} className={`founder-card ${moments ? "is-moments on-dark" : "is-terms"}`}>
            <p className="t-label" style={{ color: moments ? "var(--text-muted-dark)" : "var(--text-muted)" }}>{moments ? "MOMENTS" : "TERMS"}</p>
            <div className="founder-card-top">
              <Portrait alt={`Portrait of ${p.name}`} label={moments ? "PORTRAIT · CHARCOAL" : "PORTRAIT · PAPER"} dark={moments} src={p.portrait} />
              <div>
                <h3 className="founder-name">{p.name}</h3>
                <p className="founder-role">{p.title}</p>
              </div>
            </div>
            <p className="founder-line">{p.line}</p>
            <p className="founder-body">{p.cardBody}</p>
            <ul className="founder-proof">{p.cardProof.map((line) => <li key={line}>{line}</li>)}</ul>
            <TextLink href={`/people/${p.slug}`}>{p.name.split(" ")[0]}&apos;s profile</TextLink>
          </article>
        );
      })}
    </div>
  );
}
