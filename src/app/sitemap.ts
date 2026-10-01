import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/metadata";
import { embeddedLeadershipHref } from "@/lib/routes";
import { getSitemapData } from "@/sanity/load";
import { SINGLETON_IDS, sitePageId } from "@/sanity/queries";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

/** Every public path, dated by the Sanity document behind it (_updatedAt), not by the build. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteOrigin();
  const d = await getSitemapData();
  const at = (id: string) => d.singletons.find((s) => s._id === id)?._updatedAt;
  const entries: [string, string | undefined][] = [
    ["/", at(SINGLETON_IDS.home)],
    ["/conversion-design", at(SINGLETON_IDS.method)],
    ["/engagements", at(sitePageId("engagements"))],
    ["/work", at(sitePageId("work"))],
    ["/people", at(sitePageId("people"))],
    ["/library", at(sitePageId("library"))],
    ["/newsletter", at(sitePageId("newsletter"))],
    ["/contact", at(sitePageId("contact"))],
    ...d.practices.map((p): [string, string] => [p.section === "engagements" ? embeddedLeadershipHref : `/what-we-do/${p.slug}`, p._updatedAt]),
    ...d.cases.map((c): [string, string] => [`/work/${c.slug}`, c._updatedAt]),
    ...d.people.map((p): [string, string] => [`/people/${p.slug}`, p._updatedAt]),
    ...d.tools.map((t): [string, string] => [`/tools/${t.slug}`, t._updatedAt]),
    ...d.guides.map((g): [string, string] => [`/guides/${g.slug}`, g._updatedAt]),
    ...d.legal.map((l): [string, string] => [`/${l.slug}`, l._updatedAt]),
  ];
  return entries.map(([path, updated]) => ({ url: `${base}${path}`, ...(updated ? { lastModified: new Date(updated) } : {}) }));
}
