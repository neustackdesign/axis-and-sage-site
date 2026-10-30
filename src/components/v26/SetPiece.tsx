import Link from "next/link";
import type { SetPiece as SetPieceData } from "@/lib/content/types";
import { DotField } from "./DotField";

/** GV Solutions: the structure redrawn from the engagement description, names as recorded. */
function Merger() {
  const branches: [number, number, string][] = [[14.6, 80.3, "Finance"], [32.3, 85.3, "Legal"], [50, 87, "Brand"], [67.7, 85.3, "Technology"], [85.4, 80.3, "Data"]];
  return (
    <div className="mg" aria-hidden="true">
      <svg viewBox="0 0 632 600" preserveAspectRatio="none">
        <path className="path-d" d="M150 120 C 220 120, 230 230, 316 250 M482 120 C 412 120, 402 230, 316 250" fill="none" stroke="var(--midnight-900)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d="M316 330 L 316 390 M316 390 L 92 470 M316 390 L 204 500 M316 390 L 316 510 M316 390 L 428 500 M316 390 L 540 470" fill="none" stroke="var(--midnight-900)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="bx" style={{ left: "23.7%", top: "20%" }}>iGate Advisory</span>
      <span className="bx" style={{ left: "76.3%", top: "20%" }}>Garden Ventures</span>
      <span className="bx main" style={{ left: "50%", top: "48%" }}>GV Solutions</span>
      <span style={{ position: "absolute", left: "50%", top: "65%", width: 18, height: 18, borderRadius: "50%", background: "var(--sunset-500)", transform: "translate(-50%, -50%)" }} />
      <span className="if seat" style={{ left: "50%", top: "65%" }}>COO seat · Axis &amp; Sage</span>
      {branches.map(([x, y, t]) => <span key={t} className="if" style={{ left: `${x}%`, top: `${y}%` }}>{t}</span>)}
    </div>
  );
}

function Media({ p }: { p: SetPieceData }) {
  if (p.visual === "image" && p.image) {
    return (
      <figure className="mf">
        <img src={p.image.url} alt={p.image.alt ?? ""} loading="lazy" width={p.image.width} height={p.image.height} style={{ objectPosition: p.image.focus ?? "50% 60%" }} />
        {p.caption ? <figcaption className="cap on-img">{p.caption}</figcaption> : null}
      </figure>
    );
  }
  if (p.visual === "merger") {
    return (
      <figure className="mf merger t-raised lite" role="img" aria-label="Structure diagram: iGate Advisory and Garden Ventures merged into GV Solutions. The COO seat, held by Axis & Sage, connects finance, legal, brand, technology and data.">
        <Merger />
        {p.caption ? <figcaption className="cap">{p.caption}</figcaption> : null}
      </figure>
    );
  }
  // dotField: the measured result, first proof figure "18% → 60%" read as per hundred.
  const [before, after] = (p.proof[0]?.numeral.match(/\d+/g) ?? ["0", "0"]).map(Number);
  return (
    <figure className="mf t-sage">
      <DotField before={before} after={after} toggle controlClass="seg" />
      {p.caption ? <figcaption className="cap">{p.caption}</figcaption> : null}
    </figure>
  );
}

/** Set piece: a calm text panel beside a dense media field. Dark pieces sit on Midnight with the media kept light. */
export function SetPiece({ p, mediaFirst, headingLevel = 3, readLabel = "Read the case" }: { p: SetPieceData; mediaFirst?: boolean; headingLevel?: 2 | 3; readLabel?: string }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const panel = (
    <div className={`tp${p.tone === "dark" ? " dark" : ""}`}>
      <p className="lbl">{p.eyebrow}</p>
      <H className="h2 s">{p.headline}</H>
      <p className="body">{p.body}</p>
      {p.hasCase ? <Link className="tl more go" href={`/work/${p.slug}`}>{readLabel}<span className="sr-only">: {p.name}</span></Link> : p.status ? <span className="lbl go">{p.status}</span> : null}
      {p.proof.length ? (
        <div className="proof">
          {p.proof.map((x) => <div key={x.numeral}><p className="stat s">{x.numeral}</p><p className="small muted">{x.label}</p></div>)}
        </div>
      ) : null}
    </div>
  );
  return <div className={`set rv d1${mediaFirst ? " media-first" : ""}`}>{mediaFirst ? <><Media p={p} />{panel}</> : <>{panel}<Media p={p} /></>}</div>;
}
