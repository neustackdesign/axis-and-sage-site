import type { GlyphName } from "@/lib/glyphs";

export type ToolMeta = {
  slug: string;
  title: string;
  line: string;
  kind: string;
  badge: string;
  glyph: GlyphName;
  cta: string;
};

export const tools: ToolMeta[] = [
  { slug: "conversion-scorecard", title: "Conversion Scorecard", line: "Who isn't acting, and is it the terms or the moment? Six minutes.", kind: "SCORECARD · 6 MIN", badge: "FREE", glyph: "moment", cta: "Take the Scorecard" },
  { slug: "conversion-value-calculator", title: "What's a lift worth?", line: "Put a number on moving the needle, for customers, investors or your team.", kind: "CALCULATOR", badge: "NGN · USD · AED", glyph: "money", cta: "Open the calculator" },
  { slug: "delegation-of-authority-builder", title: "Delegation of Authority Builder", line: "Who can approve what, up to which limit. Download the matrix.", kind: "BUILDER", badge: "FREE", glyph: "document", cta: "Build the matrix" },
  { slug: "esop-calculator", title: "ESOP & Share Pool Calculator", line: "Pool size, dilution, vesting and what a grant is worth.", kind: "CALCULATOR", badge: "FREE", glyph: "terms", cta: "Open the calculator" },
  { slug: "investor-readiness-score", title: "Investor Readiness Score", line: "Twenty-five checks investors will run on you. See your gaps first.", kind: "CHECKLIST · 25 CHECKS", badge: "FREE", glyph: "investors", cta: "Check your readiness" },
  { slug: "pitch-deck-outline", title: "Pitch Deck Outline", line: "Answer twelve questions and get a twelve-slide outline.", kind: "OUTLINE · 12 QUESTIONS", badge: "FREE", glyph: "screen", cta: "Start the outline" },
];

export const toolBySlug = (slug: string) => tools.find((t) => t.slug === slug);

export const templates = [
  { title: "Delegation of authority matrix", format: ".xlsx" },
  { title: "Board charter", format: ".docx" },
  { title: "ESOP term sheet", format: ".docx" },
  { title: "Investor data room index", format: ".xlsx" },
  { title: "Pitch deck template", format: "slides" },
];

export type Guide = { slug: string; title: string; category: string; published: boolean };

export const guides: Guide[] = [
  { slug: "what-the-conversion-diagnostic-fee-pays-for", title: "What the Conversion Diagnostic fee pays for", category: "ENGAGEMENTS", published: true },
  { slug: "delegation-of-authority-template", title: "Delegation of authority: a template for growing groups", category: "GOVERNANCE", published: false },
  { slug: "designing-an-esop-in-nigeria", title: "Designing an ESOP in Nigeria that keeps the people you need", category: "INCENTIVES", published: false },
  { slug: "investor-readiness-checklist", title: "The investor readiness checklist African founders get asked for", category: "RAISING", published: false },
  { slug: "pitch-deck-guide-africa-gcc", title: "The pitch deck guide for founders raising across Africa and the GCC", category: "RAISING", published: false },
  { slug: "why-customers-stop-at-the-payment-screen", title: "Why customers stop at the payment screen", category: "MOMENTS", published: false },
];

export const guideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
