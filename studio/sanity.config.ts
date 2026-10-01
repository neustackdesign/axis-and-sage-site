import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { legacyDocumentTypes, schemaTypes, singletonTypes } from "./schemaTypes";
import { structure } from "./structure";

export const projectId = "dltrl1ld";
export const dataset = "production";

export default defineConfig({
  name: "axis-and-sage",
  title: "Axis & Sage",
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: "2025-02-19" })],
  schema: {
    types: schemaTypes,
    // No "new document" for singletons or legacy types.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType) && !legacyDocumentTypes.has(schemaType)),
  },
  document: {
    // Singletons can't be deleted or duplicated; legacy documents can't be changed at all.
    actions: (actions, { schemaType }) => {
      if (legacyDocumentTypes.has(schemaType)) return [];
      if (singletonTypes.has(schemaType)) return actions.filter(({ action }) => action && ["publish", "discardChanges", "restore"].includes(action));
      return actions;
    },
    newDocumentOptions: (prev) => prev.filter((item) => !singletonTypes.has(item.templateId) && !legacyDocumentTypes.has(item.templateId)),
  },
});
