import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import { hasSanityConfig } from "@/sanity/lib/client";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/image";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

function siteOrigin() {
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return "https://axisandsage.com";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function isPublicProduction() {
  return process.env.VERCEL_ENV === "production";
}

const defaultOgImage = "/og/axis-sage.png";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const origin = siteOrigin();
  const canonical = isPublicProduction() && settings.seo.canonicalUrl?.startsWith("http")
    ? settings.seo.canonicalUrl
    : new URL("/", origin).toString();
  const imagePath = sanityImageUrl(settings.seo.image) || settings.seo.image?.src || defaultOgImage;
  const imageUrl = new URL(imagePath, origin).toString();
  return {
    metadataBase: new URL(origin),
    title: { default: settings.seo.title, template: settings.seo.titleTemplate || `%s — ${settings.title}` },
    description: settings.seo.description,
    alternates: { canonical },
    icons: {
      icon: [
        { url: "/icons/axis-sage-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
        { url: "/icons/axis-sage-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
        { url: "/favicon.ico", type: "image/x-icon" },
      ],
      apple: "/icons/axis-sage-dark.png",
    },
    openGraph: {
      type: "website", title: settings.seo.title, description: settings.seo.description, siteName: settings.title,
      url: canonical,
      images: [{ url: imageUrl, width: 1200, height: 630, type: "image/png", alt: "Axis & Sage — strategy, design, growth and venture building" }],
    },
    twitter: {
      card: "summary_large_image", title: settings.seo.title, description: settings.seo.description,
      images: [{ url: imageUrl, alt: "Axis & Sage — strategy, design, growth and venture building" }],
    },
    robots: isPublicProduction() ? undefined : { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, preview] = await Promise.all([getSiteSettings(), draftMode()]);
  return <html lang="en"><body className={`${instrumentSerif.variable} ${geistMono.variable}`}><Header navigation={settings.navigation} /><main>{children}</main><Footer settings={settings} />{hasSanityConfig ? <SanityLive /> : null}{preview.isEnabled ? <><VisualEditing /><DisableDraftMode /></> : null}</body></html>;
}
