export type Practice = {
  slug: string;
  label: string;
  eyebrow: string;
  h1: string;
  sub: string;
  ledBy?: string;
  ledByPeople?: string[];
  whenToCall?: string[];
  whatWeDo?: string[];
  howItWorks?: string[];
  connects?: string;
  proof: string[];
  proofNote?: string;
  whenItFits?: string;
  tools: string[];
};

export const practices: Practice[] = [
  {
    slug: "strategy-and-investment",
    label: "Strategy & Investment",
    eyebrow: "WHAT WE DO · STRATEGY & INVESTMENT",
    h1: "Get the terms right.",
    sub: "The structure, incentives and deals that decide whether investors, partners and teams want to act.",
    ledBy: "Ifeanyi Monyei",
    ledByPeople: ["ifeanyi-monyei"],
    whenToCall: [
      "You're raising and investors stall after the first meeting.",
      "You've merged or restructured and teams still work the old way.",
      "Managers escalate everything because nobody knows their limits.",
      "Your share scheme isn't keeping the people you need.",
      "A partner deal is agreed in principle and stuck in drafting.",
    ],
    whatWeDo: [
      "Corporate and growth strategy",
      "Market entry across Africa and the GCC",
      "Operating model and organisation design",
      "Governance and delegation of authority",
      "Executive and employee incentives, including share schemes",
      "Investment readiness and transaction structuring support",
      "Merger design and integration",
      "Partnership and joint-venture terms",
    ],
    connects: "Terms decide whether people want to act. Product & Technology and Brand & Market make sure they can.",
    proof: ["gv-solutions", "venture-garden-group", "national-social-investment-programme"],
    tools: ["delegation-of-authority-builder", "esop-calculator", "investor-readiness-score"],
  },
  {
    slug: "product-and-technology",
    label: "Product & Technology",
    eyebrow: "WHAT WE DO · PRODUCT & TECHNOLOGY",
    h1: "Make the moment clear.",
    sub: "The products, flows and systems where customers pay, users sign up and teams do the work.",
    ledBy: "Tomiwa Ogunmodede",
    ledByPeople: ["tomiwa-ogunmodede"],
    whenToCall: [
      "People start sign-up and don't finish.",
      "Customers trust you until the payment screen.",
      "Your teams work around the system instead of in it.",
      "You're launching a product and need it right the first time.",
      "You want AI in a workflow without losing control of the output.",
    ],
    whatWeDo: [
      "Product strategy",
      "Service and experience design",
      "Digital platforms and MVPs",
      "Operational software (orders, payments, inventory, approvals)",
      "AI-assisted workflows with human review",
      "Design systems",
      "Build and implementation support",
    ],
    connects: "Moments decide whether people can act. They only work when the terms behind them do.",
    proof: ["farmcrowdy", "mular", "kolibri"],
    tools: ["conversion-scorecard", "conversion-value-calculator"],
  },
  {
    slug: "brand-and-market",
    label: "Brand & Market",
    eyebrow: "WHAT WE DO · BRAND & MARKET",
    h1: "Say it so they act.",
    sub: "The positioning, identity and go-to-market that tell customers, partners and investors why to act, and why now.",
    ledBy: "both founders",
    ledByPeople: ["ifeanyi-monyei", "tomiwa-ogunmodede"],
    whenToCall: [
      "Your market doesn't understand what you've become.",
      "You're entering Nigeria, the UAE or Saudi Arabia and the story doesn't travel.",
      "Investors like the numbers and forget the company.",
      "You're convening investors or partners and need them in the room and committed.",
      "Your website gets visits and no enquiries.",
    ],
    whatWeDo: [
      "Positioning and proposition",
      "Identity systems and packaging",
      "Go-to-market and launch",
      "Investor and stakeholder narrative",
      "Convenings and summits",
      "Websites with tools that qualify buyers",
    ],
    connects: "The promise sits across both halves. It sets the terms people expect and the moment they meet.",
    proof: ["nature-roots", "uganda-investor-summit", "oui-life"],
    tools: ["pitch-deck-outline", "conversion-scorecard"],
  },
  {
    slug: "embedded-leadership",
    label: "Embedded leadership",
    eyebrow: "WHAT WE DO · EMBEDDED LEADERSHIP",
    h1: "A principal in the seat.",
    sub: "When the fix needs someone who owns it, one of us takes a named role (COO, head of product or strategy lead) for a fixed term.",
    howItWorks: ["A named role", "Defined hours", "A fixed term, reviewed every quarter", "Contracted through Axis & Sage"],
    proof: ["gv-solutions"],
    proofNote: "GV Solutions, where Ifeanyi Monyei has been fractional COO since August 2026. Her remit covers business operations, the group's interfaces across finance, legal, brand, technology and data, delivery oversight and team performance.",
    whenItFits: "You need operating ownership now, and a permanent hire is the wrong answer or too slow.",
    tools: [],
  },
];

export const practiceBySlug = (slug: string) => practices.find((p) => p.slug === slug);
