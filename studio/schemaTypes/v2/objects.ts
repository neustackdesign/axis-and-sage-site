import { defineArrayMember, defineField, defineType } from "sanity";
import { glyphNames } from "./vocab";

// Reusable v2 objects. Names start with "as" so they never collide with the legacy v1 types (seo, cta, …).

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const req = { validation: (r: any) => r.required() };
export const glyphField = (name = "glyph", title = "Glyph") =>
  defineField({ name, title, type: "string", options: { list: glyphNames.map((g) => ({ title: g, value: g })) }, ...req });

export const asLink = defineType({
  name: "asLink", title: "Link", type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", ...req }),
    defineField({ name: "href", title: "Destination", type: "string", description: "An internal path (/work), an anchor or a full URL.", ...req }),
    defineField({ name: "description", title: "Description", type: "text", rows: 2 }),
  ],
  preview: { select: { title: "label", subtitle: "href" } },
});

export const asCta = defineType({
  name: "asCta", title: "Call to action", type: "object",
  fields: [defineField({ name: "label", title: "Label", type: "string", ...req }), defineField({ name: "href", title: "Destination", type: "string", ...req })],
});

export const asNavGroup = defineType({
  name: "asNavGroup", title: "Menu group", type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", ...req }),
    defineField({ name: "key", title: "Key", type: "string", description: "Used for the menu's id.", ...req }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "blurb", title: "Blurb", type: "text", rows: 2 }),
    defineField({ name: "items", title: "Items", type: "array", of: [defineArrayMember({ type: "asLink" })] }),
  ],
});

export const asFooterColumn = defineType({
  name: "asFooterColumn", title: "Footer column", type: "object",
  fields: [defineField({ name: "title", title: "Title", type: "string", ...req }), defineField({ name: "links", title: "Links", type: "array", of: [defineArrayMember({ type: "asLink" })] })],
  preview: { select: { title: "title" } },
});

export const asSeo = defineType({
  name: "asSeo", title: "SEO", type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", description: "The full title, as it appears in search results." }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({ name: "ogTitle", title: "Share-card headline", type: "string", description: "The headline on the page's Open Graph image." }),
  ],
});

export const asSectionIntro = defineType({
  name: "asSectionIntro", title: "Section intro", type: "object",
  fields: [
    defineField({ name: "key", title: "Key", type: "string", description: "Which section this is. Don't change it.", ...req }),
    defineField({ name: "label", title: "Label", type: "string" }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "title", subtitle: "key" } },
});

export const asTextItem = defineType({
  name: "asTextItem", title: "Text", type: "object",
  fields: [defineField({ name: "key", title: "Key", type: "string", ...req }), defineField({ name: "value", title: "Text", type: "text", rows: 2, ...req })],
  preview: { select: { title: "value", subtitle: "key" } },
});

export const asStat = defineType({
  name: "asStat", title: "Figure", type: "object",
  fields: [
    defineField({ name: "numeral", title: "Figure", type: "string", ...req }),
    defineField({ name: "label", title: "Label", type: "string", ...req }),
    defineField({ name: "source", title: "Source", type: "string", description: "No source, no number." }),
    defineField({ name: "tag", title: "Tag", type: "string", description: "For example FARMCROWDY · BUILT." }),
  ],
  preview: { select: { title: "numeral", subtitle: "label" } },
});

export const asTimelineDay = defineType({
  name: "asTimelineDay", title: "Timeline step", type: "object",
  fields: [defineField({ name: "when", title: "When", type: "string", ...req }), defineField({ name: "what", title: "What happens", type: "text", rows: 2, ...req })],
  preview: { select: { title: "when", subtitle: "what" } },
});

export const asGlyphCard = defineType({
  name: "asGlyphCard", title: "Card", type: "object",
  fields: [glyphField(), defineField({ name: "text", title: "Text", type: "text", rows: 2, ...req })],
  preview: { select: { title: "text", subtitle: "glyph" } },
});

export const asActor = defineType({
  name: "asActor", title: "Actor", type: "object",
  fields: [glyphField(), defineField({ name: "actor", title: "Who", type: "string", ...req }), defineField({ name: "examples", title: "Examples of the action", type: "string", ...req })],
  preview: { select: { title: "actor", subtitle: "examples" } },
});

export const asSentenceRow = defineType({
  name: "asSentenceRow", title: "Sentence row", type: "object",
  fields: [
    defineField({ name: "who", title: "Who", type: "string", ...req }),
    defineField({ name: "action", title: "Action", type: "string", ...req }),
    defineField({ name: "stops", title: "What usually stops them", type: "text", rows: 2, ...req }),
    defineField({ name: "look", title: "Where we'd look first", type: "text", rows: 2, ...req }),
  ],
  preview: { select: { title: "who", subtitle: "action" } },
});

export const asMethodStep = defineType({
  name: "asMethodStep", title: "Step", type: "object",
  fields: [defineField({ name: "index", title: "Number", type: "string", ...req }), defineField({ name: "title", title: "Title", type: "string", ...req }), defineField({ name: "body", title: "Body", type: "text", rows: 3, ...req })],
  preview: { select: { title: "title", subtitle: "index" } },
});

export const asActionCard = defineType({
  name: "asActionCard", title: "Action card", type: "object",
  fields: [
    defineField({ name: "key", title: "Work filter key", type: "string", description: "For example investors-commit.", ...req }),
    defineField({ name: "label", title: "Label", type: "string", ...req }),
    glyphField(),
    defineField({ name: "line", title: "Line", type: "text", rows: 2, ...req }),
  ],
  preview: { select: { title: "label", subtitle: "key" } },
});

export const asCaseChange = defineType({
  name: "asCaseChange", title: "Change", type: "object",
  fields: [
    defineField({ name: "tag", title: "Half", type: "string", options: { list: ["TERMS", "MOMENT"] }, ...req }),
    defineField({ name: "text", title: "Text", type: "text", rows: 2, ...req }),
  ],
  preview: { select: { title: "text", subtitle: "tag" } },
});

const linkAnnotation = { name: "link", type: "object", title: "Link", fields: [{ name: "href", type: "string", title: "Destination" }] };

/** Plain rich text: paragraphs, bullets, bold, italic, links. */
export const asSimpleText = defineType({
  name: "asSimpleText", title: "Text", type: "array",
  of: [defineArrayMember({
    type: "block",
    styles: [{ title: "Normal", value: "normal" }],
    lists: [{ title: "Bullet", value: "bullet" }],
    marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }], annotations: [linkAnnotation] },
  })],
});

export const asLegalSection = defineType({
  name: "asLegalSection", title: "Section", type: "object",
  fields: [
    defineField({ name: "anchor", title: "Anchor", type: "string", description: "The #link target, for example who-we-are.", ...req }),
    defineField({ name: "heading", title: "Heading", type: "string", ...req }),
    defineField({ name: "body", title: "Body", type: "asSimpleText", ...req }),
  ],
  preview: { select: { title: "heading", subtitle: "anchor" } },
});

export const asCallout = defineType({
  name: "asCallout", title: "Callout", type: "object",
  fields: [defineField({ name: "label", title: "Label", type: "string", ...req }), defineField({ name: "text", title: "Text", type: "text", rows: 2, ...req })],
});

export const asToolEmbed = defineType({
  name: "asToolEmbed", title: "Tool card", type: "object",
  fields: [defineField({ name: "tool", title: "Tool", type: "reference", to: [{ type: "toolContent" }], ...req })],
});

export const asEngagementTimeline = defineType({
  name: "asEngagementTimeline", title: "Engagement timeline", type: "object",
  description: "Shows an engagement's timeline as a table.",
  fields: [defineField({ name: "engagement", title: "Engagement", type: "reference", to: [{ type: "engagement" }], ...req })],
});

export const asArticleEnd = defineType({
  name: "asArticleEnd", title: "Closing call to action", type: "object",
  fields: [defineField({ name: "headline", title: "Headline", type: "string", ...req }), defineField({ name: "cta", title: "Button", type: "asCta", ...req })],
});

/** Article body: headings, quotes, bullets, links, plus callouts, tool cards, engagement timelines and a closing CTA. */
export const asArticleBody = defineType({
  name: "asArticleBody", title: "Body", type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }, { title: "Heading", value: "h2" }, { title: "Pull quote", value: "blockquote" }],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: { decorators: [{ title: "Bold", value: "strong" }, { title: "Italic", value: "em" }], annotations: [linkAnnotation] },
    }),
    defineArrayMember({ type: "asCallout" }),
    defineArrayMember({ type: "asToolEmbed" }),
    defineArrayMember({ type: "asEngagementTimeline" }),
    defineArrayMember({ type: "asArticleEnd" }),
  ],
});

export const objectTypes = [
  asLink, asCta, asNavGroup, asFooterColumn, asSeo, asSectionIntro, asTextItem, asStat, asTimelineDay, asGlyphCard, asActor,
  asSentenceRow, asMethodStep, asActionCard, asCaseChange, asSimpleText, asLegalSection, asCallout, asToolEmbed,
  asEngagementTimeline, asArticleEnd, asArticleBody,
];
