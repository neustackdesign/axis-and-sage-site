import * as React from "react";
/** Form field (input / textarea / select) with medium label, underline-only control and help/error line. */
export interface FieldProps {
  label: string;
  /** false shows "(optional)". */
  required?: boolean;
  help?: string;
  state?: "error" | "success";
  as?: "input" | "textarea" | "select";
  options?: string[];
  dark?: boolean;
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: any) => void;
}
export declare function Field(props: FieldProps): JSX.Element;
