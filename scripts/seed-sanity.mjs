import { createReadStream, existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "..");
const canonicalContent = JSON.parse(readFileSync(resolve(repositoryRoot, "src/content/canonical-content.json"), "utf8"));
const apiVersion = "2026-02-01";
const draft = (id) => `drafts.${id}`;

export function portableText(text) {
  return [{
    _type: "block",
    _key: `block-${text.slice(0, 20).replace(/\W/g, "").toLowerCase()}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "span-1", marks: [], text }],
  }];
}

function reference(id) {
  return { _type: "reference", _ref: draft(id) };
}

function cta(value) {
  return { _type: "cta", label: value.label, href: value.href, ...(value.external ? { external: true } : {}) };
}

function imageField(image, assetRefs, key) {
  const asset = assetRefs?.[key];
  return asset ? { ...asset, alt: image.alt } : undefined;
}

export function buildSeedDocuments(content = canonicalContent, assetRefs = {}) {
  const { settings, home } = content;
  const serviceDocuments = home.services.items.map((service) => ({
    _id: draft(`service-${service.slug}`),
    _type: "service",
    title: service.title,
    slug: { _type: "slug", current: service.slug },
    summary: service.summary,
    capabilities: service.capabilities,
    featured: Boolean(service.featured),
    detailApproved: false,
    previewOnly: true,
    cta: cta(settings.defaultCta),
  }));
  const projectDocuments = home.projects.items.map((project) => ({
    _id: draft(`project-${project.slug}`),
    _type: "project",
    title: project.title,
    slug: { _type: "slug", current: project.slug },
    summary: project.summary,
    cover: imageField(project.cover, assetRefs.projects, project.slug),
    tags: project.tags,
    featured: Boolean(project.featured),
    homepagePlacement: project.homepagePlacement,
    homepageOrder: project.homepageOrder,
  })).map((project) => Object.fromEntries(Object.entries(project).filter(([, value]) => value !== undefined)));
  const testimonialDocuments = home.testimonials.items.map((testimonial, index) => ({
    _id: draft(`testimonial-${index + 1}`),
    _type: "testimonial",
    quote: testimonial.quote,
    personName: testimonial.personName,
    ...(testimonial.role ? { role: testimonial.role } : {}),
    ...(testimonial.organisation ? { organisation: testimonial.organisation } : {}),
    portrait: imageField(testimonial.portrait, assetRefs.testimonials, testimonial.personName),
    approved: false,
    showOnHomepage: Boolean(testimonial.showOnHomepage),
    featuredOnHomepage: Boolean(testimonial.featuredOnHomepage),
    ...(testimonial.homepageOrder ? { homepageOrder: testimonial.homepageOrder } : {}),
  })).map((testimonial) => Object.fromEntries(Object.entries(testimonial).filter(([, value]) => value !== undefined)));
  const faqDocuments = home.faqs.items.map((faq, index) => ({
    _id: draft(`faq-${index + 1}`),
    _type: "faq",
    question: faq.question,
    answer: faq.answer,
    display: faq.display !== false,
    showOnHomepage: true,
    homepageOrder: index + 1,
  }));
  const settingsDocument = {
    _id: draft("siteSettings"),
    _type: "siteSettings",
    siteTitle: settings.title,
    shortBrandDescription: settings.brandDescription,
    primaryNavigation: settings.navigation.map((item, index) => ({ _key: `nav-${index + 1}`, ...item })),
    footerNavigation: settings.footerNavigation.map((item, index) => ({ _key: `footer-${index + 1}`, ...item })),
    defaultCta: cta(settings.defaultCta),
    contactEmail: settings.contactEmail,
    officeLocations: settings.officeLocations.map((address, index) => ({ _key: `office-${index + 1}`, _type: "officeLocation", label: "Base", address })),
    socialLinks: settings.socialLinks,
    footerCopyright: settings.copyright || "© 2026 Axis & Sage",
    defaultSeo: { _type: "seo", title: settings.seo.title, description: settings.seo.description },
  };
  const homeDocument = {
    _id: draft("homePage"),
    _type: "homePage",
    internalTitle: "Axis & Sage homepage",
    sections: [
      {
        _key: "section-hero", _type: "heroSection", enabled: true,
        eyebrow: home.hero.eyebrow, heading: home.hero.heading, body: home.hero.body,
        primaryCta: cta(home.hero.primaryCta), secondaryCta: cta(home.hero.secondaryCta),
        ...(imageField(home.hero.media, assetRefs, "hero") ? { media: imageField(home.hero.media, assetRefs, "hero") } : {}),
      },
      {
        _key: "section-about", _type: "aboutSection", enabled: true, anchorId: "about",
        label: home.about.label, heading: home.about.heading, body: portableText(home.about.body),
        approach: home.about.approach, principles: home.about.principles, support: home.about.support,
        ...(assetRefs.aboutImages ? { images: home.about.images.map((image, index) => ({ ...assetRefs.aboutImages[index], alt: image.alt })) } : {}),
        statistics: [],
      },
      {
        _key: "section-services", _type: "servicesSection", enabled: true, anchorId: "services",
        label: home.services.label, heading: home.services.heading, introduction: home.services.introduction,
        services: serviceDocuments.map((service) => reference(service._id.replace("drafts.", ""))),
      },
      {
        _key: "section-projects", _type: "projectsSection", enabled: true, anchorId: "our-work",
        label: home.projects.label, heading: home.projects.heading, introduction: home.projects.introduction,
        projects: projectDocuments.map((project) => reference(project._id.replace("drafts.", ""))),
      },
      {
        _key: "section-testimonials", _type: "testimonialsSection", enabled: true, anchorId: "testimonials",
        label: home.testimonials.label, heading: home.testimonials.heading, introduction: home.testimonials.introduction,
        testimonials: testimonialDocuments.filter((testimonial) => testimonial.showOnHomepage).map((testimonial) => reference(testimonial._id.replace("drafts.", ""))),
      },
      {
        _key: "section-faqs", _type: "faqSection", enabled: true, anchorId: "faqs",
        label: home.faqs.label, heading: home.faqs.heading, introduction: home.faqs.introduction, cta: cta(home.faqs.cta),
        faqs: faqDocuments.map((faq) => reference(faq._id.replace("drafts.", ""))),
      },
      {
        _key: "section-contact", _type: "contactSection", enabled: true, anchorId: "contact",
        label: home.contact.label, heading: home.contact.heading, introduction: home.contact.introduction,
        offices: home.contact.offices.map((address, index) => ({ _key: `contact-office-${index + 1}`, _type: "officeLocation", label: "Base", address })),
        base: home.contact.base, workingAcross: home.contact.workingAcross, email: home.contact.email,
        formTitle: "Start a conversation",
      },
    ],
  };
  return [settingsDocument, ...serviceDocuments, ...projectDocuments, ...testimonialDocuments, ...faqDocuments, homeDocument];
}

async function getExistingDocuments(client, documents) {
  const entries = await Promise.all(documents.map(async (document) => [document._id, await client.getDocument(document._id)]));
  return new Map(entries);
}

export async function seedDocuments({ client, documents, force = false, existingDocuments, logger = console }) {
  const existing = existingDocuments || await getExistingDocuments(client, documents);
  const writable = [];
  const results = [];
  for (const document of documents) {
    const alreadyExists = Boolean(existing.get(document._id));
    if (force) {
      writable.push(document);
      results.push({ id: document._id, status: alreadyExists ? "replaced" : "created" });
    } else if (alreadyExists) {
      results.push({ id: document._id, status: "skipped" });
    } else {
      writable.push(document);
      results.push({ id: document._id, status: "created" });
    }
  }
  if (writable.length) {
    const transaction = client.transaction();
    for (const document of writable) {
      if (force) transaction.createOrReplace(document);
      else transaction.createIfNotExists(document);
    }
    await transaction.commit();
  }
  for (const result of results) logger.log(`[sanity-seed] ${result.status}: ${result.id}`);
  return results;
}

export async function validateBootstrap({ client, projectId, dataset, token, logger = console }) {
  if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required for local Sanity bootstrap.");
  if (!dataset) throw new Error("NEXT_PUBLIC_SANITY_DATASET is required for local Sanity bootstrap.");
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is required locally. Never add this token to Vercel.");
  logger.log(`[sanity-seed] Target dataset: ${projectId}/${dataset}`);
  await client.request({ method: "GET", uri: `/datasets/${dataset}` });
  await client.request({ method: "POST", uri: `/data/mutate/${dataset}`, body: { mutations: [] } });
}

async function prepareAssetRefs({ client, content, existingDocuments, force, logger }) {
  if (!client.assets?.upload) return {};
  const refs = { projects: {}, testimonials: {}, aboutImages: [] };
  const hasExistingDocument = [...existingDocuments.values()].some(Boolean);
  const upload = async (image, key) => {
    if (!image?.src || (!force && hasExistingDocument)) return undefined;
    const localPath = resolve(repositoryRoot, "public", image.src.replace(/^\//, ""));
    if (!existsSync(localPath)) return undefined;
    const asset = await client.assets.upload("image", createReadStream(localPath), { filename: basename(localPath) });
    logger.log(`[sanity-seed] uploaded asset: ${key}`);
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  };
  const home = content.home;
  refs.hero = await upload(home.hero.media, "hero");
  for (const [index, image] of home.about.images.entries()) refs.aboutImages[index] = await upload(image, `about-${index + 1}`);
  for (const project of home.projects.items) refs.projects[project.slug] = await upload(project.cover, `project-${project.slug}`);
  for (const testimonial of home.testimonials.items) refs.testimonials[testimonial.personName] = await upload(testimonial.portrait, `testimonial-${testimonial.personName}`);
  return refs;
}

export async function runSeed({ environment = process.env, clientFactory = createClient, logger = console } = {}) {
  const projectId = environment.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = environment.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = environment.SANITY_API_WRITE_TOKEN;
  const force = environment.SANITY_SEED_FORCE === "true";
  if (!projectId) throw new Error("NEXT_PUBLIC_SANITY_PROJECT_ID is required for local Sanity bootstrap.");
  if (!dataset) throw new Error("NEXT_PUBLIC_SANITY_DATASET is required for local Sanity bootstrap.");
  if (!token) throw new Error("SANITY_API_WRITE_TOKEN is required locally. Never add this token to Vercel.");
  const client = clientFactory({ projectId, dataset, apiVersion, token, useCdn: false });
  await validateBootstrap({ client, projectId, dataset, token, logger });
  logger.log(`[sanity-seed] Mode: ${force ? "force replacement of draft documents" : "safe initial bootstrap"}`);
  const baseDocuments = buildSeedDocuments(canonicalContent);
  const existingDocuments = await getExistingDocuments(client, baseDocuments);
  const assetRefs = await prepareAssetRefs({ client, content: canonicalContent, existingDocuments, force, logger });
  const documents = buildSeedDocuments(canonicalContent, assetRefs);
  return seedDocuments({ client, documents, force, existingDocuments, logger });
}

const invokedFile = process.argv[1] ? resolve(process.argv[1]) : "";
if (invokedFile === fileURLToPath(import.meta.url)) {
  runSeed().catch((error) => {
    console.error(`[sanity-seed] ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
