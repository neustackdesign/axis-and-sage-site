import { pageTitles } from "@/content/titles";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Start from the action.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "THE METHOD", title: pageTitles.conversionDesign.og });
}
