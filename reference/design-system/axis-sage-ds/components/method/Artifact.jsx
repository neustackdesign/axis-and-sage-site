import React from "react";
/** Artifact.Screen: plain device outline, confirm action in orange. Captioned "redrawn, not screenshots". */
export function ArtifactScreen({ kicker, title, rows = [], media, action }) {
  return (
    <div className="artifact-screen" aria-hidden="true">
      <span className="artifact-screen-kicker">{kicker}</span>
      <span className="artifact-screen-title">{title}</span>
      {media ? <span className="artifact-screen-media">{media}</span> : null}
      {rows.map(([k, v]) => <span className="artifact-screen-row" key={k}><span>{k}</span><b>{v}</b></span>)}
      <span className="artifact-screen-btn">{action}</span>
    </div>
  );
}
/** Artifact.Paper: an A4 sheet; the signature line is the orange action point. */
export function ArtifactDoc({ kicker, title, lines = 5, sign }) {
  const w = [92, 78, 86, 60, 88, 70, 82];
  return (
    <div className="artifact-doc" aria-hidden="true">
      <span className="artifact-doc-kicker">{kicker}</span>
      <span className="artifact-doc-title">{title}</span>
      {Array.from({ length: lines }, (_, i) => <span key={i} className="artifact-line" style={{ width: w[i % w.length] + "%" }} />)}
      <span className="artifact-sign">{sign}</span>
    </div>
  );
}
/** Stage that holds artifacts: midnight by default, cloud-200 with paper. */
export function Artifact({ paper, children }) {
  const n = React.Children.count(children);
  return <div className={"artifact-stage" + (paper ? " is-paper" : "")} style={{ "--n": n }}>{children}</div>;
}
