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

test("contact delivery is server-gated and falls back to the visitor's email app", async () => {
  const availability = await read("src/lib/contact-availability.ts");
  const route = await read("src/app/api/contact/route.ts");
  const hook = await read("src/components/forms/useLead.ts");
  assert.match(availability, /RESEND_API_KEY/);
  assert.match(availability, /CONTACT_FROM_EMAIL/);
  assert.match(availability, /CONTACT_TO_EMAIL/);
  assert.match(route, /if \(!isContactFormConfigured\(\)\)/);
  assert.match(route, /status: 503/);
  assert.match(hook, /res\.status === 503/);
  assert.match(hook, /mailtoFor\(payload\)/);
  assert.doesNotMatch(route, /NEXT_PUBLIC/);
});
