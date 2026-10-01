import { deckQuestions } from "@/lib/tools/spec";

/** A suggested headline from the answer: its first sentence, capitalised, without the closing full stop. */
export function headlineFrom(answer: string) {
  const first = answer.trim().split(/(?<=[.!?])\s+/)[0] || "";
  const clean = first.replace(/\s+/g, " ").replace(/\.$/, "");
  return clean ? clean[0].toUpperCase() + clean.slice(1) : "";
}

export function deckOutline(answers: string[]) {
  return deckQuestions.map((q, i) => ({ number: i + 1, slide: q.slide, words: (answers[i] || "").trim(), headline: headlineFrom(answers[i] || ""), note: q.note }));
}

export function deckText(answers: string[]) {
  return deckOutline(answers).map((s) => `${String(s.number).padStart(2, "0")} ${s.slide}\n${s.headline || "[to write]"}\nNote: ${s.note}`).join("\n\n");
}
