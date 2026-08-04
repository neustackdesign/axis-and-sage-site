export type ImageValue = {
  src?: string;
  alt?: string;
  asset?: { _ref?: string; _id?: string };
};

export type LinkValue = {
  label: string;
  href: string;
  external?: boolean;
};

export type Statistic = {
  value?: string;
  label: string;
  detail?: string;
};

export type Service = {
  _id?: string;
  title: string;
  slug: string;
  summary?: string;
  capabilities?: string[];
  image?: ImageValue;
  featured?: boolean;
  detailApproved?: boolean;
  previewOnly?: boolean;
};

export type Testimonial = {
  _id?: string;
  quote: string;
  personName: string;
  role?: string;
  organisation?: string;
  portrait?: ImageValue;
  approved?: boolean;
  showOnHomepage?: boolean;
  homepageOrder?: number;
  featuredOnHomepage?: boolean;
};

export type Project = {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  cover?: ImageValue;
  tags: string[];
  client?: string;
  year?: string;
  location?: string;
  challenge?: string;
  contribution?: string;
  outcome?: string;
  testimonial?: Testimonial;
  featured?: boolean;
  homepagePlacement?: "featured" | "supporting" | "hidden";
  homepageOrder?: number;
  tone: "sage" | "amber" | "ink";
  seo?: { title?: string; description?: string; canonicalUrl?: string; image?: ImageValue };
};

export type Faq = {
  _id?: string;
  question: string;
  answer: string;
  category?: string;
  display?: boolean;
  showOnHomepage?: boolean;
  homepageOrder?: number;
};

export type SiteSettings = {
  title: string;
  brandDescription: string;
  defaultCta: LinkValue;
  navigation: LinkValue[];
  footerNavigation: LinkValue[];
  contactEmail?: string;
  phone?: string;
  officeLocations?: string[];
  workingAcross?: string;
  socialLinks?: LinkValue[];
  copyright?: string;
  favicon?: ImageValue;
  seo: { title: string; description: string; titleTemplate?: string; canonicalUrl?: string; image?: ImageValue };
};

export type HomePage = {
  title: string;
  seo?: { title?: string; description?: string; image?: ImageValue };
  hero: {
    eyebrow: string[];
    heading: string;
    body: string;
    primaryCta: LinkValue;
    secondaryCta?: LinkValue;
    quote?: string;
    media?: ImageValue;
  };
  about: {
    label: string;
    heading: string;
    body: string;
    approach: string;
    principles?: { number: string; title: string; body: string }[];
    support: string[];
    images?: ImageValue[];
    statistics?: Statistic[];
  };
  services: {
    label: string;
    heading: string;
    introduction: string;
    items: Service[];
  };
  projects: {
    label: string;
    heading: string;
    introduction: string;
    items: Project[];
  };
  testimonials?: {
    label: string;
    heading: string;
    introduction: string;
    items: Testimonial[];
  };
  faqs: {
    label: string;
    heading: string;
    introduction: string;
    cta: LinkValue;
    items: Faq[];
  };
  contact: {
    label: string;
    heading: string;
    introduction: string;
    offices?: string[];
    base?: string;
    workingAcross?: string;
    email?: string;
  };
};
