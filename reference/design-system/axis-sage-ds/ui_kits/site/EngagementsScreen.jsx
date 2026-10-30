// /engagements — hero, EngagementTable, specialist cards, Diagnostic DayTimeline, FAQ, CTABand.
function EngagementsScreen({ go }) {
  const { SiteHeader, PageHero, Section, SectionHeader, RailBody, EngagementTable, SpecialistCard, DayTimeline, Faq, CTABand } = window.AxisSageDesignSystem_72f554;
  const D = window.AS_DATA;
  return (
    <>
      <SiteHeader current="Engagements and pricing" assetBase={ASSET} onNavigate={go} />
      <PageHero label="ENGAGEMENTS" title="Start with one sentence. Know the price before we start." sub="We need [who] to [do what] by [when]. Every engagement starts there." />
      <Section tight>
        <EngagementTable columns={D.engagements} />
        <p className="engagement-note">{D.creditRule}</p>
      </Section>
      <Section>
        <SectionHeader label="01 · SPECIALIST" title="Specialist engagements." />
        <RailBody full><div className="specialist-grid" style={{ marginTop: 0 }}>{D.specialists.concat([{ name: "Portfolio Review", price: "Quoted on a 30-minute call", time: "4 weeks", intro: "For investors and group boards." }]).map((s) => <SpecialistCard key={s.name} {...s} cta={{ label: "Talk to us" }} />)}</div></RailBody>
      </Section>
      <Section tone="alt">
        <SectionHeader label="02 · THE DIAGNOSTIC" title="Ten working days." />
        <RailBody full>
          <DayTimeline days={[{ when: "DAY 1", what: "Agree the sentence and how we'll measure it." }, { when: "DAYS 2–4", what: "Interview the people who need to act." }, { when: "DAYS 5–6", what: "Walk the path they take." }, { when: "DAYS 7–9", what: "Read the numbers and tag every blocker." }, { when: "DAY 10", what: "The readout: baseline, blockers, fixes and a fixed quote." }]} />
        </RailBody>
      </Section>
      <Section>
        <SectionHeader label="03 · FAQ" title="Frequently asked questions." />
        <RailBody><Faq items={[{ q: "What does the Diagnostic fee pay for?", a: "The baseline, what's in the way, the fixes worth making and a fixed quote." }, { q: "Is the fee credited?", a: D.creditRule }, { q: "Who leads the work?", a: D.foundersNote }]} /></RailBody>
      </Section>
      <CTABand />
    </>
  );
}
window.EngagementsScreen = EngagementsScreen;
