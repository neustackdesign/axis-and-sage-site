import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Section, TextLink } from "@/components/ds/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { newsletter } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({ title: "Terms & Moments", path: "/newsletter", description: newsletter.line });

// Archive issues, newest first. Empty until the first issue is sent.
const issues: { title: string; date: string; href: string }[] = [];

export default function NewsletterPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Newsletter", path: "/newsletter" }]} />
      <PageHero label="NEWSLETTER" title={`${newsletter.name}.`} display sub={newsletter.line}>
        <div style={{ width: "100%", maxWidth: 560 }}><NewsletterForm primary /></div>
      </PageHero>
      <Section tone="alt" labelledBy="archive-title">
        <div className="section-header rail-grid">
          <Eyebrow strong as="div"><span id="archive-title">ARCHIVE</span></Eyebrow>
          {issues.length ? (
            <ol className="spec-list">{issues.map((i, k) => <li key={i.href}><span className="t-label">{String(issues.length - k).padStart(2, "0")}</span><span><TextLink href={i.href}>{i.title}</TextLink> <span className="t-label muted">· {i.date}</span></span></li>)}</ol>
          ) : (
            <div className="work-empty" style={{ borderTop: "1px solid var(--charcoal-900)", paddingTop: 24 }}>
              <p className="t-h3">No issues yet.</p>
              <p className="muted">The archive starts with the first issue: [first issue date]. Subscribe above to get it.</p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}
