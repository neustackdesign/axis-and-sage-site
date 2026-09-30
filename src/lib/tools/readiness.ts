import { readinessBands, readinessGroups, type ReadinessAnswer } from "@/content/tools";

export const readinessPoints: Record<ReadinessAnswer, number> = { yes: 2, partly: 1, no: 0 };
export const checkKey = (groupKey: string, index: number) => `${groupKey}-${index}`;

/** Unanswered checks score 0. Percentages are of the maximum (2 points a check). */
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

/** Gaps: every check not answered yes. Interim ordering until file 06: "no" (and unanswered) before "partly", then group order, then check order. */
export function readinessGaps(answers: Record<string, ReadinessAnswer | undefined>) {
  const rank = (a?: ReadinessAnswer) => (a === "partly" ? 1 : 0);
  return readinessGroups
    .flatMap((g, gi) => g.checks.map((text, i) => ({ group: g.label, text, answer: answers[checkKey(g.key, i)], gi, i })))
    .filter((x) => x.answer !== "yes")
    .sort((a, b) => rank(a.answer) - rank(b.answer) || a.gi - b.gi || a.i - b.i);
}
