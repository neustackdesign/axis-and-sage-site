import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const configured = {
  RESEND_API_KEY: "re_test_key",
  CONTACT_FROM_EMAIL: "studio@example.com",
  CONTACT_TO_EMAIL: "team@example.com",
};
const isConfigured = (environment) => Boolean(
  environment.RESEND_API_KEY &&
  environment.CONTACT_FROM_EMAIL &&
  environment.CONTACT_TO_EMAIL,
);

test("contact form is enabled only when all delivery variables are configured", () => {
  assert.equal(isConfigured(configured), true);
  assert.equal(isConfigured({ ...configured, RESEND_API_KEY: "" }), false);
  assert.equal(isConfigured({ ...configured, CONTACT_FROM_EMAIL: undefined }), false);
  assert.equal(isConfigured({ ...configured, CONTACT_TO_EMAIL: undefined }), false);
});

test("contact presentation is server-gated and offers email fallback", async () => {
  const section = await read("src/components/home/ContactSection.tsx");
  const availability = await read("src/lib/contact-availability.ts");
  const route = await read("src/app/api/contact/route.ts");
  assert.match(availability, /RESEND_API_KEY/);
  assert.match(availability, /CONTACT_FROM_EMAIL/);
  assert.match(availability, /CONTACT_TO_EMAIL/);
  assert.match(section, /isContactFormConfigured\(\)/);
  assert.match(section, /formEnabled \? <ContactForm \/> :/);
  assert.match(section, />Email us<\/TextLink>/);
  assert.match(route, /if \(!isContactFormConfigured\(\)\)/);
  assert.doesNotMatch(section, /NEXT_PUBLIC|process\.env/);
});
