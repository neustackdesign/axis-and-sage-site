import React from "react";
/** Portrait: 4:5 photo, or a serif initials tile while no photo is supplied (Cloud for Terms, midnight for Moments). */
export function Portrait({ src, alt = "", initials, dark, className = "", style }) {
  const cls = ["portrait", dark ? "portrait-dark" : "", !src && initials ? "portrait-initials" : "", className].filter(Boolean).join(" ");
  return (
    <div className={cls} style={style}>
      {src ? <img src={src} alt={alt} /> : initials ? <span className="portrait-monogram" role="img" aria-label={alt}>{initials}</span> : null}
    </div>
  );
}
