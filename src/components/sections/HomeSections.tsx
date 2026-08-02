"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Faq, HomePage, ImageValue, Project, Service, Testimonial } from "@/types/content";
import { ContactForm } from "@/components/ui/ContactForm";

const assetRoot = "/images/axis-sage";
const projectAssets: Record<string, string> = {
  "nature-roots": `${assetRoot}/nature-roots-live.jpg`,
  earlybean: `${assetRoot}/earlybean-live.jpeg`,
  "uganda-investor-summit": `${assetRoot}/summit-live.jpg`,
};

function imageSource(image?: ImageValue, fallback?: string) {
  return image?.src || fallback;
}

function SourceImage({ image, fallback, alt, className }: { image?: ImageValue; fallback?: string; alt: string; className?: string }) {
  const src = imageSource(image, fallback);
  return src ? <img className={className} src={src} alt={image?.alt || alt} /> : <div className={`${className || "source-image"} source-image-empty`} role="img" aria-label={alt} />;
}

function SectionIntro({ label, heading, children, centered = false }: { label: string; heading: string; children?: React.ReactNode; centered?: boolean }) {
  return <div className={`section-intro${centered ? " section-intro-centered" : ""}`} data-reveal="section-intro"><span className="section-label">{label}</span><h2>{heading}</h2>{children ? <div className="section-intro-copy">{children}</div> : null}</div>;
}

function ArrowButton({ href, children, light = false }: { href: string; children: React.ReactNode; light?: boolean }) {
  return <Link className={`arrow-button${light ? " arrow-button-light" : ""}`} href={href}><span>{children}</span><b aria-hidden="true">↗</b></Link>;
}

function Hero({ data }: { data: HomePage["hero"] }) {
  return <section className="hero" id="top">
    <div className="hero-frame">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="hero-pills">{data.eyebrow.map((item, index) => <span key={item} data-reveal="hero-pill" style={{ "--reveal-delay": `${index * 140}ms` } as React.CSSProperties}><i />{item}</span>)}</div>
          <h1>{data.heading}</h1>
          <p data-reveal="hero-copy">{data.body}</p>
          <div data-reveal="hero-cta"><ArrowButton href={data.primaryCta.href} light>{data.primaryCta.label}</ArrowButton></div>
        </div>
        <div className="hero-media" data-reveal="hero-media">
          <SourceImage image={data.media} fallback={`${assetRoot}/hero-chess.jpg`} alt="Chess pieces on a board" />
        </div>
      </div>
    </div>
  </section>;
}

function About({ data }: { data: HomePage["about"] }) {
  const aboutImages = data.images?.length ? data.images : ["about-1.jpg", "about-2.jpg", "about-3.jpg", "about-4.jpg", "about-5.jpg", "about-6.jpg"].map((name) => ({ src: `${assetRoot}/${name}`, alt: "Axis & Sage editorial image" }));
  const stats = data.statistics?.filter((stat) => stat.value && stat.label) ?? [];
  return <section className="section about-section" id="about">
    <div className="container"><div className="about-intro"><SectionIntro label={data.label} heading={data.heading}><p>{data.body}</p></SectionIntro></div></div>
    <div className="about-strip" aria-label="Axis & Sage editorial images">{[...aboutImages, ...aboutImages].map((image, index) => <SourceImage key={`${image.src}-${index}`} image={image} alt="Axis & Sage editorial image" />)}</div>
    <div className="container about-lower"><div><span className="section-label">Our approach</span><p className="approach-copy">{data.approach}</p></div><div className="support-copy">{data.support.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>
    {stats.length ? <div className="container stats-grid">{stats.map((stat) => <article className="stat-card" key={stat.label}><strong>{stat.value}</strong><h3>{stat.label}</h3><p>{stat.detail}</p></article>)}</div> : null}
  </section>;
}

function ServiceRow({ service, index, open, onClick }: { service: Service; index: number; open: boolean; onClick: () => void }) {
  const icon = `${assetRoot}/service-${(index % 5) + 1}.svg`;
  const detailAvailable = service.detailApproved === true;
  return <article className={`service-row${open ? " is-open" : ""}`}>
    <button type="button" aria-expanded={detailAvailable && open} onClick={detailAvailable ? onClick : undefined}><span className="service-icon"><img src={icon} alt="" /></span><span className="service-title">{service.title}</span><span className="service-control" aria-hidden="true">{detailAvailable && open ? "×" : "+"}</span></button>
    {detailAvailable ? <div className={`service-detail${open ? " is-open" : ""}`} aria-hidden={!open}><div className="service-detail-inner"><p>{service.summary}</p><ul>{service.capabilities?.map((capability) => <li key={capability}>{capability}</li>)}</ul><ArrowButton href="#contact">Work with us</ArrowButton></div></div> : null}
  </article>;
}

function Services({ data }: { data: HomePage["services"] }) {
  const [open, setOpen] = useState(0);
  return <section className="section services-section" id="services"><div className="container"><SectionIntro label={data.label} heading={data.heading} centered><p>{data.introduction}</p></SectionIntro><div className="services-grid"><div className="services-media"><SourceImage fallback={`${assetRoot}/services-chess.jpg`} alt="Chess pieces on a board" className="service-photo" /></div><div className="services-list">{data.items.map((service, index) => <ServiceRow key={service.slug} service={service} index={index} open={open === index} onClick={() => setOpen(open === index ? -1 : index)} />)}</div></div></div></section>;
}

function ProjectCard({ project }: { project: Project }) {
  return <article className="project-card"><div className="project-media"><SourceImage image={project.cover} fallback={projectAssets[project.slug]} alt={`${project.title} project image`} /></div><div className="project-content"><h3>{project.title}</h3><p>{project.summary}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{project.testimonial ? <blockquote>“{project.testimonial.quote}”<cite>{project.testimonial.personName}</cite></blockquote> : null}</div></article>;
}

function Projects({ data }: { data: HomePage["projects"] }) {
  return <section className="section projects-section" id="our-work"><div className="container"><SectionIntro label={data.label} heading={data.heading} centered><p>{data.introduction}</p></SectionIntro><div className="project-list">{data.items.map((project) => <div key={project.slug} data-reveal="project-card"><ProjectCard project={project} /></div>)}</div></div></section>;
}

function Testimonials({ data }: { data?: HomePage["testimonials"] }) {
  if (!data?.items?.length) return null;
  const items = [...data.items, ...data.items];
  return <section className="section testimonials-section" id="testimonials"><div className="container"><SectionIntro label={data.label} heading={data.heading} centered><p>{data.introduction}</p></SectionIntro></div><div className="testimonial-track" aria-label="Client testimonials">{items.map((testimonial, index) => <TestimonialCard key={`${testimonial._id ?? testimonial.personName}-${index}`} testimonial={testimonial} index={index} />)}</div></section>;
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return <figure className={`testimonial-card testimonial-card-${index % 2 ? "tint" : "plain"}`}><strong className="stars">★★★★★</strong><blockquote>{testimonial.quote}</blockquote><figcaption><SourceImage image={testimonial.portrait} alt={`${testimonial.personName} portrait`} className="testimonial-portrait" /><span>{testimonial.personName}</span></figcaption></figure>;
}

function FaqItem({ faq, open, onClick }: { faq: Faq; open: boolean; onClick: () => void }) {
  const id = `faq-answer-${faq.question.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return <article className={`faq-item${open ? " is-open" : ""}`}><button type="button" aria-expanded={open} aria-controls={id} onClick={onClick}><span>{faq.question}</span><b aria-hidden="true">{open ? "×" : "+"}</b></button><div id={id} className={`faq-answer${open ? " is-open" : ""}`} aria-hidden={!open}><div className="faq-answer-inner"><p>{faq.answer}</p></div></div></article>;
}

function Faqs({ data }: { data: HomePage["faqs"] }) {
  const items = data.items.filter((faq) => faq.display !== false);
  const [open, setOpen] = useState(0);
  return <section className="section faq-section" id="faqs"><div className="container faq-grid"><SectionIntro label={data.label} heading={data.heading}><p>{data.introduction}</p><ArrowButton href={data.cta.href}>{data.cta.label}</ArrowButton></SectionIntro><div className="faq-list">{items.map((faq, index) => <FaqItem key={faq._id ?? faq.question} faq={faq} open={open === index} onClick={() => setOpen(open === index ? -1 : index)} />)}</div></div></section>;
}

function Contact({ data }: { data: HomePage["contact"] }) {
  return <section className="section contact-section" id="contact"><div className="contact-panel"><div className="contact-grid container"><div className="contact-copy"><SectionIntro label={data.label} heading={data.heading}><p>{data.introduction}</p></SectionIntro><div className="contact-details"><strong>Office</strong><span>{data.offices?.[0] || "Abu Dhabi, Dubai, UAE"}</span><strong>Email</strong><a href={`mailto:${data.email || "info@axisandsage.com"}`}>{data.email || "info@axisandsage.com"}</a></div></div><div className="contact-form-wrap"><ContactForm /></div></div></div></section>;
}

export function HomeSections({ home }: { home: HomePage }) {
  useEffect(() => {
    document.documentElement.classList.add("motion-enhanced");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("motion-enhanced");
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.15, rootMargin: "0px 0px -8%" });
    elements.forEach((element) => observer.observe(element));
    return () => { observer.disconnect(); document.documentElement.classList.remove("motion-enhanced"); };
  }, []);
  return <><Hero data={home.hero} /><About data={home.about} /><Services data={home.services} /><Projects data={home.projects} /><Testimonials data={home.testimonials} /><Faqs data={home.faqs} /><Contact data={home.contact} /></>;
}
