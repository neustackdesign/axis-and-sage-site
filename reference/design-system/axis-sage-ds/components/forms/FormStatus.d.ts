import * as React from "react";
/** Plain-language form result line (success / error) or the last-resort mailto fallback panel. */
export interface FormStatusProps {
  state?: "success" | "error" | "fallback";
  fallbackHref?: string;
  children?: React.ReactNode;
}
export declare function FormStatus(props: FormStatusProps): JSX.Element;
