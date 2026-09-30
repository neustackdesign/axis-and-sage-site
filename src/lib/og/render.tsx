import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fonts = async () => {
  const dir = join(process.cwd(), "src/lib/og");
  const [serif, mono] = await Promise.all([readFile(join(dir, "SourceSerif4-Regular.ttf")), readFile(join(dir, "GeistMono-Regular.ttf"))]);
  return [
    { name: "Source Serif 4", data: serif, weight: 400 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
};

const mark = `data:image/svg+xml;base64,${Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="483.7 735.5 494.6 216.39"><path d="M953.47 862.43L909.8 862.43C876.6 862.43 842.45 873.64 814.28 893.79L776.88 920.53C748.7 940.68 714.55 951.89 681.36 951.89L666.29 951.89L691.12 824.96L706.19 824.96C739.39 824.96 773.54 813.75 801.71 793.6L839.11 766.85C867.28 746.71 901.43 735.5 934.63 735.5L978.3 735.5L953.47 862.43Z" fill="#FE94F9" fill-opacity="0.7"/><path d="M770.88 862.43L727.21 862.43C694.01 862.43 659.86 873.64 631.69 893.79L594.28 920.53C566.11 940.68 531.96 951.89 498.76 951.89L483.7 951.89L508.53 824.96L523.6 824.96C556.8 824.96 590.95 813.75 619.12 793.6L656.52 766.85C684.69 746.71 718.84 735.5 752.04 735.5L795.71 735.5L770.88 862.43Z" fill="#FE5F03" fill-opacity="0.7"/></svg>').toString("base64")}`;

/** Open Graph card in the design system: mono label, serif headline, orange rule, paper ground. */
export async function renderOg({ label, title }: { label: string; title: string }) {
  const size = title.length > 70 ? 60 : title.length > 42 ? 70 : 84;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#ECEBE9", padding: "64px 72px", color: "#1F1F1F" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 2.4, color: "#5B5A57", textTransform: "uppercase" }}>{label}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={96} height={42} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <div style={{ fontFamily: "Source Serif 4", fontSize: size, lineHeight: 1.06, letterSpacing: -1.2, maxWidth: 1000 }}>{title}</div>
          <div style={{ width: 160, height: 8, background: "#E8590C" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Geist Mono", fontSize: 20, letterSpacing: 2.4, color: "#5B5A57" }}>
          <span>AXIS &amp; SAGE ADVISORY</span>
          <span>AXISANDSAGE.COM</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
