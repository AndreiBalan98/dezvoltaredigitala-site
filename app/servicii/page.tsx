import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageHead from "@/components/PageHead";
import Section from "@/components/Section";
import { MENU } from "@/lib/site";

export const metadata: Metadata = { title: "Servicii" };

const SERVICE_LINKS = MENU.find((item) => item.label === "Servicii")!.children!;

// Live, /servicii/ is empty below its title. PO decision (spec 004): one card per service page, using only
// existing words — the page names and the home page's "Vezi mai mult".
export default function Servicii() {
  return (
    <>
      <PageHead title="Servicii" />
      <Section>
        <div className="grid-2">
          {SERVICE_LINKS.map((s) => (
            <Card key={s.href} className="service">
              <h2>
                <Link href={s.href}>{s.label}</Link>
              </h2>
              <Button href={s.href}>Vezi mai mult</Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
