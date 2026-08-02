"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Faq, HomePage, Project, Testimonial } from "@/types/content";
import { ContactForm } from "@/components/ui/ContactForm";

function SectionIntro({ label, heading, children, dark = false }: { label: string; heading: string; children?: React.ReactNode; dark?: boolean }) {
  return <div className={`section-intro${dark ? " section-intro-dark" : ""}`}><p className="eyebrow">{label}</p><h2>{heading}</h2>{children ? <div className="section-intro-copy">{children}</div> : null}</div>;
}

function ArrowLink({ href, children, dark = false }: { href: string; children: React.ReactNode; dark?: boolean }) {
  return <Link className={`text-link${dark ? " text-link-light" : ""}`} href={href}>{children}<span aria-hidden="true">↗</span></Link>;
}

function Hero({ data }: { data: HomePage["hero"] }) {
  const [activeWord, setActiveWord] = useState(0);
  useEffect(() => { const id = window.setInterval(() => setActiveWord((word) => (word + 1) % data.eyebrow.length), 2600); return () => window.clearInterval(id); }, [data.eyebrow.length]);
  return <section className="hero" id="top">
    <div className="hero-orbit hero-orbit-one" aria-hidden="true" /><div className="hero-orbit hero-orbit-two" aria-hidden="true" />
    <div className="hero-content container">
      <div className="hero-meta"><span className="eyebrow">Axis &amp; Sage</span><span className="hero-location">Africa / GCC / Everywhere in between</span></div>
      <div className="hero-framing" aria-live="polite"><span className="hero-word-index">0{activeWord + 1}</span><span className="hero-word">{data.eyebrow[activeWord]}</span><span className="hero-word-line" /></div>
      <h1>{data.heading}</h1>
      <div className="hero-bottom"><p>{data.body}</p><div className="hero-actions"><ArrowLink href={data.primaryCta.href} dark>{data.primaryCta.label}</ArrowLink>{data.secondaryCta ? <ArrowLink href={data.secondaryCta.href} dark>{data.secondaryCta.label}</ArrowLink> : null}</div></div>
    </div>
    <a className="scroll-cue" href="#about"><span>Scroll to explore</span><span aria-hidden="true">↓</span></a>
  </section>;
}

function About({ data }: { data: HomePage["about"] }) {
  return <section className="section about-section" id="about"><div className="container about-grid"><SectionIntro label={data.label} heading={data.heading}><p>{data.body}</p></SectionIntro><div className="about-visual" aria-label="Abstract Axis & Sage visual composition"><div className="visual-panel visual-panel-sage" /><div className="visual-panel visual-panel-sand" /><div className="visual-panel visual-panel-ink"><span>A / S</span></div><div className="visual-caption">Strategy<br />meets story.</div></div></div><div className="container about-bottom"><div className="approach-block"><p className="eyebrow">Our approach</p><p className="approach-copy">{data.approach}</p></div><div className="about-support">{data.support.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>{data.statistics?.length ? <div className="container stats-grid">{data.statistics.map((stat) => <div key={stat.label} className="stat-card"><strong>{stat.value}</strong><p>{stat.label}</p><small>{stat.detail}</small></div>)}</div> : null}</section>;
}

function Services({ data }: { data: HomePage["services"] }) {
  const [active, setActive] = useState(data.items[0]?.slug ?? "");
  return <section className="section services-section" id="services"><div className="container"><SectionIntro label={data.label} heading={data.heading}><p>{data.introduction}</p></SectionIntro><div className="services-list">{data.items.map((service, index) => <article className={`service-card${active === service.slug ? " is-active" : ""}`} key={service.slug}><button className="service-toggle" type="button" aria-expanded={active === service.slug} onClick={() => setActive(active === service.slug ? "" : service.slug)}><span className="service-index">0{index + 1}</span><span className="service-title">{service.title}</span><span className="service-plus" aria-hidden="true">{active === service.slug ? "−" : "+"}</span></button><div className="service-detail"><div><p className={service.summary ? "" : "pending-copy"}>{service.summary || "Description pending editorial confirmation."}</p>{service.capabilities?.length ? <ul className="capability-list">{service.capabilities.map((item) => <li key={item}>{item}</li>)}</ul> : null}</div><ArrowLink href="#contact">Work with us</ArrowLink></div></article>)}</div></div></section>;
}

function ProjectVisual({ project }: { project: Project }) {
  return <div className={`project-visual project-visual-${project.tone}`} aria-label={`${project.title} visual placeholder pending approved project imagery`}><span className="project-visual-mark">{project.title.split(" ").map((word) => word[0]).join("")}</span><span className="project-visual-note">Approved imagery<br />pending review</span></div>;
}

function Projects({ data }: { data: HomePage["projects"] }) {
  const [active, setActive] = useState(0);
  const project = data.items[active];
  if (!project) return null;
  const next = () => setActive((index) => (index + 1) % data.items.length);
  const previous = () => setActive((index) => (index - 1 + data.items.length) % data.items.length);
  return <section className="section projects-section" id="our-work"><div className="container"><SectionIntro label={data.label} heading={data.heading}><p>{data.introduction}</p></SectionIntro><div className="project-stage"><ProjectVisual project={project} /><div className="project-copy"><div className="project-meta"><span>0{active + 1} / 0{data.items.length}</span><span>{project.tags.join(" · ")}</span></div><h3>{project.title}</h3><p>{project.summary}</p><div className="project-footer"><ArrowLink href={`/work/${project.slug}`}>View project</ArrowLink><div className="carousel-controls"><button type="button" onClick={previous} aria-label="Previous project">←</button><button type="button" onClick={next} aria-label="Next project">→</button></div></div></div></div><div className="project-dots" aria-label="Project slides">{data.items.map((item, index) => <button key={item.slug} type="button" aria-label={`Show ${item.title}`} aria-current={index === active} onClick={() => setActive(index)} />)}</div></div></section>;
}

function Testimonials({ data }: { data?: HomePage["testimonials"] }) {
  const approved = data?.items.filter((testimonial) => testimonial.approved) ?? [];
  if (!approved.length) return null;
  return <section className="section testimonials-section" id="testimonials"><div className="container"><SectionIntro label={data?.label ?? "Testimonials"} heading={data?.heading ?? "Hear from our clients"}><p>{data?.introduction}</p></SectionIntro><div className="testimonial-grid">{approved.map((testimonial) => <TestimonialCard key={testimonial._id ?? testimonial.personName} testimonial={testimonial} />)}</div></div></section>;
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return <figure className="testimonial-card"><blockquote>“{testimonial.quote}”</blockquote><figcaption><strong>{testimonial.personName}</strong><span>{[testimonial.role, testimonial.organisation].filter(Boolean).join(" · ")}</span></figcaption></figure>;
}

function Faqs({ data }: { data: HomePage["faqs"] }) {
  const [open, setOpen] = useState(0);
  const items = data.items.filter((faq) => faq.display !== false);
  return <section className="section faq-section" id="faqs"><div className="container faq-grid"><SectionIntro label={data.label} heading={data.heading}><p>{data.introduction}</p><ArrowLink href={data.cta.href}>{data.cta.label}</ArrowLink></SectionIntro><div className="faq-list">{items.map((faq, index) => <FaqItem key={faq._id ?? faq.question} faq={faq} open={open === index} onClick={() => setOpen(open === index ? -1 : index)} />)}</div></div></section>;
}

function FaqItem({ faq, open, onClick }: { faq: Faq; open: boolean; onClick: () => void }) {
  const id = `faq-answer-${faq.question.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return <div className={`faq-item${open ? " is-open" : ""}`}><button type="button" aria-expanded={open} aria-controls={id} onClick={onClick}><span>{faq.question}</span><span aria-hidden="true">{open ? "−" : "+"}</span></button><div className="faq-answer" id={id} hidden={!open}><p>{faq.answer}</p></div></div>;
}

function Contact({ data }: { data: HomePage["contact"] }) {
  return <section className="section contact-section" id="contact"><div className="container contact-grid"><div className="contact-copy"><SectionIntro label={data.label} heading={data.heading}><p>{data.introduction}</p></SectionIntro>{data.offices?.length ? <div className="contact-details"><p className="eyebrow">Office</p>{data.offices.map((office) => <p key={office}>{office}</p>)}</div> : <p className="pending-panel">Verified office and email details will appear here once confirmed.</p>}{data.email ? <div className="contact-details"><p className="eyebrow">Email</p><a href={`mailto:${data.email}`}>{data.email}</a></div> : null}</div><div className="contact-form-wrap"><p className="eyebrow">Start a conversation</p><ContactForm /></div></div></section>;
}

export function HomeSections({ home }: { home: HomePage }) {
  return <><Hero data={home.hero} /><About data={home.about} /><Services data={home.services} /><Projects data={home.projects} /><Testimonials data={home.testimonials} /><Faqs data={home.faqs} /><Contact data={home.contact} /></>;
}
