import * as React from "react";
/** Mono uppercase label ("01 · THE GAP") that opens sections and tags metadata. */
export interface EyebrowProps {
  /** Leading 24px rule. */
  rule?: boolean;
  /** Primary ink instead of muted. */
  strong?: boolean;
  as?: "p" | "span" | "div";
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
