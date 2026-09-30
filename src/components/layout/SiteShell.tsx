import type { ReactNode } from "react";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Tracking } from "@/components/analytics/Tracking";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, type HeaderVariant } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd } from "@/lib/seo";

/**
 * The page shell shared by every route group. The home route group asks for the hero header, which sits inside the
 * homepage cover; every other page gets the sticky paper header. One header per page, chosen by layout, not by path.
 */
export function SiteShell({ children, header = "default" }: { children: ReactNode; header?: HeaderVariant }) {
  return (
    <>
      <JsonLd data={organizationLd()} />
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader variant={header} />
      <main id="main">{children}</main>
      <SiteFooter />
      <Tracking />
      <GoogleAnalytics />
    </>
  );
}
