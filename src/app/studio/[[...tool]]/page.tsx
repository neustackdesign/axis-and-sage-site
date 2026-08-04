import { StudioClient } from "@/components/StudioClient";
import type { Metadata } from "next";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default function StudioPage() {
  return <StudioClient />;
}
