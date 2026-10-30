// Published-content events only. Keep this list aligned with the website's GROQ queries.
export const CONTENT_TYPES = [
  "companySettings",
  "homePageV2",
  "conversionMethod",
  "sitePage",
  "person",
  "practice",
  "workItem",
  "testimonialQuote",
  "engagement",
  "faqItem",
  "libraryItem",
  "toolContent",
  "legalPage",
  "sanity.imageAsset"
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

// before() covers unpublishes/deletes, when after() is null.
export const WEBHOOK_FILTER = `coalesce(after()._type, before()._type) in [${CONTENT_TYPES.map((type) => JSON.stringify(type)).join(", ")}]`;
export const WEBHOOK_PROJECTION = '{ "_id": coalesce(after()._id, before()._id), "_type": coalesce(after()._type, before()._type) }';

export type ContentEvent = { _id: string; _type: ContentType };
export function parseContentEvent(value: unknown): ContentEvent | null {
  if (!value || typeof value !== "object") return null;
  const event = value as Record<string, unknown>;
  if (typeof event._id !== "string" || typeof event._type !== "string") return null;
  if (event._id.startsWith("drafts.") || event._id.startsWith("versions.")) return null;
  if (!CONTENT_TYPES.some((type) => type === event._type)) return null;
  return { _id: event._id, _type: event._type as ContentType };
}
