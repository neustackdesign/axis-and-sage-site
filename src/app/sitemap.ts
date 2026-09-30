import type { MetadataRoute } from "next";
import { guides, tools } from "@/content/library";
import { people } from "@/content/people";
import { practices } from "@/content/practices";
import { casePages } from "@/content/work";
import { contentDate } from "@/content/dates";
import { siteOrigin } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteOrigin();
  const paths = [
    "/", "/conversion-design", "/engagements", "/work", "/people", "/library", "/newsletter", "/contact", "/privacy", "/terms",
    ...practices.map((p) => `/what-we-do/${p.slug}`),
    ...casePages.map((c) => `/work/${c.slug}`),
    ...people.map((p) => `/people/${p.slug}`),
    ...tools.map((t) => `/tools/${t.slug}`),
    ...guides.filter((g) => g.published).map((g) => `/guides/${g.slug}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}`, lastModified: new Date(contentDate(path)) }));
}
