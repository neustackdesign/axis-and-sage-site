import * as React from "react";
/** Dot-matrix glyph in a pill — the brand's only icon system; use for audiences, tools and gap cards. */
export interface GlyphProps {
  name?: "investors" | "partners" | "team" | "customers" | "users" | "terms" | "moment" | "action" | "time" | "money" | "document" | "screen";
  /** "sm" = 72×44 pill; default 96×56. */
  size?: "sm";
  label?: string;
}
export declare function Glyph(props: GlyphProps): JSX.Element;
