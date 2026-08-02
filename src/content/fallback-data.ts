import type { HomePage, SiteSettings } from "@/types/content";

export const fallbackSettings: SiteSettings = {
  title: "Axis & Sage",
  brandDescription: "Strategy, design, growth, venture building and storytelling.",
  defaultCta: { label: "Work with us", href: "#contact" },
  navigation: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Our work", href: "#our-work" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact", href: "#contact" },
  ],
  footerNavigation: [
    { label: "About us", href: "#about" },
    { label: "Our work", href: "#our-work" },
    { label: "Services", href: "#services" },
    { label: "FAQs", href: "#faqs" },
    { label: "Contact", href: "#contact" },
  ],
  officeLocations: [],
  socialLinks: [],
  copyright: "© 2026 Axis & Sage. All rights reserved.",
  seo: {
    title: "Axis & Sage — Strategy, Design, Growth and Venture Building",
    description: "A boutique consultancy blending strategic thinking with creative execution, helping ambitious brands turn ideas into practical realities.",
  },
};

export const fallbackHome: HomePage = {
  title: "Homepage",
  hero: {
    eyebrow: ["Strategy", "Design", "Growth"],
    heading: "We build businesses, brands, and products that matter",
    body: "A boutique consultancy fusing deep African insight with GCC know-how to help innovators, investors, & public-sector leaders design, build, & scale high-impact ventures.",
    primaryCta: { label: "Work with us", href: "#contact" },
    secondaryCta: { label: "Explore our work", href: "#our-work" },
  },
  about: {
    label: "About us",
    heading: "Where strategy meets storytelling",
    body: "At Axis and Sage, we believe every great business starts with a compelling story. We're the strategic architects and creative storytellers who help ambitious leaders build ventures that don't just succeed—they inspire.",
    approach: "Our approach is simple: think strategically, act creatively, grow sustainably.",
    support: [
      "We've helped launch groundbreaking ventures, transform established brands, and connect investors with game-changing opportunities across Africa and beyond.",
      "From product design to market strategy, from storytelling to growth hacking—we're the partners who see your vision and make it reality.",
    ],
    statistics: [],
  },
  services: {
    label: "Services",
    heading: "What we do",
    introduction: "Think of us as your strategic Swiss Army knife - versatile, reliable, and always sharp.",
    items: [
      { title: "Strategy", slug: "strategy", summary: "From market research to business model design, we help you navigate complexity and find your true north.", capabilities: ["Market Analysis", "Business Model Design", "Competitive Intelligence", "Growth Planning"], featured: true },
      { title: "Design", slug: "design", summary: "", capabilities: [], featured: true },
      { title: "Growth", slug: "growth", summary: "", capabilities: [], featured: true },
      { title: "Venture Building", slug: "venture-building", summary: "", capabilities: [], featured: true },
      { title: "Storytelling", slug: "storytelling", summary: "", capabilities: [], featured: true },
    ],
  },
  projects: {
    label: "Our work",
    heading: "Get inspired by our work",
    introduction: "From disruptive startups to established organizations, we've helped ambitious leaders across Africa and beyond achieve remarkable results.",
    items: [
      {
        title: "Nature Roots",
        slug: "nature-roots",
        summary: "We crafted a brand strategy and digital identity that positioned Nature Roots as more than an organic commodities brand — but a trusted link between African farmers and sustainable global markets. From packaging systems to digital presence, our work emphasized transparency, credibility, and scalability, enabling Nature Roots to enter retail channels with confidence.",
        tags: ["Strategy", "Branding"],
        testimonial: { quote: "Axis & Sage’s work was quick, high quality, and completely transformed our brand, making it both beautiful and highly functional.", personName: "Kunmi Demuren", approved: false },
        tone: "sage",
        featured: true,
      },
      {
        title: "Earlybean",
        slug: "earlybean",
        summary: "Axis & Sage partnered with Earlybean to translate a revolutionary savings model into an intuitive digital product for young Africans. From user research with first-time savers to end-to-end UX design, we built a platform that demystifies finance and encourages long-term wealth creation. The outcome: a 10K+ user community within months and strong investor confidence in the model.",
        tags: ["Product Design", "UX/UI"],
        testimonial: { quote: "Incredible work and turnaround times. We went from just an idea to a fully-fledged product with 10K+ active users in no time.", personName: "Biobele Oyibo", approved: false },
        tone: "amber",
        featured: true,
      },
      {
        title: "Uganda Investor Summit",
        slug: "uganda-investor-summit",
        summary: "We delivered end-to-end event strategy, branding, and investor relations for Uganda’s premier investment conference. From stakeholder mapping to compelling event storytelling and visual identity, our team ensured the Summit positioned Uganda as a forward-thinking hub for regional capital flows.",
        tags: ["Event Strategy", "Storytelling"],
        testimonial: { quote: "The quality of work was excellent, and the team was incredibly professional from start to finish.", personName: "Bunmi Akinyemiju", approved: false },
        tone: "ink",
        featured: true,
      },
    ],
  },
  faqs: {
    label: "FAQs",
    heading: "Answering your questions",
    introduction: "Got more questions? Send us your enquiry below",
    cta: { label: "Get in touch", href: "#contact" },
    items: [
      { question: "What exactly does Axis & Sage do?", answer: "We partner with ambitious organizations and founders to design clarity, scale impact, and build trusted brands. Our work sits at the intersection of strategy, brand, product, and storytelling — helping businesses move from idea to execution, and from execution to sustainable growth.", display: true },
      { question: "Who do you typically work with?", answer: "We work with a diverse range of clients, from early-stage startups validating product-market fit, to growth-stage companies needing sharper strategy and design systems, to public institutions and development partners looking to communicate innovation with credibility.", display: true },
      { question: "How do you structure engagements?", answer: "Every engagement starts with discovery and alignment — understanding your context, goals, and constraints. From there, we co-design the right format: focused sprints, broader projects, or ongoing partnerships.", display: true },
      { question: "What makes Axis & Sage different?", answer: "We’re not just an agency chasing pretty outputs, and we’re not consultants delivering slides no one uses. We live at the crossroads of strategy and craft. Our work is pragmatic, fast, and designed to create measurable business impact.", display: true },
      { question: "Do you only work in Africa?", answer: "Africa is our heartland — it’s where we’ve honed our craft and built deep understanding. But we also partner with clients in the GCC, Europe, and North America, especially where there’s an Africa connection.", display: true },
      { question: "How can we get started?", answer: "Simple: book a conversation with us. In 30 minutes we’ll unpack your goals, challenges, and opportunities — and if we’re the right fit, we’ll map out an engagement that works.", display: true },
    ],
  },
  contact: {
    label: "Contact",
    heading: "Get in touch",
    introduction: "Got a big idea? A complex challenge? Or just want to explore how we can help? We'd love to hear from you!",
    offices: [],
  },
};
