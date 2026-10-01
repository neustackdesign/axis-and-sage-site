import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { defaultDescription, isPublicProduction, siteName, siteOrigin, titleSuffix } from "@/lib/metadata";
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/components.css";
import "../styles/chrome.css";
import "../styles/tools.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: { default: siteName, template: `%s${titleSuffix}` },
  description: defaultDescription,
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

export const viewport: Viewport = { themeColor: "#ECEBE9", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preload" href="/fonts/brand/platypi-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/brand/geist-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}<Analytics /><SpeedInsights /></body>
    </html>
  );
}
