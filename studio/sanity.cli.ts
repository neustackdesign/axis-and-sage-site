import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: { projectId: "dltrl1ld", dataset: "production" },
  // Hosted at https://axis-and-sage.sanity.studio once deployed with `pnpm deploy` (needs a logged-in `sanity login`).
  studioHost: "axis-and-sage",
  // Pinned to the installed sanity version (no auto-updates), so a deploy is reproducible.
  deployment: { autoUpdates: false },
});
