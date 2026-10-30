import type { Person } from "@/lib/content/types";
import { Portrait, TextLink } from "@/components/ds/primitives";

/** Split founders block: Cloud card for Terms, Midnight card for Moments. Name, role and principle line only: the stats and cases carry the proof, the profile carries the bio. */
export function FounderCards({ people }: { people: Person[] }) {
  return (
    <div className="founder-grid">
      {people.map((p) => {
        const moments = p.half === "moments";
        return (
          <article key={p.slug} className={`founder-card ${moments ? "is-moments on-dark" : "is-terms"}`}>
            <p className="t-label" style={{ color: moments ? "var(--text-muted-dark)" : "var(--text-muted)" }}>{moments ? "MOMENTS" : "TERMS"}</p>
            <div className="founder-card-top">
              <Portrait alt={p.name} initials={p.initials} dark={moments} src={p.portrait} />
              <div>
                <h3 className="founder-name">{p.name}</h3>
                <p className="founder-role">{p.title}</p>
                <p className="founder-practice t-label">{p.practice.toUpperCase()}</p>
              </div>
            </div>
            <p className="founder-line">{p.line}</p>
            <TextLink href={`/people/${p.slug}`}>{p.name.split(" ")[0]}&apos;s profile</TextLink>
          </article>
        );
      })}
    </div>
  );
}
