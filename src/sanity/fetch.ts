import { client } from "./client";
import { contentSource, REVALIDATE_SECONDS } from "./env";

/**
 * Every content read goes through here. Production: the published perspective from Sanity's CDN, cached for
 * REVALIDATE_SECONDS. Development and tests may set SANITY_CONTENT_SOURCE=seed to run the same query on the local seed.
 */
export async function sanityFetch<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  if (contentSource() === "seed") {
    const { querySeed } = await import("./seed-dataset");
    return querySeed<T>(query, params);
  }
  return client.fetch<T>(query, params, { next: { revalidate: REVALIDATE_SECONDS, tags: ["sanity"] } });
}

/** A required document is missing: the page (and so a production build) fails instead of rendering stale or legacy content. */
export class MissingContentError extends Error {
  constructor(what: string) {
    super(`Required Sanity content is missing: ${what}. Publish it in the Studio (or run \`pnpm sanity:seed --publish\`). The site never falls back to the legacy v1 documents.`);
    this.name = "MissingContentError";
  }
}
