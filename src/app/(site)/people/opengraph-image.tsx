import { pageTitles } from "@/content/titles";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Two founders. Both of them on your work.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOg({ label: "PEOPLE", title: pageTitles.people.og });
}
