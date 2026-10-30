import * as React from "react";
/** Square 48px button; primary is the single orange next action per view, secondary is outlined midnight. */
export interface ButtonProps {
  variant?: "primary" | "secondary" | "dark";
  /** "sm" = 44px tall, 15px label (header). */
  size?: "sm";
  block?: boolean;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: (e: any) => void;
  className?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): JSX.Element;
