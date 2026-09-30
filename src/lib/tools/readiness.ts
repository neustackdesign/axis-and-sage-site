import { readinessBands, readinessGapOrder, readinessGroups, type ReadinessAnswer } from "@/content/tools";

export const readinessPoints: Record<ReadinessAnswer, number> = { yes: 2, partly: 1, no: 0 };
export const checkKey = (groupKey: string, index: number) => `${groupKey}-${index}`;

/** Group % = group points / 10 × 100; overall % = total points / 50 × 100. Unanswered checks score 0. */
export function readinessScore(answers: Record<string, ReadinessAnswer | undefined>) {
  const groups = readinessGroups.map((g) => {
    const points = g.checks.reduce((n, _, i) => n + (answers[checkKey(g.key, i)] ? readinessPoints[answers[checkKey(g.key, i)]!] : 0), 0);
    const max = g.checks.length * 2;
    return { key: g.key, label: g.label, points, max, pct: Math.round((points / max) * 100) };
  });
  const points = groups.reduce((n, g) => n + g.points, 0), max = groups.reduce((n, g) => n + g.max, 0);
  const pct = Math.round((points / max) * 100);
  return { groups, points, max, pct, band: readinessBands.find((b) => pct >= b.min)! };
}

/** Gaps: every "no" (unanswered counts as no), then every "partly". Within each: Terms, Numbers, Company, Story, Process. */
export function readinessGaps(answers: Record<string, ReadinessAnswer | undefined>) {
  const rank = (a?: ReadinessAnswer) => (a === "partly" ? 1 : 0);
  const groupRank = (key: string) => readinessGapOrder.indexOf(key);
  return readinessGroups
    .flatMap((g) => g.checks.map((text, i) => ({ key: g.key, group: g.label, number: readinessGroups.findIndex((x) => x.key === g.key) * 5 + i + 1, text, answer: answers[checkKey(g.key, i)], i })))
    .filter((x) => x.answer !== "yes")
    .sort((a, b) => rank(a.answer) - rank(b.answer) || groupRank(a.key) - groupRank(b.key) || a.i - b.i);
}
