import type { HomePage as HomeData } from "@/types/content";
import { AboutOverview } from "./AboutOverview";
import { ClientPerspectives } from "./ClientPerspectives";
import { ContactSection } from "./ContactSection";
import { EditorialHero } from "./EditorialHero";
import { Questions } from "./Questions";
import { SelectedWork } from "./SelectedWork";
import { ServiceIndex } from "./ServiceIndex";
import { MotionScope } from "@/components/motion/MotionScope";

export function HomePage({ data }: { data: HomeData }) {
  return <MotionScope><div className="landing-page"><EditorialHero data={data.hero} /><AboutOverview data={data.about} /><ServiceIndex data={data.services} /><SelectedWork data={data.projects} /><ClientPerspectives data={data.testimonials} /><Questions data={data.faqs} /><ContactSection data={data.contact} /></div></MotionScope>;
}
