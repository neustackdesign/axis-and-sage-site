import * as React from "react";
/** Work-index cell (place in a .work-grid): sector, name, one-line result, role and action chips. */
export interface WorkCardProps {
  name: string;
  sector: string;
  provenance?: string;
  line: string;
  roles?: string[];
  actions?: string[];
  href?: string;
}
export declare function WorkCard(props: WorkCardProps): JSX.Element;
