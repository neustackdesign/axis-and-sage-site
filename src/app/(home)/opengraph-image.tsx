import { getHome } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Get the people your business depends on to act.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export default async function Image() {
  const home = await getHome();
  return renderOg({ label: "ADVISORY · AFRICA AND THE GCC", title: home.seo.ogTitle ?? home.headline });
}
