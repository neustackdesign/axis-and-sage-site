import * as React from "react";
/**
 * Full-bleed homepage cover: graded photo with left shade and grain, serif headline, orange + outline buttons, mono metadata footer.
 * @startingPoint section="Sections" subtitle="Homepage photo cover" viewport="1280x760"
 */
export interface HomepageCoverProps {
  /** Landscape photo URL; Lagos skyline at sunset in production. */
  image?: string;
  eyebrow?: string[];
  headline: string;
  sub?: string;
  primary?: string;
  secondary?: string;
  practices?: string[];
  /** "LAGOS AT SUNSET · PHOTO: …" */
  credit?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}
export declare function HomepageCover(props: HomepageCoverProps): JSX.Element;
