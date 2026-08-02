import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
import type { ImageValue } from "@/types/content";

const builder = imageUrlBuilder(client);

export function sanityImageUrl(image?: ImageValue) {
  if (!image?.asset) return undefined;
  return builder.image(image).auto("format").fit("crop").url();
}
