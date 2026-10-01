import { ButtonLink, Eyebrow } from "@/components/ds/primitives";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { headerNav } from "@/lib/content/header";
import { getSettings, getSitePage } from "@/sanity/load";

export const metadata = { title: "Nothing here", robots: { index: false, follow: false } };

export default async function NotFound() {
  const [settings, p] = await Promise.all([getSettings(), getSitePage("notFound")]);
  return (
    <>
      <SiteHeader nav={headerNav(settings)} />
      <main id="main" className="tone-paper">
        <section className="wrap page-hero" aria-labelledby="nf-title">
          <div className="page-hero-grid">
            <Eyebrow strong>{p.hero.label}</Eyebrow>
            <div>
              <h1 id="nf-title" className="t-display">{p.hero.title}</h1>
              {p.hero.sub ? <p className="page-hero-sub t-body-l">{p.hero.sub}</p> : null}
              <div className="button-row" style={{ marginTop: 32 }}>
                <ButtonLink href={settings.scorecardCta.href}>{settings.scorecardCta.label}</ButtonLink>
                <ButtonLink href={settings.primaryCta.href} variant="secondary">{settings.primaryCta.label}</ButtonLink>
                <ButtonLink href="/" variant="secondary">{p.strings.homeLink ?? "Home"}</ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
