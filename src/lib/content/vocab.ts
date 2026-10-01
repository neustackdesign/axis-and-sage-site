// Controlled vocabularies shared by the site and the Studio (studio/schemaTypes/v2/vocab.ts must match; a test checks).
// These are taxonomy and application behaviour, not editorial copy, so they stay in code.

export const glyphNames = ["investors", "partners", "team", "customers", "users", "terms", "moment", "action", "time", "money", "document", "screen"] as const;

export const roles = ["FOUNDED", "RAN", "BUILT", "ADVISED", "EMBEDDED"] as const;
export type Role = (typeof roles)[number];

export const actions = [
  { key: "investors-commit", label: "Investors commit", glyph: "investors" },
  { key: "partners-sign", label: "Partners sign", glyph: "partners" },
  { key: "teams-execute", label: "Teams execute", glyph: "team" },
  { key: "customers-buy", label: "Customers buy", glyph: "customers" },
  { key: "users-adopt", label: "Users adopt", glyph: "users" },
] as const;
export type ActionKey = (typeof actions)[number]["key"];
export const actionLabel = (key: ActionKey) => actions.find((a) => a.key === key)!.label;

/** Where a piece of work comes from. Sanity stores the key; the site shows the label. */
export const provenances = [
  { key: "axisAndSage", label: "AXIS & SAGE ENGAGEMENT" },
  { key: "principalTrackRecord", label: "PRINCIPAL TRACK RECORD" },
] as const;
export type Provenance = (typeof provenances)[number]["key"];
export const provenanceLabel = (key?: string | null) => provenances.find((p) => p.key === key)?.label ?? null;

/** Redrawn artifacts available on case pages (components in the case page). */
export const caseArtifacts = ["farmcrowdy", "mular", "governance", "merger"] as const;

export const libraryTypes = ["guide", "template", "newsletter", "resource"] as const;
export const libraryStatuses = ["draft", "comingSoon", "published"] as const;
export const faqPlacements = ["conversionDesign", "engagements"] as const;
export const practiceSections = ["whatWeDo", "engagements"] as const;
export const engagementTiers = ["core", "specialist"] as const;
export const sitePageKeys = ["engagements", "work", "people", "library", "contact", "newsletter", "thankYou", "notFound"] as const;
export type SitePageKey = (typeof sitePageKeys)[number];

/** "By when" choices in the sentence forms. */
export const whenOptions = ["this month", "this quarter", "this year", "no date yet"] as const;
