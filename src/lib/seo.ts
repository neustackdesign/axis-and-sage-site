import { contact } from "@/content/site";
import { people, type Person } from "@/content/people";
import type { ToolMeta } from "@/content/library";
import { siteOrigin } from "./metadata";

const abs = (path: string) => new URL(path, siteOrigin()).toString();
const orgId = () => `${abs("/")}#organization`;

/** Organization / ProfessionalService, on every page. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": orgId(),
    name: "Axis & Sage Advisory",
    legalName: contact.legalName,
    url: abs("/"),
    logo: abs("/icons/axis-sage-dark.png"),
    email: contact.email,
    description: "Advisory for Africa and the GCC. We get investors, partners, teams and customers to act, by designing the terms and the moment. We call it Conversion Design.",
    address: { "@type": "PostalAddress", addressLocality: "Masdar City Free Zone, Abu Dhabi", addressCountry: "AE" },
    areaServed: ["Africa", "Nigeria", "United Arab Emirates", "Saudi Arabia", "Gulf Cooperation Council"],
    founder: people.map((p) => ({ "@type": "Person", name: p.name, url: abs(`/people/${p.slug}`) })),
    ...(contact.companyLinkedIn ? { sameAs: [contact.companyLinkedIn] } : {}),
  };
}

export function personLd(p: Person) {
  const sameAs = p.links.map((l) => l.href).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.title.replace(/\s*\[.*?\]\s*/g, "").replace(/&\s*$/, "").trim() || undefined,
    description: p.line,
    url: abs(`/people/${p.slug}`),
    worksFor: { "@id": orgId() },
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function articleLd({ headline, description, path, date, authors }: { headline: string; description: string; path: string; date: string; authors?: { name: string; path: string }[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: abs(path),
    mainEntityOfPage: abs(path),
    datePublished: date,
    dateModified: date,
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
