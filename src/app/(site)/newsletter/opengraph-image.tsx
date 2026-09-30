import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Terms & Moments.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "NEWSLETTER", title: "Terms & Moments." });
}
