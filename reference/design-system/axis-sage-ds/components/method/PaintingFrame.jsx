import React from "react";
/** PaintingFrame.Hero: midnight frame, image above with credit label, Cloud panel below. One per page. */
export function PaintingFrame({ image, children, aside, hero, markSrc = "assets/brand/mark-midnight.svg" }) {
  return (
    <div className={"painting-frame" + (hero ? " is-hero" : "")}>
      <div className="painting">
        <img src={image.src} alt={image.alt || ""} style={{ position: "absolute", inset: 0 }} />
        {image.credit ? <span className="painting-label t-label">{image.credit}</span> : null}
      </div>
      <div className="painting-panel">
        <div>{children}</div>
        <div className="painting-panel-mark">{aside}<img src={markSrc} alt="" width={44} height={19} /></div>
      </div>
    </div>
  );
}
