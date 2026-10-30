// Home — mirrors src/app/(home)/page.tsx section order.
function HomeScreen({ go }) {
  const { SiteHeader, HomepageCover, LogoStrip, Section, SectionHeader, RailBody, GapGrid, MethodSentence, PlaneStack, TextLink, FounderCard, StatGrid, StatTile, CaseCard, Testimonial, EngagementTable, SpecialistCard, ToolCard, CTABand } = window.AxisSageDesignSystem_72f554;
  const D = window.AS_DATA, S = D.sections, lab = (n, t) => String(n).padStart(2, "0") + " · " + t;
  return (
    <>
      <div style={{ position: "relative" }}>
        <SiteHeader variant="hero" assetBase={ASSET} onNavigate={go} />
        <HomepageCover {...D.hero} onPrimary={() => go("Contact")} onSecondary={() => go("Scorecard")} />
      </div>
      <Section tight>
        <div className="rail-grid" style={{ alignItems: "center" }}>
          <p className="t-label eyebrow eyebrow-strong">WORK BY AXIS & SAGE AND ITS FOUNDERS</p>
          <LogoStrip names={D.logoStrip} />
        </div>
      </Section>
      <Section>
        <SectionHeader label={lab(1, S.gap[0])} title={S.gap[1]}><p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 720 }}>{S.gap[2]}</p></SectionHeader>
        <RailBody full><GapGrid cards={D.gapCards} /></RailBody>
      </Section>
      <Section tone="alt">
        <SectionHeader label={lab(2, S.cd[0])} title={S.cd[1]}><p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 760 }}>{S.cd[2]}</p></SectionHeader>
        <RailBody><MethodSentence rows={D.sentenceRows} /></RailBody>
        <RailBody><PlaneStack steps={D.methodSteps} /><p style={{ marginTop: 32 }}><TextLink href="#">How Conversion Design works</TextLink></p></RailBody>
      </Section>
      <Section>
        <SectionHeader label={lab(3, S.founders[0])} title={S.founders[1]} />
        <RailBody full>
          <div className="founder-grid">{D.people.map((p) => <FounderCard key={p.name} person={p} />)}</div>
          <p className="founders-note">{D.foundersNote}</p>
        </RailBody>
      </Section>
      <Section tone="midnight">
        <SectionHeader label={lab(4, S.moved[0])} title={S.moved[1]} />
        <RailBody full>
          <StatGrid cols={4}>{D.stats.map((s, i) => <StatTile key={s.numeral} {...s} wide={i === 1} />)}</StatGrid>
          <p className="stat-grid-note t-label">{D.statsSource}</p>
        </RailBody>
      </Section>
      <Section>
        <SectionHeader label={lab(5, S.work[0])} title={S.work[1]} />
        <RailBody full>
          <div className="case-grid">{D.cases.map((c, i) => <CaseCard key={c.slug} item={c} index={i + 1} provenance={c.provenance} href="#" />)}</div>
          <p style={{ marginTop: 32 }}><TextLink href="#" onClick={(e) => { e.preventDefault(); go("Work"); }}>All work</TextLink></p>
        </RailBody>
      </Section>
      <Section tight>
        <div className="testimonial-grid">{D.testimonials.map((t) => <Testimonial key={t.name} {...t} portrait={t.portrait ? IMG + t.portrait : undefined} />)}</div>
      </Section>
      <Section>
        <SectionHeader label={lab(6, S.start[0])} title={S.start[1]} />
        <RailBody full>
          <EngagementTable columns={D.engagements} />
          <p className="engagement-note">{D.creditRule}</p>
          <div className="specialist-grid">{D.specialists.map((s) => <SpecialistCard key={s.name} {...s} />)}</div>
          <p style={{ marginTop: 32 }}><TextLink href="#" onClick={(e) => { e.preventDefault(); go("Engagements and pricing"); }}>Engagements and pricing</TextLink></p>
        </RailBody>
      </Section>
      <Section tone="sage">
        <SectionHeader label={lab(7, S.library[0])} title={S.library[1]} />
        <RailBody full><div className="tool-grid">{D.tools.map((t) => <ToolCard key={t.title} {...t} />)}</div></RailBody>
      </Section>
      <CTABand />
    </>
  );
}
window.HomeScreen = HomeScreen;
