// Prices are numbers with a currency. `amount: null` means not set yet: previews show "[price]" and the
// production build refuses to ship it (scripts/check-placeholders.mjs).
export type Price = { amount: number | null; currency: "USD" | "AED" | "NGN" };

export const prices = {
  diagnostic: { amount: null, currency: "USD" } as Price,
  investorReadinessSprint: { amount: null, currency: "USD" } as Price,
  portfolioReview: { amount: null, currency: "USD" } as Price,
  leadershipSession: { amount: null, currency: "USD" } as Price,
};

const symbols: Record<Price["currency"], string> = { USD: "US$", AED: "AED ", NGN: "₦" };

export function formatPrice(price: Price) {
  if (price.amount === null) return "[price]";
  if (price.amount === 0) return "Free";
  return `${symbols[price.currency]}${price.amount.toLocaleString("en-GB")}`;
}

export const fromPrice = (price: Price) => (price.amount === null || price.amount > 0 ? `From ${formatPrice(price)}` : formatPrice(price));

export type EngagementColumn = {
  name: string;
  recommended?: boolean;
  price: string;
  time: string;
  bring: string;
  weDo: string;
  youGet: string;
  cta: { label: string; href: string };
};

export const engagementRows = [
  { key: "price", label: "Price" },
  { key: "time", label: "Time" },
  { key: "bring", label: "You bring" },
  { key: "weDo", label: "We do" },
  { key: "youGet", label: "You get" },
] as const;

export const engagements: EngagementColumn[] = [
  {
    name: "Conversion Scorecard",
    price: "Free",
    time: "6 minutes",
    bring: "Six minutes",
    weDo: "Nothing yet. It's yours.",
    youGet: "Your Terms and Moments scores and the three blockers to fix first",
    cta: { label: "Take the Scorecard", href: "/tools/conversion-scorecard" },
  },
  {
    name: "Conversion Diagnostic",
    recommended: true,
    price: fromPrice(prices.diagnostic),
    time: "10 working days",
    bring: "One sentence: we need [who] to [do what] by [when]",
    weDo: "Interview the people who need to act, walk the path they take, read your numbers",
    youGet: "The baseline, what's in the way, the fixes worth making and a fixed quote",
    cta: { label: "Book a Diagnostic", href: "/contact?engagement=diagnostic#book" },
  },
  {
    name: "Conversion Programme",
    price: "Fixed fee, quoted after the Diagnostic",
    time: "4 to 12 weeks",
    bring: "The Diagnostic",
    weDo: "Fix what's in the way, in the strategy, the product or the brand, with your team",
    youGet: "The change built and running, and the new number",
    cta: { label: "Talk to us", href: "/contact?engagement=programme" },
  },
  {
    name: "Embedded leadership",
    price: "Monthly",
    time: "3 months minimum",
    bring: "A role to fill",
    weDo: "A principal takes a named role: COO, head of product or strategy lead",
    youGet: "Operating ownership without a permanent hire",
    cta: { label: "Talk to us", href: "/contact?engagement=embedded" },
  },
];

export const diagnosticCreditNote = "The Diagnostic fee is credited in full if you start a Programme within 30 days.";

export type Specialist = { name: string; price: string; time: string; intro: string; points?: string[]; body?: string };

export const specialistCards: Specialist[] = [
  {
    name: "Investor Readiness Sprint",
    price: fromPrice(prices.investorReadinessSprint),
    time: "3 weeks",
    intro: "For founders and CEOs raising. We cover both halves:",
    points: [
      "The terms: cap table, share scheme, data room, valuation logic.",
      "The moment: narrative, deck, investor list and process.",
    ],
  },
  {
    name: "Portfolio Review",
    price: fromPrice(prices.portfolioReview),
    time: "4 weeks",
    intro: "For investors and groups. The Diagnostic run across three companies, with one report for the board.",
  },
];

export const leadershipSession: Specialist = {
  name: "Leadership working session",
  price: fromPrice(prices.leadershipSession),
  time: "half a day",
  intro: "Your leadership team in one room, one sentence each. We leave you with the three actions that matter and what's in the way of each.",
};

export const diagnosticDays = [
  { when: "Day 1", what: "We agree the sentence and how we'll measure it." },
  { when: "Days 2–5", what: "We interview the people who need to act and the people who own the path." },
  { when: "Days 5–7", what: "We walk the path and read the numbers." },
  { when: "Days 8–9", what: "We tag every blocker (terms, moment or both) and draft the fixes and the quote." },
  { when: "Day 10", what: "Readout with your leadership team." },
];

export const diagnosticFeePays = "Ten working days of principal time, the interviews, the analysis, the report and a fixed quote for the fix. It's credited in full against a Programme started within 30 days.";

export const faqs = [
  { q: "What does Axis & Sage do?", a: "We get the people your business depends on to act: investors, partners, teams and customers. We find what's stopping them in the terms or the moment, and fix it in the strategy, the product or the brand." },
  { q: "Is Conversion Design the same as conversion rate optimisation?", a: "Conversion rate optimisation improves pages. We start earlier, with the structure, incentives and deal terms that decide whether people want to act. Then we design the product and the message that decide whether they can." },
  { q: "Who do you work with?", a: "Owners, CEOs and investors of groups and growing businesses; founders raising capital; and institutions running programmes. We work across Africa and the GCC." },
  { q: "How does an engagement start?", a: "With the Scorecard or a 30-minute call, then a fixed-fee Conversion Diagnostic. You know the price before we start." },
  { q: "Do you raise capital or place investments?", a: "No. We make the business and the proposition ready for investors, and you run the raise." },
  { q: "Who does the work?", a: "The founders lead every engagement. Specialists we've worked with join when the fix needs them, and they're named in the proposal." },
  { q: "Where are you based?", a: "We're registered in Masdar City Free Zone, Abu Dhabi, and the founders are in Dubai and Lagos. We work across Africa and the GCC, and in person when it helps." },
  { q: "How quickly do you reply?", a: "Within one working day, with a clear next step." },
];
