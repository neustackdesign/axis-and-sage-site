import React from "react";

const RIBBON = "M 1289.492 569.581 L 1093.421 569.581 C 944.346 569.581 791.006 619.881 664.511 710.277 L 496.552 830.304 C 370.056 920.7 216.717 971 67.642 971 L 0 971 L 111.508 401.419 L 179.15 401.419 C 328.224 401.419 481.564 351.119 608.059 260.723 L 776.019 140.696 C 902.514 50.3 1055.854 0 1204.928 0 L 1401 0 L 1289.492 569.581 Z";

/* Crops from the 2025 brand book. Percentages resolve against container width, so each crop holds at any aspect ratio. */
const CROPS = {
  full: { left: 0, top: 0, width: "100%" },
  cover: { left: "-7.86%", top: 0, marginTop: "29.53%", width: "115.68%" },
  crop: { left: "-14.74%", top: 0, marginTop: "-31%", width: "141.77%" },
  band: { left: "-4%", top: 0, marginTop: "4.5%", width: "108%" },
  edge: { right: "-30%", bottom: 0, marginBottom: "-12%", width: "92%" },
};

/** Ribbons: the two waves of the logomark, cropped large. Fills its positioned parent. */
export function Ribbons({ crop = "cover", tone = "color", style }) {
  const c = CROPS[crop] || CROPS.cover;
  const outline = tone === "outline";
  const quiet = tone === "quiet";
  const a = quiet ? "var(--haze-400)" : "var(--mark-orange)";
  const b = quiet ? "var(--haze-300)" : "var(--mark-pink)";
  const paint = (col) => outline
    ? { fill: "none", stroke: col, strokeWidth: 1.75, strokeDasharray: "0 7", strokeLinecap: "round", vectorEffect: "non-scaling-stroke" }
    : { fill: col, opacity: 0.7 };
  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", ...style }}>
      <svg viewBox="0 0 2221 971" style={{ position: "absolute", ...c, height: "auto", aspectRatio: "2221 / 971", maxWidth: "none", display: "block", overflow: "visible" }}>
        <path d={RIBBON} transform="translate(820 0)" {...paint(b)} />
        <path d={RIBBON} {...paint(a)} />
      </svg>
    </div>
  );
}
