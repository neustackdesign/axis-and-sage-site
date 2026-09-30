import { availableTemplates } from "./library";

// Global copy and contact details. Anything in [square brackets] is a placeholder to fill before launch.

export const contact = {
  email: "info@axisandsage.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "",
  companyLinkedIn: process.env.NEXT_PUBLIC_LINKEDIN_URL || "",
  legalName: "Axis & Sage Advisory Limited",
  registeredAddress: "Masdar City Free Zone, Abu Dhabi, United Arab Emirates",
  registeredAddressShort: "Masdar City Free Zone, Abu Dhabi, UAE",
  foundersBased: "Founders in Dubai and Lagos",
};

export const whatsappMessage = "Hi Axis & Sage, we need ___ to ___.";

/** WhatsApp deep link with the message pre-filled. Null while the number is unset: every WhatsApp link then hides. */
export function whatsappHref(message = whatsappMessage) {
  const digits = contact.whatsappNumber.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; key: string; eyebrow: string; blurb: string; items: NavLink[] };

export const practiceNav: NavLink[] = [
  { label: "Strategy & Investment", href: "/what-we-do/strategy-and-investment", description: "Get the terms right." },
  { label: "Product & Technology", href: "/what-we-do/product-and-technology", description: "Make the moment clear." },
  { label: "Brand & Market", href: "/what-we-do/brand-and-market", description: "Say it so they act." },
  { label: "Embedded leadership", href: "/what-we-do/embedded-leadership", description: "A principal in the seat." },
  { label: "Engagements and pricing", href: "/engagements", description: "Start with one sentence. Know the price before we start." },
];

export const libraryNav: NavLink[] = [
  { label: "Tools", href: "/library#tools", description: "Free tools for the decision in front of you." },
  { label: "Guides", href: "/library#guides", description: "Delegation of authority, ESOPs, investor readiness, pitch decks and the payment screen." },
  ...(availableTemplates.length ? [{ label: "Templates", href: "/library#templates", description: "Delegation of authority, board charter, ESOP term sheet and more." }] : []),
  { label: "Newsletter", href: "/newsletter", description: "Terms & Moments, each month." },
];

export const navGroups: Record<"whatWeDo" | "library", NavGroup> = {
  whatWeDo: {
    label: "What we do",
    key: "what-we-do",
    eyebrow: "WHAT WE DO",
    blurb: "Strategy & Investment fixes terms. Product & Technology fixes moments. Brand & Market fixes the promise and the message.",
    items: practiceNav,
  },
  library: {
    label: "Library",
    key: "library",
    eyebrow: "LIBRARY",
    blurb: "Built from the frameworks we use with clients. No sign-up to use them.",
    items: libraryNav,
  },
};

export const primaryLinks: NavLink[] = [
  { label: "Work", href: "/work" },
  { label: "Conversion Design", href: "/conversion-design" },
  { label: "People", href: "/people" },
];

export const bookCallHref = "/contact#book";
export const scorecardHref = "/tools/conversion-scorecard";

export const ctaBand = {
  headline: "Who needs to act?",
  line: "Tell us in one sentence. We reply within one working day with a clear next step.",
};

export const newsletter = {
  name: "Terms & Moments",
  line: "Each month, one decision that didn't turn into action: why, and what fixed it.",
};

export const whenOptions = ["this month", "this quarter", "this year", "no date yet"] as const;

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "What we do",
    links: practiceNav.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Work",
    links: [
      { label: "All work", href: "/work" },
      { label: "Investors commit", href: "/work?action=investors-commit" },
      { label: "Partners sign", href: "/work?action=partners-sign" },
      { label: "Teams execute", href: "/work?action=teams-execute" },
      { label: "Customers buy", href: "/work?action=customers-buy" },
    ],
  },
  {
    title: "Library",
    links: libraryNav.map(({ label, href }) => ({ label, href })),
  },
  {
    title: "Company",
    links: [
      { label: "Conversion Design", href: "/conversion-design" },
      { label: "People", href: "/people" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const legalLine = `© 2026 ${contact.legalName} · ${contact.registeredAddress}`;
