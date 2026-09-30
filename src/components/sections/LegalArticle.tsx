import Link from "next/link";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ds/primitives";
import type { LegalDoc, LegalItem } from "@/content/legal";

const EMAIL = "info@axisandsage.com";

/** Links the contact address, and "privacy notice" in the terms, without changing a word of the text. */
function linked(text: string): ReactNode[] {
  return text.split(/(info@axisandsage\.com|privacy notice)/).map((part, i) => {
    if (part === EMAIL) return <a key={i} className="text-link" href={`mailto:${EMAIL}`}>{part}</a>;
    if (part === "privacy notice") return <Link key={i} className="text-link" href="/privacy">{part}</Link>;
    return part;
  });
}

const item = (x: LegalItem) => (typeof x === "string" ? linked(x) : <><strong>{x.lead}</strong> {linked(x.text)}</>);

/** Privacy and terms in the design system's Article layout: label, title, date, contents rail, body. */
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
              {s.body.map((b, i) => ("p" in b ? <p key={i}>{linked(b.p)}</p> : <ul key={i}>{b.ul.map((x, j) => <li key={j}>{item(x)}</li>)}</ul>))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
