import type { StructureResolver } from "sanity/structure";
import { SINGLETONS, sitePageId } from "./schemaTypes/v2/documents";
import { sitePageKeys } from "./schemaTypes/v2/vocab";

const pageTitles: Record<string, string> = {
  engagements: "Engagements and pricing", work: "Work", people: "People", library: "Library",
  contact: "Contact", newsletter: "Newsletter", thankYou: "Thank you", notFound: "Page not found",
};

/**
 * AXIS & SAGE desk. Singletons open straight into their one document. Legacy v1 documents sit in their own,
 * clearly labelled, read-only section: the new site never reads them.
 */
export const structure: StructureResolver = (S) => {
  const singleton = (title: string, type: string, id: string) =>
    S.listItem().title(title).id(id).child(S.document().schemaType(type).documentId(id).title(title));
  return S.list()
    .title("AXIS & SAGE")
    .items([
      singleton("Site settings", "companySettings", SINGLETONS.companySettings),
      singleton("Homepage", "homePageV2", SINGLETONS.homePageV2),
      singleton("Conversion Design", "conversionMethod", SINGLETONS.conversionMethod),
      S.listItem().title("Pages").id("pages").child(
        S.list().title("Pages").items(sitePageKeys.map((k) => singleton(pageTitles[k] || k, "sitePage", sitePageId(k)))),
      ),
      S.divider(),
      S.documentTypeListItem("person").title("People"),
      S.documentTypeListItem("practice").title("Practices"),
      S.documentTypeListItem("workItem").title("Work"),
      S.documentTypeListItem("testimonialQuote").title("Testimonials"),
      S.documentTypeListItem("engagement").title("Engagements"),
      S.documentTypeListItem("faqItem").title("FAQs"),
      S.documentTypeListItem("libraryItem").title("Library"),
      S.documentTypeListItem("toolContent").title("Tools"),
      S.documentTypeListItem("legalPage").title("Legal"),
      S.divider(),
      S.listItem().title("Legacy v1 (read-only, not used by the site)").id("legacy").child(
        S.list().title("Legacy v1").items([
          S.listItem().title("Old homepage").id("legacyHome").child(S.documentList().title("Old homepage").filter('_type == "homePage"')),
          S.listItem().title("Old site settings").id("legacySettings").child(S.documentList().title("Old site settings").filter('_type == "siteSettings"')),
          S.documentTypeListItem("service").title("Old services"),
          S.documentTypeListItem("project").title("Old projects"),
          S.documentTypeListItem("testimonial").title("Old testimonials"),
          S.documentTypeListItem("faq").title("Old FAQs"),
        ]),
      ),
    ]);
};
