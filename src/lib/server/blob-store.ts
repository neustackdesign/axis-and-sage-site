import "server-only";
import { del, get, list, put } from "@vercel/blob";
import type { PendingStore } from "@/lib/pipeline/core";
import { config } from "./config";

/** Private Vercel Blob store holding anything the Pipeline Sheet hasn't received yet. */
export const blobStore: PendingStore = {
  async put(pathname, body) {
    if (!config.blobToken) throw new Error("BLOB_READ_WRITE_TOKEN not configured");
    await put(pathname, body, { access: "private", contentType: "application/json", addRandomSuffix: false, allowOverwrite: true });
  },
  async list(prefix) {
    if (!config.blobToken) return [];
    const out: string[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ prefix, cursor, limit: 1000 });
      out.push(...page.blobs.map((b) => b.pathname));
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);
    return out;
  },
  async read(pathname) {
    const res = await get(pathname, { access: "private", useCache: false });
    if (!res || res.statusCode !== 200) return null;
    return new Response(res.stream).text();
  },
  async remove(pathname) {
    await del(pathname);
  },
};
