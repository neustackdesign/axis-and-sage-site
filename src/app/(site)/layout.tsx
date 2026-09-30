import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Tracking } from "@/components/analytics/Tracking";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationLd } from "@/lib/seo";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={organizationLd()} />
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
      <Tracking />
      <GoogleAnalytics />
    </>
  );
}
