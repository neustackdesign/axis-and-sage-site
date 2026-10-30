import * as React from "react";
/** Four-up ruled grid of glyph + serif sentence cells ("Investors take the meeting and don't commit."). */
export interface GapGridProps {
  cards: { glyph: "investors" | "partners" | "team" | "customers" | "users" | "terms" | "moment" | "action" | "time" | "money" | "document" | "screen"; text: string }[];
}
export declare function GapGrid(props: GapGridProps): JSX.Element;
