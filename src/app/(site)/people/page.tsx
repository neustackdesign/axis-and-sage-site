import { CTABand } from "@/components/ds/CTABand";
import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Portrait, Section, TextLink } from "@/components/ds/primitives";
import { people, specialists } from "@/content/people";
import { pageTitles } from "@/content/titles";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: pageTitles.people.title,
  absoluteTitle: true,
  path: "/people",
  description: "Two founders. Both of them on your work. Ifeanyi designs the terms people act on. Tomiwa designs the moments they act in.",
});

export default function PeoplePage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "People", path: "/people" }]} />
      <PageHero label="PEOPLE" title="Two founders. Both of them on your work." sub="Ifeanyi designs the terms people act on. Tomiwa designs the moments they act in." />
      {people.map((p, i) => (
        <Section key={p.slug} tone={p.half === "moments" ? "charcoal" : "paper"} labelledBy={`${p.slug}-name`}>
          <div className="person-row">
            <Portrait alt={p.name} initials={p.initials} dark={p.half === "moments"} src={p.portrait} />
            <div className="stack-24">
              <Eyebrow>{String(i + 1).padStart(2, "0")} · {p.half === "terms" ? "TERMS" : "MOMENTS"}</Eyebrow>
              <div>
                <h2 id={`${p.slug}-name`} className="t-h2">{p.name}</h2>
                <p className="muted" style={{ marginTop: 8 }}>{p.title}</p>
              </div>
              <p className="founder-line">{p.line}</p>
              <p className="prose">{p.bio}</p>
              <TextLink href={`/people/${p.slug}`}>{p.name.split(" ")[0]}&apos;s profile</TextLink>
            </div>
          </div>
        </Section>
      ))}
      {specialists.length ? (
        <Section labelledBy="specialists-title">
          <div className="section-header rail-grid">
            <Eyebrow strong>SPECIALISTS</Eyebrow>
            <div>
              <h2 id="specialists-title" className="t-h2">Specialists we bring in.</h2>
              <ul className="spec-list" style={{ marginTop: 32 }}>{specialists.map((s, k) => <li key={s.name}><span className="t-label">{String(k + 1).padStart(2, "0")}</span><span><strong>{s.name}</strong> · {s.role}</span></li>)}</ul>
            </div>
          </div>
        </Section>
      ) : null}
      <CTABand />
    </>
  );
}
