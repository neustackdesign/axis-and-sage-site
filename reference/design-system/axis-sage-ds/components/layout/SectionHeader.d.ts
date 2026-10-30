import * as React from "react";
/** The signature 3/9 left-rail header: rule on top, mono numbered label left, serif headline right. Pair with RailBody. */
export interface SectionHeaderProps {
  id?: string;
  /** "01 · THE GAP" */
  label: string;
  railText?: React.ReactNode;
  title: React.ReactNode;
  lede?: React.ReactNode;
  level?: 1 | 2;
  children?: React.ReactNode;
}
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
export interface RailBodyProps { full?: boolean; className?: string; children?: React.ReactNode; }
export declare function RailBody(props: RailBodyProps): JSX.Element;
