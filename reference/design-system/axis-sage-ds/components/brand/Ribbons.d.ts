import * as React from "react";
/** Ribbons: the two waves of the logomark as a large graphic. Fills its positioned parent. Use on covers, section openers, social, decks, print and the site footer. */
export interface RibbonsProps {
  /** "full" = whole artwork, size the parent yourself; "cover" = lower half (brand-book cover); "crop" = close on the intersection; "band" = full width; "edge" = bottom-right corner. Default "cover". */
  crop?: "full" | "cover" | "crop" | "band" | "edge";
  /** "color" = Sunset and Bloom at 70% (default). "outline" = dotted outlines, for the footer and quiet grounds. "quiet" = haze tints on light grounds. */
  tone?: "color" | "outline" | "quiet";
  style?: React.CSSProperties;
}
export declare function Ribbons(props: RibbonsProps): JSX.Element;
