import React from "react";

const WAVE = "M 618.943 273.572 L 524.831 273.572 C 453.277 273.572 379.675 297.731 318.959 341.149 L 238.34 398.798 C 177.623 442.216 104.022 466.375 32.468 466.375 L 0 466.375 L 53.523 192.803 L 85.99 192.803 C 157.544 192.803 231.146 168.644 291.862 125.226 L 372.481 67.577 C 433.198 24.159 506.799 0 578.353 0 L 672.466 0 L 618.943 273.572 Z";
let uid = 0;

/** MarkAvatar: the quiet icon — the ribbons' intersection cropped in a Midnight circle (brand book §4). */
export function MarkAvatar({ size = 48, ground = "midnight", title = "Axis & Sage" }) {
  const id = React.useMemo(() => "as-av-" + (++uid), []);
  const bg = ground === "cloud" ? "var(--cloud-100)" : "var(--midnight-900)";
  return (
    <svg width={size} height={size} viewBox="0 0 310.813 310.813" role="img" aria-label={title} style={{ display: "block", flex: "none" }}>
      <clipPath id={id}><circle cx="155.4065" cy="155.4065" r="155.4065" /></clipPath>
      <g clipPath={"url(#" + id + ")"}>
        <rect width="310.813" height="310.813" fill={bg} />
        <g transform="translate(-513 102)">
          <path d={WAVE} fill="var(--mark-pink)" opacity="0.7" transform="translate(327 19)" />
          <path d={WAVE} fill="var(--mark-orange)" opacity="0.7" />
        </g>
      </g>
    </svg>
  );
}
