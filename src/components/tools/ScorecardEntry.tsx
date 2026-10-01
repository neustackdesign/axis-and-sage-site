"use client";

import { useSearchParams } from "next/navigation";
import { Scorecard } from "./Scorecard";

/** Reads a sentence passed from the homepage (?who=&what=&when=) and starts the Scorecard with it. */
export function ScorecardEntry({ cases }: { cases: { slug: string; name: string }[] }) {
  const p = useSearchParams();
  return <Scorecard preset={{ who: p.get("who") || undefined, what: p.get("what") || undefined, when: p.get("when") || undefined }} cases={cases} />;
}
