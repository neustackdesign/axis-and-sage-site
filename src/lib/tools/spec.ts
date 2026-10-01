// Tool copy and defaults, from Spec A (reference/briefs/06-tools-spec.md). The logic lives in src/lib/tools.

/** Small line under every result. */
export const TOOL_DISCLAIMER = "An illustrative planning estimate, not financial, legal or tax advice.";

/* ---------- Formatting ---------- */

export const currencies = [
  { code: "NGN", symbol: "₦" },
  { code: "USD", symbol: "$" },
  { code: "AED", symbol: "AED " },
] as const;
export type CurrencyCode = (typeof currencies)[number]["code"];

const trim = (n: number) => n.toFixed(2).replace(/\.?0+$/, "");

/** On-screen money: en-GB digits, large values abbreviated (₦1.66bn, $2.1M). Exports carry full values. */
export function money(value: number, code: CurrencyCode, opts: { decimals?: number } = {}) {
  const symbol = currencies.find((c) => c.code === code)!.symbol;
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}${symbol}${trim(abs / 1e9)}bn`;
  if (abs >= 1e6) return `${sign}${symbol}${trim(abs / 1e6)}M`;
  const d = opts.decimals ?? 0;
  return `${sign}${symbol}${abs.toLocaleString("en-GB", { minimumFractionDigits: d, maximumFractionDigits: d })}`;
}

/** Whole numbers in en-GB format. */
export const count = (n: number, digits = 0) => n.toLocaleString("en-GB", { maximumFractionDigits: digits });

/* ---------- Tool 1 · Conversion Scorecard ---------- */

/** `label` is the menu choice; `who` the mid-sentence form; `whoCount` the form used after a number. */
export const scorecardWho = [
  { key: "investors", label: "Investors", who: "investors", whoCount: "investors", actions: ["commit to this round", "follow on", "move from first meeting to term sheet faster"] },
  { key: "partners", label: "Partners", who: "partners", whoCount: "partners", actions: ["sign", "renew", "commit more volume"] },
  { key: "our team", label: "Our team", who: "our team", whoCount: "people on our team", actions: ["work to a new structure or process", "hit the new plan", "adopt a new system"] },
  { key: "customers", label: "Customers", who: "customers", whoCount: "customers", actions: ["buy for the first time", "buy again", "switch to us", "pay on time"] },
  { key: "users", label: "Users or beneficiaries", who: "users or beneficiaries", whoCount: "users or beneficiaries", actions: ["sign up", "finish onboarding", "keep using it"] },
  { key: "other", label: "Something else", who: "", whoCount: "", actions: [] },
] as const;

/** Free-text answers ("Something else") are capped at 40 characters. */
export const SCORECARD_FREE_TEXT_MAX = 40;

export const scorecardWhen = ["this month", "this quarter", "this year", "no date yet"] as const;

export type Statement = { id: string; half: "terms" | "moments"; text: string; check: string };

export const scorecardStatements: Statement[] = [
  { id: "t1", half: "terms", text: "{Who} can see what's in it for them, in their words, in one sentence.", check: "Rewrite the proposition from their side: what {who} get, in their words." },
  { id: "t2", half: "terms", text: "What we ask of {who} holds up against what they're offered elsewhere: price, equity, pay, share of upside.", check: "Benchmark the ask against the real alternatives {who} have." },
  { id: "t3", half: "terms", text: "The risk {who} carry is clear, capped and fair.", check: "Map the risk {who} carry and where it can be shared or capped." },
  { id: "t4", half: "terms", text: "The people on our side who can say yes are named, and so are their limits.", check: "Write down who can approve what, up to which limit. The Delegation of Authority Builder is a start." },
  { id: "t5", half: "terms", text: "Our incentives reward the people who get {who} to {action}.", check: "Trace who is rewarded when {who} {action}, and who isn't." },
  { id: "m1", half: "moments", text: "{Who} can {action} in one sitting, without having to ask us a question.", check: "Walk the path yourself and count every question {who} must ask." },
  { id: "m2", half: "moments", text: "When they act, they know exactly what happens next.", check: "Design the confirmation and the next three steps they'll see." },
  { id: "m3", half: "moments", text: "Our people, product and materials tell {who} the same story.", check: "Put sales, product and materials on one story." },
  { id: "m4", half: "moments", text: "We can see where {who} drop off, step by step.", check: "Instrument each step so you can see the drop-off." },
  { id: "m5", half: "moments", text: "The ask reaches {who} when they're ready to decide.", check: "Move the ask to the moment they're ready: after proof, before doubt." },
];

export const scaleLabels = ["Not true", "Rarely", "Sometimes", "Mostly", "Fully true"];

export const scorecardRateQuestion = "Out of every 10 {who_count} who reach the point of deciding, how many {action} today?";
export const scorecardVolumeQuestion = "How many reach that point in a typical month?";

export const scorecardCaseFor: Record<string, string> = {
  investors: "uganda-investor-summit",
  partners: "nature-roots",
  "our team": "gv-solutions",
  customers: "farmcrowdy",
  // Kolibri has no case page yet; switch to it when it does.
  users: "mular",
  other: "farmcrowdy",
};

export const scorecardVerdicts = {
  terms: { headline: "It's the terms.", body: "{Who} can act easily. The question is whether they want to. The fix usually sits in strategy and investment: the offer, the structure, the incentives or who decides." },
  moment: { headline: "It's the moment.", body: "{Who} want what you offer, then lose the thread. The fix usually sits in product and brand: the flow, the message, the timing." },
  both: { headline: "It's both.", body: "Start with the terms. A clear moment can't rescue a weak offer." },
  reach: { headline: "It's reach, speed or proof.", body: "Your terms and moments hold up. Check how many {who} reach the decision, how long it takes, and what proof they see first." },
};

export const scorecardUnknown = { headline: "You can't see it yet.", body: "Measuring the action is step one, and it's the first thing a Diagnostic sets up." };

/* ---------- Tool 2 · What's a lift worth? ---------- */

export type LiftMode = "customers" | "investors" | "team";

export type LiftField = { key: "base" | "rate" | "value" | "lift" | "target"; label: string; kind: "count" | "pct" | "money" | "points"; min?: number; max?: number; hint?: string };

export const liftModes: { key: LiftMode; label: string; fields: LiftField[]; defaults: { base: number; rate: number; value: number; lift: number; target: number } }[] = [
  {
    key: "customers", label: "Customers",
    fields: [
      { key: "base", label: "People who reach the decision each month", kind: "count" },
      { key: "rate", label: "How many act today, %", kind: "pct" },
      { key: "value", label: "Value of each action", kind: "money" },
      { key: "lift", label: "Target lift in percentage points", kind: "points", min: 1, max: 30 },
    ],
    defaults: { base: 1000, rate: 10, value: 100, lift: 5, target: 15 },
  },
  {
    key: "investors", label: "Investors",
    fields: [
      { key: "base", label: "Investor conversations in your process", kind: "count" },
      { key: "rate", label: "% who commit today", kind: "pct" },
      { key: "value", label: "Average cheque", kind: "money" },
      { key: "lift", label: "Target lift in points", kind: "points", min: 1, max: 30 },
    ],
    defaults: { base: 40, rate: 5, value: 250000, lift: 5, target: 10 },
  },
  {
    key: "team", label: "Our team",
    fields: [
      { key: "base", label: "People who need to work the new way", kind: "count" },
      { key: "rate", label: "% who do today", kind: "pct" },
      { key: "target", label: "Target %", kind: "pct" },
      { key: "value", label: "Monthly value per person when they do", kind: "money", hint: "Hours saved × cost, or revenue they drive." },
    ],
    defaults: { base: 50, rate: 40, value: 500, lift: 50, target: 90 },
  },
];

export const liftPerPointCopy = "Every point of lift is worth {per_point} a month.";
export const liftBreakEvenCopy = "A Diagnostic pays for itself after {payback_actions} extra {actions}.";

/* ---------- Tool 3 · Delegation of Authority Builder ---------- */

export const doaLevels = ["Board", "Board committee", "Group CEO", "CEO / MD", "CFO", "Function head", "Manager"] as const;
export type DoaLevel = (typeof doaLevels)[number];
export const doaLevelNotes: Partial<Record<DoaLevel, string>> = { "Board committee": "Audit or remuneration", "Group CEO": "Groups only" };
/** In a group, the CEO / MD column is the subsidiary MD. */
export const doaSubsidiaryLabel = "Subsidiary MD";

export const doaAreas = [
  "Annual budget and plan",
  "Capital spend",
  "Unbudgeted spend",
  "Customer contracts",
  "Supplier contracts",
  "Hiring",
  "Pay and bonuses",
  "Pricing and discounts",
  "Write-offs and credit notes",
  "Borrowing and guarantees",
  "New products or markets",
  "Legal claims and settlements",
  "Related-party transactions",
  "Mergers, acquisitions and disposals",
  "Policies",
] as const;
export type DoaArea = (typeof doaAreas)[number];

/** Areas that take the revenue bands. */
export const doaMonetaryAreas: DoaArea[] = ["Capital spend", "Customer contracts", "Supplier contracts", "Write-offs and credit notes", "Legal claims and settlements"];
/** Unbudgeted spend takes the bands one level up. */
export const doaUnbudgetedArea: DoaArea = "Unbudgeted spend";

/** Monetary bands as a share of annual revenue R. The Board approves above the CEO / MD band. */
export const doaBands: { level: DoaLevel; share: number }[] = [
  { level: "Manager", share: 0.0005 },
  { level: "Function head", share: 0.0025 },
  { level: "CFO", share: 0.01 },
  { level: "CEO / MD", share: 0.05 },
];
/** In a group, the Group CEO approves above the subsidiary limit and up to this share of group revenue. */
export const doaGroupCeoShare = 0.05;

export const doaCodes = ["A", "R", "C", "I", "–"] as const;
export type DoaCode = (typeof doaCodes)[number];
export const doaCodeNames: Record<DoaCode, string> = { A: "Approves", R: "Recommends", C: "Consulted", I: "Informed", "–": "No role" };

export type DoaDefault = { code: DoaCode; note?: string; pct?: { op: "≤" | ">"; value: number } };

/** Non-monetary defaults. Levels not listed have no role. "CEO" is the CEO / MD. */
export const doaNonMonetary: Partial<Record<DoaArea, Partial<Record<DoaLevel, DoaDefault>>>> = {
  "Annual budget and plan": { "Function head": { code: "R" }, CFO: { code: "R" }, "CEO / MD": { code: "R" }, "Board committee": { code: "C" }, Board: { code: "A" } },
  Hiring: { Manager: { code: "R" }, "Function head": { code: "A", note: "below head level" }, "CEO / MD": { code: "A", note: "for heads" }, "Board committee": { code: "A", note: "remuneration committee: CEO and direct reports" }, Board: { code: "A", note: "CEO and direct reports" } },
  "Pay and bonuses": { "Function head": { code: "R" }, CFO: { code: "C" }, "CEO / MD": { code: "A", note: "below C-suite" }, "Board committee": { code: "R", note: "remuneration committee: C-suite" }, Board: { code: "A", note: "C-suite and CEO" } },
  "Pricing and discounts": { Manager: { code: "A", pct: { op: "≤", value: 5 } }, "Function head": { code: "A", pct: { op: "≤", value: 15 } }, "CEO / MD": { code: "A", pct: { op: ">", value: 15 } } },
  "Borrowing and guarantees": { CFO: { code: "R" }, "CEO / MD": { code: "R" }, Board: { code: "A", note: "all" } },
  "New products or markets": { "Function head": { code: "R" }, "CEO / MD": { code: "A", note: "within plan" }, Board: { code: "A", note: "outside plan" } },
  "Related-party transactions": { "CEO / MD": { code: "R" }, "Board committee": { code: "C", note: "audit committee" }, Board: { code: "A", note: "all" } },
  "Mergers, acquisitions and disposals": { "CEO / MD": { code: "R" }, Board: { code: "A" } },
  Policies: { "Function head": { code: "R" }, "CEO / MD": { code: "A", note: "operating policies" }, Board: { code: "A", note: "governance policies" } },
};

export const doaFootnotes = [
  "Unbudgeted spend goes one level up.",
  "Related-party transactions always go to the Board.",
  "In an emergency the CEO may approve and must report to the Board within 48 hours.",
  "Nobody approves a decision in which they have a personal interest; it goes one level up.",
];

export const doaBookCopy = "We can tailor this matrix to your company and have it running in 30 days.";

/* ---------- Tool 4 · ESOP & Share Pool Calculator ---------- */

export const esopDefaults = { shares: 10_000_000, founders: 8_000_000, pool: 10, grant: 0.5, valuation: 5_000_000, exit: 50_000_000, years: 4, cliff: 12, frequency: "monthly" as const, round: false, dilution: 20 };
export const esopFrequencies = [{ key: "monthly", label: "Monthly", months: 1 }, { key: "quarterly", label: "Quarterly", months: 3 }, { key: "annually", label: "Annually", months: 12 }] as const;
export type EsopFrequency = (typeof esopFrequencies)[number]["key"];
export const esopSentence = "Offer {G} options vesting over {years} years with a {cliff}-month cliff. If the company sells for {Ve}, they'd be worth about {grant_value} before tax.";

/* ---------- Tool 5 · Investor Readiness Score ---------- */

export const readinessGroups: { key: string; label: string; checks: string[] }[] = [
  { key: "story", label: "Story", checks: [
    "A one-sentence description a stranger can repeat.",
    "A deck of 15 slides or fewer, tested on three people who don't know you.",
    "A clear answer to \"why now\".",
    "The ask (amount, use of funds, milestones) on one slide.",
    "A named profile of your ideal lead investor.",
  ] },
  { key: "numbers", label: "Numbers", checks: [
    "A monthly model with assumptions kept separate from outputs.",
    "Unit economics per customer: acquisition cost, margin, payback.",
    "A written definition for every metric you quote.",
    "Twelve months of management accounts.",
    "Runway and burn you can state without checking.",
  ] },
  { key: "terms", label: "Terms", checks: [
    "A clean, current cap table.",
    "Every SAFE, note or convertible documented, with its terms.",
    "A share-option pool sized for the next 18 months of hires.",
    "A valuation rationale grounded in comparables.",
    "Founder vesting in place.",
  ] },
  { key: "company", label: "Company", checks: [
    "Incorporation and filings up to date.",
    "IP assigned to the company.",
    "Customer and supplier contracts signed and filed.",
    "Licences for what you do, or a clear path to them.",
    "A board or advisory structure that keeps minutes.",
  ] },
  { key: "process", label: "Process", checks: [
    "A list of 30+ targeted investors, with a reason for each.",
    "A data room that opens with an index.",
    "Three customers who'll take a reference call.",
    "A timeline with a first-close date.",
    "One person who owns the process every week.",
  ] },
];

/** Gaps are listed in this group order within "no" and within "partly". */
export const readinessGapOrder = ["terms", "numbers", "company", "story", "process"];

export type ReadinessAnswer = "yes" | "partly" | "no";

/** Bands, highest first: the first band whose minimum the overall % reaches. */
export const readinessBands = [
  { min: 80, headline: "Ready.", line: "Run a tight process." },
  { min: 50, headline: "Close.", line: "Close the gaps below first." },
  { min: 0, headline: "Not yet.", line: "Fix these before you pitch." },
];

/* ---------- Tool 6 · Pitch Deck Outline ---------- */

export const deckQuestions: { slide: string; question: string; note: string }[] = [
  { slide: "Title", question: "What do you do, in one sentence?", note: "Say it the way a customer would." },
  { slide: "Problem", question: "What problem do customers have?", note: "Use the customer's words and one number." },
  { slide: "Customer", question: "Who has it most?", note: "Name one customer type, not five." },
  { slide: "Solution", question: "How do you solve it?", note: "Show the moment it works." },
  { slide: "Why now", question: "Why now?", note: "What changed in the last two years?" },
  { slide: "Traction", question: "What traction do you have?", note: "One chart, clearly labelled." },
  { slide: "Business model", question: "How do you make money?", note: "Price, margin, payback." },
  { slide: "Market", question: "How big can it get?", note: "Bottom-up: customers × price." },
  { slide: "Competition", question: "Who else solves it?", note: "Show the customer's real alternatives." },
  { slide: "Team", question: "Who's on the team?", note: "Why these people for this problem." },
  { slide: "The ask", question: "How much are you raising, and for what?", note: "Amount, use of funds, runway." },
  { slide: "Milestones", question: "What will the money prove?", note: "The two numbers that win the next round." },
];
