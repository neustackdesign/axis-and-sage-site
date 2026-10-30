import * as React from "react";
/** Scorecard result: sage panel with Terms/Moments mono scores, then Quadrant and Blockers in the body. */
export interface ResultPanelProps {
  scores: { label: string; value: number; max?: number }[];
  children?: React.ReactNode;
}
export declare function ResultPanel(props: ResultPanelProps): JSX.Element;
export interface QuadrantProps { x?: number; y?: number; labels?: string[]; you?: number; xLabel?: string; yLabel?: string; }
export declare function Quadrant(props: QuadrantProps): JSX.Element;
export interface BlockersProps { items: { text: string; check?: string }[]; }
export declare function Blockers(props: BlockersProps): JSX.Element;
