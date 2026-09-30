import Image from "next/image";
import type { ReactNode } from "react";
import { planes } from "@/content/method";
import { InView } from "./InView";

/** PlaneStack: the method in four layers. The action plane is orange. Steps sit in a spec column to the right. */
export function PlaneStack({ steps }: { steps: { index: string; title: string; body: ReactNode }[] }) {
  return (
    <InView className="plane-stack">
      <div className="planes" role="img" aria-label="Four planes, top to bottom: the decision, the terms, the moment, the action. The action is marked in orange.">
        {planes.map((p) => (
          <div className="plane-row" key={p.index}>
            <span className="t-label">{p.index}</span>
            <div className={`plane plane-${p.kind}`}>{p.name}</div>
          </div>
        ))}
      </div>
      <ol className="plane-steps">
        {steps.map((s) => (
          <li key={s.index}>
            <span className="t-label">{s.index}</span>
            <div><h3>{s.title}</h3><p>{s.body}</p></div>
          </li>
        ))}
      </ol>
    </InView>
  );
}

export type FrameImage = { src: string; alt: string; credit: string };

/** PaintingFrame.Hero: the image above, paper panel below, with the credit label on the image. One per page. */
export function PaintingFrame({ image, children, aside, hero }: { image: FrameImage; children: ReactNode; aside?: ReactNode; hero?: boolean }) {
  return (
    <div className={`painting-frame${hero ? " is-hero" : ""}`}>
      <div className="painting">
        <Image src={image.src} alt={image.alt} fill priority={hero} sizes="(max-width: 1440px) 100vw, 1392px" />
        <span className="painting-label t-label">{image.credit}</span>
      </div>
      <div className="painting-panel">
        <div>{children}</div>
        <div className="painting-panel-mark">{aside}<img src="/brand/mark-charcoal.svg" alt="" width={44} height={19} /></div>
      </div>
    </div>
  );
}

/** Artifact.Screen: a plain device outline with the confirm action in orange. */
export function ArtifactScreen({ kicker, title, rows, media, action }: { kicker: string; title: string; rows?: [string, string][]; media?: string; action: string }) {
  return (
    <div className="artifact-screen" aria-hidden="true">
      <span className="artifact-screen-kicker">{kicker}</span>
      <span className="artifact-screen-title">{title}</span>
      {media ? <span className="artifact-screen-media">{media}</span> : null}
      {rows?.map(([k, v]) => <span className="artifact-screen-row" key={k}><span>{k}</span><b>{v}</b></span>)}
      <span className="artifact-screen-btn">{action}</span>
    </div>
  );
}

/** Artifact.Paper: an A4 sheet; the signature line is the orange action point. */
export function ArtifactDoc({ kicker, title, lines = 5, sign }: { kicker: string; title: string; lines?: number; sign: string }) {
  const widths = [92, 78, 86, 60, 88, 70, 82];
  return (
    <div className="artifact-doc" aria-hidden="true">
      <span className="artifact-doc-kicker">{kicker}</span>
      <span className="artifact-doc-title">{title}</span>
      {Array.from({ length: lines }, (_, i) => <span key={i} className="artifact-line" style={{ width: `${widths[i % widths.length]}%` }} />)}
      <span className="artifact-sign">{sign}</span>
    </div>
  );
}
