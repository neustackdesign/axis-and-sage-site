import { SiteShell } from "@/components/layout/SiteShell";

/** The homepage: the header is part of the hero cover (SiteHeader variant "hero"). */
export default function HomeLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell header="hero">{children}</SiteShell>;
}
