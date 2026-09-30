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
export const defaultDescription = "Get the people your business depends on to act. Investors commit, partners sign, teams execute and customers buy when the terms are right and the moment is clear. We design both. We call it Conversion Design.";
const ogImage = "/og/axis-sage.png";

/** Per-page metadata with canonical URL, Open Graph and Twitter cards. Non-production previews are noindex. */
export function pageMetadata({ title, description = defaultDescription, path, type = "website" }: { title?: string; description?: string; path: string; type?: "website" | "article" }): Metadata {
  const origin = siteOrigin();
  const url = new URL(path, origin).toString();
  const image = { url: new URL(ogImage, origin).toString(), width: 1200, height: 630, alt: "Axis & Sage Advisory" };
  const fullTitle = title ? `${title} · ${siteName}` : `${siteName} · Get the people your business depends on to act`;
  return {
    title: title ? title : { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { type, title: fullTitle, description, url, siteName, images: [image] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [{ url: image.url, alt: image.alt }] },
    robots: isPublicProduction() ? undefined : { index: false, follow: false },
  };
}
