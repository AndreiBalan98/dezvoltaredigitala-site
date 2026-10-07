import type { Metadata } from "next";
import Button from "@/components/Button";
import Card from "@/components/Card";
import IconList from "@/components/IconList";
import PageHead from "@/components/PageHead";
import Section from "@/components/Section";
import { EMAIL, PHONE } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

// Texts: content/pages/contact.json with content/fixes.json (spec 004). The message form needs a backend
// (non-goal) and is removed; the embedded Google Map is replaced by a link to the same search the live map
// shows ("C&A Connect", zoom 15) — PO decision, so the page loads no Google code.
const MAP_URL = "https://maps.google.com/maps?q=C%26A%20Connect&z=15&hl=ro";

export default function Contact() {
  return (
    <>
      <PageHead title="Contact" />
      <Section>
        <Card className="contact-card">
          <h2>Ai o întrebare? Scrie-ne aici</h2>
          <IconList
            items={[
              { icon: "map-pin", content: "C&A Connect S.R.L. Botoșani, Strada Dobosari, 79 H" },
              {
                icon: "phone",
                content: (
                  <>
                    <a href={PHONE.href}>{PHONE.display}</a>
                    <br />
                    L-V: 8-16
                  </>
                ),
              },
              {
                icon: "mail",
                content: (
                  <>
                    <a href={EMAIL.href}>{EMAIL.display}</a>
                    <br />
                    Suport online
                  </>
                ),
              },
            ]}
          />
          <Button href={MAP_URL}>Deschide în Google Maps</Button>
        </Card>
      </Section>
    </>
  );
}
