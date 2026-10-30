import * as React from "react";
/** Square midnight checkbox with label; used in tool checklists and consent lines. */
export interface CheckProps {
  label: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (e: any) => void;
  error?: boolean;
}
export declare function Check(props: CheckProps): JSX.Element;
