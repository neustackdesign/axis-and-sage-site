import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { CONTENT_TYPES, WEBHOOK_FILTER, WEBHOOK_PROJECTION, parseContentEvent } from "../src/sanity/revalidation.ts";

const read = (p) => readFile(new URL(p, import.meta.url), "utf8");

test("webhook accepts every published v2 content type, never drafts, releases or legacy", () => {
  for (const type of CONTENT_TYPES) {
    assert.deepEqual(parseContentEvent({ _id: "published-doc", _type: type }), { _id: "published-doc", _type: type });
    assert.ok(WEBHOOK_FILTER.includes(JSON.stringify(type)));
  }
  for (const id of ["drafts.doc", "versions.release.doc"]) assert.equal(parseContentEvent({ _id: id, _type: "engagement" }), null);
  for (const type of ["siteSettings", "homePage", "project", "service", "faq"]) assert.equal(parseContentEvent({ _id: "doc", _type: type }), null);
  assert.equal(parseContentEvent({ _id: "doc" }), null);
  assert.equal(parseContentEvent(null), null);
  assert.match(WEBHOOK_PROJECTION, /before\(\)/);
  assert.match(WEBHOOK_FILTER, /before\(\)/);
});

test("cache purge is signed, fail-closed, restricted to production dataset and expires both caches", async () => {
  const route = await read("../src/app/api/sanity/revalidate/route.ts");
  assert.match(route, /parseBody<unknown>\(request, secret, true\)/);
  assert.match(route, /isValidSignature !== true/);
  assert.match(route, /SANITY_REVALIDATE_SECRET/);
  assert.match(route, /sanity-project-id/);
  assert.match(route, /sanity-dataset/);
  assert.match(route, /revalidateTag\("sanity", \{ expire: 0 \}\)/);
  assert.match(route, /revalidatePath\("\/", "layout"\)/);
  assert.match(route, /status: 500/);
});

test("every production Sanity query is tagged and periodically refreshed without relying on CDN", async () => {
  const src = await read("../src/sanity/fetch.ts");
  const client = await read("../src/sanity/client.ts");
  assert.match(src, /revalidate: REVALIDATE_SECONDS/);
  assert.match(src, /tags: \["sanity"\]/);
  assert.match(client, /useCdn: false/);
});

test("legacy models remain stored but cannot be edited in the current Studio", async () => {
  const schema = await read("../studio/schemaTypes/index.ts");
  const desk = await read("../studio/structure.ts");
  const settings = await read("../studio/sanity.config.ts");
  assert.doesNotMatch(schema, /\.\.\.legacyTypes/);
  assert.doesNotMatch(desk, /Legacy v1/);
  assert.match(settings, /legacyDocumentTypes\.has\(schemaType\)/);
});
