import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Tell us who needs to act.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "CONTACT", title: "Tell us who needs to act." });
}
