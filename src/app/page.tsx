import type { Metadata } from "next";
import { HomeSections } from "@/components/sections/HomeSections";
import { getHomePage, getSiteSettings } from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/image";

function siteOrigin() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return "https://axisandsage.com";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomePage()]);
  const title = home.seo?.title || settings.seo.title;
  const description = home.seo?.description || settings.seo.description;
  const imagePath = sanityImageUrl(home.seo?.image) || sanityImageUrl(settings.seo.image) || home.seo?.image?.src || settings.seo.image?.src || "/og/axis-sage.png";
  const origin = siteOrigin();
  return {
    title,
    description,
    alternates: { canonical: new URL("/", origin).toString() },
    openGraph: { title, description, url: new URL("/", origin).toString(), images: [{ url: new URL(imagePath, origin).toString(), width: 1200, height: 630, type: "image/png", alt: home.seo?.image?.alt || settings.seo.image?.alt || "Axis & Sage — strategy, design, growth and venture building" }] },
    twitter: { card: "summary_large_image", title, description, images: [{ url: new URL(imagePath, origin).toString(), alt: home.seo?.image?.alt || settings.seo.image?.alt || "Axis & Sage — strategy, design, growth and venture building" }] },
    robots: process.env.VERCEL_ENV === "production" ? undefined : { index: false, follow: false },
  };
}

export default async function HomePage() {
  const home = await getHomePage();
  return <HomeSections home={home} />;
}
