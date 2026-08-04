import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildSeedDocuments, seedDocuments, validateBootstrap } from "../scripts/seed-sanity.mjs";

const canonical = JSON.parse(readFileSync(new URL("../src/content/canonical-content.json", import.meta.url), "utf8"));
const quietLogger = { log() {} };

function mockSanity(existingIds = []) {
  const existing = new Set(existingIds);
  const operations = [];
  let committed = false;
  return {
    operations,
    get committed() { return committed; },
    async getDocument(id) { return existing.has(id) ? { _id: id } : null; },
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

test("bootstrap validates project, dataset and write access before writes", async () => {
  const requests = [];
  const client = { request: async (request) => requests.push(request) };
  await validateBootstrap({ client, projectId: "abc123", dataset: "production", token: "local-write-token", logger: quietLogger });
  assert.deepEqual(requests, [
    { method: "GET", uri: "/datasets/production" },
    { method: "POST", uri: "/data/mutate/production", body: { mutations: [] } },
  ]);
  await assert.rejects(() => validateBootstrap({ client, projectId: "", dataset: "production", token: "token", logger: quietLogger }), /project.*id/i);
  await assert.rejects(() => validateBootstrap({ client, projectId: "abc123", dataset: "", token: "token", logger: quietLogger }), /dataset/i);
  await assert.rejects(() => validateBootstrap({ client, projectId: "abc123", dataset: "production", token: "", logger: quietLogger }), /SANITY_API_WRITE_TOKEN/);
});

test("fallback renderer imports the same canonical data module", () => {
  const source = readFileSync(new URL("../src/content/fallback-data.ts", import.meta.url), "utf8");
  assert.match(source, /canonical-content\.json/);
});
