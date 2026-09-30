import { scorecardCaseFor, scorecardStatements, scorecardUnknown, scorecardVerdicts, scorecardWho, type Statement } from "@/content/tools";

export type ScorecardAnswers = Record<string, number>; // statement id -> 1..5

/** The display forms of {who}: mid-sentence, at the start of a sentence, and after a number. */
export function whoForms(key: string, otherWho = "") {
  const def = scorecardWho.find((w) => w.key === key);
  const who = (def && def.key !== "other" ? def.who : otherWho.trim().toLowerCase()) || "they";
  const whoCount = (def && def.key !== "other" ? def.whoCount : otherWho.trim().toLowerCase()) || "people";
  return { who, Who: who[0].toUpperCase() + who.slice(1), whoCount };
}

type Forms = { who: string; Who?: string; whoCount?: string };

/** Fills {Who}, {who}, {who_count} and {action}. */
export function fill(text: string, forms: Forms, action: string) {
  const Who = forms.Who || (forms.who ? forms.who[0].toUpperCase() + forms.who.slice(1) : "They");
  return text
    .replace(/\{Who\}/g, Who)
    .replace(/\{who_count\}/g, forms.whoCount || forms.who || "people")
    .replace(/\{who\}/g, forms.who || "they")
    .replace(/\{action\}/g, action || "act");
}

/** One answer on the 1–5 scale: s = (a − 1) / 4 × 100. */
export const answerScore = (answer: number) => ((Math.min(5, Math.max(1, answer)) - 1) / 4) * 100;

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** terms = round(mean(T1..T5)); moments = round(mean(M1..M5)). */
export function halfScore(answers: ScorecardAnswers, half: Statement["half"], statements = scorecardStatements) {
  return Math.round(mean(statements.filter((s) => s.half === half && typeof answers[s.id] === "number").map((s) => answerScore(answers[s.id]))));
}

export const VERDICT_THRESHOLD = 60;

export type VerdictKey = keyof typeof scorecardVerdicts;

export function verdictKey(terms: number, moments: number): VerdictKey {
  const t = terms >= VERDICT_THRESHOLD, m = moments >= VERDICT_THRESHOLD;
  return t && m ? "reach" : !t && m ? "terms" : t && !m ? "moment" : "both";
}

export function verdict(terms: number, moments: number, forms: Forms = { who: "they" }, action = "") {
  const key = verdictKey(terms, moments);
  return { key, headline: scorecardVerdicts[key].headline, body: fill(scorecardVerdicts[key].body, forms, action) };
}

/** Shown with the verdict when "I don't know" is ticked in step 2. */
export const unknownNote = (unknown: boolean) => (unknown ? scorecardUnknown : null);

/**
 * The three blockers: lowest score first. Ties go to the weaker side first (Terms when the sides are equal),
 * then statement order.
 */
export function blockers(answers: ScorecardAnswers, statements = scorecardStatements, count = 3) {
  const terms = halfScore(answers, "terms", statements), moments = halfScore(answers, "moments", statements);
  const weaker: Statement["half"] = moments < terms ? "moments" : "terms";
  return statements
    .map((s, index) => ({ s, index, score: typeof answers[s.id] === "number" ? answerScore(answers[s.id]) : 0 }))
    .sort((a, b) => a.score - b.score || Number(b.s.half === weaker) - Number(a.s.half === weaker) || a.index - b.index)
    .slice(0, count)
    .map((x) => x.s);
}

export const relatedCaseSlug = (who: string) => scorecardCaseFor[who] || scorecardCaseFor.other;

export function sentenceFor(who: string, action: string, when: string) {
  return `We need ${who} to ${action}${when && when !== "no date yet" ? ` by ${when}` : ""}.`;
}

export type ScorecardReport = { sentence: string; unknown: boolean; rate: number; volume?: string; answers: ScorecardAnswers; forms: Forms; action: string };

/** The emailed report: the sentence, the rate, both scores, the verdict and the three blockers. */
export function scorecardSummary(input: ScorecardReport) {
  const terms = halfScore(input.answers, "terms");
  const moments = halfScore(input.answers, "moments");
  const v = verdict(terms, moments, input.forms, input.action);
  const u = unknownNote(input.unknown);
  return [
    input.sentence,
    `Today: ${input.unknown ? "not known" : `${input.rate} out of 10`}${input.volume ? `; ${input.volume} reach that point in a typical month` : ""}`,
    `Terms ${terms}/100 · Moments ${moments}/100`,
    `${v.headline} ${v.body}`,
    ...(u ? [`${u.headline} ${u.body}`] : []),
    "",
    "Your three blockers:",
    ...blockers(input.answers).map((s, i) => `${i + 1}. ${fill(s.text, input.forms, input.action)}\n   What we'd check first: ${fill(s.check, input.forms, input.action)}`),
  ].join("\n");
}
