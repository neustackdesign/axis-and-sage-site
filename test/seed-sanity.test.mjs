import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildSeedDocuments, runSeed, seedDocuments, validateBootstrap, validateSeedDocuments } from "../scripts/seed-sanity.mjs";

const canonical = JSON.parse(readFileSync(new URL("../src/content/canonical-content.json", import.meta.url), "utf8"));
const quietLogger = { log() {}, warn() {} };

function mockSanity(existingIds = []) {
  const existing = new Set(existingIds);
  const operations = [];
  let committed = false;
  return {
    operations,
    get committed() { return committed; },
    async getDocument(id) { return existing.has(id) ? { _id: id } : null; },
    async fetch() { return 0; },
    transaction() {
      return {
        createIfNotExists(document) { operations.push(["createIfNotExists", document._id]); return this; },
        createOrReplace(document) { operations.push(["createOrReplace", document._id]); return this; },
        async commit() { committed = true; },
      };
    },
  };
}

test("seed documents align with the shared fallback content", () => {
  const documents = buildSeedDocuments(canonical);
  const home = documents.find((document) => document._id === "drafts.homePage");
  const services = documents.filter((document) => document._type === "service");
  const projects = documents.filter((document) => document._type === "project");
  const faqs = documents.filter((document) => document._type === "faq");
  assert.equal(home.sections[0].heading, canonical.home.hero.heading);
  assert.deepEqual(home.sections[0].primaryCta, { _type: "cta", ...canonical.home.hero.primaryCta });
  assert.equal(services.length, 5);
  assert.deepEqual(services.map((service) => service.summary), canonical.home.services.items.map((service) => service.summary));
  assert.deepEqual(services.map((service) => service.capabilities), canonical.home.services.items.map((service) => service.capabilities));
  assert.deepEqual(projects.map((project) => project.homepagePlacement), ["featured", "supporting", "supporting"]);
  assert.equal(canonical.home.projects.items.find((project) => project.slug === "earlybean").cover.src, "/images/axis-sage/earlybean.jpg");
  assert.equal(faqs.length, 6);
  assert.equal(home.sections.find((section) => section._type === "contactSection").email, canonical.home.contact.email);
  assert.equal(home.sections.find((section) => section._type === "testimonialsSection").testimonials.length, 3);
  assert.ok(home.sections.every((section) => section._type === "heroSection" || section._type === "aboutSection" || section._type === "servicesSection" || section._type === "projectsSection" || section._type === "testimonialsSection" || section._type === "faqSection" || section._type === "contactSection"));
});

test("empty dataset bootstraps with createIfNotExists", async () => {
  const client = mockSanity();
  const documents = buildSeedDocuments(canonical).slice(0, 3);
  const results = await seedDocuments({ client, documents, logger: quietLogger });
  assert.deepEqual(results.map((result) => result.status), ["created", "created", "created"]);
  assert.equal(client.committed, true);
  assert.ok(client.operations.every(([operation]) => operation === "createIfNotExists"));
});

test("transaction construction uses transaction-level mutations", async () => {
  const client = mockSanity();
  const documents = [{ _id: "drafts/example", _type: "example" }];
  client.createOrReplace = () => { throw new Error("client.createOrReplace must not be called during transaction construction"); };
  await seedDocuments({ client, documents, logger: quietLogger });
  assert.deepEqual(client.operations, [["createIfNotExists", "drafts/example"]]);
});

test("seed validation rejects missing types and unseeded references", () => {
  assert.throws(() => validateSeedDocuments([{ _id: "drafts/missing-type" }]), /_type/);
  assert.throws(() => validateSeedDocuments([{ _id: "drafts/example", _type: "example", related: { _type: "reference", _ref: "drafts/unknown" } }]), /unseeded document/);
});

test("default bootstrap refuses to overwrite existing documents", async () => {
  const documents = buildSeedDocuments(canonical).slice(0, 2);
  const client = mockSanity(documents.map((document) => document._id));
  const results = await seedDocuments({ client, documents, logger: quietLogger });
  assert.deepEqual(results.map((result) => result.status), ["skipped", "skipped"]);
  assert.deepEqual(client.operations, []);
  assert.equal(client.committed, false);
});

test("force mode explicitly replaces existing draft documents", async () => {
  const documents = buildSeedDocuments(canonical).slice(0, 2);
  const client = mockSanity([documents[0]._id]);
  const results = await seedDocuments({ client, documents, force: true, logger: quietLogger });
  assert.deepEqual(results.map((result) => result.status), ["replaced", "created"]);
  assert.deepEqual(client.operations, [["createOrReplace", documents[0]._id], ["createOrReplace", documents[1]._id]]);
});

test("dry run prints target, document identity and intended operation without committing", async () => {
  const logs = [];
  const client = mockSanity();
  await runSeed({
    environment: { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "production", SANITY_API_WRITE_TOKEN: "local-token", SANITY_SEED_DRY_RUN: "true" },
    clientFactory: () => client,
    logger: { log(message) { logs.push(message); }, warn() {} },
  });
  assert.ok(logs.some((message) => message.includes("abc123 / production")));
  assert.ok(logs.some((message) => message.includes("drafts.homePage") && message.includes("homePage") && message.includes("createIfNotExists")));
  assert.equal(client.committed, false);
});

test("bootstrap validates an accessible empty dataset with a Content Lake query", async () => {
  const calls = [];
  const client = { fetch: async (...args) => { calls.push(args); return 0; } };
  const count = await validateBootstrap({ client, projectId: "abc123", dataset: "production", token: "local-read-token", logger: quietLogger });
  assert.equal(count, 0);
  assert.deepEqual(calls, [["count(*)", {}, { perspective: "raw", useCdn: false }]]);
});

test("bootstrap accepts a populated dataset and never calls dataset management endpoints", async () => {
  const calls = [];
  const client = { fetch: async (...args) => { calls.push(args); return 12; } };
  const count = await validateBootstrap({ client, projectId: "abc123", dataset: "production", token: "local-read-token", logger: quietLogger });
  assert.equal(count, 12);
  assert.ok(calls.every(([query]) => query === "count(*)"));
  assert.ok(calls.every(([, , options]) => options.perspective === "raw" && options.useCdn === false));
});

test("bootstrap reports missing datasets and invalid project IDs from Content Lake access", async () => {
  const client = { fetch: async () => { throw new Error("404 Not Found"); } };
  await assert.rejects(() => validateBootstrap({ client, projectId: "dltrl1ld", dataset: "missing", token: "token", logger: quietLogger }), /Could not reach Sanity project.*missing/);
  await assert.rejects(() => validateBootstrap({ client, projectId: "invalid", dataset: "production", token: "token", logger: quietLogger }), /Could not reach Sanity project invalid/);
});

test("dry run accepts a read token and prefers it over a write token", async () => {
  const calls = [];
  const client = mockSanity();
  await runSeed({
    environment: { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "production", SANITY_API_READ_TOKEN: "read-token", SANITY_API_WRITE_TOKEN: "write-token", SANITY_SEED_DRY_RUN: "true" },
    clientFactory: (config) => { calls.push(config); return client; },
    logger: quietLogger,
  });
  assert.equal(calls[0].token, "read-token");
});

test("dry run accepts a write token when no read token is available", async () => {
  const calls = [];
  await runSeed({
    environment: { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "production", SANITY_API_WRITE_TOKEN: "write-token", SANITY_SEED_DRY_RUN: "true" },
    clientFactory: (config) => { calls.push(config); return mockSanity(); },
    logger: quietLogger,
  });
  assert.equal(calls[0].token, "write-token");
});

test("dry run without either token is rejected", async () => {
  await assert.rejects(() => runSeed({ environment: { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "production", SANITY_SEED_DRY_RUN: "true" }, clientFactory: () => { throw new Error("client should not be created"); }, logger: quietLogger }), /READ_TOKEN or SANITY_API_WRITE_TOKEN/);
});

test("real seed requires a write token even when a read token exists", async () => {
  await assert.rejects(() => runSeed({ environment: { NEXT_PUBLIC_SANITY_PROJECT_ID: "abc123", NEXT_PUBLIC_SANITY_DATASET: "production", SANITY_API_READ_TOKEN: "read-token" }, clientFactory: () => { throw new Error("client should not be created"); }, logger: quietLogger }), /SANITY_API_WRITE_TOKEN/);
});

test("real transaction permission errors explain the required token scope", async () => {
  const client = mockSanity();
  client.transaction = () => ({ createIfNotExists() { return this; }, async commit() { throw new Error("403 Forbidden"); } });
  await assert.rejects(() => seedDocuments({ client, documents: [{ _id: "drafts/example", _type: "example" }], logger: quietLogger }), /Editor\/write permission/);
});

test("bootstrap rejects invalid configuration before querying", async () => {
  const client = { fetch: async () => 0 };
  await assert.rejects(() => validateBootstrap({ client, projectId: "", dataset: "production", token: "token", logger: quietLogger }), /project.*id/i);
  await assert.rejects(() => validateBootstrap({ client, projectId: "abc123", dataset: "", token: "token", logger: quietLogger }), /dataset/i);
  await assert.rejects(() => validateBootstrap({ client, projectId: "abc123", dataset: "production", token: "", logger: quietLogger }), /SANITY_API_WRITE_TOKEN/);
});

test("fallback renderer imports the same canonical data module", () => {
  const source = readFileSync(new URL("../src/content/fallback-data.ts", import.meta.url), "utf8");
  assert.match(source, /canonical-content\.json/);
});
