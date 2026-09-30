import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Start with one sentence. Know the price before we start.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "ENGAGEMENTS AND PRICING", title: "Start with one sentence. Know the price before we start." });
}
