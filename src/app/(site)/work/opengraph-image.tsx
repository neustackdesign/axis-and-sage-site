import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Who needed to act, and what moved.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "WORK", title: "Who needed to act, and what moved." });
}
