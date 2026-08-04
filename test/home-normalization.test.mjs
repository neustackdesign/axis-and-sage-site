import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [{ normalizeHomePage }, { fallbackHome }] = await Promise.all([
  import("../src/sanity/lib/normalize-home.ts"),
  import("../src/content/fallback-data.ts"),
]);
const querySource = await readFile(new URL("../src/sanity/lib/queries.ts", import.meta.url), "utf8");

const service = (overrides = {}) => ({ _id: "service-1", title: "Strategy", slug: "strategy", summary: "Published strategy summary", capabilities: ["Positioning"], ...overrides });
const project = (overrides = {}) => ({ _id: "project-1", title: "Nature Roots", slug: "nature-roots", summary: "Published project summary", tags: ["BRAND STRATEGY"], tone: "sage", ...overrides });
const faq = (overrides = {}) => ({ _id: "faq-1", question: "How do we start?", answer: "Start with a conversation.", ...overrides });

test("GROQ projects collection fields under the application items contract", () => {
  assert.match(querySource, /"items": services\[\]\->/);
  assert.match(querySource, /"items": projects\[\]\->/);
  assert.match(querySource, /"items": testimonials\[\]\->/);
  assert.match(querySource, /"items": faqs\[\]\->/);
});

test("complete Sanity homepage normalizes all expected collections", () => {
  const result = normalizeHomePage({
    title: "Published homepage",
    hero: { ...fallbackHome.hero },
    about: { ...fallbackHome.about },
    services: { ...fallbackHome.services, items: [service()] },
    projects: { ...fallbackHome.projects, items: [project()] },
    testimonials: { ...fallbackHome.testimonials, items: [{ quote: "Published quote", personName: "A client", approved: true }] },
    faqs: { ...fallbackHome.faqs, items: [faq()] },
    contact: { ...fallbackHome.contact },
  });
  assert.equal(result.title, "Published homepage");
  assert.equal(result.services?.items.length, 1);
  assert.equal(result.projects?.items.length, 1);
  assert.equal(result.testimonials?.items.length, 1);
  assert.equal(result.faqs?.items.length, 1);
});

test("a homepage without a testimonial section preserves the optional section absence", () => {
  const result = normalizeHomePage({ title: "No testimonials", services: { items: [] }, projects: { items: [] }, faqs: { items: [] } });
  assert.equal(result.testimonials, undefined);
  assert.ok(Array.isArray(result.services?.items));
  assert.ok(Array.isArray(result.projects?.items));
  assert.ok(Array.isArray(result.faqs?.items));
});

test("missing items arrays fall back section-by-section", () => {
  const result = normalizeHomePage({ services: {}, projects: {}, faqs: {}, testimonials: {} });
  assert.equal(result.services?.items.length, fallbackHome.services.items.length);
  assert.equal(result.projects?.items.length, fallbackHome.projects.items.length);
  assert.equal(result.faqs?.items.length, fallbackHome.faqs.items.length);
  assert.equal(result.testimonials?.items.length, fallbackHome.testimonials.items.length);
});

test("unresolved references are removed without removing valid entries", () => {
  const result = normalizeHomePage({
    services: { items: [null, service({ title: "Valid service" })] },
    projects: { items: [null, project({ title: "Valid project" })] },
    faqs: { items: [null, faq({ question: "Valid question" })] },
    testimonials: { items: [null, { quote: "Valid quote", personName: "Valid person" }] },
  });
  assert.deepEqual(result.services?.items.map((item) => item.title), ["Valid service"]);
  assert.deepEqual(result.projects?.items.map((item) => item.title), ["Valid project"]);
  assert.deepEqual(result.faqs?.items.map((item) => item.question), ["Valid question"]);
  assert.deepEqual(result.testimonials?.items.map((item) => item.personName), ["Valid person"]);
});

test("empty Sanity data returns canonical fallback content", () => {
  const result = normalizeHomePage(null);
  assert.equal(result.hero?.heading, fallbackHome.hero.heading);
  assert.equal(result.services?.items.length, fallbackHome.services.items.length);
  assert.equal(result.projects?.items.length, fallbackHome.projects.items.length);
  assert.equal(result.faqs?.items.length, fallbackHome.faqs.items.length);
});

test("partially populated drafts retain valid values and fill only missing fields", () => {
  const result = normalizeHomePage({
    services: { items: [service({ title: "Draft strategy", summary: undefined, capabilities: undefined })] },
    projects: { items: [project({ summary: undefined })] },
    faqs: { items: [faq({ answer: undefined })] },
  });
  assert.equal(result.services?.items[0].title, "Draft strategy");
  assert.equal(result.services?.items[0].summary, fallbackHome.services.items[0].summary);
  assert.deepEqual(result.services?.items[0].capabilities, fallbackHome.services.items[0].capabilities);
  assert.equal(result.projects?.items[0].summary, fallbackHome.projects.items[0].summary);
  assert.equal(result.faqs?.items[0].answer, fallbackHome.faqs.items[0].answer);
});

test("valid published content is not replaced by fallback values", () => {
  const result = normalizeHomePage({ services: { items: [service()] }, projects: { items: [project()] }, faqs: { items: [faq()] } });
  assert.equal(result.services?.items[0].summary, "Published strategy summary");
  assert.equal(result.projects?.items[0].summary, "Published project summary");
  assert.equal(result.faqs?.items[0].answer, "Start with a conversation.");
});

test("the query and normalizer remain source files in the production build path", async () => {
  const normalizerSource = await readFile(new URL("../src/sanity/lib/normalize-home.ts", import.meta.url), "utf8");
  assert.match(querySource, /normalizeHomePage\(data\)/);
  assert.match(normalizerSource, /fallbackHome/);
});
