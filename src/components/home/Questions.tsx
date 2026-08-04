"use client";

import { useState } from "react";
import type { Faq, HomePage } from "@/types/content";
import { Apparatus, SectionOpening, TextLink } from "./EditorialPrimitives";

function QuestionRow({ faq, index, open, onToggle }: { faq: Faq; index: number; open: boolean; onToggle: () => void }) {
  const id = `question-answer-${faq.question.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return <article className={`question-row${open ? " is-open" : ""}`}><button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle}><Apparatus>0{index + 1}</Apparatus><span>{faq.question}</span><b aria-hidden="true">{open ? "−" : "+"}</b></button><div id={id} className="question-answer" aria-hidden={!open}><div><p>{faq.answer}</p></div></div></article>;
}

export function Questions({ data }: { data: NonNullable<HomePage["faqs"]> }) {
  const [open, setOpen] = useState(0);
  const sourceItems = Array.isArray(data?.items) ? data.items : [];
  const items = sourceItems.filter((faq) => faq.display !== false && faq.showOnHomepage !== false).slice(0, 6);
  return <section className="landing-section questions" id="faqs"><SectionOpening index="05" label={data.label} /><div className="question-layout prose"><div className="question-intro" data-reveal="question-intro"><h2>{data.heading}</h2><p>{data.introduction}</p></div><div className="question-list" data-reveal="question-list">{items.map((faq, index) => <QuestionRow key={faq._id ?? faq.question} faq={faq} index={index} open={open === index} onToggle={() => setOpen(open === index ? -1 : index)} />)}</div><div className="question-cta"><TextLink href={data.cta.href}>{data.cta.label}</TextLink></div></div></section>;
}
