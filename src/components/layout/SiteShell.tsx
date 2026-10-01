import type { ReactNode } from "react";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Tracking } from "@/components/analytics/Tracking";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, type HeaderVariant } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { headerNav } from "@/lib/content/header";
import { organizationLd } from "@/lib/seo";
import { getPeople, getSettings } from "@/sanity/load";

/**
 * The page shell shared by every route group. The home route group asks for the hero header, which sits inside the
 * homepage cover; every other page gets the sticky paper header. One header per page, chosen by layout, not by path.
 */
export async function SiteShell({ children, header = "default" }: { children: ReactNode; header?: HeaderVariant }) {
  const [settings, people] = await Promise.all([getSettings(), getPeople()]);
  return (
    <>
      <JsonLd data={organizationLd(settings, people)} />
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader variant={header} nav={headerNav(settings)} />
      <main id="main">{children}</main>
      <SiteFooter settings={settings} />
      <Tracking />
      <GoogleAnalytics />
    </>
  );
}
