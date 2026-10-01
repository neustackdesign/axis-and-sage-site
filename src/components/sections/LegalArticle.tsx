import { Eyebrow } from "@/components/ds/primitives";
import { RichText } from "@/components/ds/RichText";
import type { LegalDoc } from "@/lib/content/types";

/** Privacy and terms in the design system's Article layout: label, title, date, contents rail, body (Portable Text). */
export function LegalArticle({ doc }: { doc: LegalDoc }) {
  return (
    <article className="article">
      <header className="wrap article-head">
        <Eyebrow strong>{doc.label}</Eyebrow>
        <h1 className="t-h1 article-title">{doc.title}</h1>
        <p className="article-standfirst t-body-l">{doc.updated}</p>
      </header>
      <div className="wrap article-layout">
        <nav className="article-toc" aria-label="Contents">
          <span className="t-label muted">CONTENTS</span>
          {doc.sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.heading}</a>)}
        </nav>
        <div className="article-body">
          {doc.sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id}>{s.heading}</h2>
              <RichText value={s.body} components={{ block: { normal: ({ children }) => <p>{children}</p> } }} />
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
