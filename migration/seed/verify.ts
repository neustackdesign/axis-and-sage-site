// Canonical content checks, written as GROQ so the same checks run against the local seed (tests, dry run) and against
// the published dataset (after `pnpm sanity:seed --publish`, or `pnpm sanity:verify`). Every check is read-only.
import { CANONICAL, EXPECTED_COUNTS, SINGLETON_IDS, diagnosticPriceText, sitePageId } from "./build";

export type Query = <T>(query: string, params?: Record<string, unknown>) => Promise<T>;
export type Check = { name: string; ok: boolean; detail?: string };

export const V2_TYPES = Object.keys(EXPECTED_COUNTS);
export const LEGACY_TYPES = ["homePage", "siteSettings", "service", "project", "testimonial", "faq"] as const;
const SITE_PAGE_KEYS = ["engagements", "work", "people", "library", "contact", "newsletter", "thankYou", "notFound"];

/** Phrases that must not appear anywhere in v2 content: stale pricing and service copy, unsupported claims, placeholders. */
export const FORBIDDEN = [
  /\bFrom US\$/i, /\bStarting at\b/i, /investment advisory/i, /waterfall/i, /structuring executive/i, /\bjoint[- ]venture structuring\b/i,
  /we run the raise/i, /\[price\]/, /\[Agency name\]/,
];
/** Regulated activities Axis & Sage never describes as a service. The legal pages may disclaim them ("not ... investment advice"). */
export const REGULATED = [/investment advice/i, /investment management/i, /capital placement/i, /fund formation/i, /securities advice/i, /legal services/i, /legal structuring/i];
// Founder titles specifically: "CEO reward" (work copy) and a client's "Group CEO" are fine; a founder called CEO, GM or CTO is not.
const FOUNDER_TITLE = /^Co-founder$/;

const text = (v: unknown): string => (typeof v === "string" ? v : Array.isArray(v) ? v.map(text).join(" ") : v && typeof v === "object" ? Object.entries(v).filter(([k]) => !k.startsWith("_") || k === "_type").map(([, x]) => text(x)).join(" ") : "");

export async function verifyCanonical(q: Query): Promise<Check[]> {
  const checks: Check[] = [];
  const add = (name: string, ok: boolean, detail?: string) => checks.push({ name, ok, ...(detail ? { detail } : {}) });

  // 1. Every canonical document exists, in the expected numbers.
  const counts = await q<Record<string, number>>(`{${V2_TYPES.map((t) => `"${t}": count(*[_type == "${t}" && !(_id in path("drafts.**"))])`).join(", ")}}`);
  for (const [type, n] of Object.entries(EXPECTED_COUNTS)) add(`count ${type} = ${n}`, counts[type] === n, `found ${counts[type]}`);
  const singletons = await q<string[]>(`*[_id in $ids]._id`, { ids: [...Object.values(SINGLETON_IDS), ...SITE_PAGE_KEYS.map(sitePageId)] });
  add("singletons and site pages exist", singletons.length === 3 + SITE_PAGE_KEYS.length, `found ${singletons.length}`);

  // 2. Zero broken references among v2 documents.
  const docs = await q<Record<string, unknown>[]>(`*[_type in $types && !(_id in path("drafts.**"))]`, { types: V2_TYPES });
  const refs = docs.map((d) => ({ id: String(d._id), refs: collectRefs(d) }));
  const ids = new Set(await q<string[]>(`*[!(_id in path("drafts.**"))]._id`));
  const broken = refs.flatMap((d) => (d.refs || []).filter((r) => !ids.has(r)).map((r) => `${d.id} → ${r}`));
  add("zero broken references", broken.length === 0, broken.slice(0, 5).join("; "));

  // 3. Homepage: exactly the six selected, in order, none held back.
  const home = await q<{ work: string[]; images: number } | null>(`*[_id == $id][0]{"work": selectedWork[]->slug.current, "images": count([desktopHeroImage.asset, mobileHeroImage.asset][defined(@)])}`, { id: SINGLETON_IDS.home });
  add("homepage has exactly 6 selected work", home?.work?.length === 6, JSON.stringify(home?.work));
  add("homepage selected work is the canonical six, in order", JSON.stringify(home?.work) === JSON.stringify(CANONICAL.homepageWork), JSON.stringify(home?.work));
  const heldFeatured = await q<string[]>(`*[_type == "workItem" && slug.current in $held && (featured == true || homepageFeatured == true)].slug.current`, { held: CANONICAL.heldBack });
  add("no held-back work featured", heldFeatured.length === 0, heldFeatured.join(", "));
  const provenance = await q<{ slug: string; provenance: string | null }[]>(`*[_type == "workItem"]{"slug": slug.current, provenance}`);
  const wrong = provenance.filter((w) => {
    const want = (CANONICAL.provenance.axisAndSage as readonly string[]).includes(w.slug) ? "axisAndSage" : (CANONICAL.provenance.principalTrackRecord as readonly string[]).includes(w.slug) ? "principalTrackRecord" : null;
    return (w.provenance ?? null) !== want;
  });
  add("work provenance matches the canonical lists", wrong.length === 0, wrong.map((w) => `${w.slug}=${w.provenance}`).join(", "));

  // 4. Founder titles exact; no officer titles.
  const people = await q<{ slug: string; publicTitle: string; practiceTitle: string; longBio: string }[]>(`*[_type == "person"]{"slug": slug.current, publicTitle, practiceTitle, longBio}`);
  for (const [slug, t] of Object.entries(CANONICAL.titles)) {
    const p = people.find((x) => x.slug === slug);
    add(`${slug}: "${t.publicTitle} · ${t.practiceTitle}"`, !!p && FOUNDER_TITLE.test(p.publicTitle) && p.practiceTitle === t.practiceTitle, p ? `${p.publicTitle} · ${p.practiceTitle}` : "missing");
    add(`${slug}: canonical biography`, p?.longBio === CANONICAL.bios[slug as keyof typeof CANONICAL.bios]);
  }

  // 5. Diagnostic price and credit rule exact.
  const d = await q<{ publishedPrice: boolean; publicPrice: number; currency: string; uaePrice: number; duration: string; creditRule: string } | null>(`*[_type == "engagement" && slug.current == "conversion-diagnostic"][0]{publishedPrice, publicPrice, currency, uaePrice, duration, creditRule}`);
  add("Diagnostic: US$5,000 fixed, AED 18,500 for UAE engagements, 10 working days", !!d && d.publishedPrice && d.publicPrice === CANONICAL.diagnostic.price && d.currency === "USD" && d.uaePrice === CANONICAL.diagnostic.uaePrice && d.duration === CANONICAL.diagnostic.duration, `${JSON.stringify(d && { ...d, creditRule: undefined })} → "${diagnosticPriceText()}"`);
  add("Diagnostic credit rule exact", d?.creditRule === CANONICAL.creditRule);
  const quoted = await q<{ slug: string; publishedPrice: boolean; priceLabel: string }[]>(`*[_type == "engagement" && slug.current != "conversion-diagnostic" && slug.current != "conversion-scorecard"]{"slug": slug.current, publishedPrice, priceLabel}`);
  add("every other paid engagement is quoted, not priced", quoted.every((e) => !e.publishedPrice && /quoted/i.test(e.priceLabel || "")), quoted.map((e) => `${e.slug}: ${e.priceLabel}`).join("; "));

  // 6. Strategy & Investment capabilities, the capital-raising answer, no stale copy.
  const si = await q<string[] | null>(`*[_type == "practice" && slug.current == "strategy-and-investment"][0].capabilities`);
  add("Strategy & Investment capabilities are the canonical list", JSON.stringify(si) === JSON.stringify(CANONICAL.strategyCapabilities));
  const capital = await q<string | null>(`*[_type == "faqItem" && question == $q][0].answer`, { q: CANONICAL.capitalFaq.question });
  add("capital-raising answer exact", capital === CANONICAL.capitalFaq.answer);
  const stale = docs.flatMap((doc) => [...FORBIDDEN, ...(doc._type === "legalPage" ? [] : REGULATED)].filter((re) => re.test(text(doc))).map((re) => `${doc._type}/${(doc.slug as { current?: string })?.current ?? doc._id}: ${re}`));
  add("no stale or prohibited copy", stale.length === 0, stale.slice(0, 5).join("; "));
  const titles = people.map((p) => `${p.publicTitle} ${p.practiceTitle}`).join(" ");
  add("no CEO, GM or CTO founder titles", !/\b(CEO|GM|CTO)\b/.test(titles), titles);

  return checks;
}

export function collectRefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => collectRefs(v, out));
  else if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    if (typeof o._ref === "string") out.push(o._ref);
    Object.values(o).forEach((v) => collectRefs(v, out));
  }
  return out;
}
