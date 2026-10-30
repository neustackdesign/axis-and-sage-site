import * as React from "react";
/** Square-cornered 4:5 portrait, with a serif-initials fallback tile. */
export interface PortraitProps {
  src?: string;
  alt?: string;
  /** Serif initials shown when there is no src. */
  initials?: string;
  dark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function Portrait(props: PortraitProps): JSX.Element;
