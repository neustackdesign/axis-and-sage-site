import { CtaBandForm } from "@/components/forms/CtaBandForm";
import { bookCallHref, ctaBand, whatsappHref } from "@/content/site";
import { TextLink } from "./primitives";

/** CTABand.Orange: "Who needs to act?" with the inline sentence form. Used on most pages. */
export function CTABand({ headline = ctaBand.headline }: { headline?: string }) {
  return (
    <section className="cta-band" aria-labelledby="cta-band-title">
      <div className="wrap cta-band-grid">
        <div>
          <h2 id="cta-band-title">{headline}</h2>
          <p className="cta-band-line">{ctaBand.line}</p>
        </div>
        <div>
          <CtaBandForm />
          <p className="cta-band-links">
            <TextLink href={bookCallHref}>Book a 30-minute call</TextLink>
            {whatsappHref() ? <TextLink href={whatsappHref()!}>WhatsApp us</TextLink> : null}
          </p>
        </div>
      </div>
    </section>
  );
}
