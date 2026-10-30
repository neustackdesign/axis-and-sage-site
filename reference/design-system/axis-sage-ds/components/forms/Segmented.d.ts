import * as React from "react";
/** Square segmented control; the pressed option inverts to midnight. For Yes / Partly / No answers and 1–5 scales. */
export interface SegmentedProps {
  options: string[];
  value?: string;
  onChange?: (v: string) => void;
  error?: boolean;
  scaleLabels?: [string, string];
}
export declare function Segmented(props: SegmentedProps): JSX.Element;
