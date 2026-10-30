import * as React from "react";
/** Mono uppercase pill tag for roles and conversion actions; becomes a filter toggle when given onClick. */
export interface ChipProps {
  label: string;
  /** role = outlined (FOUNDED, RAN, BUILT); conversion = sage fill (CUSTOMERS BUY). */
  kind?: "role" | "conversion";
  /** Filter state when used as a button. */
  pressed?: boolean;
  onClick?: (e: any) => void;
}
export declare function Chip(props: ChipProps): JSX.Element;
export interface ChipRowProps { chips: { label: string; kind?: "role" | "conversion" }[]; label?: string; }
export declare function ChipRow(props: ChipRowProps): JSX.Element;
