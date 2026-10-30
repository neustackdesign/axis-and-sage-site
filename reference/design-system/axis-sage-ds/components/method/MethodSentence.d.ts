import * as React from "react";
/** Interactive mono fill-in sentence "WE NEED ___ TO ___ BY ___" with the diagnosis panel; the brand's signature interaction. */
export interface MethodSentenceProps {
  rows: { who: string; action: string; stops: string; look: string }[];
  panel?: boolean;
}
export declare function MethodSentence(props: MethodSentenceProps): JSX.Element;
