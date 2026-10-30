import * as React from "react";
/** Said-vs-did case timeline with pinned values over a dotted baseline; DayTimeline is the simple dotted day list. */
export interface TimelineProps {
  label: string;
  baseline: { value: number; label: string };
  steps: { when: string; said: string; value: number; valueLabel: string; did: string; action?: boolean }[];
  source?: string;
}
export declare function Timeline(props: TimelineProps): JSX.Element;
export interface DayTimelineProps { days: { when: string; what: string }[]; }
export declare function DayTimeline(props: DayTimelineProps): JSX.Element;
