import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Politică de confidențialitate" };

export default function PoliticaDeConfidentialitate() {
  return <LegalPage slug="politica-de-confidentialitate" />;
}
