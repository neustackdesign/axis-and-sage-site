import * as React from "react";
/** Underlined medium-weight link with a trailing ▸; the secondary action everywhere ("Read the case ▸"). */
export interface TextLinkProps {
  href?: string;
  /** Trailing ▸ (default true). */
  arrow?: boolean;
  onClick?: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
}
export declare function TextLink(props: TextLinkProps): JSX.Element;
