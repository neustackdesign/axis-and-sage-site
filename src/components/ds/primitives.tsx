import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { glyphDots, type GlyphName } from "@/lib/glyphs";
import type { Chip as ChipData } from "@/content/work";

type Tone = "paper" | "alt" | "sage" | "charcoal";

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** Smart link: next/link for internal routes, <a> for external and mailto. */
export function SmartLink({ href, children, ...rest }: { href: string; children: ReactNode } & Omit<ComponentProps<"a">, "href">) {
  if (isExternal(href)) {
    const external = href.startsWith("http");
    return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>{children}</a>;
  }
  return <Link href={href} {...rest}>{children}</Link>;
}

/** Eyebrow: mono, 12/16, uppercase, +8%. An index number and a topic, separated by a middle dot. */
export function Eyebrow({ children, rule, strong, as: Tag = "p", className = "" }: { children: ReactNode; rule?: boolean; strong?: boolean; as?: "p" | "span" | "div"; className?: string }) {
  return <Tag className={`t-label eyebrow${rule ? " eyebrow-rule" : ""}${strong ? " eyebrow-strong" : ""} ${className}`.trim()}>{children}</Tag>;
}

/** Button.Primary · Button.Secondary. One primary per view: the next action. */
export function ButtonLink({ href, variant = "primary", size, block, children, className = "", ...rest }: { href: string; variant?: "primary" | "secondary" | "dark"; size?: "sm"; block?: boolean; children: ReactNode; className?: string } & Omit<ComponentProps<"a">, "href">) {
  const cls = `btn btn-${variant}${size ? ` btn-${size}` : ""}${block ? " btn-block" : ""} ${className}`.trim();
  return <SmartLink href={href} className={cls} {...rest}>{children}</SmartLink>;
}

/** TextLink: underline, orange underline on hover, trailing ▸. */
export function TextLink({ href, children, arrow = true, className = "", ...rest }: { href: string; children: ReactNode; arrow?: boolean; className?: string } & Omit<ComponentProps<"a">, "href">) {
  return <SmartLink href={href} className={`text-link ${className}`.trim()} {...rest}>{children}{arrow ? <span className="text-link-arrow" aria-hidden="true">▸</span> : null}</SmartLink>;
}

/** Chip.Role (outlined) · Chip.Conversion (sage filled). */
export function Chip({ chip }: { chip: ChipData }) {
  return <span className={`chip${chip.kind === "conversion" ? " chip-conversion" : ""}`}>{chip.label}</span>;
}

export function ChipRow({ chips, label }: { chips: ChipData[]; label?: string }) {
  return <ul className="chip-row" aria-label={label}>{chips.map((c) => <li key={c.label}><Chip chip={c} /></li>)}</ul>;
}

/** Section wrapper. Paper by default; charcoal at most two per page; sage for tools. */
export function Section({ id, tone = "paper", tight, children, className = "", labelledBy }: { id?: string; tone?: Tone; tight?: boolean; children: ReactNode; className?: string; labelledBy?: string }) {
  return <section id={id} aria-labelledby={labelledBy} className={`section${tight ? " section-tight" : ""} tone-${tone} ${className}`.trim()}><div className="wrap">{children}</div></section>;
}

/** SectionHeader: the left-rail pattern. Rail (3 cols): eyebrow and a short paragraph. Content (9 cols): two-line serif headline. */
export function SectionHeader({ id, label, railText, title, lede, level = 2, children }: { id?: string; label: string; railText?: ReactNode; title: ReactNode; lede?: ReactNode; level?: 1 | 2; children?: ReactNode }) {
  const Heading = level === 1 ? "h1" : "h2";
  return (
    <div className="section-header rail-grid">
      <div className="section-header-rail">
        <Eyebrow strong>{label}</Eyebrow>
        {railText ? <p className="t-small muted">{railText}</p> : null}
      </div>
      <div>
        <Heading id={id} className={`section-header-title ${level === 1 ? "t-h1" : "t-h2"}`}>{title}</Heading>
        {lede ? <div className="section-header-lede t-body-l muted">{lede}</div> : null}
        {children}
      </div>
    </div>
  );
}

/** Body that sits in the content column under a SectionHeader. */
export function RailBody({ children, full, className = "" }: { children: ReactNode; full?: boolean; className?: string }) {
  return <div className={`section-body rail-grid ${className}`.trim()}><div className={full ? "rail-grid-full" : "rail-grid-content"}>{children}</div></div>;
}

/** Glyph: 9×9 dot matrix in a pill. The orange dot marks the action point. */
export function Glyph({ name, size, label }: { name: GlyphName; size?: "sm"; label?: string }) {
  const dots = glyphDots(name);
  return (
    <span className={`glyph${size ? ` glyph-${size}` : ""}`} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <span className="glyph-dots">{dots.map((d, i) => <span key={i} className={d} />)}</span>
    </span>
  );
}

/** Lockup: AXIS & SAGE ADVISORY. The mark keeps its own colours; it is never UI. */
export function Lockup({ dark }: { dark?: boolean }) {
  return (
    <span className={`lockup${dark ? " on-dark" : ""}`}>
      <img className="lockup-mark" src="/brand/mark.svg" alt="" width={38} height={17} />
      <span className="lockup-words">
        <img className="lockup-wordmark" src={dark ? "/brand/wordmark-paper.svg" : "/brand/wordmark-charcoal.svg"} alt="Axis & Sage" width={105} height={13} />
        <span className="lockup-advisory" aria-hidden="true">ADVISORY</span>
      </span>
      <span className="sr-only"> Advisory</span>
    </span>
  );
}

/** Portrait in the principal treatment: a photo when one is supplied, otherwise an initials tile with serif initials. */
export function Portrait({ src, alt, initials, dark, className = "" }: { src?: string; alt: string; initials?: string; dark?: boolean; className?: string }) {
  return (
    <div className={`portrait${dark ? " portrait-dark" : ""}${!src && initials ? " portrait-initials" : ""} ${className}`.trim()}>
      {src ? <img src={src} alt={alt} loading="lazy" /> : initials ? <span className="portrait-monogram" role="img" aria-label={alt}>{initials}</span> : null}
    </div>
  );
}
