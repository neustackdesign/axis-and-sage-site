import * as React from "react";
/** MarkAvatar: the brand's quiet icon — the point where the two ribbons intersect, cropped into a circle. Use for social avatars, favicons-at-size, story bubbles, stationery seals and author chips for the firm. */
export interface MarkAvatarProps {
  /** Diameter in px. Default 48. Min 24. */
  size?: number;
  /** "midnight" (default) or "cloud" ground inside the circle. */
  ground?: "midnight" | "cloud";
  title?: string;
}
export declare function MarkAvatar(props: MarkAvatarProps): JSX.Element;
