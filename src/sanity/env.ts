// The existing Sanity project. Do not point this at another project or dataset.
export const projectId = "dltrl1ld";
export const dataset = "production";
export const apiVersion = "2025-02-19";

/** Seconds before a published edit appears on the site (no webhook needed). */
export const REVALIDATE_SECONDS = 60;

export type ContentSource = "sanity" | "seed";

/**
 * Where content comes from. Always Sanity in production. SANITY_CONTENT_SOURCE=seed is a development and test
 * fallback that runs the same GROQ queries against the local seed (migration/seed), for working offline before the
 * seed is published. A production build refuses it.
 */
export function contentSource(): ContentSource {
  if (process.env.SANITY_CONTENT_SOURCE !== "seed") return "sanity";
  if (process.env.VERCEL_ENV === "production") throw new Error("SANITY_CONTENT_SOURCE=seed is not allowed in production: production reads published Sanity content only.");
  return "seed";
}
