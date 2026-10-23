import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/** Published content only: no token, the uncached Sanity API origin, and the published perspective. Drafts never reach the site. */
export const client = createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "published" });
