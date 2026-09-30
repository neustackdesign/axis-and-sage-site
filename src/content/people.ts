export type Person = {
  slug: string;
  name: string;
  title: string;
  half: "terms" | "moments";
  line: string;
  cardBody: string;
  cardProof: string[];
  bio: string;
  selectedWork: string[];
  extra: { label: string; value: string };
  education: string;
  basedIn: string;
  links: { label: string; href: string }[];
  portrait?: string;
};

export const people: Person[] = [
  {
    slug: "ifeanyi-monyei",
    name: "Ifeanyi Monyei",
    title: "Co-founder & [CEO]",
    half: "terms",
    line: "Designs the terms people act on.",
    cardBody: "Governance, delegation of authority, executive and employee incentives, deal structures and mergers. Eleven years inside a pan-African technology group, from consulting manager to chief of staff to group head of strategy and growth.",
    cardProof: [
      "Authored the group's governance framework, delegation of authority, board pay policy, CEO reward framework and employee share scheme redesign.",
      "Designed and led the merger that created GV Solutions, where she now serves as fractional COO.",
      "Consulting lead within the group on Nigeria's National Social Investment Programme.",
    ],
    bio: "Ifeanyi works on the machinery behind decisions: who decides, who is rewarded, and on what terms partners and investors commit. She spent eleven years inside Venture Garden Group and its portfolio. She rose from consulting manager, heading VGN Consulting and holding the Head of Business Analysis and Head of Product R&D roles, to Chief of Staff to the Group CEO (including GreenHouse Capital, the group's investment arm), and then to Group Head, Strategy & Growth, with a board seat at Venture Garden Nigeria Limited. She now serves as fractional COO of GV Solutions, the company she designed and led the merger to create.",
    selectedWork: [
      "Governance framework and delegation of authority, board compensation policy, CEO total reward framework and employee share scheme redesign for Venture Garden Group.",
      "The iGate Advisory and Garden Ventures merger that created GV Solutions.",
      "Consulting lead within the group on Nigeria's National Social Investment Programme (GEEP, National Cash Transfer, Home-Grown School Feeding, N-Power).",
      "On secondment to Galaxy Backbone, led the ease-of-doing-business reform workstream and the 1Gov.ng single-window vision.",
      "Payments strategy with Glenbrook Partners.",
      "Co-founder and CEO of Business Analyst Community Nigeria.",
    ],
    extra: { label: "Craft", value: "Founder equity, incentive design, fund waterfalls, board reward, joint-venture economics, and the commercial terms of agreements across several jurisdictions." },
    education: "BSc Biochemistry, University of Benin.",
    basedIn: "Dubai.",
    links: [{ label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_IFEANYI || "" }],
  },
  {
    slug: "tomiwa-ogunmodede",
    name: "Tomiwa Ogunmodede",
    title: "Co-founder, Product & Technology",
    half: "moments",
    line: "Designs the moments people act in.",
    cardBody: "Products, services and brands where money, access and trust meet. More than ten years across fintech, education, hospitality and AI-assisted products, from first design hire to co-founder.",
    cardProof: [
      "Farmcrowdy: first-time mobile sponsorship conversion from 18% to 60%.",
      "Co-founded Mular: $2.1M+ processed across 19K+ transactions.",
      "Designed for Kolibri, a learning platform used in 220+ countries and territories.",
    ],
    bio: "Tomiwa designs the moments where people decide: the flow, the screen, the message, the system behind the counter. He joined Farmcrowdy as its first design hire, where first-time mobile sponsorship conversion moved from 18% to 60%, and later led products and programmes. He spent nearly four years as Senior Product Designer on Kolibri at Learning Equality, a learning platform used in 220+ countries and territories. He co-founded Mular (stablecoin-to-Naira payments, $2.1M+ processed) and Earlybean (family finance, Techstars '23). He leads product and technology for a 14-venue hospitality group in Lagos, and founded Neustack Studio.",
    selectedWork: [
      "Farmcrowdy sponsorship flow and first design system (300+ components).",
      "Kolibri content import and coach tools; contributor to the open-source Kolibri Design System (500+ components).",
      "Mular's payment, rates and settlement experience.",
      "Earlybean's four-sided permissions for parents, children, schools and merchants.",
      "Lion Hospitality Partners' order, payment, kitchen and inventory systems.",
      "AdPipe's AI-assisted creation workflows.",
    ],
    extra: { label: "Writing and speaking", value: "BusinessDay SME Clinic panellist (2025); Learning Equality, “When the Internet Behaves Like Weather” (2026)." },
    education: "BSc Computer Science with Economics, Obafemi Awolowo University.",
    basedIn: "Dubai and Lagos.",
    links: [
      { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_TOMIWA || "" },
      { label: "Portfolio", href: process.env.NEXT_PUBLIC_PORTFOLIO_TOMIWA || "" },
    ],
  },
];

export const personBySlug = (slug: string) => people.find((p) => p.slug === slug);

// Optional block: named specialists, added when confirmed. The block hides while this list is empty.
export const specialists: { name: string; role: string }[] = [];
