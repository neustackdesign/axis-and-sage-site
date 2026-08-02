import { defineLocations, type PresentationPluginOptions } from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  mainDocuments: [
    { route: "/", filter: `_type == "homePage"` },
    { route: "/work/:slug", filter: `_type == "project" && slug.current == $slug` },
  ],
  locations: {
    homePage: defineLocations({
      message: "Homepage content appears across the public homepage.",
      tone: "positive",
    }),
    siteSettings: defineLocations({
      message: "Site settings are used across the entire site.",
      tone: "caution",
    }),
    service: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Service", href: "/#services" }],
      }),
    }),
    project: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || "Project", href: `/work/${doc?.slug}` },
          { title: "Featured work", href: "/#our-work" },
        ],
      }),
    }),
    testimonial: defineLocations({
      message: "Testimonials appear when approved on project or homepage content.",
      tone: "caution",
    }),
    faq: defineLocations({
      message: "FAQs appear on the homepage when their display state is enabled.",
      tone: "positive",
    }),
  },
};
