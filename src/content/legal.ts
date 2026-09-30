// Privacy notice and terms of use, exactly as written in brief 11 §5 (reference/briefs/11-launch-build.md).
// Drafts for Ifeanyi's approval before launch; not legal advice.

export type LegalItem = string | { lead: string; text: string };
export type LegalBlock = { p: string } | { ul: LegalItem[] };
export type LegalSection = { id: string; heading: string; body: LegalBlock[] };
export type LegalDoc = { label: string; title: string; updated: string; sections: LegalSection[] };

export const privacyNotice: LegalDoc = {
  label: "PRIVACY",
  title: "Privacy notice",
  updated: "Last updated: October 2026",
  sections: [
    { id: "who-we-are", heading: "Who we are", body: [
      { p: "Axis & Sage Advisory Limited (\"Axis & Sage\", \"we\") is registered in Masdar City Free Zone, Abu Dhabi, United Arab Emirates. We decide how personal data collected through axisandsage.com is used, and we handle it in line with applicable data protection law. That includes the UAE's Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data and Nigeria's Data Protection Act 2023. Questions about this notice go to info@axisandsage.com." },
    ] },
    { id: "what-we-collect", heading: "What we collect", body: [
      { ul: [
        { lead: "Notes, forms and calls.", text: "When you send a note, use the \"Who needs to act?\" form or book a call, we collect your name, work email, company, role, the sentence you write, when it needs to happen, how you heard about us, and anything else you choose to tell us." },
        { lead: "Tools.", text: "When you finish a tool, we keep your answers and your result without your name or email, so we can see which tools help people. If you ask us to email you the result, we keep it with your email." },
        { lead: "Newsletter.", text: "When you subscribe to Terms & Moments, we keep your email address and your confirmation." },
        { lead: "Bookings.", text: "When you book a call, Cal.com passes us the details you give it." },
        { lead: "How you found us.", text: "We note the campaign link, the referring site and the first page you landed on. Your browser keeps this for 90 days and sends it to us only if you submit a form." },
        { lead: "Technical data.", text: "We count page views with Vercel Web Analytics, which doesn't use cookies. To stop our forms being abused, we use a scrambled (hashed) version of your IP address and keep it for a few hours at most." },
      ] },
      { p: "We don't ask for sensitive personal data. Please don't send it to us." },
    ] },
    { id: "why-we-use-it", heading: "Why we use it", body: [
      { ul: [
        "To reply to you and prepare for a conversation you asked for.",
        "To send you what you asked for, such as a tool result or a spreadsheet.",
        "To send the newsletter, only after you confirm your subscription.",
        "To see which pages and links help people reach us.",
        "To keep the site and our inboxes free of spam and abuse.",
      ] },
      { p: "We rely on:" },
      { ul: [
        "your consent, for the newsletter",
        "the steps you ask us to take before a possible engagement, for enquiries, bookings and tool emails",
        "our legitimate interest in running and protecting our business, for analytics and security",
      ] },
      { p: "You can withdraw consent at any time." },
    ] },
    { id: "who-else-handles-it", heading: "Who else handles it", body: [
      { p: "A small number of providers process data for us:" },
      { ul: [
        "Vercel hosts the website. It briefly holds a copy of your message if our tracker can't be reached, and deletes it once the message arrives.",
        "Google Workspace runs our email and the tracker we use to follow up enquiries.",
        "MailerLite sends the newsletter.",
        "Cal.com runs our booking calendar.",
      ] },
      { p: "If you message us on WhatsApp, WhatsApp's own terms and privacy policy also apply. We don't sell personal data or share it for anyone else's marketing." },
    ] },
    { id: "international-transfers", heading: "International transfers", body: [
      { p: "Our providers may process data outside the UAE and Nigeria, including in the European Union and the United States. We choose providers that protect personal data with contractual and technical safeguards." },
    ] },
    { id: "how-long-we-keep-it", heading: "How long we keep it", body: [
      { ul: [
        "Enquiries and bookings: up to 24 months after our last contact. If we work together, we keep them for as long as our contract and the law require.",
        "Tool results without an email: up to 12 months.",
        "Newsletter subscriptions: until you unsubscribe. Every issue has an unsubscribe link.",
        "Hashed IP addresses: a few hours at most.",
      ] },
    ] },
    { id: "your-rights", heading: "Your rights", body: [
      { p: "Depending on where you live, you can ask us to:" },
      { ul: [
        "tell you what we hold about you",
        "correct it or delete it",
        "restrict how we use it, or object to it",
        "give you a copy in a portable form",
      ] },
      { p: "Write to info@axisandsage.com and we'll reply within 30 days. You can also complain to your data protection authority, such as the UAE Data Office or the Nigeria Data Protection Commission." },
    ] },
    { id: "children", heading: "Children", body: [
      { p: "This site is for businesses. It isn't directed at anyone under 18." },
    ] },
    { id: "changes", heading: "Changes", body: [
      { p: "When we change this notice, we'll update the date at the top." },
    ] },
  ],
};

export const termsOfUse: LegalDoc = {
  label: "TERMS",
  title: "Terms of use",
  updated: "Last updated: October 2026",
  sections: [
    { id: "about-these-terms", heading: "1. About these terms", body: [
      { p: "These terms apply to your use of axisandsage.com, which is run by Axis & Sage Advisory Limited, Masdar City Free Zone, Abu Dhabi, United Arab Emirates. By using the site, you accept them." },
    ] },
    { id: "information-not-advice", heading: "2. Information, not advice", body: [
      { p: "The site, guides and tools give general information. Tool results are illustrative estimates based on what you enter. They are not financial, legal, tax or investment advice, so don't rely on them without advice for your own situation. Nothing on the site is an offer to raise capital or to arrange investments." },
    ] },
    { id: "no-engagement", heading: "3. No engagement until we sign one", body: [
      { p: "Using the site, sending a note or booking a call doesn't make you our client. We work under a signed engagement letter that sets out the scope, fees and terms." },
    ] },
    { id: "our-content", heading: "4. Our content", body: [
      { p: "We own, or are licensed to use, the content on this site: the text, design, graphics, tools and templates. You may view it, and you may download templates and tool results for your own organisation's internal use. You may not copy, resell or republish our content, tools or templates without our written permission. Client names, logos and quotes belong to those clients." },
    ] },
    { id: "using-the-site", heading: "5. Using the site properly", body: [
      { p: "Don't try to break or overload the site, scrape it, or send spam or harmful material through our forms. We may block access that does." },
    ] },
    { id: "other-websites", heading: "6. Other websites", body: [
      { p: "Links to other sites are there for convenience. We aren't responsible for their content or practices." },
    ] },
    { id: "liability", heading: "7. Liability", body: [
      { p: "We provide the site as it is. We work to keep it accurate and available, but we can't guarantee either. As far as the law allows, we aren't liable for any loss arising from your use of the site or from relying on its content. Nothing in these terms limits any liability that the law doesn't allow to be limited." },
    ] },
    { id: "privacy", heading: "8. Privacy", body: [
      { p: "Our privacy notice explains how we handle personal data." },
    ] },
    { id: "governing-law", heading: "9. Governing law", body: [
      { p: "These terms are governed by the laws of the Emirate of Abu Dhabi and the federal laws of the United Arab Emirates. The courts of Abu Dhabi have jurisdiction." },
    ] },
    { id: "changes-and-contact", heading: "10. Changes and contact", body: [
      { p: "We may update these terms. When we do, we'll change the date at the top. Questions go to info@axisandsage.com." },
    ] },
  ],
};
