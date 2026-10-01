// Builds the canonical v2 Sanity documents from the frozen content snapshot plus the final commercial decisions
// (brief: "final implementation pass"). Pure and deterministic: the same input gives the same documents, so the
// seeder can tell created from updated from unchanged.
//
// Identity: singletons have fixed _ids; every other document has a stable seedKey and gets a Sanity-generated _id.
// References are written as { _ref: "seed:<seedKey>" } here and resolved to real _ids by the seeder.
// Images are written as { asset: { _upload: "<path>" } } and uploaded by the seeder.

import * as engagementsSrc from "../content-snapshot/engagements";
import * as legalSrc from "../content-snapshot/legal";
import * as librarySrc from "../content-snapshot/library";
import * as methodSrc from "../content-snapshot/method";
import * as peopleSrc from "../content-snapshot/people";
import * as practicesSrc from "../content-snapshot/practices";
import * as siteSrc from "../content-snapshot/site";
import * as titlesSrc from "../content-snapshot/titles";
import * as workSrc from "../content-snapshot/work";
import { block, type Block } from "./pt";

export type SeedRef = { _type: "reference"; _ref: string; _key?: string };
export type SeedImage = { _type: "image"; asset: { _upload: string }; alt?: string; hotspot?: { x: number; y: number; width: number; height: number } };
export type SeedDoc = { _id?: string; _type: string; seedKey?: string; [field: string]: unknown };

export const SINGLETON_IDS = { settings: "axisSageSettings", home: "axisSageHome", method: "axisSageConversionMethod" } as const;
export const sitePageId = (key: string) => `axisSagePage-${key}`;
export const HERO_ASSETS = {
  desktop: "migration/assets/hero/lagos-sunset-desktop-3200x1800.jpg",
  mobile: "migration/assets/hero/lagos-sunset-mobile-1200x1800.jpg",
} as const;

const ref = (seedKey: string, key?: string): SeedRef => ({ _type: "reference", _ref: `seed:${seedKey}`, ...(key ? { _key: key } : {}) });
const refs = (prefix: string, slugs: string[]) => slugs.map((s, i) => ref(`${prefix}:${s}`, `${s}-${i}`));
const keyed = <T extends object>(items: T[], prefix: string) => items.map((x, i) => ({ _key: `${prefix}${i}`, ...x }));
const slugOf = (s: string) => ({ _type: "slug", current: s });
const upload = (path: string, alt?: string): SeedImage => ({ _type: "image", asset: { _upload: path }, ...(alt ? { alt } : {}) });
const section = (key: string, label: string, title: string, intro?: string) => ({ _key: key, _type: "asSectionIntro", key, label, title, ...(intro ? { intro } : {}) });
const text = (key: string, value: string) => ({ _key: key, _type: "asTextItem", key, value });
const link = (l: { label: string; href: string; description?: string }, i: number) => ({ _key: `l${i}`, _type: "asLink", label: l.label, href: l.href, ...(l.description ? { description: l.description } : {}) });

/* ---------------------------------------------------------------- Canonical decisions (locked) */

export const CANONICAL = {
  titles: { "ifeanyi-monyei": { publicTitle: "Co-founder", practiceTitle: "Strategy & Investment" }, "tomiwa-ogunmodede": { publicTitle: "Co-founder", practiceTitle: "Product & Technology" } },
  diagnostic: { price: 5000, currency: "USD", uaePrice: 18500, duration: "10 working days" },
  creditRule: "100% of the Diagnostic fee is credited against a Conversion Programme of US$15,000 or more, contracted within 30 days of the Diagnostic readout.",
  provenance: {
    axisAndSage: ["gv-solutions", "nature-roots", "uganda-investor-summit", "oui-life"],
    principalTrackRecord: ["venture-garden-group", "national-social-investment-programme", "galaxy-backbone-1gov", "farmcrowdy", "mular", "earlybean", "kolibri", "lion-hospitality-partners", "adpipe"],
  },
  heldBack: ["lasric", "university-innovation-platform", "africa-agrighg-summit"],
  homepageWork: ["gv-solutions", "nature-roots", "uganda-investor-summit", "farmcrowdy", "mular", "venture-garden-group"],
  strategyCapabilities: [
    "Corporate and growth strategy",
    "Market entry",
    "Operating-model and organisation design",
    "Governance and delegation of authority",
    "Executive and employee incentives",
    "Investment readiness",
    "Transaction-structuring support",
    "Merger design and integration",
    "Partnership and joint-venture commercial terms",
  ],
  capitalFaq: {
    question: "Do you raise capital or place investments?",
    answer: "No. We prepare businesses, materials and commercial structures for investor conversations. Clients and their licensed advisers manage solicitation, placement and regulated activity.",
  },
  bios: {
    "ifeanyi-monyei": [
      "Ifeanyi works on the terms behind action: governance, operating structure, incentives, partnerships and commercial decision-making.",
      "She has spent more than a decade across Venture Garden Group and its portfolio, progressing through consulting leadership and Chief of Staff to Group Strategy & Growth. Her work includes governance and delegation of authority, executive reward, employee equity, operating models, business integration and partnership structures.",
      "She designed and led the merger that created GV Solutions and now serves as its fractional COO through Axis & Sage.",
      "Earlier work includes consulting leadership across programmes within Nigeria's National Social Investment Programme and public-sector transformation through Galaxy Backbone.",
      "At Axis & Sage, she leads Strategy & Investment.",
    ].join("\n\n"),
    "tomiwa-ogunmodede": [
      "Tomiwa works on the moments where people act: products, interfaces, services and systems.",
      "He has more than ten years across product design, technology, growth and venture building in fintech, education, hospitality and operational software.",
      "He was the first design hire at Farmcrowdy, where internal funnel tracking recorded first-time mobile sponsorship conversion moving from 18% to 60%. He spent nearly four years as Senior Product Designer on Learning Equality's Kolibri platform, co-founded Mular and Earlybean, and currently leads Product & Technology for Lion Hospitality Partners.",
      "At Axis & Sage, he leads Product & Technology.",
    ].join("\n\n"),
  },
} as const;

/** "US$5,000 fixed · AED 18,500 for UAE engagements" */
export const diagnosticPriceText = () =>
  `US$${CANONICAL.diagnostic.price.toLocaleString("en-GB")} fixed · AED ${CANONICAL.diagnostic.uaePrice.toLocaleString("en-GB")} for UAE engagements`;

/* ---------------------------------------------------------------- Builders */

function settings(): SeedDoc {
  const s = siteSrc;
  return {
    _id: SINGLETON_IDS.settings,
    _type: "companySettings",
    companyName: "Axis & Sage Advisory",
    shortName: "Axis & Sage",
    legalName: s.contact.legalName,
    siteUrl: "https://axisandsage.com",
    contactEmail: s.contact.email,
    bookingUrl: "https://cal.com/axisandsage/30min",
    registeredAddress: s.contact.registeredAddress,
    registeredAddressShort: s.contact.registeredAddressShort,
    foundersBased: s.contact.foundersBased,
    locations: ["Abu Dhabi", "Dubai", "Lagos"],
    regionTag: "AFRICA · GCC",
    navigation: {
      whatWeDo: { _type: "asNavGroup", ...s.navGroups.whatWeDo, items: s.navGroups.whatWeDo.items.map(link) },
      library: { _type: "asNavGroup", ...s.navGroups.library, items: s.navGroups.library.items.map(link) },
      primaryLinks: s.primaryLinks.map(link),
    },
    footerNavigation: s.footerColumns.map((c, i) => ({ _key: `c${i}`, _type: "asFooterColumn", title: c.title, links: c.links.map(link) })),
    socialLinks: [],
    legalLine: s.legalLine,
    primaryCta: { _type: "asCta", label: "Book a call", href: s.bookCallHref },
    scorecardCta: { _type: "asCta", label: "Take the Scorecard", href: s.scorecardHref },
    ctaBand: { headline: s.ctaBand.headline, line: s.ctaBand.line },
    newsletter: { name: s.newsletter.name, line: s.newsletter.line, archiveEmpty: "The archive starts with the first issue on Tuesday 3 November 2026. Subscribe above to get it." },
    whatsappMessage: s.whatsappMessage,
    defaultSeo: { _type: "asSeo", title: "Axis & Sage Advisory", description: "Get the people your business depends on to act. Investors commit, partners sign, teams execute and customers buy when the terms are right and the moment is clear. We design both. We call it Conversion Design." },
  };
}

function home(): SeedDoc {
  const t = titlesSrc.pageTitles.home;
  return {
    _id: SINGLETON_IDS.home,
    _type: "homePageV2",
    eyebrow: ["ADVISORY", "AFRICA AND THE GCC", "ABU DHABI", "DUBAI", "LAGOS"],
    headline: "Get the people your business depends on to act.",
    supportingCopy: "Investors commit, partners sign, teams execute and customers buy when the terms are right and the moment is clear. We design both. We call it Conversion Design.",
    desktopHeroImage: upload(HERO_ASSETS.desktop),
    mobileHeroImage: upload(HERO_ASSETS.mobile),
    heroImageAlt: "The Lagos skyline across the water at sunset.",
    heroImageCredit: "LAGOS AT SUNSET · PHOTO: CHIBUZO NWANERI / UNSPLASH",
    heroImageSourceUrl: "https://unsplash.com/photos/gE3ign9Lx1Q",
    primaryCTA: { _type: "asCta", label: "Book a 30-minute call", href: siteSrc.bookCallHref },
    secondaryCTA: { _type: "asCta", label: "Take the Conversion Scorecard", href: siteSrc.scorecardHref },
    practices: refs("practice", practicesSrc.practices.map((p) => p.slug)),
    // LASRIC is held back from public featured work, so it leaves the strip too.
    logoStrip: { label: "WORK BY AXIS & SAGE AND ITS FOUNDERS", names: workSrc.logoStrip.filter((n) => n !== "LASRIC") },
    sections: [
      section("gap", "THE GAP", "Growth stalls in the gap between what a business decides, what it builds and what it says.", "A board approves a new structure and managers keep deciding the old way. A product launches and customers stop at the payment screen. A raise opens and investors take the meeting, then go quiet. The decision was sound. The action never happened."),
      section("conversionDesign", "CONVERSION DESIGN", "A conversion is the action your business needs from someone. It isn't always a sale.", "Conversion Design starts with that action and works backwards. People act when two things are true: the terms are right and the moment is clear. Terms are what's on offer and who decides: the price, the equity, the incentive, the authority. Moments are where the decision happens: the pitch, the screen, the conversation, the form. We design both."),
      section("founders", "THE FOUNDERS", "Two halves of every decision."),
      section("moved", "WHAT MOVED", "Founded, ran, built, advised. Here's what moved."),
      section("work", "SELECTED WORK", "Who needed to act, and what changed."),
      section("start", "HOW TO START", "Start with one sentence. Know the price before we start."),
      section("library", "LIBRARY", "Free tools for the decision in front of you."),
    ],
    gapCards: keyed(methodSrc.gapCards.map((c) => ({ _type: "asGlyphCard", glyph: c.glyph, text: c.text })), "g"),
    conversionLinkLabel: "How Conversion Design works",
    foundersNote: "Every engagement is led by one of us, and usually both.",
    stats: keyed(workSrc.homeStats.map((s) => ({ _type: "asStat", numeral: s.numeral, label: s.label, tag: s.tag, ...(s.source ? { source: s.source } : {}) })), "s"),
    statsSource: workSrc.homeStatsSource,
    selectedWork: refs("work", [...CANONICAL.homepageWork]),
    selectedPeople: refs("person", peopleSrc.people.map((p) => p.slug)),
    testimonials: [ref("testimonial:kunmi", "kunmi"), ref("testimonial:bunmi", "bunmi"), ref("testimonial:temi", "temi")],
    seo: { _type: "asSeo", title: t.title, description: t.description, ogTitle: t.og },
  };
}

function method(): SeedDoc {
  const m = methodSrc;
  const t = titlesSrc.pageTitles.conversionDesign;
  const faqIdx = [0, 1, 2, 6];
  return {
    _id: SINGLETON_IDS.method,
    _type: "conversionMethod",
    hero: { label: "THE METHOD", title: "Start from the action.", sub: "Conversion Design is how we get investors, partners, teams and customers to act. We name the action, find what's in the way in the terms or the moment, fix it, and measure what moved." },
    sections: [
      section("counts", "WHAT COUNTS", "A conversion is the action your business needs from someone."),
      section("halves", "TERMS AND MOMENTS", "People act when the terms are right and the moment is clear."),
      section("steps", "THE FOUR STEPS", "The four steps."),
      section("example", "EXAMPLE · FARMCROWDY", "Decided: grow sponsorship on mobile."),
      section("question", "A COMMON QUESTION", "Is this conversion rate optimisation?"),
      section("byType", "BY TYPE OF ACTION", "By type of action."),
      section("faq", "QUESTIONS", "Frequently asked questions."),
    ],
    actors: keyed(m.conversionActors.map((a) => ({ _type: "asActor", ...a })), "a"),
    actorsClosing: "It isn't always a sale. It's always a person doing something.",
    terms: { title: "What's on offer and who decides.", body: [emBlock("t0", "Price, equity, incentives, risk, authority, deal structure. Terms decide whether people ", "want", " to act.")] },
    moments: { title: "Where the decision happens.", body: [emBlock("m0", "The pitch, the screen, the form, the conversation, the timing of the ask. Moments decide whether people ", "can", " act, and whether they're asked at the right time.")] },
    behaviourNote: "This mirrors BJ Fogg's behaviour model: people act when motivation, ability and a prompt meet. Terms supply the motivation. Moments supply the ability and the prompt.",
    sentenceRows: keyed(m.sentenceRows.map((r) => ({ _type: "asSentenceRow", ...r })), "r"),
    methodSteps: keyed(m.methodSteps.map((s) => ({ _type: "asMethodStep", ...s })), "s"),
    methodStepsExpanded: keyed(m.methodStepsExpanded.map((s) => ({ _type: "asMethodStep", ...s })), "x"),
    example: {
      timelineLabel: "WHAT WAS DECIDED → WHAT PEOPLE DID",
      baselineValue: 18,
      baselineLabel: "BASELINE 18%",
      steps: [
        { _key: "before", when: "BEFORE", said: "Grow sponsorship on mobile", value: 18, valueLabel: "18%", did: "Baseline: 18% of first-time mobile visitors sponsored.", action: false },
        { _key: "after", when: "AFTER THE REDESIGN", said: "Redesign the first-time mobile sponsorship flow", value: 60, valueLabel: "60%", did: "First-time mobile sponsorship conversion: 60%.", action: true },
      ],
      source: "SOURCE: INTERNAL FUNNEL TRACKING",
      caseStudy: ref("work:farmcrowdy"),
      caseLinkLabel: "Read the Farmcrowdy case",
    },
    question: { title: "Is this conversion rate optimisation?", body: "Conversion rate optimisation improves pages. It works on the moment. We start earlier, with the terms: the structure, the incentives and the deal that decide whether people want to act. Then we design the moment." },
    actionCards: keyed(m.actionCards.map((c) => ({ _type: "asActionCard", ...c })), "c"),
    actionCardLinkLabel: "See the work",
    faqs: faqIdx.map((i) => ref(`faq:${i}`, `faq-${i}`)),
    seo: { _type: "asSeo", title: t.title, description: t.description, ogTitle: t.og },
  };
}

function emBlock(key: string, before: string, em: string, after: string): Block {
  return { _type: "block", _key: key, style: "normal", markDefs: [], children: [
    { _type: "span", _key: `${key}a`, text: before, marks: [] },
    { _type: "span", _key: `${key}b`, text: em, marks: ["em"] },
    { _type: "span", _key: `${key}c`, text: after, marks: [] },
  ] };
}

function sitePages(): SeedDoc[] {
  const T = titlesSrc.pageTitles;
  const page = (key: string, hero: object, sections: object[], strings: object[], seo: object) => ({ _id: sitePageId(key), _type: "sitePage", key, hero, sections, strings, seo: { _type: "asSeo", ...seo } });
  return [
    page("engagements", { label: "ENGAGEMENTS AND PRICING", title: "Start with one sentence. Know the price before we start.", sub: "Every engagement begins with the action you need and a fixed fee. Nothing starts without both." },
      [section("specialist", "SPECIALIST", "Specialist engagements."), section("diagnostic", "THE DIAGNOSTIC", "What happens in the Diagnostic."), section("fee", "THE FEE", "What the Diagnostic fee pays for."), section("faq", "QUESTIONS", "Frequently asked questions.")],
      [text("guideLink", "Read the guide"), text("specialistCta", "Talk to us")],
      { title: T.engagements.title, description: T.engagements.description, ogTitle: T.engagements.og }),
    page("work", { label: "WORK", title: "Who needed to act, and what moved.", sub: "Work by Axis & Sage and its founders. Every case is tagged with our role: founded, ran, built, advised or embedded, and with where it comes from: an Axis & Sage engagement or the principals' track record." },
      [], [],
      { title: T.work.title, description: "Work by Axis & Sage and its founders: Axis & Sage engagements and the principals' track record, each tagged with our role.", ogTitle: T.work.og }),
    page("people", { label: "PEOPLE", title: "Two founders. Both of them on your work.", sub: "Ifeanyi designs the terms people act on. Tomiwa designs the moments they act in." },
      [section("specialists", "SPECIALISTS", "Specialists we bring in.")], [],
      { title: T.people.title, description: "Two founders. Both of them on your work. Ifeanyi designs the terms people act on. Tomiwa designs the moments they act in.", ogTitle: T.people.og }),
    page("library", { label: "LIBRARY", title: "Free tools for the decision in front of you.", sub: "Built from the frameworks we use with clients. No sign-up to use them. Leave an email only if you want the full model or a copy of your results." },
      [section("tools", "TOOLS", "Tools."), section("guides", "GUIDES", "Guides."), section("templates", "TEMPLATES", "Templates.", "Downloads. Leave your work email and we send you a copy."), section("newsletter", "NEWSLETTER", "")],
      [text("comingSoon", "Coming soon. Subscribe to get it first."), text("readGuide", "READ THE GUIDE ▸"), text("archiveLink", "The archive")],
      { title: "Library | Axis & Sage", description: "Free tools for the decision in front of you. Built from the frameworks we use with clients. No sign-up to use them.", ogTitle: "Free tools for the decision in front of you." }),
    page("contact", { label: "CONTACT", title: "Tell us who needs to act.", sub: "One sentence is enough. We reply within one working day with a clear next step." },
      [], [text("callTitle", "Book a 30-minute call"), text("noteTitle", "Send a note"), text("whatsappTitle", "WhatsApp"), text("whatsappLink", "Chat with us")],
      { title: "Contact | Axis & Sage", description: "Tell us who needs to act. One sentence is enough. We reply within one working day with a clear next step.", ogTitle: "Tell us who needs to act." }),
    page("newsletter", { label: "NEWSLETTER", title: "Terms & Moments.", sub: siteSrc.newsletter.line },
      [], [text("archiveLabel", "ARCHIVE"), text("emptyTitle", "No issues yet.")],
      { title: "Terms & Moments | Axis & Sage", description: siteSrc.newsletter.line, ogTitle: "Terms & Moments." }),
    page("thankYou", { label: "THANK YOU", title: "Thanks. We'll be in touch within one working day.", sub: "" },
      [], [text("scorecardLabel", "SCORECARD · 6 MIN"), text("scorecardTitle", "Take the Conversion Scorecard"), text("scorecardLink", "Start"), text("guideLabel", "GUIDE"), text("guideTitle", "Read “What the Diagnostic fee pays for”"), text("guideLink", "Read")],
      { title: "Thank you | Axis & Sage" }),
    page("notFound", { label: "404", title: "Nothing here.", sub: "The page moved or never existed." },
      [], [text("homeLink", "Home")],
      { title: "Nothing here | Axis & Sage" }),
  ];
}

function people(): SeedDoc[] {
  const relatedWork: Record<string, string[]> = {
    "ifeanyi-monyei": ["venture-garden-group", "gv-solutions", "national-social-investment-programme", "galaxy-backbone-1gov"],
    "tomiwa-ogunmodede": ["farmcrowdy", "kolibri", "mular", "earlybean", "lion-hospitality-partners", "adpipe"],
  };
  // Small wording changes so nothing contradicts the canonical biographies or carries an officer title.
  const shortBio: Record<string, string> = {
    "ifeanyi-monyei": "Governance, delegation of authority, executive and employee incentives, operating structure, partnerships and business integration. More than a decade across Venture Garden Group and its portfolio, through consulting leadership and Chief of Staff to Group Strategy & Growth.",
  };
  const proof: Record<string, string[]> = {
    "ifeanyi-monyei": [
      "Governance framework, delegation of authority, board pay policy, executive reward and employee share scheme redesign across Venture Garden Group.",
      "Designed and led the merger that created GV Solutions, where she now serves as fractional COO through Axis & Sage.",
      "Consulting leadership across programmes within Nigeria's National Social Investment Programme.",
    ],
    "tomiwa-ogunmodede": [
      "Farmcrowdy: first-time mobile sponsorship conversion from 18% to 60%, recorded by internal funnel tracking.",
      "Co-founded Mular: $2.1M+ processed across 19K+ transactions.",
      "Designed for Kolibri, a learning platform used in 220+ countries and territories.",
    ],
  };
  const selected = (slug: string, items: string[]) => items.map((x) => (slug === "ifeanyi-monyei" && x.startsWith("Co-founder and CEO of Business Analyst Community Nigeria") ? "Co-founded Business Analyst Community Nigeria." : x));
  return peopleSrc.people.map((p, i) => ({
    _type: "person",
    seedKey: `person:${p.slug}`,
    name: p.name,
    slug: slugOf(p.slug),
    publicTitle: CANONICAL.titles[p.slug as keyof typeof CANONICAL.titles].publicTitle,
    practiceTitle: CANONICAL.titles[p.slug as keyof typeof CANONICAL.titles].practiceTitle,
    initials: p.initials,
    focus: p.half,
    principleLine: p.line,
    shortBio: shortBio[p.slug] ?? p.cardBody,
    longBio: CANONICAL.bios[p.slug as keyof typeof CANONICAL.bios],
    proofPoints: proof[p.slug] ?? p.cardProof,
    selectedWork: selected(p.slug, p.selectedWork),
    extra: p.extra,
    education: p.education,
    basedIn: p.basedIn,
    links: [],
    relatedWork: refs("work", relatedWork[p.slug] || []),
    order: i + 1,
    seo: { _type: "asSeo", title: `${p.name} | Axis & Sage`, description: `${p.name}, Co-founder, ${CANONICAL.titles[p.slug as keyof typeof CANONICAL.titles].practiceTitle}. ${p.line}` },
  }));
}

function practices(): SeedDoc[] {
  const meta = titlesSrc.practiceMeta as Record<string, { title: string; description?: string; og: string }>;
  // "investment advisory" reads as investment advice, which Axis & Sage does not provide.
  const seoOverride: Record<string, { title: string; og: string }> = {
    "strategy-and-investment": { title: "Strategy & Investment for Africa and the GCC | Axis & Sage", og: "Strategy & Investment for Africa and the GCC" },
  };
  const navDescription = Object.fromEntries(siteSrc.practiceNav.map((n) => [n.href.split("/").pop(), n.description]));
  const all = [...practicesSrc.practices.map((p) => ({ p, section: "whatWeDo" })), { p: practicesSrc.embeddedLeadership, section: "engagements" }];
  return all.map(({ p, section }, i) => {
    const m = meta[p.slug];
    const emb = titlesSrc.pageTitles.embeddedLeadership;
    const seo = p.slug === "embedded-leadership" ? { title: emb.title, description: emb.description, ogTitle: emb.og } : { title: seoOverride[p.slug]?.title ?? m.title, description: m.description, ogTitle: seoOverride[p.slug]?.og ?? m.og };
    return {
      _type: "practice",
      seedKey: `practice:${p.slug}`,
      title: p.label,
      slug: slugOf(p.slug),
      section,
      eyebrow: p.eyebrow,
      headline: p.h1,
      summary: p.sub,
      ...(navDescription[p.slug] ? { navDescription: navDescription[p.slug] } : {}),
      ...(p.ledBy === "both founders" ? { ledByLabel: "both founders" } : {}),
      ledBy: refs("person", p.ledByPeople || []),
      whenToCall: p.whenToCall || [],
      capabilities: p.slug === "strategy-and-investment" ? [...CANONICAL.strategyCapabilities] : p.whatWeDo || [],
      howItWorks: p.howItWorks || [],
      ...(p.connects ? { connectsCopy: p.connects } : {}),
      proof: refs("work", p.proof),
      ...(p.proofNote ? { proofNote: p.proofNote } : {}),
      ...(p.whenItFits ? { whenItFits: p.whenItFits } : {}),
      tools: refs("tool", p.tools),
      order: i + 1,
      seo: { _type: "asSeo", ...seo },
    };
  });
}

function testimonials(): SeedDoc[] {
  return Object.entries(workSrc.testimonials).map(([key, t]) => ({
    _type: "testimonialQuote",
    seedKey: `testimonial:${key}`,
    quote: t.quote,
    name: t.name,
    title: t.title,
    ...(t.company ? { company: t.company } : {}),
    ...(t.portrait ? { portrait: upload(`public${t.portrait}`, t.name) } : {}),
  }));
}

function work(): SeedDoc[] {
  const provenanceOf = (slug: string) => (CANONICAL.provenance.axisAndSage as readonly string[]).includes(slug) ? "axisAndSage" : (CANONICAL.provenance.principalTrackRecord as readonly string[]).includes(slug) ? "principalTrackRecord" : undefined;
  const selected = Object.fromEntries(workSrc.selectedWork.map((c) => [c.slug, c]));
  const cases = Object.fromEntries(workSrc.casePages.map((c) => [c.slug, c]));
  const testimonialKey = Object.fromEntries(Object.entries(workSrc.testimonials).map(([k, t]) => [t.name, k]));
  const practiceFor = (slug: string) => [...practicesSrc.practices, practicesSrc.embeddedLeadership].filter((p) => p.proof.includes(slug)).map((p) => p.slug);
  const personFor = (name?: string) => peopleSrc.people.filter((p) => p.name === name).map((p) => p.slug);
  return workSrc.workIndex.map((w, i) => {
    const provenance = provenanceOf(w.slug);
    const held = (CANONICAL.heldBack as readonly string[]).includes(w.slug);
    const sel = selected[w.slug];
    const c = cases[w.slug];
    const line = w.slug === "university-innovation-platform" ? w.line.replace(/\s*\[Agency name\]\s*$/, "") : w.line;
    return {
      _type: "workItem",
      seedKey: `work:${w.slug}`,
      title: w.name,
      slug: slugOf(w.slug),
      entity: w.name.split(" · ")[0],
      sector: w.sector,
      roles: [...w.roles],
      actions: [...w.actions],
      ...(provenance ? { provenance } : {}),
      featured: !!provenance && !held,
      homepageFeatured: (CANONICAL.homepageWork as readonly string[]).includes(w.slug),
      summary: line,
      ...(sel ? { needed: sel.needed, changed: sel.changed, moved: sel.moved } : c ? { changed: c.changedSummary, moved: c.moved } : {}),
      metrics: c?.stats ? keyed(c.stats.map((s) => ({ _type: "asStat", numeral: s.numeral, label: s.label, ...(s.source ? { source: s.source } : {}) })), "m") : [],
      ...(c?.quote ? { quote: ref(`testimonial:${testimonialKey[c.quote.name]}`) } : {}),
      relatedPeople: refs("person", personFor(c?.ledBy)),
      relatedPractices: refs("practice", practiceFor(w.slug)),
      caseStudy: !!c,
      ...(c ? {
        ...(c.years ? { years: c.years } : {}),
        ...(c.intro ? { intro: c.intro } : {}),
        caseNeeded: c.needed,
        inTheWay: c.inTheWay || [],
        changes: c.changes ? keyed(c.changes.map((ch) => ({ _type: "asCaseChange", ...ch })), "ch") : [],
        ...(c.artifact ? { artifact: c.artifact } : {}),
        relatedTools: refs("tool", c.tools),
      } : {}),
      order: i + 1,
      seo: { _type: "asSeo", title: `${w.name} · Work | Axis & Sage`, description: c?.intro || `${w.name}: ${c?.moved || line}` },
    };
  });
}

function engagements(): SeedDoc[] {
  const e = engagementsSrc;
  const byName = Object.fromEntries(e.engagements.map((x) => [x.name, x]));
  const spec = [...e.specialistCards, e.leadershipSession];
  const core = (slug: string, name: string, extra: object, i: number): SeedDoc => {
    const x = byName[name];
    return { _type: "engagement", seedKey: `engagement:${slug}`, name, slug: slugOf(slug), tier: "core", recommended: !!x.recommended, publishedPrice: false, duration: x.time, bring: x.bring, weDo: x.weDo, youGet: x.youGet, cta: { _type: "asCta", ...x.cta }, order: i, ...extra };
  };
  return [
    core("conversion-scorecard", "Conversion Scorecard", { priceLabel: "Free" }, 1),
    core("conversion-diagnostic", "Conversion Diagnostic", {
      publishedPrice: true,
      publicPrice: CANONICAL.diagnostic.price,
      currency: CANONICAL.diagnostic.currency,
      uaePrice: CANONICAL.diagnostic.uaePrice,
      duration: CANONICAL.diagnostic.duration,
      creditRule: CANONICAL.creditRule,
      feeExplainer: "Ten working days of principal time, the interviews, the analysis, the report and a fixed quote for the fix.",
      timeline: keyed(e.diagnosticDays.map((d) => ({ _type: "asTimelineDay", ...d })), "d"),
    }, 2),
    core("conversion-programme", "Conversion Programme", { priceLabel: "Fixed fee, quoted after the Diagnostic" }, 3),
    core("embedded-leadership", "Embedded leadership", { priceLabel: "Monthly, quoted" }, 4),
    ...spec.map((s, i): SeedDoc => {
      const slug = s.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return { _type: "engagement", seedKey: `engagement:${slug}`, name: s.name, slug: slugOf(slug), tier: "specialist", recommended: false, publishedPrice: false, priceLabel: "Quoted on a 30-minute call", duration: s.time, intro: s.intro, points: s.points || [], cta: { _type: "asCta", label: "Talk to us", href: `/contact?engagement=${encodeURIComponent(s.name)}` }, order: 10 + i };
    }),
  ];
}

function faqs(): SeedDoc[] {
  const placements = (i: number) => ([0, 1, 2, 6].includes(i) ? ["conversionDesign", "engagements"] : ["engagements"]);
  return engagementsSrc.faqs.map((f, i) => {
    const isCapital = f.q === CANONICAL.capitalFaq.question;
    return { _type: "faqItem", seedKey: `faq:${i}`, question: f.q, answer: isCapital ? CANONICAL.capitalFaq.answer : f.a, category: "general", placements: placements(i), order: i + 1 };
  });
}

function tools(): SeedDoc[] {
  const phrase = titlesSrc.toolSearchPhrase as Record<string, string>;
  return librarySrc.tools.map((t, i) => ({
    _type: "toolContent",
    seedKey: `tool:${t.slug}`,
    title: t.title,
    slug: slugOf(t.slug),
    eyebrow: t.kind,
    badge: t.badge,
    intro: t.line,
    instructions: "No sign-up to use it. Leave an email only if you want the full model or a copy of your results.",
    cta: t.cta,
    glyph: t.glyph,
    order: i + 1,
    seo: { _type: "asSeo", title: `${phrase[t.slug] || t.title} | Axis & Sage`, description: t.line, ogTitle: phrase[t.slug] || t.title },
  }));
}

function library(): SeedDoc[] {
  const e = engagementsSrc;
  const diagnostic = e.engagements.find((x) => x.recommended)!;
  const startFaq = e.faqs[3].a;
  const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const guideBody = [
    block("h1", "What the fee pays for", { style: "h2" }),
    block("p1", "Ten working days of principal time, the interviews, the analysis, the report and a fixed quote for the fix."),
    block("q1", "“You know the price before we start.”", { style: "blockquote" }),
    block("h2", "The ten working days", { style: "h2" }),
    { _type: "asEngagementTimeline", _key: "tl", engagement: ref("engagement:conversion-diagnostic") },
    { _type: "asCallout", _key: "co", label: "CALLOUT · YOU BRING", text: `${diagnostic.bring}.` },
    { _type: "asToolEmbed", _key: "te", tool: ref("tool:conversion-scorecard") },
    block("h3", "What you get", { style: "h2" }),
    block("p3", `We ${lower(diagnostic.weDo)}. You get ${lower(diagnostic.youGet)}.`),
    block("h4", "The credit", { style: "h2" }),
    block("p4", `${CANONICAL.creditRule} ${startFaq}`),
    { _type: "asArticleEnd", _key: "end", headline: siteSrc.ctaBand.headline, cta: { _type: "asCta", label: "Book a 30-minute call", href: siteSrc.bookCallHref } },
  ];
  const guides = librarySrc.guides.map((g, i): SeedDoc => ({
    _type: "libraryItem",
    seedKey: `library:${g.slug}`,
    type: "guide",
    title: g.title,
    slug: slugOf(g.slug),
    category: g.category,
    status: g.published ? "published" : "comingSoon",
    authors: refs("person", peopleSrc.people.map((p) => p.slug)),
    order: i + 1,
    ...(g.published ? {
      excerpt: "Every engagement begins with the action you need and a fixed fee. Nothing starts without both.",
      publishedAt: "2026-09-30",
      body: guideBody,
      relatedTool: ref("tool:conversion-scorecard"),
      seo: { _type: "asSeo", title: `${g.title} | Axis & Sage`, description: "Ten working days of principal time, the interviews, the analysis, the report and a fixed quote for the fix.", ogTitle: g.title },
    } : {}),
  }));
  const templates = librarySrc.templates.map((t, i): SeedDoc => {
    const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return { _type: "libraryItem", seedKey: `library:template-${slug}`, type: "template", title: t.title, slug: slugOf(`template-${slug}`), format: t.format, status: "draft", order: 100 + i };
  });
  return [...guides, ...templates];
}

function legal(): SeedDoc[] {
  const docs = [{ doc: legalSrc.privacyNotice, slug: "privacy" }, { doc: legalSrc.termsOfUse, slug: "terms" }];
  return docs.map(({ doc, slug }) => ({
    _type: "legalPage",
    seedKey: `legal:${slug}`,
    title: doc.title,
    slug: slugOf(slug),
    label: doc.label,
    effectiveDate: "2026-10-01",
    effectiveLabel: doc.updated,
    sections: doc.sections.map((s) => ({
      _key: s.id,
      _type: "asLegalSection",
      anchor: s.id,
      heading: s.heading,
      body: s.body.flatMap((b, bi) => ("p" in b
        ? [block(`${s.id}${bi}`, b.p, { links: { "privacy notice": "/privacy" } })]
        : b.ul.map((item, li) => (typeof item === "string"
          ? block(`${s.id}${bi}_${li}`, item, { bullet: true, links: { "privacy notice": "/privacy" } })
          : block(`${s.id}${bi}_${li}`, item.text, { bullet: true, leadBold: item.lead, links: { "privacy notice": "/privacy" } }))))),
    })),
    seo: { _type: "asSeo", title: `${doc.title} | Axis & Sage`, description: slug === "privacy" ? "How Axis & Sage Advisory collects, uses and protects personal data from axisandsage.com." : "The terms that apply to your use of axisandsage.com." },
  }));
}

/** Every canonical v2 document, in dependency-friendly order (referenced documents first). */
export function buildSeed(): SeedDoc[] {
  return [...tools(), ...testimonials(), ...people(), ...work(), ...practices(), ...engagements(), ...faqs(), ...library(), ...legal(), ...sitePages(), settings(), home(), method()];
}

/** The counts the seeder must find before it will publish. */
export const EXPECTED_COUNTS: Record<string, number> = {
  companySettings: 1, homePageV2: 1, conversionMethod: 1, sitePage: 8, person: 2, practice: 4, workItem: 16,
  testimonialQuote: 4, engagement: 7, faqItem: 8, libraryItem: 11, toolContent: 6, legalPage: 2,
};
