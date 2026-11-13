import { getHome } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Get the people your business depends on to act.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 604800; // Seven-day fallback; publish webhook handles immediate changes.

export default async function Image() {
  const home = await getHome();
  return renderOg({ label: "ADVISORY · AFRICA AND THE GCC", title: home.seo.ogTitle ?? home.headline });
}
