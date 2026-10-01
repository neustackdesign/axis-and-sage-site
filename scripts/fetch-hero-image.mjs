// Downloads the homepage hero ("Sunset on Lagos skyline" by Chibuzo Nwaneri, Unsplash License) as a 3200×1800
// landscape crop and saves it where src/content/site.ts → heroImage.src expects it. Run once, then commit the file:
//   pnpm fetch:hero
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const SOURCE = "https://images.unsplash.com/photo-1638437155671-167865b8bd49?auto=format&fit=crop&crop=entropy&w=3200&h=1800&q=82&fm=jpg";
const TARGET = join(process.cwd(), "public/images/axis-sage/lagos-sunset-chibuzo-nwaneri.jpg");

/** Width and height from a JPEG's start-of-frame marker. */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null;
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

const res = await fetch(SOURCE);
if (!res.ok) { console.error(`Download failed: HTTP ${res.status} from images.unsplash.com`); process.exit(1); }
const buf = Buffer.from(await res.arrayBuffer());
const size = jpegSize(buf);
if (!size) { console.error("The download isn't a JPEG."); process.exit(1); }
if (size.width < 1920 || size.width <= size.height) { console.error(`Expected a landscape crop at least 1920px wide; got ${size.width}×${size.height}.`); process.exit(1); }
await mkdir(dirname(TARGET), { recursive: true });
await writeFile(TARGET, buf);
console.log(`Saved ${size.width}×${size.height} (${Math.round(buf.length / 1024)} KB) to ${TARGET}. Commit it.`);
