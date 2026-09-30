// Text helpers shared by the pipeline and its tests.

/** Removes URLs (and bare domains) from visitor text before we echo it back in an email. */
export function stripUrls(text: string) {
  return text
    .replace(/\b(?:https?:\/\/|www\.)\S+/gi, "[link removed]")
    .replace(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|io|co|ng|ae|app|dev|xyz|info|biz|ru|cn|link|click|top)(?:\/\S*)?\b/gi, "[link removed]")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
