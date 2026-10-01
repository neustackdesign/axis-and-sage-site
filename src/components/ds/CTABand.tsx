import { CtaBandForm } from "@/components/forms/CtaBandForm";
import { whatsappHref } from "@/lib/whatsapp";
import { getSettings } from "@/sanity/load";
import { TextLink } from "./primitives";

/** CTABand.Orange: "Who needs to act?" with the inline sentence form. Used on most pages. Copy from Site settings. */
export async function CTABand({ headline }: { headline?: string }) {
  const s = await getSettings();
  const wa = whatsappHref(s.whatsappMessage);
  return (
    <section className="cta-band" aria-labelledby="cta-band-title">
      <div className="wrap cta-band-grid">
        <div>
          <h2 id="cta-band-title">{headline ?? s.ctaBand.headline}</h2>
          <p className="cta-band-line">{s.ctaBand.line}</p>
        </div>
        <div>
          <CtaBandForm />
          <p className="cta-band-links">
            <TextLink href={s.primaryCta.href}>Book a 30-minute call</TextLink>
            {wa ? <TextLink href={wa}>WhatsApp us</TextLink> : null}
          </p>
        </div>
      </div>
    </section>
  );
}
