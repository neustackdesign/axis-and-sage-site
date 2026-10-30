import * as React from "react";
/** The Axis & Sage logo lockup (mark + wordmark + ADVISORY); use in the header, footer and anywhere the brand signs. */
export interface LockupProps {
  /** Cloud wordmark for Midnight / photo grounds. */
  dark?: boolean;
  /** Path to the folder holding mark.svg and wordmark-*.svg, relative to the page. Default "assets/brand". */
  assetBase?: string;
  compact?: boolean;
  /** "inline" (default: mark left of words, header/footer) or "stacked" (mark above words, covers, posters, title slides). */
  layout?: "inline" | "stacked";
}
export declare function Lockup(props: LockupProps): JSX.Element;
