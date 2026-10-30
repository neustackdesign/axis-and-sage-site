import * as React from "react";
/** Balance: a block that keeps an even shape. Every line runs close to the same length and the last line is at least two-thirds of the longest. Loading the bundle balances all p, li, dd, blockquote, td and .t-body blocks automatically; wrap other copy in <Balance>. */
export interface BalanceProps {
  /** Element to render. Default "div". */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
export declare function Balance(props: BalanceProps): JSX.Element;
/** Re-run balancing under a root (it already runs on load, resize and DOM change). */
export declare function balanceText(root?: ParentNode): void;
export declare function startBalance(): void;
