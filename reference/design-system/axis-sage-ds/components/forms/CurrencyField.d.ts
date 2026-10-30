import * as React from "react";
/** Money input with a fused NGN / USD / AED toggle; the selected currency inverts to midnight. */
export interface CurrencyFieldProps {
  currencies?: string[];
  currency?: string;
  onCurrency?: (c: string) => void;
  value?: string;
  onChange?: (e: any) => void;
  placeholder?: string;
}
export declare function CurrencyField(props: CurrencyFieldProps): JSX.Element;
