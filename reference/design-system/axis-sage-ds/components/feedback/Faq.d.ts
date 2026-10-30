import * as React from "react";
/** Ruled accordion of numbered serif questions with a mono + / – toggle. */
export interface FaqProps {
  items: { q: string; a: string }[];
}
export declare function Faq(props: FaqProps): JSX.Element;
