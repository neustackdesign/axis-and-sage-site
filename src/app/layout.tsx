import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/sanity/lib/live";
import { hasSanityConfig } from "@/sanity/lib/client";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteSettings } from "@/sanity/lib/queries";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    title: { default: settings.seo.title, template: `%s — ${settings.title}` },
    description: settings.seo.description,
    alternates: { canonical: "/" },
    openGraph: { type: "website", title: settings.seo.title, description: settings.seo.description, siteName: settings.title },
    twitter: { card: "summary_large_image", title: settings.seo.title, description: settings.seo.description },
    robots: process.env.VERCEL_ENV === "production" ? undefined : { index: false, follow: false },
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [settings, preview] = await Promise.all([getSiteSettings(), draftMode()]);
  return <html lang="en"><body><Header navigation={settings.navigation} /><main>{children}</main><Footer settings={settings} />{hasSanityConfig ? <SanityLive /> : null}{preview.isEnabled ? <><VisualEditing /><DisableDraftMode /></> : null}</body></html>;
}
