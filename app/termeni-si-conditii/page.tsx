import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Termeni și condiții" };

export default function TermeniSiConditii() {
  return <LegalPage slug="termeni-si-conditii" />;
}
