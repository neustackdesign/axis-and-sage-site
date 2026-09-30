// Tool copy and interim scoring.
// DRAFT: the statements, checks, questions, notes and scoring below are working drafts written so the screens can be
// reviewed. Replace them with the final copy and logic from file 06 before launch. Nothing here is a client figure.

export const TOOL_DRAFT_NOTE = "DRAFT COPY AND SCORING · FINAL VERSION FROM FILE 06";

/* ---------- Conversion Scorecard ---------- */

export const scorecardWho = [
  { key: "investors", label: "Investors", actions: ["commit to the round", "follow on", "move from first meeting to term sheet"] },
  { key: "partners", label: "Partners", actions: ["sign", "renew", "commit more volume"] },
  { key: "our team", label: "Our team", actions: ["work to a new structure", "follow a new process", "hit a new plan"] },
  { key: "customers", label: "Customers", actions: ["buy", "buy again", "switch to you", "pay on time"] },
  { key: "users", label: "Users or beneficiaries", actions: ["sign up", "finish onboarding", "keep using it"] },
  { key: "other", label: "Something else", actions: [] },
] as const;

export type Statement = { id: string; half: "terms" | "moments"; text: string; check: string };

export const scorecardStatements: Statement[] = [
  { id: "t1", half: "terms", text: "What we offer is worth more to {who} than what we ask them to do.", check: "The offer, and what it is worth from their side of the table." },
  { id: "m1", half: "moments", text: "We ask {who} to {action} at a time when they are able to decide.", check: "The timing of the ask against their budget, board or buying cycle." },
  { id: "t2", half: "terms", text: "They can compare our offer with the alternatives and see why it's better.", check: "How the price or the terms read next to the alternative they already have." },
  { id: "m2", half: "moments", text: "Nothing on the path to {action} makes {who} stop.", check: "Each step between yes-in-principle and the action, walked as they walk it." },
  { id: "t3", half: "terms", text: "The person who decides has the authority to say yes.", check: "Who can approve what, and up to which limit." },
  { id: "m3", half: "moments", text: "We earn their trust before we ask for commitment.", check: "What they see before the ask, and what is missing." },
  { id: "t4", half: "terms", text: "Their incentives reward acting, not waiting.", check: "How they are paid, measured or rewarded for this decision." },
  { id: "m4", half: "moments", text: "They have what they need to act at the moment we ask.", check: "The information, documents and access the moment assumes they have." },
  { id: "t5", half: "terms", text: "The risk they carry is priced into what we offer.", check: "The terms that decide who carries the risk if it goes wrong." },
  { id: "m5", half: "moments", text: "Something prompts {who} to {action} now rather than later.", check: "The reason to decide this week, and who gives it to them." },
];

export const scaleLabels = ["Not true", "Rarely", "Sometimes", "Mostly", "Fully true"];

export const scorecardCaseFor: Record<string, string> = {
  investors: "uganda-investor-summit",
  partners: "nature-roots",
  "our team": "venture-garden-group",
  customers: "farmcrowdy",
  users: "mular",
  other: "gv-solutions",
};

export const scorecardVerdicts = {
  reach: { headline: "It's reach, speed or proof", line: "Both halves score well. What's left is how many people reach the decision, how fast, and what proof they see." },
  terms: { headline: "It's the terms", line: "The moment works. What's on offer, or who decides, is what stops them." },
  moment: { headline: "It's the moment", line: "The terms work. Where and when they're asked is what stops them." },
  both: { headline: "It's both", line: "The terms and the moment both need work. Start with the terms: a better moment can't sell a weak offer." },
};

export const scorecardUnknown = { headline: "You can't see it yet", line: "You don't know how many act today. The first fix is to count it: without a baseline, nothing that changes can be measured." };

/* ---------- What's a lift worth? ---------- */

export type LiftMode = "customers" | "investors" | "team";

/** Customers and Investors take a lift in percentage points; Our team takes a target rate (r1). */
export const liftModes: { key: LiftMode; label: string; base: string; rate: string; value: string; action: string; target?: string; defaults: { base: number; rate: number; value: number; lift: number; target: number } }[] = [
  { key: "customers", label: "Customers", base: "People who reach the point of buying each month", rate: "Share who buy today", value: "Value of one purchase", action: "purchases", defaults: { base: 2000, rate: 3, value: 50, lift: 2, target: 5 } },
  { key: "investors", label: "Investors", base: "Investor conversations each month", rate: "Share who commit today", value: "Average cheque", action: "commitments", defaults: { base: 20, rate: 5, value: 250000, lift: 5, target: 10 } },
  { key: "team", label: "Our team", base: "People who need to work the new way", rate: "Share working the new way today", value: "Value per person per month when they do", action: "people acting", target: "Share you want working the new way", defaults: { base: 120, rate: 40, value: 400, lift: 10, target: 80 } },
];

export const currencies = [
  { code: "USD", symbol: "$" },
  { code: "NGN", symbol: "₦" },
  { code: "AED", symbol: "AED " },
] as const;
export type CurrencyCode = (typeof currencies)[number]["code"];

export function money(value: number, code: CurrencyCode) {
  const symbol = currencies.find((c) => c.code === code)!.symbol;
  const abs = Math.abs(value);
  const fmt = abs >= 1e9 ? `${(value / 1e9).toFixed(2)}bn` : abs >= 1e6 ? `${(value / 1e6).toFixed(2)}m` : Math.round(value).toLocaleString("en-GB");
  return `${symbol}${fmt}`;
}

/* ---------- Delegation of Authority Builder ---------- */

export const doaLevels = ["Board", "Board committee", "Group CEO", "CEO", "CFO", "Head of function", "Line manager"];
export const doaAreas = [
  "Capital expenditure",
  "Spend outside the approved budget",
  "Customer and supplier contracts",
  "Hiring, pay and promotions",
  "Pricing and discounts",
  "Borrowing and guarantees",
  "Legal claims and settlements",
  "Related-party transactions",
];
/** Areas with a monetary limit. The budgeted-spend areas take revenue-based limits; "Spend outside the approved budget" goes one level up. */
export const doaMonetaryAreas = ["Capital expenditure", "Spend outside the approved budget", "Customer and supplier contracts", "Legal claims and settlements"];
export const doaUnbudgetedArea = "Spend outside the approved budget";
/** Share of annual revenue for each delegated level, lowest level first. Above the highest, the top level approves. */
export const doaLimitShares = [0.0005, 0.0025, 0.01, 0.05];
export const doaCodes = ["A", "R", "C", "I", "–"] as const;
export type DoaCode = (typeof doaCodes)[number];
export const doaCodeNames: Record<DoaCode, string> = { A: "Approves", R: "Recommends", C: "Consulted", I: "Informed", "–": "No role" };

/** Interim non-monetary default: how far up the chain approval sits, 0 = top level. Replace with file 06's defaults. */
export const doaAreaWeight: Record<string, number> = {
  "Hiring, pay and promotions": 0.7,
  "Pricing and discounts": 0.75,
  "Borrowing and guarantees": 0,
  "Related-party transactions": 0,
};

/* ---------- Investor Readiness Score ---------- */

export const readinessGroups: { key: string; label: string; checks: string[] }[] = [
  { key: "story", label: "Story", checks: [
    "You can say what the company does in one sentence.",
    "Your deck and your data room tell the same story.",
    "You can say why now, with evidence.",
    "You can name the three risks an investor will raise, and your answer to each.",
    "Your ask says how much, for what, and how long it lasts.",
  ] },
  { key: "numbers", label: "Numbers", checks: [
    "Monthly management accounts are up to date.",
    "Unit economics are calculated and you can explain them.",
    "You have a financial model with its assumptions written down.",
    "You know your runway to the month.",
    "Key metrics are defined the same way everywhere they appear.",
  ] },
  { key: "terms", label: "Terms", checks: [
    "The cap table is current and reconciled.",
    "Your valuation logic is written down.",
    "The share scheme and the pool are documented.",
    "Terms from earlier rounds are summarised in one place.",
    "You know which terms you will and won't accept.",
  ] },
  { key: "company", label: "Company", checks: [
    "The company is correctly incorporated and in good standing.",
    "Founder and staff contracts assign IP to the company.",
    "Material contracts are signed and filed.",
    "Board minutes and resolutions are complete.",
    "Tax and regulatory filings are up to date.",
  ] },
  { key: "process", label: "Process", checks: [
    "You have a named investor list with a reason for each.",
    "The data room is organised and access-controlled.",
    "You have a timeline for the round.",
    "One person owns the process and the follow-ups.",
    "You have a warm route to your first ten investors.",
  ] },
];

export type ReadinessAnswer = "yes" | "partly" | "no";

/** Bands, highest first: the first band whose minimum the overall % reaches. */
export const readinessBands = [
  { min: 80, headline: "Ready to run the process", line: "Close the remaining gaps while you build the investor list." },
  { min: 50, headline: "Close. Fix the gaps first", line: "Investors will find these gaps in the first week. Fix them before the first meeting." },
  { min: 0, headline: "Not yet. Start with the terms and the story", line: "Raising now would spend your best introductions on a process that isn't ready." },
];

/* ---------- Pitch Deck Outline ---------- */

export const deckQuestions: { slide: string; question: string; note: string }[] = [
  { slide: "Title", question: "What is the company called, and what does it do in one line?", note: "The line should still make sense to someone who reads nothing else." },
  { slide: "Problem", question: "What problem do you solve, and for whom?", note: "Name the person who has the problem, not the market." },
  { slide: "Solution", question: "How do you solve it?", note: "Say what changes for that person, then how." },
  { slide: "Why now", question: "Why is now the right time for this?", note: "One change in the world that makes this possible or urgent now." },
  { slide: "Market", question: "Who will you reach first, and how many of them are there?", note: "Start with the market you can reach in the next two years." },
  { slide: "Product", question: "What does the product do, in three steps?", note: "Show the moment the customer gets value." },
  { slide: "Traction", question: "What proof do you have so far?", note: "Every number needs a date and a source." },
  { slide: "Business model", question: "How do you make money, and what does one customer earn you?", note: "Price, margin and payback, in that order." },
  { slide: "Competition", question: "Who else solves this, and why do customers choose you?", note: "Include the option of doing nothing." },
  { slide: "Go-to-market", question: "How will you reach and win customers?", note: "The channel you have evidence for comes first." },
  { slide: "Team", question: "Who is on the team, and why are you the ones to do this?", note: "What each person has done before that matters here." },
  { slide: "The ask", question: "How much are you raising, and what will it get done?", note: "The milestones this money reaches, and by when." },
];
