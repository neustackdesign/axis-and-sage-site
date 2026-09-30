import { ButtonLink, Eyebrow } from "@/components/ds/primitives";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { bookCallHref, scorecardHref } from "@/content/site";

export const metadata = { title: "Nothing here", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="tone-paper">
        <section className="wrap page-hero" aria-labelledby="nf-title">
          <div className="page-hero-grid">
            <Eyebrow strong>404</Eyebrow>
            <div>
              <h1 id="nf-title" className="t-display">Nothing here.</h1>
              <p className="page-hero-sub t-body-l">The page moved or never existed.</p>
              <div className="button-row" style={{ marginTop: 32 }}>
                <ButtonLink href={scorecardHref}>Take the Scorecard</ButtonLink>
                <ButtonLink href={bookCallHref} variant="secondary">Book a call</ButtonLink>
                <ButtonLink href="/" variant="secondary">Home</ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
