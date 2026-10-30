import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { isPublicProduction, siteName, siteOrigin, titleSuffix } from "@/lib/metadata";
import { getSettings } from "@/sanity/load";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/chrome.css";
import "../styles/tools.css";
import "../styles/compose.css";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
  metadataBase: new URL(siteOrigin()),
  title: { default: settings.defaultSeo.title ?? siteName, template: `%s${titleSuffix}` },
  description: settings.defaultSeo.description,
  icons: {
    icon: [
      { url: "/icons/axis-sage-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
      { url: "/icons/axis-sage-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/icons/axis-sage-dark.png",
  },
  robots: isPublicProduction() ? undefined : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#F3F0FF", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/brand/platypi-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/brand/geist-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Reveals hide content only once script is known to run, before first paint, with a fallback if hydration stalls. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('mo');setTimeout(function(){document.querySelectorAll('[data-sec]').forEach(function(e){e.classList.add('in')})},4500)" }} />
      </head>
      <body>{children}<Analytics /><SpeedInsights /></body>
    </html>
  );
}
