import * as React from "react";
/** Sage library card for a free tool: kind label, badge chip, glyph, title, one line and a link. Place in .tool-grid. */
export interface ToolCardProps {
  title: string;
  line: string;
  /** "SCORECARD · 6 MIN" */
  kind: string;
  badge?: string;
  glyph?: "investors" | "partners" | "team" | "customers" | "users" | "terms" | "moment" | "action" | "time" | "money" | "document" | "screen";
  cta?: string;
  href?: string;
}
export declare function ToolCard(props: ToolCardProps): JSX.Element;
