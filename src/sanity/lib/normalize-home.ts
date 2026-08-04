import { fallbackHome } from "@/content/fallback-data";
import type { Faq, HomePage, ImageValue, LinkValue, Project, Service, Testimonial } from "@/types/content";

type RawRecord = Record<string, unknown>;
type Hero = NonNullable<HomePage["hero"]>;
type About = NonNullable<HomePage["about"]>;
type Services = NonNullable<HomePage["services"]>;
type Projects = NonNullable<HomePage["projects"]>;
type Testimonials = NonNullable<HomePage["testimonials"]>;
type Faqs = NonNullable<HomePage["faqs"]>;
type Contact = NonNullable<HomePage["contact"]>;

const canonical = {
  hero: fallbackHome.hero!,
  about: fallbackHome.about!,
  services: fallbackHome.services!,
  projects: fallbackHome.projects!,
  testimonials: fallbackHome.testimonials!,
  faqs: fallbackHome.faqs!,
  contact: fallbackHome.contact!,
};

const isRecord = (value: unknown): value is RawRecord => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const nonEmptyString = (value: unknown, fallback: string): string => typeof value === "string" && value.trim() ? value : fallback;
const stringArray = (value: unknown, fallback: string[]): string[] => Array.isArray(value) && value.every((item) => typeof item === "string") ? value : fallback;
const booleanOr = (value: unknown, fallback: boolean): boolean => typeof value === "boolean" ? value : fallback;

function normalizeImage(value: unknown, fallback?: ImageValue): ImageValue | undefined {
  if (!isRecord(value)) return fallback;
  const src = nonEmptyString(value.src, fallback?.src || "");
  if (!src) return fallback;
  return { ...fallback, ...value, src, alt: typeof value.alt === "string" ? value.alt : fallback?.alt } as ImageValue;
}

function normalizeLink(value: unknown, fallback: LinkValue): LinkValue {
  if (!isRecord(value)) return fallback;
  return {
    ...fallback,
    label: nonEmptyString(value.label, fallback.label),
    href: nonEmptyString(value.href, fallback.href),
    ...(typeof value.external === "boolean" ? { external: value.external } : {}),
  };
}

function normalizeService(value: unknown, fallback: Service, fallbackItems: Service[]): Service | null {
  if (!isRecord(value)) return null;
  const rawSlug = typeof value.slug === "string" ? value.slug : isRecord(value.slug) ? value.slug.current : undefined;
  const base = fallbackItems.find((item) => item.slug === rawSlug) || fallback;
  const slug = nonEmptyString(rawSlug, base.slug);
  return {
    ...base,
    ...value,
    _id: typeof value._id === "string" ? value._id : base._id,
    title: nonEmptyString(value.title, base.title),
    slug,
    summary: nonEmptyString(value.summary, base.summary || ""),
    capabilities: stringArray(value.capabilities, base.capabilities || []),
    image: normalizeImage(value.image, base.image),
    featured: booleanOr(value.featured, Boolean(base.featured)),
    detailApproved: booleanOr(value.detailApproved, Boolean(base.detailApproved)),
    previewOnly: booleanOr(value.previewOnly, Boolean(base.previewOnly)),
  };
}

function normalizeTestimonial(value: unknown, fallback: Testimonial): Testimonial | null {
  if (!isRecord(value)) return null;
  return {
    ...fallback,
    ...value,
    _id: typeof value._id === "string" ? value._id : fallback._id,
    quote: nonEmptyString(value.quote, fallback.quote),
    personName: nonEmptyString(value.personName, fallback.personName),
    role: typeof value.role === "string" ? value.role : fallback.role,
    organisation: typeof value.organisation === "string" ? value.organisation : fallback.organisation,
    portrait: normalizeImage(value.portrait, fallback.portrait),
    approved: booleanOr(value.approved, Boolean(fallback.approved)),
    showOnHomepage: booleanOr(value.showOnHomepage, Boolean(fallback.showOnHomepage)),
    featuredOnHomepage: booleanOr(value.featuredOnHomepage, Boolean(fallback.featuredOnHomepage)),
    homepageOrder: typeof value.homepageOrder === "number" ? value.homepageOrder : fallback.homepageOrder,
  };
}

function normalizeProject(value: unknown, fallback: Project, fallbackItems: Project[]): Project | null {
  if (!isRecord(value)) return null;
  const rawSlug = typeof value.slug === "string" ? value.slug : isRecord(value.slug) ? value.slug.current : undefined;
  const base = fallbackItems.find((item) => item.slug === rawSlug) || fallback;
  const tone = value.tone === "sage" || value.tone === "amber" || value.tone === "ink" ? value.tone : base.tone;
  return {
    ...base,
    ...value,
    _id: typeof value._id === "string" ? value._id : base._id,
    title: nonEmptyString(value.title, base.title),
    slug: nonEmptyString(rawSlug, base.slug),
    summary: nonEmptyString(value.summary, base.summary),
    cover: normalizeImage(value.cover, base.cover),
    tags: stringArray(value.tags, base.tags),
    tone,
    featured: booleanOr(value.featured, Boolean(base.featured)),
    homepagePlacement: value.homepagePlacement === "featured" || value.homepagePlacement === "supporting" || value.homepagePlacement === "hidden" ? value.homepagePlacement : base.homepagePlacement,
    homepageOrder: typeof value.homepageOrder === "number" ? value.homepageOrder : base.homepageOrder,
    testimonial: value.testimonial === null ? undefined : normalizeTestimonial(value.testimonial, base.testimonial || { quote: "", personName: "" }) || undefined,
  };
}

function normalizeFaq(value: unknown, fallback: Faq): Faq | null {
  if (!isRecord(value)) return null;
  return {
    ...fallback,
    ...value,
    _id: typeof value._id === "string" ? value._id : fallback._id,
    question: nonEmptyString(value.question, fallback.question),
    answer: nonEmptyString(value.answer, fallback.answer),
    display: booleanOr(value.display, fallback.display !== false),
    showOnHomepage: booleanOr(value.showOnHomepage, fallback.showOnHomepage !== false),
    homepageOrder: typeof value.homepageOrder === "number" ? value.homepageOrder : fallback.homepageOrder,
  };
}

function collectionItems<T>(section: RawRecord, fallbackItems: T[], normalize: (value: unknown, fallback: T, index: number) => T | null): T[] {
  const source = Array.isArray(section.items) ? section.items : fallbackItems;
  return source.map((value, index) => normalize(value, fallbackItems[index], index)).filter((item): item is T => item !== null);
}

function normalizeSection<T>(value: unknown, fallback: T, normalize: (value: RawRecord, fallback: T) => T): T | undefined {
  if (isRecord(value) && value.enabled === false) return undefined;
  return normalize(isRecord(value) ? value : {}, fallback);
}

function normalizeServices(value: RawRecord, fallback: Services): Services {
  return {
    ...fallback,
    label: nonEmptyString(value.label, fallback.label),
    heading: nonEmptyString(value.heading, fallback.heading),
    introduction: nonEmptyString(value.introduction, fallback.introduction),
    items: collectionItems(value, fallback.items, (item, base, index) => normalizeService(item, base || fallback.items[index] || fallback.items[0], fallback.items)),
  };
}

function normalizeProjects(value: RawRecord, fallback: Projects): Projects {
  return {
    ...fallback,
    label: nonEmptyString(value.label, fallback.label),
    heading: nonEmptyString(value.heading, fallback.heading),
    introduction: nonEmptyString(value.introduction, fallback.introduction),
    items: collectionItems(value, fallback.items, (item, base, index) => normalizeProject(item, base || fallback.items[index] || fallback.items[0], fallback.items)),
  };
}

function normalizeTestimonials(value: RawRecord, fallback: Testimonials): Testimonials {
  return {
    ...fallback,
    label: nonEmptyString(value.label, fallback.label),
    heading: nonEmptyString(value.heading, fallback.heading),
    introduction: typeof value.introduction === "string" ? value.introduction : fallback.introduction,
    items: collectionItems(value, fallback.items, (item, base, index) => normalizeTestimonial(item, base || fallback.items[index] || fallback.items[0])),
  };
}

function normalizeFaqs(value: RawRecord, fallback: Faqs): Faqs {
  return {
    ...fallback,
    label: nonEmptyString(value.label, fallback.label),
    heading: nonEmptyString(value.heading, fallback.heading),
    introduction: nonEmptyString(value.introduction, fallback.introduction),
    cta: normalizeLink(value.cta, fallback.cta),
    items: collectionItems(value, fallback.items, (item, base, index) => normalizeFaq(item, base || fallback.items[index] || fallback.items[0])),
  };
}

export function normalizeHomePage(value: unknown): HomePage {
  if (!isRecord(value)) return fallbackHome;
  const rawTestimonials = Object.prototype.hasOwnProperty.call(value, "testimonials") ? value.testimonials : undefined;
  const testimonials = rawTestimonials === undefined || rawTestimonials === null
    ? undefined
    : normalizeSection(rawTestimonials, canonical.testimonials, normalizeTestimonials);
  return {
    title: nonEmptyString(value.title, fallbackHome.title),
    seo: isRecord(value.seo) ? { ...fallbackHome.seo, ...value.seo } : fallbackHome.seo,
    hero: normalizeSection(value.hero, canonical.hero, (raw, fallback: Hero) => ({
      ...fallback,
      eyebrow: stringArray(raw.eyebrow, fallback.eyebrow),
      heading: nonEmptyString(raw.heading, fallback.heading),
      body: nonEmptyString(raw.body, fallback.body),
      primaryCta: normalizeLink(raw.primaryCta, fallback.primaryCta),
      secondaryCta: raw.secondaryCta === null ? undefined : normalizeLink(raw.secondaryCta, fallback.secondaryCta || fallback.primaryCta),
      quote: typeof raw.quote === "string" ? raw.quote : fallback.quote,
      media: normalizeImage(raw.media, fallback.media),
    })),
    about: normalizeSection(value.about, canonical.about, (raw, fallback: About) => ({
      ...fallback,
      label: nonEmptyString(raw.label, fallback.label),
      heading: nonEmptyString(raw.heading, fallback.heading),
      body: nonEmptyString(raw.body, fallback.body),
      approach: nonEmptyString(raw.approach, fallback.approach),
      principles: Array.isArray(raw.principles) ? raw.principles.filter(isRecord).map((principle, index) => ({ ...fallback.principles?.[index], number: nonEmptyString(principle.number, fallback.principles?.[index]?.number || `0${index + 1}`), title: nonEmptyString(principle.title, fallback.principles?.[index]?.title || ""), body: nonEmptyString(principle.body, fallback.principles?.[index]?.body || "") })) : fallback.principles,
      support: stringArray(raw.support, fallback.support),
      images: Array.isArray(raw.images) ? raw.images.map((image, index) => normalizeImage(image, fallback.images?.[index])).filter((image): image is ImageValue => Boolean(image)) : fallback.images,
      statistics: Array.isArray(raw.statistics) ? raw.statistics.filter(isRecord) as About["statistics"] : fallback.statistics,
    })),
    services: normalizeSection(value.services, canonical.services, normalizeServices),
    projects: normalizeSection(value.projects, canonical.projects, normalizeProjects),
    testimonials,
    faqs: normalizeSection(value.faqs, canonical.faqs, normalizeFaqs),
    contact: normalizeSection(value.contact, canonical.contact, (raw, fallback: Contact) => ({
      ...fallback,
      label: nonEmptyString(raw.label, fallback.label),
      heading: nonEmptyString(raw.heading, fallback.heading),
      introduction: nonEmptyString(raw.introduction, fallback.introduction),
      offices: stringArray(raw.offices, fallback.offices || []),
      base: nonEmptyString(raw.base, fallback.base || ""),
      workingAcross: nonEmptyString(raw.workingAcross, fallback.workingAcross || ""),
      email: nonEmptyString(raw.email, fallback.email || ""),
    })),
  };
}
