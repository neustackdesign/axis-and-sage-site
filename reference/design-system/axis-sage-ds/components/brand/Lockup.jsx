import React from "react";
/** Lockup: AXIS & SAGE ADVISORY. The mark keeps its own colours; it is never UI. */
export function Lockup({ dark = false, assetBase = "assets/brand", compact = false, layout = "inline" }) {
  const stacked = layout === "stacked";
  return (
    <span className={"lockup" + (dark ? " on-dark" : "") + (stacked ? " is-stacked" : "")}>
      <img className="lockup-mark" src={assetBase + "/mark.svg"} alt="" width={38} height={17} style={compact && !stacked ? { width: 30 } : undefined} />
      <span className="lockup-words">
        <img className="lockup-wordmark" src={assetBase + (dark ? "/wordmark-cloud.svg" : "/wordmark-midnight.svg")} alt="Axis & Sage" width={105} height={13} />
        <span className="lockup-advisory" aria-hidden="true">ADVISORY</span>
      </span>
    </span>
  );
}
