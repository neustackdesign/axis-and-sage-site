import { PracticeView } from "@/components/sections/PracticeView";
import { embeddedLeadership } from "@/content/practices";
import { embeddedLeadershipHref } from "@/content/site";
import { pageTitles } from "@/content/titles";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: pageTitles.embeddedLeadership.title, absoluteTitle: true, path: embeddedLeadershipHref, description: pageTitles.embeddedLeadership.description });

export default function EmbeddedLeadershipPage() {
  return <PracticeView p={embeddedLeadership} trail={[{ name: "Engagements and pricing", path: "/engagements" }, { name: embeddedLeadership.label, path: embeddedLeadershipHref }]} />;
}
