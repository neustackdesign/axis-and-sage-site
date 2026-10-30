import * as React from "react";
/**
 * Site navigation bar with What we do / Library dropdown panels, Scorecard link and the orange Book a call button.
 * @startingPoint section="Navigation" subtitle="Cloud nav bar with dropdowns" viewport="1280x420"
 */
export interface SiteHeaderProps {
  /** default = sticky Cloud bar; hero = transparent, on-dark, laid over HomepageCover. */
  variant?: "default" | "hero";
  /** Label of the current page, gets the orange underline. */
  current?: string;
  assetBase?: string;
  onNavigate?: (label: string) => void;
}
export declare function SiteHeader(props: SiteHeaderProps): JSX.Element;
