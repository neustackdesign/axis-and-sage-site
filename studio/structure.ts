import type { StructureResolver } from "sanity/structure";
import { SINGLETONS, sitePageId } from "./schemaTypes/v2/documents";
import { sitePageKeys } from "./schemaTypes/v2/vocab";

const pageTitles: Record<string, string> = {
  engagements: "Engagements and pricing", work: "Work", people: "People", library: "Library",
  contact: "Contact", newsletter: "Newsletter", thankYou: "Thank you", notFound: "Page not found",
};

/** Active Axis & Sage content only. Legacy documents remain archived in Content Lake, not in the editing desk. */
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
      S.documentTypeListItem("legalPage").title("Legal")
    ]);
};
