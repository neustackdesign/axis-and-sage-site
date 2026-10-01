// Shareable result links: tool state encoded in the URL hash (#r=...). Nothing is stored on the server.

export function encodeState(state: unknown): string {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeState<T>(value: string): T | null {
  try {
    const bin = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch { return null; }
}

export const readHashState = <T,>(hash: string): T | null => { const m = hash.match(/^#r=(.+)$/); return m ? decodeState<T>(m[1]) : null; };
export const shareUrl = (origin: string, path: string, state: unknown) => `${origin}${path}#r=${encodeState(state)}`;
