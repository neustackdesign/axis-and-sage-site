# Website UI kit

Click-through recreation of axisandsage.com built from `src/app` and `src/components` in neustackdesign/axis-and-sage-site.

- `index.html` — router (Home, Work, Engagements, Contact) + shared footer; page persists in localStorage.
- `HomeScreen.jsx` — cover, logo strip, the gap, Conversion Design (interactive sentence), founders, what moved, selected work, testimonials, how to start, library, CTA band.
- `WorkScreen.jsx` — action/role filter chips with count, clear and empty state.
- `EngagementsScreen.jsx` — pricing table, specialists, Diagnostic day timeline, FAQ.
- `ContactScreen.jsx` — three routes; form validates email and shows Sending… → success.
- `data.js` — verbatim copy from `migration/content-snapshot`.

Omitted: practice pages, case pages, people profiles, the six tools and guides (components for them exist: ResultPanel, Stepper, Timeline, Artifact, article parts). The hero photo loads from Unsplash as the site's own fallback does.
