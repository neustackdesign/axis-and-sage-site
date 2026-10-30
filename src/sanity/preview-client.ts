import { createClient } from "next-sanity";
import { draftMode } from "next/headers";
import { apiVersion, dataset, projectId } from "./env";

/**
 * Drafts, for review only: Vercel preview deployments, and production while an editor has draft mode on
 * (/api/draft-mode/enable, gated by SANITY_PREVIEW_SECRET). Needs SANITY_API_READ_TOKEN; without it nothing changes.
 * Production visitors never get here: the public client (./client) reads published content only.
 */
export async function readsDrafts() {
  if (!process.env.SANITY_API_READ_TOKEN) return false;
  if (process.env.VERCEL_ENV === "preview") return true;
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request (build, generateStaticParams)
  }
}

export const draftsClient = () =>
  createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "drafts", token: process.env.SANITY_API_READ_TOKEN });
