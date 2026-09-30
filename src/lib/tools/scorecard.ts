import { scorecardCaseFor, scorecardStatements, scorecardUnknown, scorecardVerdicts, type Statement } from "@/content/tools";

export type ScorecardAnswers = Record<string, number>; // statement id -> 1..5

/** Substitutes {who} and {action} into a statement. */
export function fillStatement(text: string, who: string, action: string) {
  return text.replace(/\{who\}/g, who || "they").replace(/\{action\}/g, action || "act");
}

/** One answer on the 1–5 scale scored 0–100. */
export const answerScore = (answer: number) => Math.round(((Math.min(5, Math.max(1, answer)) - 1) / 4) * 100);

/** Average of the answered statements in one half, 0–100. */
export function halfScore(answers: ScorecardAnswers, half: Statement["half"], statements = scorecardStatements) {
  const vals = statements.filter((s) => s.half === half && typeof answers[s.id] === "number").map((s) => answerScore(answers[s.id]));
  return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
}

export const VERDICT_THRESHOLD = 60;

export function verdict(terms: number, moments: number) {
  const t = terms >= VERDICT_THRESHOLD, m = moments >= VERDICT_THRESHOLD;
  const key = t && m ? "reach" : !t && m ? "terms" : t && !m ? "moment" : "both";
  return { key, ...scorecardVerdicts[key] } as const;
}

/** Shown alongside the verdict when "I don't know" is ticked in step 2. */
export const unknownNote = (unknown: boolean) => (unknown ? scorecardUnknown : null);

/**
 * The three blockers: lowest-scoring statements first.
 * Interim tie-break until file 06: Terms before Moments, then statement order.
 */
export function blockers(answers: ScorecardAnswers, statements = scorecardStatements, count = 3) {
  return statements
    .map((s, index) => ({ s, index, score: typeof answers[s.id] === "number" ? answerScore(answers[s.id]) : 50 }))
    .sort((a, b) => a.score - b.score || (a.s.half === b.s.half ? 0 : a.s.half === "terms" ? -1 : 1) || a.index - b.index)
    .slice(0, count)
    .map((x) => x.s);
}

export const relatedCaseSlug = (who: string) => scorecardCaseFor[who] || scorecardCaseFor.other;

export function scorecardSummary(input: { sentence: string; unknown: boolean; outOf10: number; monthly?: string; answers: ScorecardAnswers; who: string; action: string }) {
  const terms = halfScore(input.answers, "terms");
  const moments = halfScore(input.answers, "moments");
  const v = verdict(terms, moments);
  const u = unknownNote(input.unknown);
  return [
    input.sentence,
    `Today: ${input.unknown ? "not known" : `${input.outOf10} out of 10`}${input.monthly ? `, ${input.monthly} reach the point each month` : ""}`,
    `Terms ${terms}/100 · Moments ${moments}/100`,
    `${v.headline}. ${v.line}`,
    ...(u ? [`${u.headline}. ${u.line}`] : []),
    "",
    "Your three blockers:",
    ...blockers(input.answers).map((s, i) => `${i + 1}. ${fillStatement(s.text, input.who, input.action)}\n   What we'd check first: ${s.check}`),
  ].join("\n");
}
