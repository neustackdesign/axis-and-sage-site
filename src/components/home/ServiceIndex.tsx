"use client";

import { useState } from "react";
import type { HomePage, Service } from "@/types/content";
import { Apparatus, EditorialImage, SectionOpening, TextLink } from "./EditorialPrimitives";

const assetRoot = "/images/axis-sage";
const serviceImages = [`${assetRoot}/services-chess.jpg`, `${assetRoot}/service-chess.jpg`, `${assetRoot}/about-4.jpg`, `${assetRoot}/about-6.jpg`, `${assetRoot}/about-3.jpg`];

function ServiceRow({ service, index, open, onToggle }: { service: Service; index: number; open: boolean; onToggle: () => void }) {
  const approved = service.detailApproved === true;
  return <article className={`service-index-row${open ? " is-open" : ""}`}>
    <button className="service-index-trigger" type="button" disabled={!approved} aria-expanded={approved && open} onClick={approved ? onToggle : undefined}>
      <Apparatus className="service-index-number">0{index + 1}</Apparatus>
      <span className="service-index-title">{service.title}</span>
      <span className="service-index-sign" aria-hidden="true">{approved && open ? "−" : "+"}</span>
    </button>
    {approved ? <div className="service-index-detail" aria-hidden={!open}><div className="service-index-detail-inner"><p>{service.summary}</p><div className="service-capabilities">{service.capabilities?.map((capability) => <Apparatus key={capability}>{capability}</Apparatus>)}</div><TextLink href="#contact">Work with us</TextLink></div></div> : null}
  </article>;
}

export function ServiceIndex({ data }: { data: HomePage["services"] }) {
  const [open, setOpen] = useState(0);
  const activeImage = serviceImages[Math.max(0, open)] || serviceImages[0];
  return <section className="landing-section service-index" id="services">
    <SectionOpening index="02" label={data.label} />
    <div className="section-copy prose" data-reveal="service-intro"><h2>{data.heading}</h2><p>{data.introduction}</p></div>
    <div className="service-list prose" data-reveal="service-list">{data.items.map((service, index) => <ServiceRow key={service.slug} service={service} index={index} open={open === index} onToggle={() => setOpen(open === index ? -1 : index)} />)}</div>
    <figure className="service-index-figure breakout" data-reveal="service-figure"><EditorialImage fallback={activeImage} alt="Axis & Sage service image" /><figcaption><Apparatus>Axis &amp; Sage / selected service view</Apparatus></figcaption></figure>
  </section>;
}

