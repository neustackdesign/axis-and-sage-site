import * as React from "react";
/** Ruled tile with a large mono numeral, label and source line; place inside StatGrid. Never publish a number without a source. */
export interface StatTileProps {
  numeral: string;
  label: string;
  /** "FARMCROWDY · BUILT" */
  tag?: string;
  source?: string;
  /** Span two columns. */
  wide?: boolean;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
export interface StatGridProps { cols?: number; children?: React.ReactNode; }
export declare function StatGrid(props: StatGridProps): JSX.Element;
