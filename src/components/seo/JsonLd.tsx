import { breadcrumbLd } from "@/lib/seo";

/** Renders one or more JSON-LD objects. `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(Array.isArray(data) ? data : data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

/** BreadcrumbList for a page. Home is added automatically. */
export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return <JsonLd data={breadcrumbLd(trail)} />;
}
