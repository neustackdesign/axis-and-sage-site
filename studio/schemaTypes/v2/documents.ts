import { defineArrayMember, defineField, defineType } from "sanity";
import { glyphField } from "./objects";
import { actions, caseArtifacts, engagementTiers, faqPlacements, libraryStatuses, libraryTypes, practiceSections, provenances, roles, sitePageKeys } from "./vocab";

// The v2 content model. Content, not presentation: the site decides how each field looks.
// Singletons have fixed IDs (see SINGLETONS); everything else gets Sanity's own IDs and is found by slug or seedKey.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const req = { validation: (r: any) => r.required() };
const list = <T extends string>(values: readonly T[]) => ({ list: values.map((v) => ({ title: v, value: v })) });
const strings = (name: string, title: string, extra: object = {}) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "string" })], ...extra });
const refs = (name: string, title: string, to: string, extra: object = {}) => defineField({ name, title, type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: to }] })], ...extra });
const slug = (source = "title") => defineField({ name: "slug", title: "Slug", type: "slug", options: { source, maxLength: 96 }, ...req });
const seo = defineField({ name: "seo", title: "SEO", type: "asSeo", group: "seo" });
const order = defineField({ name: "order", title: "Order", type: "number", description: "Lower numbers come first." });
/** Set by the seeder so a re-run updates instead of duplicating. Hidden from editors. */
const seedKey = defineField({ name: "seedKey", title: "Seed key", type: "string", hidden: true, readOnly: true });
const groups = [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }];
const image = (name: string, title: string, extra: object = {}) => defineField({ name, title, type: "image", options: { hotspot: true }, fields: [defineField({ name: "alt", title: "Alt text", type: "string" })], ...extra });

export const SINGLETONS = {
  companySettings: "axisSageSettings",
  homePageV2: "axisSageHome",
  conversionMethod: "axisSageConversionMethod",
} as const;
/** One sitePage singleton per listing route. */
export const sitePageId = (key: string) => `axisSagePage-${key}`;

export const companySettings = defineType({
  name: "companySettings", title: "Site settings", type: "document",
  fields: [
    defineField({ name: "companyName", title: "Company name", type: "string", ...req }),
    defineField({ name: "shortName", title: "Short name", type: "string", ...req }),
    defineField({ name: "legalName", title: "Legal name", type: "string", ...req }),
    defineField({ name: "siteUrl", title: "Site URL", type: "url", ...req }),
    defineField({ name: "contactEmail", title: "Contact email", type: "email", ...req }),
    defineField({ name: "bookingUrl", title: "Booking URL", type: "url", description: "The Cal.com event shown on /contact#book.", ...req }),
    defineField({ name: "registeredAddress", title: "Registered address", type: "string", ...req }),
    defineField({ name: "registeredAddressShort", title: "Registered address (short)", type: "string" }),
    defineField({ name: "foundersBased", title: "Where the founders are", type: "string" }),
    strings("locations", "Locations"),
    defineField({ name: "regionTag", title: "Region tag", type: "string", description: "Shown in the footer, for example AFRICA · GCC." }),
    defineField({
      name: "navigation", title: "Navigation", type: "object",
      fields: [
        defineField({ name: "whatWeDo", title: "What we do menu", type: "asNavGroup", ...req }),
        defineField({ name: "library", title: "Library menu", type: "asNavGroup", ...req }),
        defineField({ name: "primaryLinks", title: "Primary links", type: "array", of: [defineArrayMember({ type: "asLink" })] }),
      ],
    }),
    defineField({ name: "footerNavigation", title: "Footer columns", type: "array", of: [defineArrayMember({ type: "asFooterColumn" })] }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", of: [defineArrayMember({ type: "asLink" })] }),
    defineField({ name: "legalLine", title: "Footer legal line", type: "string", ...req }),
    defineField({ name: "primaryCta", title: "Primary call to action", type: "asCta", ...req }),
    defineField({ name: "scorecardCta", title: "Scorecard call to action", type: "asCta", ...req }),
    defineField({ name: "ctaBand", title: "CTA band", type: "object", fields: [defineField({ name: "headline", type: "string", title: "Headline" }), defineField({ name: "line", type: "text", rows: 2, title: "Line" })] }),
    defineField({ name: "newsletter", title: "Newsletter", type: "object", fields: [defineField({ name: "name", type: "string", title: "Name" }), defineField({ name: "line", type: "text", rows: 2, title: "Line" }), defineField({ name: "archiveEmpty", type: "text", rows: 2, title: "Archive note while empty" })] }),
    defineField({ name: "whatsappMessage", title: "WhatsApp pre-filled message", type: "string" }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "asSeo" }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const homePageV2 = defineType({
  name: "homePageV2", title: "Homepage", type: "document", groups,
  fields: [
    strings("eyebrow", "Eyebrow labels", { group: "content" }),
    defineField({ name: "headline", title: "Headline", type: "string", group: "content", ...req }),
    defineField({ name: "supportingCopy", title: "Supporting copy", type: "text", rows: 3, group: "content", ...req }),
    image("desktopHeroImage", "Hero image · desktop", { group: "content", description: "Landscape crop, at least 3200×1800. Set the hotspot to keep the skyline below the navigation.", ...req }),
    image("mobileHeroImage", "Hero image · mobile", { group: "content", description: "Portrait crop, at least 1200×1800. Never a stretched landscape.", ...req }),
    defineField({ name: "heroImageAlt", title: "Hero image alt text", type: "string", group: "content", ...req }),
    defineField({ name: "heroImageCredit", title: "Hero image credit", type: "string", group: "content", ...req }),
    defineField({ name: "heroImageSourceUrl", title: "Hero image source", type: "url", group: "content" }),
    defineField({ name: "primaryCTA", title: "Primary call to action", type: "asCta", group: "content", ...req }),
    defineField({ name: "secondaryCTA", title: "Secondary call to action", type: "asCta", group: "content" }),
    refs("practices", "Practices (bottom line of the hero)", "practice", { group: "content" }),
    defineField({ name: "logoStrip", title: "Logo strip", type: "object", group: "content", fields: [defineField({ name: "label", type: "string", title: "Label" }), strings("names", "Names")] }),
    defineField({ name: "sections", title: "Section intros", type: "array", group: "content", of: [defineArrayMember({ type: "asSectionIntro" })] }),
    defineField({ name: "gapCards", title: "The gap · cards", type: "array", group: "content", of: [defineArrayMember({ type: "asGlyphCard" })] }),
    defineField({ name: "conversionLinkLabel", title: "Conversion Design link label", type: "string", group: "content" }),
    defineField({ name: "foundersNote", title: "Founders note", type: "string", group: "content" }),
    defineField({ name: "stats", title: "What moved · figures", type: "array", group: "content", of: [defineArrayMember({ type: "asStat" })] }),
    defineField({ name: "statsSource", title: "What moved · sources line", type: "string", group: "content" }),
    refs("selectedWork", "Selected work", "workItem", { group: "content", description: "Exactly six: three Axis & Sage engagements, then three from the principals' track record.", // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (r: any) => r.required().length(6).unique() }),
    refs("selectedPeople", "Founders", "person", { group: "content" }),
    refs("testimonials", "Testimonials", "testimonialQuote", { group: "content" }),
    seo,
  ],
  preview: { prepare: () => ({ title: "Homepage" }) },
});

export const conversionMethod = defineType({
  name: "conversionMethod", title: "Conversion Design", type: "document", groups,
  fields: [
    defineField({ name: "hero", title: "Hero", type: "object", group: "content", fields: [defineField({ name: "label", type: "string", title: "Label" }), defineField({ name: "title", type: "string", title: "Title" }), defineField({ name: "sub", type: "text", rows: 3, title: "Definition" })] }),
    defineField({ name: "sections", title: "Section intros", type: "array", group: "content", of: [defineArrayMember({ type: "asSectionIntro" })] }),
    defineField({ name: "actors", title: "What counts · who acts", type: "array", group: "content", of: [defineArrayMember({ type: "asActor" })] }),
    defineField({ name: "actorsClosing", title: "What counts · closing line", type: "string", group: "content" }),
    defineField({ name: "terms", title: "Terms", type: "object", group: "content", fields: [defineField({ name: "title", type: "string", title: "Title" }), defineField({ name: "body", type: "asSimpleText", title: "Body" })] }),
    defineField({ name: "moments", title: "Moments", type: "object", group: "content", fields: [defineField({ name: "title", type: "string", title: "Title" }), defineField({ name: "body", type: "asSimpleText", title: "Body" })] }),
    defineField({ name: "behaviourNote", title: "Behaviour model note", type: "text", rows: 2, group: "content" }),
    defineField({ name: "sentenceRows", title: "Sentence framework", type: "array", group: "content", of: [defineArrayMember({ type: "asSentenceRow" })] }),
    defineField({ name: "methodSteps", title: "The four steps · short (homepage)", type: "array", group: "content", of: [defineArrayMember({ type: "asMethodStep" })] }),
    defineField({ name: "methodStepsExpanded", title: "The four steps · full", type: "array", group: "content", of: [defineArrayMember({ type: "asMethodStep" })] }),
    defineField({
      name: "example", title: "Worked example", type: "object", group: "content",
      fields: [
        defineField({ name: "timelineLabel", type: "string", title: "Timeline label" }),
        defineField({ name: "baselineValue", type: "number", title: "Baseline value" }),
        defineField({ name: "baselineLabel", type: "string", title: "Baseline label" }),
        defineField({ name: "steps", title: "Steps", type: "array", of: [defineArrayMember({ type: "object", fields: [
          defineField({ name: "when", type: "string", title: "When" }), defineField({ name: "said", type: "string", title: "Decided" }),
          defineField({ name: "value", type: "number", title: "Value" }), defineField({ name: "valueLabel", type: "string", title: "Value label" }),
          defineField({ name: "did", type: "string", title: "What people did" }), defineField({ name: "action", type: "boolean", title: "Marks the action" }),
        ] })] }),
        defineField({ name: "source", type: "string", title: "Source" }),
        defineField({ name: "caseStudy", type: "reference", title: "Case study", to: [{ type: "workItem" }] }),
        defineField({ name: "caseLinkLabel", type: "string", title: "Case link label" }),
      ],
    }),
    defineField({ name: "question", title: "Common question", type: "object", group: "content", fields: [defineField({ name: "title", type: "string", title: "Question" }), defineField({ name: "body", type: "text", rows: 3, title: "Answer" })] }),
    defineField({ name: "actionCards", title: "By type of action", type: "array", group: "content", of: [defineArrayMember({ type: "asActionCard" })] }),
    defineField({ name: "actionCardLinkLabel", title: "Action card link label", type: "string", group: "content" }),
    refs("faqs", "FAQs on this page", "faqItem", { group: "content" }),
    seo,
  ],
  preview: { prepare: () => ({ title: "Conversion Design" }) },
});

export const sitePage = defineType({
  name: "sitePage", title: "Page", type: "document", groups,
  fields: [
    defineField({ name: "key", title: "Page", type: "string", options: list(sitePageKeys), readOnly: true, group: "content", ...req }),
    defineField({ name: "hero", title: "Hero", type: "object", group: "content", fields: [defineField({ name: "label", type: "string", title: "Label" }), defineField({ name: "title", type: "string", title: "Title" }), defineField({ name: "sub", type: "text", rows: 3, title: "Sub" })] }),
    defineField({ name: "sections", title: "Section intros", type: "array", group: "content", of: [defineArrayMember({ type: "asSectionIntro" })] }),
    defineField({ name: "strings", title: "Other text on the page", type: "array", group: "content", of: [defineArrayMember({ type: "asTextItem" })] }),
    seo,
  ],
  preview: { select: { title: "hero.title", subtitle: "key" } },
});

export const person = defineType({
  name: "person", title: "Person", type: "document", groups,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "content", ...req }),
    slug("name"),
    defineField({ name: "publicTitle", title: "Public title", type: "string", group: "content", description: "Co-founder. No officer titles on the marketing site.", ...req }),
    defineField({ name: "practiceTitle", title: "Practice", type: "string", group: "content", ...req }),
    defineField({ name: "initials", title: "Initials", type: "string", group: "content", description: "Shown on the initials tile until there is a portrait.", ...req }),
    defineField({ name: "focus", title: "Half", type: "string", group: "content", options: list(["terms", "moments"] as const), ...req }),
    defineField({ name: "principleLine", title: "Principle line", type: "string", group: "content", ...req }),
    defineField({ name: "shortBio", title: "Short biography", type: "text", rows: 4, group: "content", ...req }),
    defineField({ name: "longBio", title: "Biography", type: "text", rows: 12, group: "content", description: "Separate paragraphs with a blank line.", ...req }),
    strings("proofPoints", "Proof points", { group: "content" }),
    strings("selectedWork", "Selected work", { group: "content" }),
    defineField({ name: "extra", title: "Extra fact", type: "object", group: "content", fields: [defineField({ name: "label", type: "string", title: "Label" }), defineField({ name: "value", type: "text", rows: 2, title: "Value" })] }),
    defineField({ name: "education", title: "Education", type: "string", group: "content" }),
    defineField({ name: "basedIn", title: "Based in", type: "string", group: "content" }),
    image("portrait", "Portrait", { group: "content" }),
    defineField({ name: "email", title: "Public email", type: "email", group: "content" }),
    defineField({ name: "links", title: "Links", type: "array", group: "content", of: [defineArrayMember({ type: "asLink" })] }),
    refs("relatedWork", "Related work", "workItem", { group: "content" }),
    order, seo, seedKey,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "practiceTitle", media: "portrait" } },
});

export const practice = defineType({
  name: "practice", title: "Practice", type: "document", groups,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", ...req }),
    slug(),
    defineField({ name: "section", title: "Listed under", type: "string", group: "content", options: list(practiceSections), description: "whatWeDo: the three practices. engagements: a way of engaging, such as Embedded leadership.", ...req }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "content", ...req }),
    defineField({ name: "headline", title: "Headline", type: "string", group: "content", ...req }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 3, group: "content", ...req }),
    defineField({ name: "navDescription", title: "Menu description", type: "string", group: "content" }),
    defineField({ name: "ledByLabel", title: "Led by (wording)", type: "string", group: "content", description: "For example both founders. Leave empty to list the people." }),
    refs("ledBy", "Led by", "person", { group: "content" }),
    strings("whenToCall", "When to call us", { group: "content" }),
    strings("capabilities", "What we do", { group: "content" }),
    strings("howItWorks", "How it works", { group: "content" }),
    defineField({ name: "connectsCopy", title: "How it connects", type: "text", rows: 2, group: "content" }),
    refs("proof", "Proof", "workItem", { group: "content" }),
    defineField({ name: "proofNote", title: "Proof note", type: "text", rows: 3, group: "content" }),
    defineField({ name: "whenItFits", title: "When it fits", type: "text", rows: 2, group: "content" }),
    refs("tools", "Related tools", "toolContent", { group: "content" }),
    order, seo, seedKey,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "section" } },
});

export const workItem = defineType({
  name: "workItem", title: "Work", type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "case", title: "Case study" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", ...req }),
    slug(),
    defineField({ name: "entity", title: "Organisation", type: "string", group: "content" }),
    defineField({ name: "sector", title: "Sector", type: "string", group: "content", ...req }),
    defineField({ name: "roles", title: "Role", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], options: { list: roles.map((r) => ({ title: r, value: r })) }, ...req }),
    defineField({ name: "actions", title: "Actions", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], options: { list: actions.map((a) => ({ title: a.label, value: a.key })) } }),
    defineField({ name: "provenance", title: "Provenance", type: "string", group: "content", options: { list: provenances.map((p) => ({ title: p.label, value: p.key })), layout: "radio" }, description: "Leave empty while unconfirmed. Work without a provenance is never featured." }),
    defineField({ name: "featured", title: "Shown in the work index", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "homepageFeatured", title: "Featured on the homepage", type: "boolean", group: "content", initialValue: false, description: "The homepage list itself is set on the Homepage document." }),
    defineField({ name: "summary", title: "Summary (work card line)", type: "text", rows: 2, group: "content", ...req }),
    defineField({ name: "needed", title: "Needed (case card)", type: "text", rows: 2, group: "content" }),
    defineField({ name: "changed", title: "Changed", type: "text", rows: 2, group: "content" }),
    defineField({ name: "moved", title: "Moved", type: "text", rows: 2, group: "content" }),
    defineField({ name: "metrics", title: "Figures", type: "array", group: "content", of: [defineArrayMember({ type: "asStat" })] }),
    defineField({ name: "quote", title: "Testimonial", type: "reference", group: "content", to: [{ type: "testimonialQuote" }] }),
    refs("relatedPeople", "People", "person", { group: "content" }),
    refs("relatedPractices", "Practices", "practice", { group: "content" }),
    defineField({ name: "caseStudy", title: "Has a case page", type: "boolean", group: "case", initialValue: false }),
    defineField({ name: "years", title: "Years", type: "string", group: "case" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2, group: "case" }),
    defineField({ name: "caseNeeded", title: "Needed (case page headline)", type: "text", rows: 2, group: "case" }),
    strings("inTheWay", "What stood in the way", { group: "case" }),
    defineField({ name: "changes", title: "What we changed", type: "array", group: "case", of: [defineArrayMember({ type: "asCaseChange" })] }),
    defineField({ name: "artifact", title: "Redrawn artifact", type: "string", group: "case", options: list(caseArtifacts) }),
    refs("relatedTools", "Related tools", "toolContent", { group: "case" }),
    image("image", "Image", { group: "case" }),
    order, seo, seedKey,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "provenance" } },
});

export const testimonialQuote = defineType({
  name: "testimonialQuote", title: "Testimonial", type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 5, ...req }),
    defineField({ name: "name", title: "Name", type: "string", ...req }),
    defineField({ name: "title", title: "Title", type: "string", ...req }),
    defineField({ name: "company", title: "Company", type: "string" }),
    image("portrait", "Portrait"),
    seedKey,
  ],
  preview: { select: { title: "name", subtitle: "company", media: "portrait" } },
});

export const engagement = defineType({
  name: "engagement", title: "Engagement", type: "document", groups,
  fields: [
    defineField({ name: "name", title: "Name", type: "string", group: "content", ...req }),
    slug("name"),
    defineField({ name: "tier", title: "Shown as", type: "string", group: "content", options: list(engagementTiers), description: "core: a column in the engagement table. specialist: a specialist card.", ...req }),
    defineField({ name: "recommended", title: "Recommended", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "publishedPrice", title: "Publish a fixed price", type: "boolean", group: "content", initialValue: false, description: "Only the Conversion Diagnostic has a published price." }),
    defineField({ name: "publicPrice", title: "Price", type: "number", group: "content", hidden: ({ parent }) => !parent?.publishedPrice }),
    defineField({ name: "currency", title: "Currency", type: "string", group: "content", options: list(["USD", "AED", "NGN"] as const), hidden: ({ parent }) => !parent?.publishedPrice }),
    defineField({ name: "uaePrice", title: "UAE price (AED)", type: "number", group: "content", hidden: ({ parent }) => !parent?.publishedPrice }),
    defineField({ name: "priceLabel", title: "Price wording", type: "string", group: "content", description: "For unpublished prices, for example Quoted on a 30-minute call." }),
    defineField({ name: "duration", title: "Time", type: "string", group: "content" }),
    defineField({ name: "bring", title: "You bring", type: "string", group: "content" }),
    defineField({ name: "weDo", title: "We do", type: "text", rows: 2, group: "content" }),
    defineField({ name: "youGet", title: "You get", type: "text", rows: 2, group: "content" }),
    defineField({ name: "intro", title: "Intro (specialist card)", type: "text", rows: 2, group: "content" }),
    strings("points", "Points (specialist card)", { group: "content" }),
    defineField({ name: "cta", title: "Call to action", type: "asCta", group: "content" }),
    defineField({ name: "creditRule", title: "Credit rule", type: "text", rows: 2, group: "content" }),
    defineField({ name: "feeExplainer", title: "What the fee pays for", type: "text", rows: 3, group: "content" }),
    defineField({ name: "timeline", title: "Timeline", type: "array", group: "content", of: [defineArrayMember({ type: "asTimelineDay" })] }),
    order, seo, seedKey,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "tier" } },
});

export const faqItem = defineType({
  name: "faqItem", title: "FAQ", type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", ...req }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 4, ...req }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "placements", title: "Shown on", type: "array", of: [defineArrayMember({ type: "string" })], options: { list: faqPlacements.map((p) => ({ title: p, value: p })) } }),
    order, seedKey,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "category" } },
});

export const libraryItem = defineType({
  name: "libraryItem", title: "Library item", type: "document", groups,
  fields: [
    defineField({ name: "type", title: "Type", type: "string", group: "content", options: list(libraryTypes), ...req }),
    defineField({ name: "title", title: "Title", type: "string", group: "content", ...req }),
    slug(),
    defineField({ name: "category", title: "Category", type: "string", group: "content" }),
    defineField({ name: "excerpt", title: "Standfirst", type: "text", rows: 2, group: "content" }),
    refs("authors", "Authors", "person", { group: "content" }),
    defineField({ name: "status", title: "Status", type: "string", group: "content", options: list(libraryStatuses), initialValue: "draft", ...req }),
    defineField({ name: "publishedAt", title: "Published", type: "date", group: "content" }),
    defineField({ name: "body", title: "Body", type: "asArticleBody", group: "content" }),
    defineField({ name: "relatedTool", title: "Related tool", type: "reference", group: "content", to: [{ type: "toolContent" }] }),
    defineField({ name: "format", title: "Format (templates)", type: "string", group: "content" }),
    defineField({ name: "file", title: "File (templates)", type: "file", group: "content" }),
    order, seo, seedKey,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "type" } },
});

export const toolContent = defineType({
  name: "toolContent", title: "Tool", type: "document", groups,
  description: "Editorial copy only. Formulas, scoring and validation stay in code.",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", ...req }),
    slug(),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string", group: "content", description: "For example SCORECARD · 6 MIN." }),
    defineField({ name: "badge", title: "Badge", type: "string", group: "content" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2, group: "content", ...req }),
    defineField({ name: "instructions", title: "Instructions", type: "text", rows: 2, group: "content" }),
    defineField({ name: "cta", title: "Card call to action", type: "string", group: "content" }),
    glyphField("glyph", "Glyph"),
    order, seo, seedKey,
  ],
  orderings: [{ title: "Order", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "eyebrow" } },
});

export const legalPage = defineType({
  name: "legalPage", title: "Legal page", type: "document", groups,
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", ...req }),
    slug(),
    defineField({ name: "label", title: "Label", type: "string", group: "content" }),
    defineField({ name: "effectiveDate", title: "Effective date", type: "date", group: "content", ...req }),
    defineField({ name: "effectiveLabel", title: "Date line", type: "string", group: "content", description: "For example Last updated: October 2026." }),
    defineField({ name: "sections", title: "Sections", type: "array", group: "content", of: [defineArrayMember({ type: "asLegalSection" })], ...req }),
    seo, seedKey,
  ],
  preview: { select: { title: "title", subtitle: "effectiveLabel" } },
});

export const documentTypes = [
  companySettings, homePageV2, conversionMethod, sitePage, person, practice, workItem, testimonialQuote, engagement, faqItem,
  libraryItem, toolContent, legalPage,
];
