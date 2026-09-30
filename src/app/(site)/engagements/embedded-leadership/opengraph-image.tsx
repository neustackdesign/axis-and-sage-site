import { embeddedLeadership } from "@/content/practices";
import { pageTitles } from "@/content/titles";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOg({ label: embeddedLeadership.eyebrow, title: pageTitles.embeddedLeadership.og });
}
