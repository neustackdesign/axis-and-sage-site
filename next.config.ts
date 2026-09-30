import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-1638437155671-167865b8bd49**" }] },
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
