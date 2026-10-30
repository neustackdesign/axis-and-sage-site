import * as React from "react";
/** Bordered Cloud card for a specialist engagement (Investor Readiness Sprint etc.). Place in .specialist-grid. */
export interface SpecialistCardProps {
  name: string;
  price: string;
  time: string;
  intro: string;
  points?: string[];
  cta?: { label: string; href?: string };
}
export declare function SpecialistCard(props: SpecialistCardProps): JSX.Element;
