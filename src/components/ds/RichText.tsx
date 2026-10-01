import { PortableText, type PortableTextComponents } from "next-sanity";
import type { ArticleBody } from "@/lib/content/types";
import { SmartLink } from "./primitives";

/** Plain text of Portable Text blocks (reading time, JSON-LD, tests). */
export const plainText = (blocks: ArticleBody = []) =>
  blocks.filter((b) => b._type === "block").map((b) => ((b as { children?: { text?: string }[] }).children || []).map((c) => c.text ?? "").join("")).join("\n");

/** The id a heading gets, so a table of contents can link to it. */
export const headingId = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Marks and lists shared by every Portable Text field: links become site links, mailto links stay plain anchors. */
export const baseComponents: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => <SmartLink className="text-link" href={(value as { href?: string })?.href || "#"}>{children}</SmartLink>,
  },
};

/** Inline rich text (no wrapping paragraph styles beyond the blocks themselves). */
export function RichText({ value, components }: { value: ArticleBody | null | undefined; components?: PortableTextComponents }) {
  if (!value?.length) return null;
  return <PortableText value={value as never} components={{ ...baseComponents, ...components, marks: { ...baseComponents.marks, ...components?.marks } }} />;
}
