import { deckQuestions } from "@/content/tools";

export function deckOutline(answers: string[]) {
  return deckQuestions.map((q, i) => ({ number: i + 1, slide: q.slide, words: (answers[i] || "").trim(), note: q.note }));
}

export function deckText(answers: string[]) {
  return deckOutline(answers).map((s) => `${String(s.number).padStart(2, "0")} ${s.slide}\n${s.words || "[to write]"}\nNote: ${s.note}`).join("\n\n");
}
