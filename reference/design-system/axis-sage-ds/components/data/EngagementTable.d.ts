import * as React from "react";
/**
 * Pricing/plan comparison table with mono row heads; the recommended column is inverted to midnight and holds the only orange button.
 * @startingPoint section="Data" subtitle="Engagements and pricing table" viewport="1100x620"
 */
export interface EngagementTableProps {
  columns: { name: string; recommended?: boolean; price: string; time: string; bring: string; weDo: string; youGet: string; cta: { label: string; href?: string } }[];
}
export declare function EngagementTable(props: EngagementTableProps): JSX.Element;
