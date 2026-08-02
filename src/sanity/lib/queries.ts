import { defineQuery } from "next-sanity";
import { fallbackHome, fallbackSettings } from "@/content/fallback-data";
import { hasSanityConfig } from "./client";
import { sanityFetch } from "./live";
import type { HomePage, Project, SiteSettings } from "@/types/content";

export const HOME_QUERY = defineQuery(`
  *[_type == "homePage"][0] {
    title,
    seo,
    "hero": sections[_type == "heroSection" && enabled != false][0],
    "about": sections[_type == "aboutSection" && enabled != false][0],
    "services": sections[_type == "servicesSection" && enabled != false][0] {
      ...,
      services[]->
    },
    "projects": sections[_type == "projectsSection" && enabled != false][0] {
      ...,
      projects[]-> {
        ...,
        "testimonial": testimonial->
      }
    },
    "testimonials": sections[_type == "testimonialsSection" && enabled != false][0] {
      ...,
      testimonials[]->
    },
    "faqs": sections[_type == "faqSection" && enabled != false][0] {
      ...,
      faqs[]->
    },
    "contact": sections[_type == "contactSection" && enabled != false][0]
  }
`);

export const SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    ...,
    "navigation": primaryNavigation,
    "footerNavigation": footerNavigation
  }
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    "testimonial": testimonial->
  }
`);

export async function getHomePage(): Promise<HomePage> {
  if (!hasSanityConfig) return fallbackHome;
  const { data } = await sanityFetch({ query: HOME_QUERY, stega: false });
  return (data as HomePage | null) ?? fallbackHome;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!hasSanityConfig) return fallbackSettings;
  const { data } = await sanityFetch({ query: SETTINGS_QUERY, stega: false });
  return (data as SiteSettings | null) ?? fallbackSettings;
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!hasSanityConfig) {
    return fallbackHome.projects.items.find((project) => project.slug === slug) ?? null;
  }
  const { data } = await sanityFetch({ query: PROJECT_QUERY, params: { slug }, stega: false });
  return (data as Project | null) ?? null;
}

export async function getProjectSlugs(): Promise<string[]> {
  if (!hasSanityConfig) return fallbackHome.projects.items.map((project) => project.slug);
  const { data } = await sanityFetch({
    query: defineQuery(`*[_type == "project" && defined(slug.current)].slug.current`),
    perspective: "published",
    stega: false,
  });
  return (data as string[]) ?? [];
}
