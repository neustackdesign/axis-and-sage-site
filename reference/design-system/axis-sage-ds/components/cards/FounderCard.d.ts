import * as React from "react";
/** Split founders card — Cloud "Terms" or midnight "Moments" — with portrait, serif line, body and ▸ proof list. */
export interface FounderCardProps {
  person: { name: string; title: string; practice: string; half: "terms" | "moments"; initials?: string; portrait?: string; line: string; cardBody: string; cardProof?: string[] };
  href?: string;
}
export declare function FounderCard(props: FounderCardProps): JSX.Element;
