import * as React from "react";
/** A dot-matrix glyph inside a circle. Use for Instagram highlight covers, topic avatars and slide markers. */
export interface GlyphBadgeProps {
  name?: "investors" | "partners" | "team" | "customers" | "users" | "terms" | "moment" | "action" | "time" | "money" | "document" | "screen";
  /** Diameter in px. Default 72. */
  size?: number;
  /** midnight (default) · cloud · lilac */
  ground?: "midnight" | "cloud" | "lilac";
  title?: string;
}
export declare function GlyphBadge(props: GlyphBadgeProps): JSX.Element;
