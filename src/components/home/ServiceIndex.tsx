"use client";

import { useState } from "react";
import type { HomePage, Service } from "@/types/content";
import { Apparatus, EditorialImage, SectionOpening, TextLink } from "./EditorialPrimitives";

const assetRoot = "/images/axis-sage";
const serviceImages: Record<string, { src: string; alt: string }> = {
  strategy: { src: `${assetRoot}/services-chess.jpg`, alt: "Chess pieces arranged for a strategy discussion" },
  design: { src: `${assetRoot}/earlybean.jpg`, alt: "Earlybean product experience sketches" },
  growth: { src: `${assetRoot}/nature-roots-live.jpg`, alt: "Nature Roots product packaging" },
  "venture-building": { src: `${assetRoot}/about-4.jpg`, alt: "" },
  storytelling: { src: `${assetRoot}/summit-live.jpg`, alt: "Uganda Investor Summit stage" },
};

function ServiceRow({ service, index, open, onToggle }: { service: Service; index: number; open: boolean; onToggle: () => void }) {
  const approved = service.detailApproved === true;
  return <article className={`service-index-row${open ? " is-open" : ""}`}>
    <div className="service-index-trigger" role={approved ? "button" : undefined} tabIndex={approved ? 0 : undefined} onClick={approved ? onToggle : undefined} onKeyDown={approved ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onToggle(); } } : undefined} aria-expanded={approved ? open : undefined}>
      <Apparatus className="service-index-number">0{index + 1}</Apparatus>
      <div><span className="service-index-title">{service.title}</span><p className="service-summary">{service.summary}</p></div>
      {approved ? <span className="service-index-sign" aria-hidden="true">{open ? "−" : "+"}</span> : null}
    </div>
    {approved ? <div className="service-index-detail" aria-hidden={!open}><div className="service-index-detail-inner"><p>{service.summary}</p><div className="service-capabilities">{service.capabilities?.map((capability) => <Apparatus key={capability}>{capability}</Apparatus>)}</div><TextLink href="#contact">Work with us</TextLink></div></div> : null}
  </article>;
}

export function ServiceIndex({ data }: { data: NonNullable<HomePage["services"]> }) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const firstExpandable = items.find((item) => item.detailApproved)?.slug || null;
  const [openSlug, setOpenSlug] = useState<string | null>(firstExpandable);
  const activeService = items.find((item) => item.slug === openSlug) || items[0];
  const mappedImage = serviceImages[activeService?.slug] || serviceImages.strategy;
  const activeImage = { src: activeService?.image?.src || mappedImage.src, alt: activeService?.image?.alt || mappedImage.alt };
  return <section className="landing-section service-index" id="services">
    <SectionOpening index="02" label={data.label} />
    <div className="section-copy prose" data-reveal="service-intro"><h2>{data.heading}</h2><p>{data.introduction}</p></div>
    <div className="service-layout breakout"><div className="service-list" data-reveal="service-list">{items.map((service, index) => <ServiceRow key={service.slug} service={service} index={index} open={openSlug === service.slug} onToggle={() => setOpenSlug(openSlug === service.slug ? null : service.slug)} />)}</div><figure className="service-index-figure" data-reveal="service-figure"><EditorialImage key={activeService?.slug} fallback={activeImage.src} alt={activeImage.alt} /><figcaption><Apparatus>{activeService?.title || "Selected service"} / selected view</Apparatus></figcaption></figure></div>
  </section>;
}
