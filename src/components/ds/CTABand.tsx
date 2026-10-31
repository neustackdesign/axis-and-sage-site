import { SentenceForm } from "@/components/v26/SentenceForm";
import { whatsappHref } from "@/lib/whatsapp";
import { getSettings } from "@/sanity/load";

/** The close on every page: Sunset bleed, the band's headline beside the sentence form. Copy from Site settings. */
export async function CTABand({ headline, label }: { headline?: string; label?: string }) {
  const s = await getSettings();
  const wa = whatsappHref(s.whatsappMessage);
  return (
    <div className="v26">
      <section className="t-sun bleed" data-sec="cta" id="cta" aria-labelledby="cta-title">
        <div className="cv">
          <div className="l edge">
            {label ? <p className="lbl rv">{label}</p> : null}
            <h2 id="cta-title" className="disp rv d1">{headline ?? s.ctaBand.headline}</h2>
            <p className="lead rv d2">{s.ctaBand.line}</p>
            {wa ? <p className="small rv d3"><a className="tl more" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp us</a></p> : null}
          </div>
          <div className="r edge-r">
            <div className="fp lite rv d2"><SentenceForm email={s.contactEmail} /></div>
          </div>
        </div>
      </section>
    </div>
  );
}
