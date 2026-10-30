// View types the components render. Sanity queries (src/sanity/queries) map published documents into these shapes.
import type { PortableTextBlock } from "next-sanity";
import type { GlyphName } from "@/lib/glyphs";
import type { ActionKey, Provenance, Role } from "./vocab";

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; key: string; eyebrow: string; blurb: string; items: NavLink[] };
export type Cta = { label: string; href: string };
export type PageSeo = { title?: string; description?: string; ogTitle?: string };
export type SectionIntro = { key: string; label?: string; title?: string; intro?: string };

export type SiteSettings = {
  companyName: string;
  shortName: string;
  legalName: string;
  siteUrl: string;
  contactEmail: string;
  bookingUrl: string;
  registeredAddress: string;
  registeredAddressShort: string;
  foundersBased: string;
  locations: string[];
  regionTag: string;
  navigation: { whatWeDo: NavGroup; library: NavGroup; primaryLinks: NavLink[] };
  footerColumns: { title: string; links: NavLink[] }[];
  socialLinks: NavLink[];
  companyLinkedIn: string;
  legalLine: string;
  primaryCta: Cta;
  scorecardCta: Cta;
  ctaBand: { headline: string; line: string };
  newsletter: { name: string; line: string; archiveEmpty: string };
  whatsappMessage: string;
  defaultSeo: PageSeo;
};

/** What the client-side header needs: navigation and two calls to action. */
export type HeaderNav = Pick<SiteSettings, "navigation" | "primaryCta" | "scorecardCta" | "contactEmail" | "locations"> & { whatsapp: { href: string; number: string } | null };

export type SanityImageView = { url: string; width?: number; height?: number; alt?: string; lqip?: string; focus?: string };

export type Testimonial = { quote: string; name: string; title: string; company?: string; portrait?: string };

export type WorkItem = { slug: string; name: string; sector: string; roles: Role[]; actions: ActionKey[]; line: string; hasCase?: boolean; provenance?: Provenance };
export type Chip = { label: string; kind: "role" | "conversion" };
export type SelectedCase = { slug: string; name: string; chips: Chip[]; needed: string; changed: string; moved: string; provenance?: Provenance };
export type StatTileData = { numeral: string; label: string; tag?: string; source?: string };
export type CaseStat = StatTileData;
export type CaseChange = { tag: "TERMS" | "MOMENT"; text: string };
export type CasePage = {
  slug: string;
  name: string;
  sector: string;
  years?: string;
  chips: Chip[];
  provenance?: Provenance;
  ledBy?: { slug: string; name: string };
  intro?: string;
  needed: string;
  inTheWay?: string[];
  changes?: CaseChange[];
  changedSummary?: string;
  moved: string;
  stats?: CaseStat[];
  quote?: Testimonial;
  tools: ToolMeta[];
  artifact?: "farmcrowdy" | "mular" | "governance" | "merger";
  /** 2026 layout: present when caseHeadline is filled in. */
  design?: CaseDesign;
  seo: PageSeo;
  updatedAt?: string;
};

export type CaseDesign = {
  headline: string;
  place?: string;
  roleLine?: string;
  wayHeadline?: string;
  flow?: { before: string[]; after: string[]; caption?: string };
  result?: CaseResult;
  evidence?: { measured?: string; observed?: string; notClaimed?: string };
  next?: { slug: string; name: string; provenance?: Provenance; actions: ActionKey[]; line: string };
  closing?: { headline: string; line?: string };
};
export type CaseResult = { before: number; after: number; numeral: string; label: string; source?: string };

/** The 2026 set piece: a text panel beside a media field. */
export type SetPiece = {
  slug: string;
  name: string;
  hasCase: boolean;
  provenance?: Provenance;
  eyebrow: string;
  headline: string;
  body: string;
  status?: string;
  caption?: string;
  visual: "dotField" | "merger" | "image";
  tone: "light" | "dark";
  proof: { numeral: string; label: string }[];
  image?: SanityImageView;
};

/** A case told as the four-stage readout. */
export type Readout = { slug: string; name: string; sentence?: string; inTheWay: string[]; changes: CaseChange[]; result?: CaseResult };
export type ProofStat = { label: string; numeral: string; line: string; href?: string };
export type ContactPath = { key: string; title: string; line: string; label: string; who: string; what: string };

export type Person = {
  slug: string;
  name: string;
  title: string;
  practice: string;
  half: "terms" | "moments";
  line: string;
  cardBody: string;
  bio: string;
  bioParagraphs: string[];
  selectedWork: string[];
  homeLine?: string;
  credentialLine?: string;
  extra?: { label: string; value: string };
  education?: string;
  basedIn?: string;
  links: NavLink[];
  initials: string;
  portrait?: string;
  relatedWork: WorkItem[];
  seo: PageSeo;
};

export type ToolMeta = { slug: string; title: string; line: string; kind: string; badge: string; glyph: GlyphName; cta: string; instructions?: string; seo: PageSeo };

export type Practice = {
  slug: string;
  label: string;
  section: "whatWeDo" | "engagements";
  eyebrow: string;
  h1: string;
  sub: string;
  navDescription?: string;
  ledBy?: string;
  ledByPeople: { slug: string; name: string }[];
  whenToCall: string[];
  whatWeDo: string[];
  howItWorks: string[];
  connects?: string;
  proof: WorkItem[];
  proofNote?: string;
  whenItFits?: string;
  tools: ToolMeta[];
  seo: PageSeo;
};

export type EngagementPathKey = "diagnose" | "deliver" | "partner";
/** One offer inside a path. `line` is what you get (main offers) or the intro (variants). */
export type Offer = { slug: string; name: string; main: boolean; recommended?: boolean; price: string; time: string; line: string; cta: Cta };
export type EngagementPath = { key: EngagementPathKey; offers: Offer[] };
export type Specialist = { slug: string; name: string; price: string; time: string; intro: string; points?: string[]; cta?: Cta };
export type DiagnosticInfo = {
  name: string;
  price: { amount: number; currency: string };
  priceText: string;
  uaePrice?: { amount: number; currency: string };
  creditRule: string;
  feeExplainer: string;
  days: { when: string; what: string }[];
  bring: string;
  weDo: string;
  youGet: string;
};
export type EngagementsData = { paths: EngagementPath[]; specialists: Specialist[]; diagnostic: DiagnosticInfo };

export type FaqEntry = { q: string; a: string };

export type Template = { title: string; format: string; file?: string };
export type GuideCard = { slug: string; title: string; category: string; published: boolean };
export type ArticleBody = (PortableTextBlock | { _type: string; _key: string; [k: string]: unknown })[];
export type Guide = GuideCard & { excerpt: string; authors: Person[]; body: ArticleBody; publishedAt?: string; updatedAt?: string; seo: PageSeo };

export type LegalSection = { id: string; heading: string; body: PortableTextBlock[] };
export type LegalDoc = { label: string; title: string; updated: string; sections: LegalSection[]; seo: PageSeo; updatedAt?: string };

export type SitePage = { key: string; hero: { label: string; title: string; sub?: string }; sections: SectionIntro[]; strings: Record<string, string>; paths: ContactPath[]; seo: PageSeo };
