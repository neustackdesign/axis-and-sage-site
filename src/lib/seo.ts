import type { Person, SiteSettings, ToolMeta } from "@/lib/content/types";
import { siteOrigin } from "./metadata";

const abs = (path: string) => new URL(path, siteOrigin()).toString();
const orgId = () => `${abs("/")}#organization`;

/** Organization / ProfessionalService, on every page. */
export function organizationLd(s: SiteSettings, people: Person[]) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId(),
    name: s.companyName,
    legalName: s.legalName,
    url: abs("/"),
    logo: abs("/icons/axis-sage-dark.png"),
    email: s.contactEmail,
    description: s.defaultSeo.description,
    address: { "@type": "PostalAddress", addressLocality: "Masdar City Free Zone, Abu Dhabi", addressCountry: "AE" },
    areaServed: ["Africa", "Nigeria", "United Arab Emirates", "Saudi Arabia", "Gulf Cooperation Council"],
    founder: people.map((p) => ({ "@type": "Person", name: p.name, url: abs(`/people/${p.slug}`) })),
    ...(s.socialLinks.length ? { sameAs: s.socialLinks.map((l) => l.href) } : {}),
  };
}

export function personLd(p: Person) {
  const sameAs = p.links.map((l) => l.href).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: `${p.title}, ${p.practice}`,
    description: p.line,
    url: abs(`/people/${p.slug}`),
    worksFor: { "@id": orgId() },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function articleLd({ headline, description, path, date, modified, authors }: { headline: string; description: string; path: string; date: string; modified?: string; authors?: { name: string; path: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    datePublished: date,
    dateModified: modified ?? date,
    author: authors?.length ? authors.map((a) => ({ "@type": "Person", name: a.name, url: abs(a.path) })) : { "@id": orgId() },
    publisher: { "@id": orgId() },
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  const items = [{ name: "Home", path: "/" }, ...trail];
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })) };
}

export function webApplicationLd(tool: ToolMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    description: tool.line,
    url: abs(`/tools/${tool.slug}`),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
    provider: { "@id": orgId() },
  };
}
