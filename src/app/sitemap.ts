import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_ENV === "production" ? "https://axisandsage.com" : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const projects = await getProjectSlugs();
  return [{ url: base, lastModified: new Date() }, ...projects.map((slug) => ({ url: `${base}/work/${slug}`, lastModified: new Date() }))];
}
