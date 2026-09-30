import { PageHero } from "@/components/ds/PageHero";
import { Section, SmartLink } from "@/components/ds/primitives";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata = { ...pageMetadata({ title: "Thank you", path: "/thank-you" }), robots: { index: false, follow: false } };

export default function ThankYouPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Thank you", path: "/thank-you" }]} />
      <PageHero label="THANK YOU" title="Thanks. We'll be in touch within one working day." />
      <Section tight labelledBy="next-title">
        <h2 id="next-title" className="sr-only">While you wait</h2>
        <div className="case-grid">
          <SmartLink href="/tools/conversion-scorecard" className="tool-card"><span className="t-label">SCORECARD · 6 MIN</span><span className="t-h3">Take the Conversion Scorecard</span><span className="text-link" style={{ marginTop: "auto" }}>Start<span className="text-link-arrow" aria-hidden="true">▸</span></span></SmartLink>
          <SmartLink href="/guides/what-the-conversion-diagnostic-fee-pays-for" className="tool-card"><span className="t-label">GUIDE</span><span className="t-h3">Read &ldquo;What the Diagnostic fee pays for&rdquo;</span><span className="text-link" style={{ marginTop: "auto" }}>Read<span className="text-link-arrow" aria-hidden="true">▸</span></span></SmartLink>
        </div>
      </Section>
    </>
  );
}
