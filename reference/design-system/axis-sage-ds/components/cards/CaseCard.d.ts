import * as React from "react";
/**
 * Selected-work card with Needed / Changed / Moved rows, role and conversion chips, and a Read the case link.
 * @startingPoint section="Cards" subtitle="Needed / Changed / Moved case card" viewport="700x460"
 */
export interface CaseCardProps {
  item: { name: string; needed: string; changed: string; moved: string; chips?: { label: string; kind?: "role" | "conversion" }[] };
  index?: number;
  dark?: boolean;
  href?: string;
  /** "AXIS & SAGE ENGAGEMENT" | "PRINCIPAL TRACK RECORD" */
  provenance?: string;
}
export declare function CaseCard(props: CaseCardProps): JSX.Element;
