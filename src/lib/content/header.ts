import type { HeaderNav, SiteSettings } from "./types";
import { whatsappLink } from "@/lib/whatsapp";

/** The slice of Site settings the client-side header needs. */
export const headerNav = (s: SiteSettings): HeaderNav => ({
  navigation: s.navigation,
  primaryCta: s.primaryCta,
  scorecardCta: s.scorecardCta,
  contactEmail: s.contactEmail,
  locations: s.locations,
  whatsapp: whatsappLink(s.whatsappMessage),
});
