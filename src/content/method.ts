import type { GlyphName } from "@/lib/glyphs";

export const gapCards: { glyph: GlyphName; text: string }[] = [
  { glyph: "investors", text: "Investors take the meeting and don't commit." },
  { glyph: "partners", text: "Partners agree in principle and don't sign." },
  { glyph: "team", text: "Teams nod at the plan and don't execute it." },
  { glyph: "customers", text: "Customers reach checkout and don't buy." },
];

export type SentenceRow = { who: string; action: string; stops: string; look: string };

export const sentenceRows: SentenceRow[] = [
  { who: "Investors", action: "commit", stops: "Terms that don't price their risk. A story that changes between the deck and the data room.", look: "The cap table, the ask and the first ten minutes of the pitch." },
  { who: "Partners", action: "sign", stops: "Economics that work for one side. No named owner on yours.", look: "The deal terms and the path from yes-in-principle to signature." },
  { who: "Our team", action: "execute", stops: "Nobody knows who can approve what. Incentives reward the old way.", look: "The delegation of authority and the reward scheme." },
  { who: "Customers", action: "buy", stops: "A price they can't compare. A moment that asks for trust before it earns it.", look: "The offer and the three screens before payment." },
  { who: "Users", action: "adopt", stops: "Sign-up assumes they have what they don't. No reason to come back.", look: "Onboarding and the first week." },
];

export const planes = [
  { index: "01", name: "THE DECISION", kind: "decision" },
  { index: "02", name: "THE TERMS", kind: "terms" },
  { index: "03", name: "THE MOMENT", kind: "moment" },
  { index: "04", name: "THE ACTION", kind: "action" },
] as const;

export const methodSteps = [
  { index: "01", title: "Name the action.", body: "We need [who] to [do what] by [when]. One sentence, agreed before any work starts." },
  { index: "02", title: "Find what's in the way.", body: "The terms, the moment, or both. We talk to the people who need to act and walk the path they take." },
  { index: "03", title: "Fix it.", body: "In the strategy, the product or the brand. We build what's needed with your team." },
  { index: "04", title: "Measure what moved.", body: "The baseline goes on the first page of our report. The new number goes on the last." },
];

export const methodStepsExpanded = [
  { index: "01", title: "Name the action.", body: "One sentence, agreed with the people who own the outcome: we need [who] to [do what] by [when]. We agree how we'll measure it before work starts." },
  { index: "02", title: "Find what's in the way.", body: "We interview the people who need to act and the people who own the path to it. We walk the path ourselves. We read the numbers. Every blocker is tagged: terms, moment, or both." },
  { index: "03", title: "Fix it.", body: "Strategy & Investment fixes terms. Product & Technology fixes moments. Brand & Market fixes the promise and the message, which sit across both. We build with your team, and a principal stays until it runs." },
  { index: "04", title: "Measure what moved.", body: "Baseline on page one, new number on the last page. The number becomes the next decision." },
];

export const conversionActors: { glyph: GlyphName; actor: string; examples: string }[] = [
  { glyph: "investors", actor: "Investors", examples: "commit to the round, follow on, move from first meeting to term sheet" },
  { glyph: "partners", actor: "Partners", examples: "sign, renew, commit more volume" },
  { glyph: "team", actor: "Teams", examples: "work to a new structure, follow a new process, hit a new plan" },
  { glyph: "customers", actor: "Customers", examples: "buy, buy again, switch to you, pay on time" },
  { glyph: "users", actor: "Users and beneficiaries", examples: "sign up, finish onboarding, keep using it" },
];

// Short lines for the "By type of action" cards reuse the matching "What usually stops them" copy.
export const actionCards: { key: string; label: string; glyph: GlyphName; line: string }[] = [
  { key: "investors-commit", label: "Investors commit", glyph: "investors", line: sentenceRows[0].stops },
  { key: "partners-sign", label: "Partners sign", glyph: "partners", line: sentenceRows[1].stops },
  { key: "teams-execute", label: "Teams execute", glyph: "team", line: sentenceRows[2].stops },
  { key: "customers-buy", label: "Customers buy", glyph: "customers", line: sentenceRows[3].stops },
];
