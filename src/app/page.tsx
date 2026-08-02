import type { Metadata } from "next";
import { HomeSections } from "@/components/sections/HomeSections";
import { getHomePage, getSiteSettings } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, home] = await Promise.all([getSiteSettings(), getHomePage()]);
  return { title: home.seo?.title || settings.seo.title, description: home.seo?.description || settings.seo.description, alternates: { canonical: "/" } };
}

export default async function HomePage() {
  const home = await getHomePage();
  return <HomeSections home={home} />;
}
