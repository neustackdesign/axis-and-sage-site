import * as React from "react";
/** Ruled grid of spec cells (mono label top, sans value bottom); SpecList is the numbered-row variant. */
export interface SpecGridProps {
  cells: { label: string; value: React.ReactNode; index?: string }[];
  cols?: number;
}
export declare function SpecGrid(props: SpecGridProps): JSX.Element;
export interface SpecListProps { items: React.ReactNode[]; numbered?: boolean; }
export declare function SpecList(props: SpecListProps): JSX.Element;
