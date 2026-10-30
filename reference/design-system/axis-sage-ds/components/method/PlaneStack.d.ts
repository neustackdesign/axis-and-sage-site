import * as React from "react";
/** The four-plane method diagram (decision → terms → moment → action, action in orange) with numbered steps beside it. */
export interface PlaneStackProps {
  steps: { index: string; title: string; body: React.ReactNode }[];
}
export declare function PlaneStack(props: PlaneStackProps): JSX.Element;
