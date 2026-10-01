import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  // Sanity's image CDN, for the existing project only. The hero uses a Sanity loader (Sanity resizes, not Vercel).
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/images/dltrl1ld/production/**" }] },
  async redirects() {
    // Embedded leadership moved under Engagements: a permanent 301, as the brief asks (Next's `permanent` sends 308).
    return [{ source: "/what-we-do/embedded-leadership", destination: "/engagements/embedded-leadership", statusCode: 301 }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
