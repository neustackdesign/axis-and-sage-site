"use client";

import { useState } from "react";
import type { HomeView } from "@/sanity/load";

type Band = NonNullable<HomeView["proofBand"]>;

/**
 * Lead and support on Midnight: the firm's own engagement leads; supporting organisations are equal logo tiles,
 * grouped by relationship. Hover or focus names who did what. A tile without a supplied logo shows the name.
 */
export function ProofBand({ band }: { band: Band }) {
  const [hot, setHot] = useState<string | null>(null);
  const line = band.groups.flatMap((g) => g.items).find((x) => x.name === hot)?.line;
  return (
    <div className="g12" style={{ alignItems: "start" }}>
      <div className="s4 proof-lead rv">
        <p className="lbl">{band.leadLabel}</p>
        <p className="h2 xs">{band.leadName}</p>
        <p className="small">{band.leadLine}</p>
      </div>
      <div className={`s8 proof-sup rv d1${hot ? " dim" : ""}`}>
        <div className="proof-groups" style={{ ["--cols" as string]: band.groups.map((g) => `${g.items.length}fr`).join(" ") }}>
          {band.groups.map((g) => (
            <div className="stack" style={{ gap: 6 }} key={g.label}>
              <p className="lbl">{g.label}</p>
              <ul className="tiles" style={{ ["--n" as string]: g.items.length }}>
                {g.items.map((x) => (
                  <li key={x.name} style={{ display: "contents" }}>
                    <button type="button" className={`tile${hot === x.name ? " hot" : ""}`} aria-describedby="proof-line"
                      onMouseEnter={() => setHot(x.name)} onFocus={() => setHot(x.name)} onMouseLeave={() => setHot(null)} onBlur={() => setHot(null)}>
                      {x.logo ? <img src={x.logo.url} alt={x.name} /> : <span className="nm">{x.name}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p id="proof-line" className="small proof-line" aria-live="polite">{line ?? band.hint}</p>
      </div>
    </div>
  );
}
