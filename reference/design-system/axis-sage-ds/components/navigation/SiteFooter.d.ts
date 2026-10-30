import * as React from "react";
/**
 * Midnight site footer: newsletter row, lockup + four link columns, contact and legal lines, orbit rings behind.
 * @startingPoint section="Navigation" subtitle="Midnight footer with newsletter" viewport="1280x620"
 */
export interface SiteFooterProps {
  assetBase?: string;
  onNavigate?: (label: string) => void;
}
export declare function SiteFooter(props: SiteFooterProps): JSX.Element;
