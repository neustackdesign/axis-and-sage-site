import React from "react";
/** PullQuote: serif 30/38 between a strong rule and a light rule. */
export function PullQuote({ children }) {
  return <blockquote className="pull-quote" style={{ marginInline: 0 }}>{children}</blockquote>;
}
/** Callout: sage-100 panel, sage-400 border, sage-700 mono label. */
export function Callout({ label = "NOTE", children }) {
  return <aside className="callout"><span className="t-label">{label}</span><div>{children}</div></aside>;
}
/** AuthorCard: round 56px portrait, name, role. */
export function AuthorCard({ name, role, initials, src }) {
  return (
    <div className="author-card">
      <div className={"portrait" + (!src && initials ? " portrait-initials" : "")}>{src ? <img src={src} alt="" /> : <span className="portrait-monogram" style={{ fontSize: 20 }}>{initials}</span>}</div>
      <div><p className="author-name">{name}</p><p className="author-role">{role}</p></div>
    </div>
  );
}
/** DataTable: strong top rule, mono uppercase headers, ruled rows. */
export function DataTable({ columns = [], rows = [] }) {
  return <table className="data-table"><thead><tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table>;
}
/** ArticleEnd: midnight end band with a serif line and one action. */
export function ArticleEnd({ line = "Who needs to act?", cta = "Book a 30-minute call", href = "#" }) {
  return <div className="article-end"><p>{line}</p><a className="btn btn-primary" href={href}>{cta}</a></div>;
}
