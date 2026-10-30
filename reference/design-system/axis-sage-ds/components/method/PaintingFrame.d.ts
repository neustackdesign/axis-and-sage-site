import * as React from "react";
/** Framed image (midnight mat, credit label) above a Cloud text panel with the midnight mark. */
export interface PaintingFrameProps {
  image: { src: string; alt?: string; credit?: string };
  hero?: boolean;
  aside?: React.ReactNode;
  markSrc?: string;
  children?: React.ReactNode;
}
export declare function PaintingFrame(props: PaintingFrameProps): JSX.Element;
