/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineArrayMember, defineField, defineType } from "sanity";

const required = (description?: string): { validation: (rule: any) => any; description?: string } => ({
  validation: (rule: any) => rule.required(),
  ...(description ? { description } : {}),
});

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", ...required("Keep this concise and specific to the page.") }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, ...required("Describe the page without template or placeholder language.") }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url", validation: (rule) => rule.uri({ allowRelative: true, scheme: ["http", "https"] }) }),
    defineField({ name: "image", title: "Open Graph image", type: "imageWithAlt" }),
  ],
});

const cta = defineType({
  name: "cta",
  title: "CTA / Link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "href", title: "Destination", type: "string", ...required("Use an anchor, internal path, mailto URL or approved external URL.") }),
    defineField({ name: "external", title: "Open externally", type: "boolean", initialValue: false }),
  ],
});

const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alt text", type: "string", ...required("Describe meaningful images. Use an empty value only for decorative imagery.") }),
    defineField({ name: "credit", title: "Credit / proof note", type: "string", description: "Optional rights or source note; do not publish unverified attribution." }),
  ],
});

const navigationItem = defineType({
  name: "navigationItem",
  title: "Navigation item",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "href", title: "Destination", type: "string", ...required() }),
  ],
});

const officeLocation = defineType({
  name: "officeLocation",
  title: "Office location",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "address", title: "Address", type: "text", rows: 2, ...required("Only publish a verified business address.") }),
  ],
});

const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({ name: "label", title: "Platform", type: "string", ...required() }),
    defineField({ name: "href", title: "URL", type: "url", ...required(), validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }) }),
  ],
});

const statistic = defineType({
  name: "statistic",
  title: "Statistic",
  type: "object",
  fields: [
    defineField({ name: "value", title: "Value", type: "string", description: "Do not publish until the number is verified." }),
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "detail", title: "Detail", type: "text", rows: 2 }),
  ],
});

const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [defineArrayMember({ type: "block" })],
});

const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", ...required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, ...required() }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 4, group: "content", description: "Leave blank while the service wording is under review." }),
    defineField({ name: "capabilities", title: "Capabilities", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.max(6) }),
    defineField({ name: "cta", title: "CTA", type: "cta", group: "content" }),
    defineField({ name: "body", title: "Detailed body", type: "portableText", group: "content" }),
    defineField({ name: "featured", title: "Featured", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "summary" } },
});

const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({ name: "quote", title: "Quote", type: "text", rows: 5, ...required("Only publish a quote with approval or proof URL.") }),
    defineField({ name: "personName", title: "Person name", type: "string", ...required() }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "organisation", title: "Organisation", type: "string" }),
    defineField({ name: "portrait", title: "Portrait", type: "imageWithAlt" }),
    defineField({ name: "sourceUrl", title: "Source / proof URL", type: "url", validation: (rule) => rule.uri({ scheme: ["http", "https"] }) }),
    defineField({ name: "approved", title: "Approved for publishing", type: "boolean", initialValue: false, ...required("Keep false until the quote is approved." ) }),
  ],
  preview: { select: { title: "personName", subtitle: "organisation", media: "portrait" } },
});

const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  groups: [{ name: "content", title: "Content", default: true }, { name: "details", title: "Case study details" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "content", ...required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "content", options: { source: "title", maxLength: 96 }, ...required() }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 5, group: "content", ...required() }),
    defineField({ name: "cover", title: "Cover image", type: "imageWithAlt", group: "content", description: "Use a rights-cleared project image with real alt text." }),
    defineField({ name: "tags", title: "Service / category tags", type: "array", group: "content", of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.max(4) }),
    defineField({ name: "client", title: "Client", type: "string", group: "content" }),
    defineField({ name: "year", title: "Year", type: "string", group: "content" }),
    defineField({ name: "location", title: "Location", type: "string", group: "content" }),
    defineField({ name: "challenge", title: "Challenge", type: "portableText", group: "details" }),
    defineField({ name: "contribution", title: "Contribution", type: "portableText", group: "details" }),
    defineField({ name: "outcome", title: "Outcome", type: "portableText", group: "details" }),
    defineField({ name: "gallery", title: "Gallery", type: "array", group: "details", of: [defineArrayMember({ type: "imageWithAlt" })], validation: (rule) => rule.max(8) }),
    defineField({ name: "testimonial", title: "Approved testimonial", type: "reference", group: "details", to: [{ type: "testimonial" }], options: { disableNew: true } }),
    defineField({ name: "externalUrl", title: "External URL", type: "url", group: "details", validation: (rule) => rule.uri({ scheme: ["http", "https"] }) }),
    defineField({ name: "featured", title: "Featured on homepage", type: "boolean", group: "content", initialValue: false }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  preview: { select: { title: "title", subtitle: "client", media: "cover" } },
});

const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({ name: "question", title: "Question", type: "string", ...required() }),
    defineField({ name: "answer", title: "Answer", type: "text", rows: 5, ...required() }),
    defineField({ name: "category", title: "Category", type: "string" }),
    defineField({ name: "display", title: "Display", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "question", subtitle: "category" } },
});

const heroSection = defineType({
  name: "heroSection",
  title: "Hero section",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({ name: "eyebrow", title: "Eyebrow labels", type: "array", of: [defineArrayMember({ type: "string" })], validation: (rule) => rule.max(4) }),
    defineField({ name: "heading", title: "Heading", type: "string", ...required() }),
    defineField({ name: "body", title: "Supporting paragraph", type: "text", rows: 4, ...required() }),
    defineField({ name: "primaryCta", title: "Primary CTA", type: "cta", ...required() }),
    defineField({ name: "secondaryCta", title: "Secondary CTA", type: "cta" }),
    defineField({ name: "media", title: "Media", type: "imageWithAlt", description: "Optional approved image; leave blank while the legacy image is template residue." }),
    defineField({ name: "quote", title: "Verified quote", type: "text", rows: 3 }),
  ],
});

const aboutSection = defineType({
  name: "aboutSection",
  title: "About section",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({ name: "anchorId", title: "Anchor ID", type: "string", initialValue: "about" }),
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "heading", title: "Heading", type: "string", ...required() }),
    defineField({ name: "body", title: "Body", type: "portableText" }),
    defineField({ name: "approach", title: "Approach statement", type: "string" }),
    defineField({ name: "support", title: "Supporting paragraphs", type: "array", of: [defineArrayMember({ type: "text" })], validation: (rule) => rule.max(3) }),
    defineField({ name: "images", title: "Approved imagery", type: "array", of: [defineArrayMember({ type: "imageWithAlt" })], validation: (rule) => rule.max(6) }),
    defineField({ name: "statistics", title: "Statistics", type: "array", of: [defineArrayMember({ type: "statistic" })], validation: (rule) => rule.max(4) }),
  ],
});

const servicesSection = defineType({
  name: "servicesSection",
  title: "Services section",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({ name: "anchorId", title: "Anchor ID", type: "string", initialValue: "services" }),
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "heading", title: "Heading", type: "string", ...required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 3 }),
    defineField({ name: "services", title: "Ordered services", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })], validation: (rule) => rule.max(5) }),
  ],
});

const projectsSection = defineType({
  name: "projectsSection",
  title: "Projects section",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({ name: "anchorId", title: "Anchor ID", type: "string", initialValue: "our-work" }),
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "heading", title: "Heading", type: "string", ...required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 3 }),
    defineField({ name: "projects", title: "Ordered featured projects", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "project" }] })], validation: (rule) => rule.max(6) }),
  ],
});

const testimonialsSection = defineType({
  name: "testimonialsSection",
  title: "Testimonials section",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({ name: "anchorId", title: "Anchor ID", type: "string", initialValue: "testimonials" }),
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "heading", title: "Heading", type: "string", ...required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 3 }),
    defineField({ name: "testimonials", title: "Approved testimonials", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "testimonial" }], options: { disableNew: true } })], validation: (rule) => rule.max(8) }),
  ],
});

const faqSection = defineType({
  name: "faqSection",
  title: "FAQ section",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({ name: "anchorId", title: "Anchor ID", type: "string", initialValue: "faqs" }),
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "heading", title: "Heading", type: "string", ...required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 3 }),
    defineField({ name: "cta", title: "CTA", type: "cta" }),
    defineField({ name: "faqs", title: "Ordered FAQs", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })], validation: (rule) => rule.max(10) }),
  ],
});

const contactSection = defineType({
  name: "contactSection",
  title: "Contact section",
  type: "object",
  fields: [
    defineField({ name: "internalLabel", title: "Internal label", type: "string" }),
    defineField({ name: "enabled", title: "Enabled", type: "boolean", initialValue: true }),
    defineField({ name: "anchorId", title: "Anchor ID", type: "string", initialValue: "contact" }),
    defineField({ name: "label", title: "Label", type: "string", ...required() }),
    defineField({ name: "heading", title: "Heading", type: "string", ...required() }),
    defineField({ name: "introduction", title: "Introduction", type: "text", rows: 4 }),
    defineField({ name: "offices", title: "Verified offices", type: "array", of: [defineArrayMember({ type: "officeLocation" })], validation: (rule) => rule.max(4) }),
    defineField({ name: "email", title: "Verified contact email", type: "email" }),
    defineField({ name: "formTitle", title: "Form title", type: "string", initialValue: "Start a conversation" }),
  ],
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  groups: [{ name: "brand", title: "Brand", default: true }, { name: "navigation", title: "Navigation" }, { name: "contact", title: "Contact" }, { name: "seo", title: "SEO" }],
  fields: [
    defineField({ name: "siteTitle", title: "Site title", type: "string", group: "brand", ...required() }),
    defineField({ name: "shortBrandDescription", title: "Short brand description", type: "text", rows: 2, group: "brand", ...required() }),
    defineField({ name: "logo", title: "Logo", type: "imageWithAlt", group: "brand" }),
    defineField({ name: "favicon", title: "Favicon", type: "imageWithAlt", group: "brand" }),
    defineField({ name: "primaryNavigation", title: "Primary navigation", type: "array", group: "navigation", of: [defineArrayMember({ type: "navigationItem" })], validation: (rule) => rule.max(8) }),
    defineField({ name: "footerNavigation", title: "Footer navigation", type: "array", group: "navigation", of: [defineArrayMember({ type: "navigationItem" })], validation: (rule) => rule.max(10) }),
    defineField({ name: "defaultCta", title: "Default CTA", type: "cta", group: "navigation" }),
    defineField({ name: "contactEmail", title: "Contact email", type: "email", group: "contact" }),
    defineField({ name: "phone", title: "Phone", type: "string", group: "contact" }),
    defineField({ name: "officeLocations", title: "Office locations", type: "array", group: "contact", of: [defineArrayMember({ type: "officeLocation" })], validation: (rule) => rule.max(4) }),
    defineField({ name: "socialLinks", title: "Social links", type: "array", group: "contact", of: [defineArrayMember({ type: "socialLink" })], validation: (rule) => rule.max(6) }),
    defineField({ name: "defaultSeo", title: "Default SEO", type: "seo", group: "seo" }),
    defineField({ name: "footerCopyright", title: "Footer copyright", type: "string", group: "brand", ...required() }),
    defineField({ name: "legalLinks", title: "Legal links", type: "array", group: "navigation", of: [defineArrayMember({ type: "cta" })], validation: (rule) => rule.max(4) }),
  ],
});

const homePage = defineType({
  name: "homePage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({ name: "internalTitle", title: "Internal title", type: "string", ...required() }),
    defineField({ name: "pageSeo", title: "Page SEO override", type: "seo" }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineArrayMember({ type: "heroSection" }),
        defineArrayMember({ type: "aboutSection" }),
        defineArrayMember({ type: "servicesSection" }),
        defineArrayMember({ type: "projectsSection" }),
        defineArrayMember({ type: "testimonialsSection" }),
        defineArrayMember({ type: "faqSection" }),
        defineArrayMember({ type: "contactSection" }),
      ],
      validation: (rule) => rule.max(7),
    }),
  ],
});

export const schemaTypes = [
  siteSettings,
  homePage,
  service,
  project,
  testimonial,
  faq,
  seo,
  cta,
  imageWithAlt,
  navigationItem,
  officeLocation,
  socialLink,
  statistic,
  portableText,
  heroSection,
  aboutSection,
  servicesSection,
  projectsSection,
  testimonialsSection,
  faqSection,
  contactSection,
];
