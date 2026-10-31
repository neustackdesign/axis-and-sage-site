"use client";

import { useRef, useState } from "react";
import { usePlayOnEnter } from "./scroll";

/** Builds the 100 dots of a per-hundred result: `before` filled as the baseline, the gain up to `after` in Sunset. */
export const dots = (before: number, after: number, showAfter: boolean) =>
  Array.from({ length: 100 }, (_, i) => ({ c: i < before ? "base" : showAfter && i < after ? "gain" : "", d: i < before ? 0 : i - before }));

export const dotAlt = (before: number, after: number, showAfter: boolean) =>
  showAfter
    ? `One hundred dots. ${after} are filled: ${before} for the baseline and ${after - before} for the gain, ${before} to ${after} per hundred.`
    : `One hundred dots, ${before} filled: the baseline of ${before} per hundred.`;

/**
 * The result drawn per 100. Renders the final frame without script; with script it starts at the baseline and fills
 * the gain once it is on screen. `toggle` adds a before/after control; `className` sizes the field.
 */
export function DotField({ before, after, toggle, labels, className = "df", controlClass = "seg", show }: { before: number; after: number; toggle?: boolean; labels?: [string, string]; className?: string; controlClass?: string; show?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [touched, setTouched] = useState(false);
  const [picked, setPicked] = useState(true);
  const played = usePlayOnEnter(ref, touched || show !== undefined);
  const showAfter = show ?? (touched ? picked : played); // controlled when the parent owns the before/after control
  const pick = (v: boolean) => { setTouched(true); setPicked(v); };
  const [b, a] = labels ?? [`Before · ${before}`, `After · ${after}`];
  return (
    <>
      {toggle ? (
        <div className={controlClass} role="group" aria-label="Show before or after">
          <button type="button" aria-pressed={!showAfter} onClick={() => pick(false)}>{b}</button>
          <button type="button" aria-pressed={showAfter} onClick={() => pick(true)}>{a}</button>
        </div>
      ) : null}
      <div ref={ref} className={className} role="img" aria-label={dotAlt(before, after, showAfter)}>
        {dots(before, after, showAfter).map((x, i) => <i key={i} className={x.c} style={{ ["--d" as string]: x.d }} />)}
      </div>
    </>
  );
}
