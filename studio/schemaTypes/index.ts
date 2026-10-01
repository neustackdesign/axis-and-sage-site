import { legacyTypes, LEGACY_DOCUMENT_TYPES } from "./legacy";
import { documentTypes, SINGLETONS } from "./v2/documents";
import { objectTypes } from "./v2/objects";

export const schemaTypes = [...documentTypes, ...objectTypes, ...legacyTypes];
export const singletonTypes = new Set<string>([...Object.keys(SINGLETONS), "sitePage"]);
export const legacyDocumentTypes = new Set<string>(LEGACY_DOCUMENT_TYPES);
