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
  return <MotionScope><div className="landing-page">{data.hero ? <EditorialHero data={data.hero} /> : null}{data.about ? <AboutOverview data={data.about} /> : null}{data.services ? <ServiceIndex data={data.services} /> : null}{data.projects ? <SelectedWork data={data.projects} /> : null}<ClientPerspectives data={data.testimonials} />{data.faqs ? <Questions data={data.faqs} /> : null}{data.contact ? <ContactSection data={data.contact} /> : null}</div></MotionScope>;
}
