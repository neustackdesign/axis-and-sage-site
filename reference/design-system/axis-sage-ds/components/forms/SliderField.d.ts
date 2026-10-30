import * as React from "react";
/** Calculator range input with mono readout and paired number box; used in the tools. */
export interface SliderFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  onChange?: (v: number) => void;
}
export declare function SliderField(props: SliderFieldProps): JSX.Element;
