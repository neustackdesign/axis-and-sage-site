import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Axis & Sage content")
    .items([
      S.listItem().title("Site settings").child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.listItem().title("Homepage").child(S.document().schemaType("homePage").documentId("homePage")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("service").title("Services"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("faq").title("FAQs"),
    ]);
