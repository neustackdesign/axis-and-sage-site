import type { HomePage, SiteSettings } from "@/types/content";
import canonicalContent from "./canonical-content.json";

export const fallbackSettings = canonicalContent.settings as SiteSettings;
export const fallbackHome = canonicalContent.home as HomePage;
