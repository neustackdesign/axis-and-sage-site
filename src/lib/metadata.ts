import type { Metadata } from "next";

export function siteOrigin() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return "https://axisandsage.com";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const isPublicProduction = () => process.env.VERCEL_ENV === "production";

export const siteName = "Axis & Sage Advisory";

export const titleSuffix = " | Axis & Sage";

/**
 * Per-page metadata with canonical URL, Open Graph and Twitter cards. Non-production previews are noindex.
 * Titles and descriptions come from each page's Sanity SEO fields. `absoluteTitle` pages carry the full title; the rest get
 * " | Axis & Sage" added. A page without a description inherits Site settings' default (root layout).
 */
export function pageMetadata({ title, absoluteTitle = false, description, path, type = "website" }: { title?: string; absoluteTitle?: boolean; description?: string; path: string; type?: "website" | "article" }): Metadata {
  const origin = siteOrigin();
  const url = new URL(path, origin).toString();
  const fullTitle = !title ? siteName : absoluteTitle ? title : `${title}${titleSuffix}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    // Images come from each route's opengraph-image.tsx (next/og).
    openGraph: { type, title: fullTitle, description, url, siteName, locale: "en_GB" },
    twitter: { card: "summary_large_image", title: fullTitle, description },
    robots: isPublicProduction() ? undefined : { index: false, follow: false },
  };
}
