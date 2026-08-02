import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const production = process.env.VERCEL_ENV === "production";
  return { rules: { userAgent: "*", allow: production ? "/" : undefined, disallow: production ? ["/studio", "/api/"] : "/" }, sitemap: production ? `${process.env.NEXT_PUBLIC_SITE_URL || "https://axisandsage.com"}/sitemap.xml` : undefined };
}
