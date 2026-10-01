// Page titles and descriptions from Spec B (reference/briefs/05-seo-titles.md). `og` is the headline on the page's
// Open Graph image: the title without the brand, which the image already carries.

export type PageTitle = { title: string; description?: string; og: string };

export const pageTitles = {
  home: { title: "Axis & Sage Advisory | Conversion Design for Africa and the GCC", description: "We get the people your business depends on to act: investors, partners, teams and customers. Strategy, product and brand advisory from Abu Dhabi, Dubai and Lagos.", og: "Conversion Design for Africa and the GCC" },
  conversionDesign: { title: "Conversion Design: start from the action | Axis & Sage", description: "How we get investors, partners, teams and customers to act: name the action, find what's in the way in the terms or the moment, fix it, and measure what moved.", og: "Conversion Design: start from the action" },
  engagements: { title: "Engagements and pricing | Axis & Sage Advisory", description: "Start with a free Scorecard or a fixed-fee Conversion Diagnostic: ten working days, one action, a price agreed before we start.", og: "Engagements and pricing" },
  embeddedLeadership: { title: "Fractional COO and embedded leadership | Axis & Sage", description: "A principal in a named role for a fixed term when the fix needs someone who owns it.", og: "Fractional COO and embedded leadership" },
  work: { title: "Work: who needed to act, and what moved | Axis & Sage", og: "Work: who needed to act, and what moved" },
  people: { title: "Ifeanyi Monyei and Tomiwa Ogunmodede | Axis & Sage Advisory", og: "Ifeanyi Monyei and Tomiwa Ogunmodede" },
} satisfies Record<string, PageTitle>;

export const practiceMeta: Record<string, PageTitle> = {
  "strategy-and-investment": { title: "Strategy and investment advisory in Africa and the GCC | Axis & Sage", description: "Governance, delegation of authority, incentives and share schemes, investment readiness, mergers and market entry.", og: "Strategy and investment advisory in Africa and the GCC" },
  "product-and-technology": { title: "Product and technology advisory | Axis & Sage", description: "Product strategy, platforms and operational software designed around the moment customers and teams act.", og: "Product and technology advisory" },
  "brand-and-market": { title: "Positioning, brand and go-to-market | Axis & Sage", description: "Positioning, identity, investor narrative and convenings that get customers, partners and investors to act.", og: "Positioning, brand and go-to-market" },
};

/** Tools: the tool's name plus the phrase people search for. */
export const toolSearchPhrase: Record<string, string> = {
  "conversion-scorecard": "Conversion Scorecard (free 6-minute self-assessment)",
  "conversion-value-calculator": "What's a lift worth? Conversion value calculator (free)",
  "delegation-of-authority-builder": "Delegation of Authority Matrix Builder (free template)",
  "esop-calculator": "ESOP & Share Pool Calculator (free dilution and vesting model)",
  "investor-readiness-score": "Investor Readiness Score (free 25-point checklist)",
  "pitch-deck-outline": "Pitch Deck Outline (free 12-slide template)",
};
export const toolTitle = (slug: string, name: string) => `${toolSearchPhrase[slug] || name} | Axis & Sage`;
