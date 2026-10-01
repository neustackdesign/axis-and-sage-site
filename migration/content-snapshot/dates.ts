// When each page's content last changed (ISO dates). The sitemap and Article JSON-LD read from here, not the build time.
// Update the date when you change a page's content.
export const siteLaunchDate = "2026-09-30";

export const contentDates: Record<string, string> = {
  "/": "2026-09-30",
  "/conversion-design": "2026-09-30",
  "/engagements": "2026-09-30",
  "/work": "2026-09-30",
  "/people": "2026-09-30",
  "/library": "2026-09-30",
  "/newsletter": "2026-09-30",
  "/contact": "2026-09-30",
  "/privacy": "2026-09-30",
  "/terms": "2026-09-30",
  "/guides/what-the-conversion-diagnostic-fee-pays-for": "2026-09-30",
};

export const contentDate = (path: string) => contentDates[path] || siteLaunchDate;
