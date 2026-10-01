import type { SchemaTypeDefinition } from "sanity";
import { legacySchemaTypes } from "./v1";

/** Legacy v1 document types, read-only and labelled, so the old documents stay visible but untouched. */
export const LEGACY_DOCUMENT_TYPES = ["homePage", "siteSettings", "service", "project", "testimonial", "faq"] as const;

export const legacyTypes: SchemaTypeDefinition[] = legacySchemaTypes.map((t) =>
  (LEGACY_DOCUMENT_TYPES as readonly string[]).includes(t.name)
    ? ({ ...t, title: `Legacy v1 · ${t.title}`, readOnly: true } as SchemaTypeDefinition)
    : (t as SchemaTypeDefinition),
);
