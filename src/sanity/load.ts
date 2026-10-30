// Loaders: run a query from ./queries and shape the result into the view types the components render.
// Required singletons throw MissingContentError, so a page, and a production build, fails rather than render without them.
import { cache } from "react";
import type {
  ArticleBody, CaseDesign, CasePage, Chip, ContactPath, DiagnosticInfo, ProofStat, Readout, SetPiece, EngagementPath, EngagementPathKey, EngagementsData, FaqEntry, Guide, GuideCard, LegalDoc,
  PageSeo, Person, Practice, SanityImageView, SectionIntro, SelectedCase, SiteSettings, SitePage, Specialist, Template,
  Testimonial, ToolMeta, WorkItem,
} from "@/lib/content/types";
import { actionLabel, type ActionKey, type Provenance, type Role, type SitePageKey } from "@/lib/content/vocab";
import { contentSource } from "./env";
import { MissingContentError, sanityFetch } from "./fetch";
import { imageView, type SanityImageSource } from "./image";
import * as Q from "./queries";

/* ---------------------------------------------------------------- Shared shaping */

type Seo = PageSeo | null | undefined;
const seoOf = (s: Seo): PageSeo => ({ title: s?.title ?? undefined, description: s?.description ?? undefined, ogTitle: s?.ogTitle ?? undefined });
const req = <T>(value: T | null | undefined, what: string): T => {
  if (value === null || value === undefined || (typeof value === "string" && !value.trim())) throw new MissingContentError(what);
  return value;
};

const chipsOf = (roles: Role[] = [], actions: ActionKey[] = []): Chip[] => [
  ...roles.map((label) => ({ label, kind: "role" as const })),
  ...actions.map((a) => ({ label: actionLabel(a).toUpperCase(), kind: "conversion" as const })),
];

type RawWork = Omit<WorkItem, "roles" | "actions" | "provenance"> & { roles: Role[] | null; actions: ActionKey[] | null; provenance: Provenance | null };
const workOf = (w: RawWork): WorkItem => ({ ...w, roles: w.roles ?? [], actions: w.actions ?? [], provenance: w.provenance ?? undefined, hasCase: !!w.hasCase });

type RawTool = Omit<ToolMeta, "seo"> & { seo: Seo };
const toolOf = (t: RawTool): ToolMeta => ({ ...t, seo: seoOf(t.seo) });

type RawTestimonial = Omit<Testimonial, "portrait"> & { portrait: SanityImageSource | null };
const testimonialOf = (t: RawTestimonial): Testimonial => ({ quote: t.quote, name: t.name, title: t.title, company: t.company ?? undefined, portrait: imageView(t.portrait, { width: 240 })?.url });

type RawPerson = {
  slug: string; name: string; publicTitle: string; practiceTitle: string; initials: string; focus: "terms" | "moments";
  principleLine: string; homeLine: string | null; credentialLine: string | null; shortBio: string; longBio: string; proofPoints: string[] | null; selectedWork: string[] | null;
  extra: { label: string; value: string } | null; education: string | null; basedIn: string | null;
  links: { label: string; href: string }[]; portrait: SanityImageSource | null; relatedWork: RawWork[]; seo: Seo;
};
const personOf = (p: RawPerson): Person => ({
  slug: p.slug,
  name: p.name,
  title: p.publicTitle,
  practice: p.practiceTitle,
  half: p.focus,
  line: p.principleLine,
  cardBody: p.shortBio,
  bio: p.longBio,
  bioParagraphs: (p.longBio || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean),
  selectedWork: p.selectedWork ?? [],
  homeLine: p.homeLine ?? undefined,
  credentialLine: p.credentialLine ?? undefined,
  extra: p.extra ?? undefined,
  education: p.education ?? undefined,
  basedIn: p.basedIn ?? undefined,
  links: p.links.filter((l) => l.href),
  initials: p.initials,
  portrait: imageView(p.portrait, { width: 640 })?.url,
  relatedWork: p.relatedWork.map(workOf),
  seo: seoOf(p.seo),
});

type RawSetPiece = { slug: string; name: string; hasCase: boolean; provenance: Provenance | null; piece: (Omit<SetPiece, "slug" | "name" | "hasCase" | "provenance" | "image" | "tone"> & { tone: SetPiece["tone"] | null; image: SanityImageSource | null }) | null };
/** A work item's set piece, or null while its set piece is not filled in. */
const setPieceOf = (w: RawSetPiece): SetPiece | null => {
  const p = w.piece;
  if (!p?.headline || !p.visual) return null;
  const image = p.visual === "image" ? imageView(p.image, { width: 1600 }) : undefined;
  if (p.visual === "image" && !image) return null; // an image set piece without its image stays off the page
  return { slug: w.slug, name: w.name, hasCase: !!w.hasCase, provenance: w.provenance ?? undefined, eyebrow: p.eyebrow, headline: p.headline, body: p.body, status: p.status ?? undefined, caption: p.caption ?? undefined, visual: p.visual, tone: p.tone ?? "light", proof: p.proof ?? [], image: image && { ...image, alt: p.image?.alt ?? "" } };
};
type RawReadout = Omit<Readout, "result"> & { result: Readout["result"] | null };
const readoutOf = (r: RawReadout | null | undefined): Readout | undefined => (r?.sentence ? { ...r, result: r.result?.numeral ? r.result : undefined } : undefined);

const sectionsOf = (s: SectionIntro[] | null | undefined) => Object.fromEntries((s ?? []).map((x) => [x.key, x])) as Record<string, SectionIntro>;

/** "US$5,000", "AED 18,500". */
const symbols: Record<string, string> = { USD: "US$", AED: "AED ", NGN: "₦" };
export const formatMoney = (amount: number, currency: string) => `${symbols[currency] ?? `${currency} `}${amount.toLocaleString("en-GB")}`;

/* ---------------------------------------------------------------- Singletons */

export const getSettings = cache(async (): Promise<SiteSettings> => {
  type Raw = Omit<SiteSettings, "companyLinkedIn" | "defaultSeo"> & { defaultSeo: Seo };
  const s = await sanityFetch<Raw | null>(Q.settingsQuery, { id: Q.SINGLETON_IDS.settings });
  if (!s) throw new MissingContentError(`Site settings (${Q.SINGLETON_IDS.settings})`);
  req(s.contactEmail, "Site settings: contact email");
  req(s.navigation?.whatWeDo, "Site settings: navigation");
  req(s.primaryCta?.href, "Site settings: primary call to action");
  return {
    ...s,
    locations: s.locations ?? [],
    socialLinks: s.socialLinks ?? [],
    companyLinkedIn: (s.socialLinks ?? []).find((l) => /linkedin/i.test(l.label) || /linkedin\.com/.test(l.href))?.href ?? "",
    defaultSeo: seoOf(s.defaultSeo),
  };
});

export type HomeView = {
  eyebrow: string[];
  headline: string;
  supportingCopy: string;
  desktopImage?: SanityImageView;
  mobileImage?: SanityImageView;
  imageAlt: string;
  imageCredit: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  practices: string[];
  logoStrip: { label: string; names: string[] };
  sections: Record<string, SectionIntro>;
  gapCards: { glyph: ToolMeta["glyph"]; text: string }[];
  conversionLinkLabel: string;
  foundersNote: string;
  stats: { numeral: string; label: string; tag?: string; source?: string }[];
  statsSource: string;
  selectedWork: SelectedCase[];
  featuredToolSlugs: string[];
  people: Person[];
  testimonials: Testimonial[];
  decisionPath?: { label: string; actors: { label: string; who: string; act: string; stops: string; look: string; done: string }[] };
  situations: { glyph: ToolMeta["glyph"]; text: string; family: string; href: string }[];
  proofBand?: { leadLabel: string; leadName: string; leadLine: string; hint: string; groups: { label: string; items: { name: string; line: string; logo?: SanityImageView }[] }[] };
  featuredCases: SetPiece[];
  testimony?: { quote?: Testimonial; stats: ProofStat[] };
  methodCase?: Readout;
  aiNote?: string;
  startLabels: string[];
  seo: PageSeo;
};

export const getHome = cache(async (): Promise<HomeView> => {
  type Raw = {
    eyebrow: string[]; headline: string; supportingCopy: string; desktopHeroImage: SanityImageSource | null; mobileHeroImage: SanityImageSource | null;
    heroImageAlt: string; heroImageCredit: string; primaryCTA: { label: string; href: string }; secondaryCTA: { label: string; href: string };
    practices: { title: string }[]; logoStrip: { label: string; names: string[] } | null; sections: SectionIntro[]; gapCards: HomeView["gapCards"];
    conversionLinkLabel: string; foundersNote: string; stats: HomeView["stats"]; statsSource: string;
    selectedWork: (Omit<SelectedCase, "chips" | "provenance"> & { roles: Role[] | null; actions: ActionKey[] | null; provenance: Provenance | null })[];
    featuredToolSlugs: string[]; selectedPeople: RawPerson[]; testimonials: RawTestimonial[]; seo: Seo;
    decisionPath: HomeView["decisionPath"] | null; situations: HomeView["situations"] | null;
    proofBand: (Omit<NonNullable<HomeView["proofBand"]>, "groups"> & { groups: { label: string; items: { name: string; line: string; logo: SanityImageSource | null }[] }[] }) | null;
    featuredCases: RawSetPiece[] | null; testimony: { quote: RawTestimonial | null; stats: ProofStat[] } | null; methodCase: RawReadout | null; aiNote: string | null; startLabels: string[] | null;
  };
  const h = await sanityFetch<Raw | null>(Q.homeQuery, { id: Q.SINGLETON_IDS.home });
  if (!h) throw new MissingContentError(`Homepage (${Q.SINGLETON_IDS.home})`);
  req(h.headline, "Homepage: headline");
  const desktopImage = imageView(h.desktopHeroImage, { width: 3200 });
  const mobileImage = imageView(h.mobileHeroImage, { width: 1200 });
  // The hero crops are Sanity assets. Only the local seed (development and tests) may render without them.
  if ((!desktopImage || !mobileImage) && contentSource() !== "seed") throw new MissingContentError("Homepage: desktop and mobile hero images");
  return {
    eyebrow: h.eyebrow ?? [],
    headline: h.headline,
    supportingCopy: h.supportingCopy,
    desktopImage: desktopImage && { ...desktopImage, alt: h.desktopHeroImage?.alt || h.heroImageAlt },
    mobileImage: mobileImage && { ...mobileImage, alt: h.mobileHeroImage?.alt || h.heroImageAlt },
    imageAlt: h.heroImageAlt,
    imageCredit: h.heroImageCredit ?? "",
    primaryCta: req(h.primaryCTA, "Homepage: primary call to action"),
    secondaryCta: req(h.secondaryCTA, "Homepage: secondary call to action"),
    practices: h.practices.map((p) => p.title.toUpperCase()),
    logoStrip: h.logoStrip ?? { label: "", names: [] },
    sections: sectionsOf(h.sections),
    gapCards: h.gapCards,
    conversionLinkLabel: h.conversionLinkLabel,
    foundersNote: h.foundersNote,
    stats: h.stats,
    statsSource: h.statsSource,
    selectedWork: h.selectedWork.map((w) => ({ ...w, chips: chipsOf(w.roles ?? [], w.actions ?? []), provenance: w.provenance ?? undefined })),
    featuredToolSlugs: h.featuredToolSlugs ?? [],
    people: h.selectedPeople.map(personOf),
    testimonials: h.testimonials.map(testimonialOf),
    decisionPath: h.decisionPath?.actors?.length ? h.decisionPath : undefined,
    situations: h.situations ?? [],
    proofBand: h.proofBand?.leadName ? {
      ...h.proofBand,
      groups: h.proofBand.groups.map((g) => ({ label: g.label, items: g.items.map((x) => ({ name: x.name, line: x.line, logo: imageView(x.logo, { width: 320 }) })) })),
    } : undefined,
    featuredCases: (h.featuredCases ?? []).map(setPieceOf).filter((x): x is SetPiece => !!x),
    testimony: h.testimony ? { quote: h.testimony.quote ? testimonialOf(h.testimony.quote) : undefined, stats: h.testimony.stats ?? [] } : undefined,
    methodCase: readoutOf(h.methodCase),
    aiNote: h.aiNote ?? undefined,
    startLabels: h.startLabels ?? [],
    seo: seoOf(h.seo),
  };
});

export type MethodView = {
  hero: { label: string; title: string; sub: string };
  sections: Record<string, SectionIntro>;
  actors: { glyph: ToolMeta["glyph"]; actor: string; examples: string }[];
  actorsClosing: string;
  terms: { title: string; body: ArticleBody };
  moments: { title: string; body: ArticleBody };
  behaviourNote: string;
  sentenceRows: { who: string; action: string; stops: string; look: string }[];
  methodSteps: { index: string; title: string; body: string }[];
  methodStepsExpanded: { index: string; title: string; body: string; owner?: string; artefact?: string; measure?: string }[];
  example: { timelineLabel: string; baselineValue: number; baselineLabel: string; steps: { when: string; said: string; value: number; valueLabel: string; did: string; action?: boolean }[]; source?: string; caseSlug?: string; caseLinkLabel?: string; readout?: Readout };
  halves?: { label: string; terms: { title: string; line: string }; moments: { title: string; line: string } };
  stagesLabel?: string;
  why?: { label: string; title: string };
  closingLine?: string;
  question: { title: string; body: string };
  actionCards: { key: string; label: string; glyph: ToolMeta["glyph"]; line: string }[];
  actionCardLinkLabel: string;
  faqs: FaqEntry[];
  seo: PageSeo;
};

export const getMethod = cache(async (): Promise<MethodView> => {
  type Raw = Omit<MethodView, "sections" | "seo" | "example" | "halves" | "why"> & { sections: SectionIntro[]; seo: Seo; example: Omit<MethodView["example"], "readout"> & { readout: RawReadout | null }; halves: MethodView["halves"] | null; why: MethodView["why"] | null };
  const m = await sanityFetch<Raw | null>(Q.methodQuery, { id: Q.SINGLETON_IDS.method });
  if (!m) throw new MissingContentError(`Conversion Design (${Q.SINGLETON_IDS.method})`);
  req(m.hero?.title, "Conversion Design: hero title");
  return {
    ...m,
    example: { ...m.example, readout: readoutOf(m.example?.readout) },
    halves: m.halves?.terms?.title && m.halves.moments?.title ? m.halves : undefined,
    stagesLabel: m.stagesLabel ?? undefined,
    why: m.why?.title ? m.why : undefined,
    closingLine: m.closingLine ?? undefined,
    sections: sectionsOf(m.sections), terms: { title: m.terms?.title ?? "", body: m.terms?.body ?? [] }, moments: { title: m.moments?.title ?? "", body: m.moments?.body ?? [] }, seo: seoOf(m.seo) };
});

export const getSitePage = cache(async (key: SitePageKey): Promise<SitePage & { sectionMap: Record<string, SectionIntro> }> => {
  type Raw = { key: string; hero: SitePage["hero"]; sections: SectionIntro[]; strings: { key: string; value: string }[]; paths: ContactPath[] | null; seo: Seo };
  const p = await sanityFetch<Raw | null>(Q.sitePageQuery, { id: Q.sitePageId(key) });
  if (!p) throw new MissingContentError(`Page "${key}" (${Q.sitePageId(key)})`);
  return {
    key: p.key,
    hero: { label: p.hero?.label ?? "", title: req(p.hero?.title, `Page "${key}": hero title`), sub: p.hero?.sub || undefined },
    sections: p.sections,
    sectionMap: sectionsOf(p.sections),
    strings: Object.fromEntries(p.strings.map((s) => [s.key, s.value])),
    paths: p.paths ?? [],
    seo: seoOf(p.seo),
  };
});

/* ---------------------------------------------------------------- Collections */

export const getPeople = cache(async (): Promise<Person[]> => (await sanityFetch<RawPerson[]>(Q.peopleQuery)).map(personOf));
export const getPerson = cache(async (slug: string): Promise<Person | null> => {
  const p = await sanityFetch<RawPerson | null>(Q.personQuery, { slug });
  return p ? personOf(p) : null;
});

type RawPractice = {
  slug: string; title: string; section: Practice["section"]; eyebrow: string; headline: string; summary: string; navDescription: string | null;
  ledByLabel: string | null; ledBy: { slug: string; name: string }[]; whenToCall: string[] | null; capabilities: string[] | null; howItWorks: string[] | null;
  connectsCopy: string | null; proof: RawWork[]; proofNote: string | null; whenItFits: string | null; tools: RawTool[]; seo: Seo;
};
const nonEmpty = (xs: string[] | null | undefined) => (xs && xs.length ? xs : []);
const practiceOf = (p: RawPractice): Practice => ({
  slug: p.slug,
  label: p.title,
  section: p.section,
  eyebrow: p.eyebrow,
  h1: p.headline,
  sub: p.summary,
  navDescription: p.navDescription ?? undefined,
  ledBy: p.ledByLabel ?? undefined,
  ledByPeople: p.ledBy,
  whenToCall: nonEmpty(p.whenToCall),
  whatWeDo: nonEmpty(p.capabilities),
  howItWorks: nonEmpty(p.howItWorks),
  connects: p.connectsCopy ?? undefined,
  proof: p.proof.map(workOf),
  proofNote: p.proofNote ?? undefined,
  whenItFits: p.whenItFits ?? undefined,
  tools: p.tools.map(toolOf),
  seo: seoOf(p.seo),
});
export const getPractices = cache(async (): Promise<Practice[]> => (await sanityFetch<RawPractice[]>(Q.practicesQuery)).map(practiceOf));
export const getPractice = async (slug: string) => (await getPractices()).find((p) => p.slug === slug) ?? null;

export const getWorkIndex = cache(async (): Promise<WorkItem[]> => (await sanityFetch<RawWork[]>(Q.workIndexQuery)).map(workOf));
export const getSetPieces = cache(async (): Promise<SetPiece[]> => (await sanityFetch<RawSetPiece[]>(Q.setPiecesQuery)).map(setPieceOf).filter((x): x is SetPiece => !!x));
export const getCaseList = cache(async () => sanityFetch<{ slug: string; name: string; moved: string }[]>(Q.caseSlugsQuery));
export const getCase = cache(async (slug: string): Promise<CasePage | null> => {
  type Raw = Omit<CasePage, "chips" | "provenance" | "quote" | "tools" | "seo" | "ledBy" | "stats" | "changes" | "inTheWay" | "design"> & {
    roles: Role[] | null; actions: ActionKey[] | null; provenance: Provenance | null; quote: RawTestimonial | null; tools: RawTool[];
    ledBy: { slug: string; name: string } | null; stats: CasePage["stats"]; changes: CasePage["changes"]; inTheWay: string[] | null; seo: Seo; _updatedAt?: string;
    caseHeadline: string | null; place: string | null; roleLine: string | null; wayHeadline: string | null; flow: CaseDesign["flow"] | null;
    result: CaseDesign["result"] | null; evidence: CaseDesign["evidence"] | null; closing: CaseDesign["closing"] | null;
    next: { slug: string; name: string; provenance: Provenance | null; actions: ActionKey[] | null; line: string } | null;
  };
  const c = await sanityFetch<Raw | null>(Q.caseQuery, { slug });
  if (!c) return null;
  return {
    ...c,
    chips: chipsOf(c.roles ?? [], c.actions ?? []),
    provenance: c.provenance ?? undefined,
    ledBy: c.ledBy ?? undefined,
    inTheWay: c.inTheWay?.length ? c.inTheWay : undefined,
    changes: c.changes?.length ? c.changes : undefined,
    stats: c.stats?.length ? c.stats : undefined,
    quote: c.quote ? testimonialOf(c.quote) : undefined,
    tools: c.tools.map(toolOf),
    artifact: c.artifact ?? undefined,
    design: c.caseHeadline ? {
      headline: c.caseHeadline,
      place: c.place ?? undefined,
      roleLine: c.roleLine ?? undefined,
      wayHeadline: c.wayHeadline ?? undefined,
      flow: c.flow?.before?.length && c.flow.after?.length ? { before: c.flow.before, after: c.flow.after, caption: c.flow.caption ?? undefined } : undefined,
      result: c.result?.numeral ? c.result : undefined,
      evidence: c.evidence ?? undefined,
      next: c.next ? { ...c.next, provenance: c.next.provenance ?? undefined, actions: c.next.actions ?? [] } : undefined,
      closing: c.closing?.headline ? c.closing : undefined,
    } : undefined,
    seo: seoOf(c.seo),
    updatedAt: c._updatedAt,
  };
});

export const getTools = cache(async (): Promise<ToolMeta[]> => (await sanityFetch<RawTool[]>(Q.toolsQuery)).map(toolOf));
export const getTool = cache(async (slug: string): Promise<ToolMeta | null> => {
  const t = await sanityFetch<RawTool | null>(Q.toolQuery, { slug });
  return t ? toolOf(t) : null;
});

type RawEngagement = {
  slug: string; name: string; path: EngagementPathKey | null; tier: "core" | "specialist"; recommended: boolean | null; publishedPrice: boolean | null; publicPrice: number | null;
  currency: string | null; uaePrice: number | null; priceLabel: string | null; duration: string; bring: string; weDo: string; youGet: string;
  intro: string | null; points: string[] | null; cta: { label: string; href: string } | null; creditRule: string | null; feeExplainer: string | null;
  timeline: { when: string; what: string }[];
};
/** A published price reads "US$5,000 fixed · AED 18,500 for UAE engagements"; anything else shows its label. */
export const priceText = (e: Pick<RawEngagement, "publishedPrice" | "publicPrice" | "currency" | "uaePrice" | "priceLabel">) => {
  if (e.publishedPrice && e.publicPrice && e.currency) {
    return `${formatMoney(e.publicPrice, e.currency)} fixed${e.uaePrice ? ` · ${formatMoney(e.uaePrice, "AED")} for UAE engagements` : ""}`;
  }
  return e.priceLabel ?? "";
};

export const getEngagements = cache(async (): Promise<EngagementsData> => {
  const all = await sanityFetch<RawEngagement[]>(Q.engagementsQuery);
  const core = all.filter((e) => e.tier === "core");
  const d = core.find((e) => e.recommended && e.publishedPrice);
  if (!d) throw new MissingContentError("Engagements: the recommended Conversion Diagnostic with a published price");
  // Three paths, in this order; each lists its main offers, then its variants, in Sanity order.
  const paths: EngagementPath[] = (["diagnose", "deliver", "partner"] as const).map((key) => ({
    key,
    // Studio requires a path; an engagement without one (mid-publish) is left out rather than failing the page.
    offers: all.filter((e) => e.path === key)
      .sort((a, b) => Number(a.tier === "specialist") - Number(b.tier === "specialist"))
      .map((e) => ({
        slug: e.slug, name: e.name, main: e.tier === "core", recommended: !!e.recommended, price: priceText(e), time: e.duration,
        // A variant's intro may end by introducing its points ("We cover both halves:"); the path shows the intro without that lead-in.
        line: (e.tier === "core" ? e.youGet : e.intro?.replace(/\s*[^.]*:\s*$/, "")) ?? "",
        cta: e.cta ?? { label: "Talk to us", href: `/contact?engagement=${encodeURIComponent(e.name)}` },
      })),
  }));
  const specialists: Specialist[] = all.filter((e) => e.tier === "specialist").map((e) => ({
    slug: e.slug, name: e.name, price: priceText(e), time: e.duration, intro: e.intro ?? "", points: e.points?.length ? e.points : undefined, cta: e.cta ?? undefined,
  }));
  const diagnostic: DiagnosticInfo = {
    name: d.name,
    price: { amount: d.publicPrice!, currency: d.currency! },
    priceText: priceText(d),
    uaePrice: d.uaePrice ? { amount: d.uaePrice, currency: "AED" } : undefined,
    creditRule: req(d.creditRule, "Conversion Diagnostic: credit rule"),
    feeExplainer: d.feeExplainer ?? "",
    days: d.timeline,
    bring: d.bring,
    weDo: d.weDo,
    youGet: d.youGet,
  };
  return { paths, specialists, diagnostic };
});

export const getFaqs = cache(async (placement: "conversionDesign" | "engagements"): Promise<FaqEntry[]> => sanityFetch<FaqEntry[]>(Q.faqsQuery, { placement }));

export const getGuides = cache(async (): Promise<GuideCard[]> => sanityFetch<GuideCard[]>(Q.libraryQuery));
export const getTemplates = cache(async (): Promise<Template[]> => sanityFetch<Template[]>(Q.templatesQuery));
export const getGuide = cache(async (slug: string): Promise<Guide | null> => {
  type Raw = Omit<Guide, "authors" | "seo" | "body"> & { authors: RawPerson[]; body: (ArticleBody[number] & { tool?: RawTool })[]; seo: Seo; _updatedAt?: string };
  const g = await sanityFetch<Raw | null>(Q.guideQuery, { slug });
  if (!g) return null;
  return {
    ...g,
    excerpt: g.excerpt ?? "",
    authors: g.authors.map(personOf),
    body: g.body.map((b) => (b._type === "asToolEmbed" && b.tool ? { ...b, tool: toolOf(b.tool) } : b)),
    seo: seoOf(g.seo),
    updatedAt: g._updatedAt,
  };
});

export const getNewsletterIssues = cache(async () => sanityFetch<{ title: string; publishedAt: string; href: string }[]>(Q.newsletterIssuesQuery));

export const getLegal = cache(async (slug: "privacy" | "terms"): Promise<LegalDoc> => {
  type Raw = { label: string; title: string; effectiveDate: string | null; effectiveLabel: string; sections: LegalDoc["sections"]; seo: Seo; _updatedAt?: string };
  const l = await sanityFetch<Raw | null>(Q.legalQuery, { slug });
  if (!l) throw new MissingContentError(`Legal page "${slug}"`);
  return { label: l.label, title: l.title, updated: l.effectiveLabel, sections: l.sections, seo: seoOf(l.seo), updatedAt: l._updatedAt };
});

export const getSitemapData = () =>
  sanityFetch<{
    singletons: { _id: string; key?: string; _updatedAt: string }[];
    practices: { slug: string; section: string; _updatedAt: string }[];
    cases: { slug: string; _updatedAt: string }[];
    people: { slug: string; _updatedAt: string }[];
    tools: { slug: string; _updatedAt: string }[];
    guides: { slug: string; _updatedAt: string }[];
    legal: { slug: string; _updatedAt: string }[];
  }>(Q.sitemapQuery, { settings: Q.SINGLETON_IDS.settings, home: Q.SINGLETON_IDS.home, method: Q.SINGLETON_IDS.method });
