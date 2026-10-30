import * as React from "react";
/** Tool step indicator (done midnight, current orange) and a thin ProgressBar. */
export interface StepperProps {
  steps: string[];
  /** Zero-based index of the current step. */
  active?: number;
}
export declare function Stepper(props: StepperProps): JSX.Element;
export interface ProgressBarProps { label?: string; value?: number; }
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
