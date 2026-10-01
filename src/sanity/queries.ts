// GROQ for the v2 content model only. These queries never name a legacy v1 type (homePage, siteSettings, service,
// project, testimonial, faq); test/sanity.test.mjs checks that. Results are shaped into src/lib/content/types.ts by ./load.

export const SINGLETON_IDS = { settings: "axisSageSettings", home: "axisSageHome", method: "axisSageConversionMethod" } as const;
export const sitePageId = (key: string) => `axisSagePage-${key}`;

const seo = `seo{title, description, ogTitle}`;
const cta = `{label, href}`;
const link = `{label, href, description}`;
const image = `{asset->{_id, url, metadata{lqip, dimensions{width, height}}}, hotspot, crop, alt}`;

export const toolProjection = `{"slug": slug.current, title, "line": intro, "kind": eyebrow, badge, glyph, cta, instructions, ${seo}}`;
export const workProjection = `{"slug": slug.current, "name": title, sector, roles, actions, "line": summary, "hasCase": caseStudy == true, provenance}`;
const caseCardProjection = `{"slug": slug.current, "name": title, roles, actions, needed, changed, moved, provenance}`;
const testimonialProjection = `{quote, name, title, company, "portrait": portrait${image}}`;
const personProjection = `{
  "slug": slug.current, name, publicTitle, practiceTitle, initials, focus, principleLine, shortBio, longBio, proofPoints,
  selectedWork, extra, education, basedIn, "links": coalesce(links[]${link}, []), "portrait": portrait${image},
  "relatedWork": coalesce(relatedWork[]->${workProjection}, []), ${seo}, _updatedAt
}`;
const engagementProjection = `{
  "slug": slug.current, name, tier, recommended, publishedPrice, publicPrice, currency, uaePrice, priceLabel, duration,
  bring, weDo, youGet, intro, points, "cta": cta${cta}, creditRule, feeExplainer, "timeline": coalesce(timeline[]{when, what}, [])
}`;
const faqProjection = `{"q": question, "a": answer}`;

export const settingsQuery = `*[_type == "companySettings" && _id == $id][0]{
  companyName, shortName, legalName, siteUrl, contactEmail, bookingUrl, registeredAddress, registeredAddressShort,
  foundersBased, locations, regionTag,
  navigation{
    whatWeDo{label, key, eyebrow, blurb, "items": coalesce(items[]${link}, [])},
    library{label, key, eyebrow, blurb, "items": coalesce(items[]${link}, [])},
    "primaryLinks": coalesce(primaryLinks[]${link}, [])
  },
  "footerColumns": coalesce(footerNavigation[]{title, "links": coalesce(links[]${link}, [])}, []),
  "socialLinks": coalesce(socialLinks[]${link}, []),
  legalLine, "primaryCta": primaryCta${cta}, "scorecardCta": scorecardCta${cta}, ctaBand{headline, line},
  newsletter{name, line, archiveEmpty}, whatsappMessage, "defaultSeo": defaultSeo{title, description, ogTitle}
}`;

export const homeQuery = `*[_type == "homePageV2" && _id == $id][0]{
  eyebrow, headline, supportingCopy,
  "desktopHeroImage": desktopHeroImage${image}, "mobileHeroImage": mobileHeroImage${image},
  heroImageAlt, heroImageCredit, heroImageSourceUrl,
  "primaryCTA": primaryCTA${cta}, "secondaryCTA": secondaryCTA${cta},
  "practices": coalesce(practices[]->{"title": title}, []),
  logoStrip{label, names}, "sections": coalesce(sections[]{key, label, title, intro}, []),
  "gapCards": coalesce(gapCards[]{glyph, text}, []), conversionLinkLabel, foundersNote,
  "stats": coalesce(stats[]{numeral, label, tag, source}, []), statsSource,
  "selectedWork": coalesce(selectedWork[]->${caseCardProjection}, []),
  "selectedPeople": coalesce(selectedPeople[]->${personProjection}, []),
  "testimonials": coalesce(testimonials[]->${testimonialProjection}, []),
  ${seo}, _updatedAt
}`;

export const methodQuery = `*[_type == "conversionMethod" && _id == $id][0]{
  hero{label, title, sub}, "sections": coalesce(sections[]{key, label, title, intro}, []),
  "actors": coalesce(actors[]{glyph, actor, examples}, []), actorsClosing,
  terms{title, body}, moments{title, body}, behaviourNote,
  "sentenceRows": coalesce(sentenceRows[]{who, action, stops, look}, []),
  "methodSteps": coalesce(methodSteps[]{index, title, body}, []),
  "methodStepsExpanded": coalesce(methodStepsExpanded[]{index, title, body}, []),
  example{timelineLabel, baselineValue, baselineLabel, "steps": coalesce(steps[]{when, said, value, valueLabel, did, action}, []), source, "caseSlug": caseStudy->slug.current, caseLinkLabel},
  question{title, body}, "actionCards": coalesce(actionCards[]{key, label, glyph, line}, []), actionCardLinkLabel,
  "faqs": coalesce(faqs[]->${faqProjection}, []), ${seo}, _updatedAt
}`;

export const sitePageQuery = `*[_type == "sitePage" && _id == $id][0]{
  key, hero{label, title, sub}, "sections": coalesce(sections[]{key, label, title, intro}, []),
  "strings": coalesce(strings[]{key, value}, []), ${seo}, _updatedAt
}`;

export const peopleQuery = `*[_type == "person" && defined(slug.current)] | order(order asc) ${personProjection}`;
export const personQuery = `*[_type == "person" && slug.current == $slug][0] ${personProjection}`;

export const practicesQuery = `*[_type == "practice" && defined(slug.current)] | order(order asc){
  "slug": slug.current, title, section, eyebrow, headline, summary, navDescription, ledByLabel,
  "ledBy": coalesce(ledBy[]->{"slug": slug.current, name}, []), whenToCall, capabilities, howItWorks, connectsCopy,
  "proof": coalesce(proof[]->${workProjection}, []), proofNote, whenItFits, "tools": coalesce(tools[]->${toolProjection}, []),
  ${seo}, _updatedAt
}`;

// Only featured work is public: the held-back items stay in the Studio and off the site.
export const workIndexQuery = `*[_type == "workItem" && featured == true && defined(slug.current)] | order(order asc) ${workProjection}`;
export const caseSlugsQuery = `*[_type == "workItem" && caseStudy == true && defined(slug.current)] | order(order asc){"slug": slug.current, "name": title, moved, _updatedAt}`;
export const caseQuery = `*[_type == "workItem" && caseStudy == true && slug.current == $slug][0]{
  "slug": slug.current, "name": title, sector, years, roles, actions, provenance, intro, "needed": caseNeeded, inTheWay,
  "changes": coalesce(changes[]{tag, text}, []), "changedSummary": changed, moved,
  "stats": coalesce(metrics[]{numeral, label, source}, []), "quote": quote->${testimonialProjection},
  "ledBy": relatedPeople[0]->{"slug": slug.current, name}, "tools": coalesce(relatedTools[]->${toolProjection}, []),
  artifact, ${seo}, _updatedAt
}`;

export const engagementsQuery = `*[_type == "engagement"] | order(order asc) ${engagementProjection}`;
export const faqsQuery = `*[_type == "faqItem" && $placement in placements] | order(order asc) ${faqProjection}`;

export const toolsQuery = `*[_type == "toolContent" && defined(slug.current)] | order(order asc) ${toolProjection}`;
export const toolQuery = `*[_type == "toolContent" && slug.current == $slug][0] ${toolProjection}`;

export const libraryQuery = `*[_type == "libraryItem" && status != "draft" && type == "guide"] | order(order asc){"slug": slug.current, title, category, "published": status == "published"}`;
export const templatesQuery = `*[_type == "libraryItem" && type == "template" && status == "published" && defined(file.asset)] | order(order asc){title, format, "file": file.asset->url}`;
export const guideQuery = `*[_type == "libraryItem" && type == "guide" && status == "published" && slug.current == $slug][0]{
  "slug": slug.current, title, category, excerpt, publishedAt, "published": true,
  "authors": coalesce(authors[]->${personProjection}, []),
  "body": coalesce(body[]{
    ...,
    _type == "asToolEmbed" => {"tool": tool->${toolProjection}},
    _type == "asEngagementTimeline" => {"days": coalesce(engagement->timeline[]{when, what}, [])},
    _type == "asArticleEnd" => {headline, "cta": cta${cta}}
  }, []),
  ${seo}, _updatedAt
}`;

export const newsletterIssuesQuery = `*[_type == "libraryItem" && type == "newsletter" && status == "published" && defined(slug.current)] | order(publishedAt desc){title, publishedAt, "href": "/library#newsletter"}`;

export const legalQuery = `*[_type == "legalPage" && slug.current == $slug][0]{
  label, title, effectiveDate, effectiveLabel, "sections": coalesce(sections[]{"id": anchor, heading, body}, []), ${seo}, _updatedAt
}`;

/** Every public path's last edit, for the sitemap. */
export const sitemapQuery = `{
  "singletons": *[_id in [$settings, $home, $method] || _type == "sitePage"]{_id, key, _updatedAt},
  "practices": *[_type == "practice" && defined(slug.current)]{"slug": slug.current, section, _updatedAt},
  "cases": *[_type == "workItem" && caseStudy == true && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "people": *[_type == "person" && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "tools": *[_type == "toolContent" && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "guides": *[_type == "libraryItem" && type == "guide" && status == "published" && defined(slug.current)]{"slug": slug.current, _updatedAt},
  "legal": *[_type == "legalPage" && defined(slug.current)]{"slug": slug.current, _updatedAt}
}`;
