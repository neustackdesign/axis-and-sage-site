import * as React from "react";
/** Inner-page hero on Cloud: mono label in the rail, serif H1 and muted sub in the content column. */
export interface PageHeroProps {
  label: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  meta?: React.ReactNode;
}
export declare function PageHero(props: PageHeroProps): JSX.Element;
