import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./env";

/** Published content only: no token, the CDN, and the published perspective. Drafts never reach the site. */
export const client = createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" });
