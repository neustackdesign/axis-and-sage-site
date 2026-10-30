import { SiteShell } from "@/components/layout/SiteShell";

/** The homepage uses the standard sticky bar: the 2026 hero is a split field, not a full-bleed cover. */
export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell>{children}</SiteShell>;
}
