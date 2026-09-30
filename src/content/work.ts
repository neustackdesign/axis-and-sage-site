// Work by Axis & Sage and its founders. Figures are used exactly as supplied; do not add numbers without a source line.

export const roles = ["FOUNDED", "RAN", "BUILT", "ADVISED", "EMBEDDED"] as const;
export type Role = (typeof roles)[number];

export const actions = [
  { key: "investors-commit", label: "Investors commit", glyph: "investors" },
  { key: "partners-sign", label: "Partners sign", glyph: "partners" },
  { key: "teams-execute", label: "Teams execute", glyph: "team" },
  { key: "customers-buy", label: "Customers buy", glyph: "customers" },
  { key: "users-adopt", label: "Users adopt", glyph: "users" },
] as const;
export type ActionKey = (typeof actions)[number]["key"];

export const actionLabel = (key: ActionKey) => actions.find((a) => a.key === key)!.label;

export type WorkItem = {
  slug: string;
  name: string;
  sector: string;
  roles: Role[];
  actions: ActionKey[];
  line: string;
  hasCase?: boolean;
};

export const workIndex: WorkItem[] = [
  { slug: "gv-solutions", name: "GV Solutions", sector: "Advisory and technology services", roles: ["EMBEDDED"], actions: ["teams-execute"], line: "Two firms merged into one. Axis & Sage holds the COO seat.", hasCase: true },
  { slug: "venture-garden-group", name: "Venture Garden Group", sector: "Technology group", roles: ["RAN"], actions: ["teams-execute"], line: "Group governance, delegation of authority, board pay, CEO reward and a redesigned share scheme.", hasCase: true },
  { slug: "national-social-investment-programme", name: "National Social Investment Programme", sector: "Public programme", roles: ["ADVISED"], actions: ["users-adopt"], line: "Consulting lead within the group across four national social investment programmes." },
  { slug: "galaxy-backbone-1gov", name: "Galaxy Backbone · 1Gov.ng", sector: "Government technology", roles: ["ADVISED"], actions: ["users-adopt"], line: "Led the ease-of-doing-business workstream and the 1Gov.ng single-window vision." },
  { slug: "farmcrowdy", name: "Farmcrowdy", sector: "Agriculture investment", roles: ["BUILT", "RAN"], actions: ["customers-buy"], line: "First-time mobile sponsorship conversion from 18% to 60%.", hasCase: true },
  { slug: "mular", name: "Mular", sector: "Payments", roles: ["FOUNDED"], actions: ["customers-buy"], line: "$2.1M+ processed across 19K+ transactions.", hasCase: true },
  { slug: "earlybean", name: "Earlybean", sector: "Family finance", roles: ["FOUNDED"], actions: ["users-adopt"], line: "3,416 active users; Techstars '23; Web Summit Qatar PITCH top three." },
  { slug: "lion-hospitality-partners", name: "Lion Hospitality Partners", sector: "Hospitality, 14 venues", roles: ["RAN"], actions: ["teams-execute"], line: "31,324 paid orders and ₦1.66bn (about US$1.25M) processed in five months across the order, payment and kitchen systems." },
  { slug: "kolibri", name: "Kolibri · Learning Equality", sector: "Education", roles: ["BUILT"], actions: ["users-adopt"], line: "85% better discoverability and 60% fewer failed imports in usability testing." },
  { slug: "adpipe", name: "AdPipe", sector: "Enterprise video", roles: ["BUILT"], actions: ["customers-buy"], line: "AI-assisted creation workflows, designed during the period leading into AdPipe's first announced $3M seed." },
  { slug: "nature-roots", name: "Nature Roots", sector: "Agri-commodities", roles: ["ADVISED"], actions: ["partners-sign", "investors-commit"], line: "Brand, packaging and identity that took the company into retail channels.", hasCase: true },
  { slug: "uganda-investor-summit", name: "Uganda Investor Summit", sector: "Investment convening", roles: ["ADVISED"], actions: ["investors-commit"], line: "Strategy, investor narrative and identity for a national investment conference.", hasCase: true },
  { slug: "lasric", name: "LASRIC", sector: "Public innovation", roles: ["ADVISED"], actions: ["partners-sign"], line: "An identity that helped a public innovation council speak to government and private partners." },
  { slug: "africa-agrighg-summit", name: "Africa AgriGHG Innovation and Investment Summit", sector: "Investment convening", roles: ["ADVISED"], actions: ["investors-commit"], line: "Summit platform designed with Qinisa Initiative." },
  { slug: "university-innovation-platform", name: "University innovation platform", sector: "Public innovation", roles: ["BUILT"], actions: ["partners-sign"], line: "Puts university innovations in front of industry, with an IP-protection framework. [Agency name]" },
  { slug: "oui-life", name: "OUI Life", sector: "Beauty manufacturing", roles: ["BUILT"], actions: ["customers-buy"], line: "Rebuilt site with engagement routes and a launch-economics calculator; a substantial increase in qualified leads." },
];

export const workBySlug = (slug: string) => workIndex.find((w) => w.slug === slug);

export type Chip = { label: string; kind: "role" | "conversion" };
const role = (label: Role): Chip => ({ label, kind: "role" });
const conv = (label: string): Chip => ({ label, kind: "conversion" });

export type SelectedCase = {
  slug: string;
  name: string;
  chips: Chip[];
  needed: string;
  changed: string;
  moved: string;
};

export const selectedWork: SelectedCase[] = [
  { slug: "gv-solutions", name: "GV Solutions", chips: [role("EMBEDDED"), conv("TEAMS EXECUTE")], needed: "Two firms to work as one company.", changed: "Merger design, operating model, and group interfaces for finance, legal, brand and technology.", moved: "GV Solutions formed. Axis & Sage holds the COO seat." },
  { slug: "venture-garden-group", name: "Venture Garden Group", chips: [role("RAN"), conv("TEAMS EXECUTE")], needed: "Executives across a pan-African group to decide at the right level and be rewarded for the right things.", changed: "Governance framework and delegation of authority, board pay, CEO reward, employee share scheme.", moved: "One written way of deciding across the group." },
  { slug: "farmcrowdy", name: "Farmcrowdy", chips: [role("BUILT"), role("RAN"), conv("CUSTOMERS BUY")], needed: "City professionals to sponsor farms they would never visit.", changed: "The first-time mobile sponsorship flow, and farm updates in text, photo and video from planting to harvest.", moved: "First-time mobile sponsorship conversion from 18% to 60%." },
  { slug: "mular", name: "Mular", chips: [role("FOUNDED"), conv("CUSTOMERS BUY")], needed: "Senders and businesses to trust a stablecoin-to-Naira transfer with real money.", changed: "Rates and fees shown before commitment; clear settlement states and recovery.", moved: "$2.1M+ processed, 5,400+ users, 80+ business accounts." },
  { slug: "nature-roots", name: "Nature Roots", chips: [role("ADVISED"), conv("PARTNERS SIGN"), conv("INVESTORS COMMIT")], needed: "Retail buyers and investors to trust a young organic-commodities brand.", changed: "Brand strategy, packaging system and digital identity.", moved: "Entry into retail channels; the founder credits the work with investor confidence and new partnerships." },
  { slug: "uganda-investor-summit", name: "Uganda Investor Summit", chips: [role("ADVISED"), conv("INVESTORS COMMIT")], needed: "International investors and policymakers to see Uganda as a regional capital hub.", changed: "Event strategy, stakeholder mapping, investor narrative and identity.", moved: "A narrative that, in the client's words, resonated with local policymakers and international investors." },
];

export type StatTileData = { numeral: string; label: string; tag: string; source?: string };

export const homeStats: StatTileData[] = [
  { numeral: "18% → 60%", label: "First-time mobile sponsorship conversion", tag: "FARMCROWDY · BUILT" },
  { numeral: "$1.86M → $9.14M", label: "Tracked sponsorship volume during the product and growth period", tag: "FARMCROWDY · RAN" },
  { numeral: "$2.1M+", label: "Processed across 19K+ transactions in live production", tag: "MULAR · FOUNDED" },
  { numeral: "60%", label: "Fewer failed content imports in usability testing", tag: "KOLIBRI · BUILT" },
  { numeral: "3,416", label: "Active users; Techstars '23; Web Summit Qatar PITCH top three", tag: "EARLYBEAN · FOUNDED" },
  { numeral: "2 → 1", label: "iGate Advisory and Garden Ventures merged into GV Solutions", tag: "GV SOLUTIONS · EMBEDDED" },
  { numeral: "Group-wide", label: "Governance, delegation of authority, board pay, CEO reward, employee shares", tag: "VENTURE GARDEN GROUP · RAN" },
];

export const homeStatsSource = "SOURCES: COMPANY RECORDS AND REPORTING · FARMCROWDY CONVERSION FROM INTERNAL FUNNEL TRACKING · KOLIBRI FROM USABILITY TESTING";

export const logoStrip = [
  "Venture Garden Group",
  "GV Solutions",
  "Farmcrowdy",
  "Learning Equality · Kolibri",
  "Mular",
  "Earlybean",
  "Nature Roots",
  "LASRIC",
  "Uganda Investor Summit",
  "National Social Investment Programme",
];

export type Testimonial = { quote: string; name: string; title: string; company: string; portrait?: string };

export const testimonials: Record<string, Testimonial> = {
  kunmi: {
    quote: "Axis & Sage's work was quick, high quality, and completely transformed our brand, making it both beautiful and highly functional. The team was professional and communicative even under crushing deadlines. We couldn't be happier with the result — it gave our investors confidence and unlocked new partnerships.",
    name: "Kunmi Demuren", title: "[Title]", company: "Nature Roots",
  },
  bunmi: {
    quote: "Axis & Sage has been a thought partner in the truest sense. They see beyond design into the heart of business strategy — aligning brand, structure, and execution seamlessly.",
    name: "Bunmi Akinyemiju", title: "Group CEO", company: "Venture Garden Group", portrait: "/images/axis-sage/portraits/portrait-1.jpg",
  },
  temi: {
    quote: "Their frameworks for brand and product positioning have consistently given our portfolio companies the edge in competitive markets.",
    name: "Temi Olateru", title: "[Title]", company: "[Firm]", portrait: "/images/axis-sage/portraits/portrait-6.jpg",
  },
  onyeka: {
    quote: "Tomiwa helped sharpen our identity. The clarity, speed, and creativity meant that our brand matched our ambitions and spoke to investors, farmers, and customers alike.",
    name: "Onyeka Akumah", title: "Founder", company: "Farmcrowdy", portrait: "/images/axis-sage/portraits/portrait-2.png",
  },
};

export const homeTestimonials = [testimonials.kunmi, testimonials.bunmi, testimonials.temi];

// Case pages. Farmcrowdy carries the full template; the others use only the copy supplied for the home cards.
export type CaseChange = { tag: "TERMS" | "MOMENT"; text: string };
export type CaseStat = { numeral: string; label: string; source?: string };
export type CasePage = {
  slug: string;
  name: string;
  sector: string;
  years?: string;
  chips: Chip[];
  ledBy?: string;
  intro?: string;
  needed: string;
  inTheWay?: string[];
  changes?: CaseChange[];
  changedSummary?: string;
  moved: string;
  stats?: CaseStat[];
  quote?: Testimonial;
  tools: string[];
  artifact?: "farmcrowdy" | "mular" | "governance" | "merger";
};

export const casePages: CasePage[] = [
  {
    slug: "farmcrowdy",
    name: "Farmcrowdy",
    sector: "Agriculture investment",
    years: "2017–2020",
    chips: [role("BUILT"), role("RAN"), conv("CUSTOMERS BUY")],
    ledBy: "Tomiwa Ogunmodede",
    intro: "Nigeria's first digital agriculture platform, where people in cities sponsor farms and share the harvest.",
    needed: "FIRST-TIME VISITORS TO SPONSOR A FARM ON THEIR PHONE.",
    inTheWay: [
      "Sponsors would never see the farm.",
      "The first-time mobile flow asked for commitment before it built trust.",
      "Nothing showed a sponsor their money at work.",
    ],
    changes: [
      { tag: "MOMENT", text: "Redesigned the first-time mobile sponsorship flow." },
      { tag: "MOMENT", text: "Farm updates in text, photo and video, from planting to harvest." },
      { tag: "MOMENT", text: "The company's first design system, 300+ components, across sponsorship, tracking and farmer tools." },
      { tag: "TERMS", text: "Then led product and growth as Head of Products and Program Management." },
    ],
    moved: "First-time mobile sponsorship conversion from 18% to 60%.",
    stats: [
      { numeral: "18% → 60%", label: "First-time mobile sponsorship conversion", source: "INTERNAL FUNNEL TRACKING" },
      { numeral: "$1.86M → $9.14M", label: "Tracked sponsorship volume", source: "DURING THE WIDER PRODUCT AND GROWTH PERIOD" },
      { numeral: "45,000+", label: "Customers", source: "Company records" },
    ],
    quote: testimonials.onyeka,
    tools: ["conversion-scorecard", "conversion-value-calculator"],
    artifact: "farmcrowdy",
  },
  {
    slug: "gv-solutions",
    name: "GV Solutions",
    sector: "Advisory and technology services",
    chips: [role("EMBEDDED"), conv("TEAMS EXECUTE")],
    ledBy: "Ifeanyi Monyei",
    needed: "TWO FIRMS TO WORK AS ONE COMPANY.",
    changedSummary: "Merger design, operating model, and group interfaces for finance, legal, brand and technology.",
    moved: "GV Solutions formed. Axis & Sage holds the COO seat.",
    stats: [{ numeral: "2 → 1", label: "iGate Advisory and Garden Ventures merged into GV Solutions", source: "COMPANY RECORDS" }],
    tools: ["delegation-of-authority-builder", "esop-calculator"],
    artifact: "merger",
  },
  {
    slug: "venture-garden-group",
    name: "Venture Garden Group",
    sector: "Technology group",
    chips: [role("RAN"), conv("TEAMS EXECUTE")],
    ledBy: "Ifeanyi Monyei",
    needed: "EXECUTIVES ACROSS A PAN-AFRICAN GROUP TO DECIDE AT THE RIGHT LEVEL AND BE REWARDED FOR THE RIGHT THINGS.",
    changedSummary: "Governance framework and delegation of authority, board pay, CEO reward, employee share scheme.",
    moved: "One written way of deciding across the group.",
    quote: testimonials.bunmi,
    tools: ["delegation-of-authority-builder", "esop-calculator"],
    artifact: "governance",
  },
  {
    slug: "mular",
    name: "Mular",
    sector: "Payments",
    chips: [role("FOUNDED"), conv("CUSTOMERS BUY")],
    ledBy: "Tomiwa Ogunmodede",
    needed: "SENDERS AND BUSINESSES TO TRUST A STABLECOIN-TO-NAIRA TRANSFER WITH REAL MONEY.",
    changedSummary: "Rates and fees shown before commitment; clear settlement states and recovery.",
    moved: "$2.1M+ processed, 5,400+ users, 80+ business accounts.",
    stats: [{ numeral: "$2.1M+", label: "Processed across 19K+ transactions in live production", source: "COMPANY RECORDS" }],
    tools: ["conversion-scorecard", "conversion-value-calculator"],
    artifact: "mular",
  },
  {
    slug: "nature-roots",
    name: "Nature Roots",
    sector: "Agri-commodities",
    chips: [role("ADVISED"), conv("PARTNERS SIGN"), conv("INVESTORS COMMIT")],
    needed: "RETAIL BUYERS AND INVESTORS TO TRUST A YOUNG ORGANIC-COMMODITIES BRAND.",
    changedSummary: "Brand strategy, packaging system and digital identity.",
    moved: "Entry into retail channels; the founder credits the work with investor confidence and new partnerships.",
    quote: testimonials.kunmi,
    tools: ["pitch-deck-outline", "conversion-scorecard"],
  },
  {
    slug: "uganda-investor-summit",
    name: "Uganda Investor Summit",
    sector: "Investment convening",
    chips: [role("ADVISED"), conv("INVESTORS COMMIT")],
    needed: "INTERNATIONAL INVESTORS AND POLICYMAKERS TO SEE UGANDA AS A REGIONAL CAPITAL HUB.",
    changedSummary: "Event strategy, stakeholder mapping, investor narrative and identity.",
    moved: "A narrative that, in the client's words, resonated with local policymakers and international investors.",
    tools: ["pitch-deck-outline", "investor-readiness-score"],
  },
];

export const caseBySlug = (slug: string) => casePages.find((c) => c.slug === slug);
