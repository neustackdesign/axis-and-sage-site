// /work — hero, action + role filter chips, work card grid, empty state. Mirrors sections/WorkFilter.tsx.
function WorkScreen({ go }) {
  const { SiteHeader, PageHero, Section, Chip, WorkCard, Button, CTABand } = window.AxisSageDesignSystem_72f554;
  const D = window.AS_DATA;
  const [action, setAction] = React.useState(null);
  const [role, setRole] = React.useState(null);
  const list = D.work.filter((w) => (!action || w.key === action || w.actions.map((a) => a.toLowerCase().replace(" ", "-")).includes(action)) && (!role || w.roles.includes(role)));
  return (
    <>
      <SiteHeader current="Work" assetBase={ASSET} onNavigate={go} />
      <PageHero label="WORK" title="Who needed to act, and what changed." sub="Work by Axis & Sage and by its founders before and outside the firm. Filter by the action that had to happen, or by the role we played." />
      <Section tight>
        <div className="work-filters">
          <div className="work-filter-group"><span className="t-label muted">BY ACTION</span><div className="chip-row">{D.actionFilters.map(([k, l]) => <Chip key={k} label={l} pressed={action === k} onClick={() => setAction(action === k ? null : k)} />)}</div></div>
          <div className="work-filter-group"><span className="t-label muted">BY ROLE</span><div className="chip-row">{D.roleFilters.map((r) => <Chip key={r} label={r} pressed={role === r} onClick={() => setRole(role === r ? null : r)} />)}</div></div>
          <div className="work-filter-count t-label"><span>{list.length} OF {D.work.length}</span>{action || role ? <button className="work-filter-clear t-label" onClick={() => { setAction(null); setRole(null); }}>CLEAR</button> : null}</div>
        </div>
        {list.length ? (
          <div className="work-grid">{list.map((w) => <WorkCard {...w} key={w.name} href={w.hasCase ? "#" : undefined} />)}</div>
        ) : (
          <div className="work-empty"><p className="t-h3">No work matches both filters yet.</p><Button variant="secondary" onClick={() => { setAction(null); setRole(null); }}>Clear the filters</Button></div>
        )}
      </Section>
      <CTABand />
    </>
  );
}
window.WorkScreen = WorkScreen;
