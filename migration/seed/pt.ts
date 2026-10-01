// Small Portable Text builders for the seed. Keys are deterministic, so re-running the seed produces identical
// documents and the seeder reports them as unchanged.

export type Span = { _type: "span"; _key: string; text: string; marks: string[] };
export type MarkDef = { _type: "link"; _key: string; href: string };
export type Block = { _type: "block"; _key: string; style: string; listItem?: "bullet"; level?: number; markDefs: MarkDef[]; children: Span[] };

/** Text with auto-links: email addresses become mailto links; listed phrases link to their paths. */
export function richSpans(text: string, keyPrefix: string, links: Record<string, string> = {}, leadBold?: string) {
  const markDefs: MarkDef[] = [];
  const children: Span[] = [];
  let n = 0;
  const push = (t: string, marks: string[] = []) => { if (t) children.push({ _type: "span", _key: `${keyPrefix}s${n++}`, text: t, marks }); };
  if (leadBold) { push(leadBold, ["strong"]); push(" "); }
  const phrases = Object.keys(links).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`([\\w.+-]+@[\\w-]+\\.[\\w.]+\\w)${phrases.length ? `|(${phrases.join("|")})` : ""}`, "g");
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    push(text.slice(last, m.index));
    const href = m[1] ? `mailto:${m[1]}` : links[m[0]];
    const key = `${keyPrefix}l${markDefs.length}`;
    markDefs.push({ _type: "link", _key: key, href });
    push(m[0], [key]);
    last = (m.index ?? 0) + m[0].length;
  }
  push(text.slice(last));
  return { markDefs, children };
}

export function block(key: string, text: string, opts: { style?: string; bullet?: boolean; links?: Record<string, string>; leadBold?: string } = {}): Block {
  const { markDefs, children } = richSpans(text, key, opts.links, opts.leadBold);
  return { _type: "block", _key: key, style: opts.style ?? "normal", ...(opts.bullet ? { listItem: "bullet" as const, level: 1 } : {}), markDefs, children };
}

/** Plain text of a block array (for reading time and tests). */
export const ptText = (blocks: { _type: string; children?: { text: string }[] }[]) =>
  blocks.filter((b) => b._type === "block").map((b) => (b.children || []).map((c) => c.text).join("")).join("\n");
