import { buildLegacyTheme, defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { legacyDocumentTypes, schemaTypes, singletonTypes } from "./schemaTypes";
import { structure } from "./structure";

export const projectId = "dltrl1ld";
export const dataset = "production";

// Axis & Sage design system colours (src/styles/tokens.css): Midnight ink, Cloud ground, Sunset deep for actions.
const theme = buildLegacyTheme({
  "--black": "#0B0626", "--white": "#FCFBFF", "--gray": "#56516F", "--gray-base": "#56516F",
  "--component-bg": "#FCFBFF", "--component-text-color": "#0B0626",
  "--brand-primary": "#B5440D", "--default-button-primary-color": "#B5440D",
  "--default-button-success-color": "#2F6B3A", "--default-button-danger-color": "#B3261E", "--default-button-warning-color": "#9A390B",
  "--state-success-color": "#2F6B3A", "--state-danger-color": "#B3261E", "--state-warning-color": "#9A390B", "--state-info-color": "#3A3463",
  "--main-navigation-color": "#0B0626", "--main-navigation-color--inverted": "#F3F0FF", "--focus-color": "#0B0626",
});

export default defineConfig({
  name: "axis-and-sage",
  title: "Axis & Sage",
  theme,
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
