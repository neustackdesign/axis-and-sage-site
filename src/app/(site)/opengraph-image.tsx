import { pageTitles } from "@/content/titles";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Get the people your business depends on to act.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "ADVISORY · AFRICA AND THE GCC", title: pageTitles.home.og });
}
