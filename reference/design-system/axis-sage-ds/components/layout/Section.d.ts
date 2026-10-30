import * as React from "react";
/** Full-width page band with a tone and the 1280px wrap. */
export interface SectionProps {
  id?: string;
  /** cloud (default) · alt · sage (tools, library) · lilac (notes, voice) · creme (people, stories) · midnight (at most two per page). */
  tone?: "cloud" | "alt" | "sage" | "lilac" | "creme" | "midnight";
  /** 64px block padding instead of 96px. */
  tight?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function Section(props: SectionProps): JSX.Element;
