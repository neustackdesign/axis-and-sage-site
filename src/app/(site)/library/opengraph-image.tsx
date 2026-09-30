import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Free tools for the decision in front of you.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "LIBRARY", title: "Free tools for the decision in front of you." });
}
