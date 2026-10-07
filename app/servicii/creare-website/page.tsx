import type { Metadata } from "next";
import Image from "next/image";
import Box from "@/components/Box";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageHead from "@/components/PageHead";
import Section from "@/components/Section";
import ServiceGrid from "@/components/ServiceGrid";

export const metadata: Metadata = { title: "Creare website" };

// Texts: content/pages/creare-website.json with content/fixes.json (spec 004). On the live page the
// packages section is invisible (its scroll-in animation never starts); the PO decided to show it, prices
// included (2026-10-07).
const OFFER = [
  [
    "Coduri scrise în mod unic pentru generarea de pagini dinamice;",
    "Adaptabile oricărui domeniu de activitate;",
    "Coș de produse ușor accesibil și vizibil pe toată perioada navigării;",
  ],
  [
    "Funcționalități nelimitate: status comenzi, gestiune produse, import produse, facturare, modul curier, statistici și rapoarte vânzări;",
    "Variante de produs (atribute) și filtre de căutare avansată;",
  ],
  ["GDPR", "Grafică personalizată", "Design compatibil cu dispozitive mobile", "Panou de administrare"],
  ["Galerie foto administrabilă", "Design logo", "Funcție tap to chat button", "Efecte animate", "100% design unic"],
];

const PACKAGES = [
  {
    title: "Site prezentare",
    price: "€400",
    points: [
      "Grafică basic",
      "Design compatibil cu dispozitive mobile",
      "Până la 5 pagini",
      "Formular contact",
      "Informații Contact: Harta Google",
    ],
  },
  {
    title: "Magazin online",
    price: "€800",
    points: [
      "Grafică standard",
      "Panou de administrare",
      "Până la 10 pagini",
      "Suport tehnic gratuit 30 zile",
      "Campanii de promovare web, la cerere",
    ],
  },
  {
    title: "Roboți software",
    price: "€1200",
    points: [
      "Plăți în funcție de numărul și complexitatea roboților",
      "Procesare facturi și extrase de cont",
      "Date în sisteme ERP sau CRM",
      "Generare de rapoarte și analize",
      "Verificare și validare de informații",
    ],
  },
];

export default function CreareWebsite() {
  return (
    <>
      <PageHead title="Creare website" />
      <Section>
        <div className="split">
          <div className="split__pair">
            <Image
              src="/media/2025/02/young-male-designer-using-graphics-tablet-while-working-with-com-scaled.jpg"
              alt="Designer care lucrează pe o tabletă grafică"
              width={2560}
              height={1707}
              sizes="(max-width: 900px) 50vw, 300px"
            />
            <Image
              src="/media/2025/02/coding-man-scaled.jpg"
              alt="Programator care scrie cod"
              width={2560}
              height={1709}
              sizes="(max-width: 900px) 50vw, 300px"
            />
          </div>
          <div className="split__text">
            <h2>Dezvoltare digitală se situează în fruntea ofertelor din domeniul dezvoltării magazinelor online.</h2>
            <p>
              Echipa noastră dedicată de profesioniști în domeniul dezvoltării digitale se angajează să creeze magazine
              online complet personalizate.
            </p>
            <p>
              Ne concentrăm asupra detaliilor, asigurându-ne că fiecare aspect al platformei este meticulos analizat și
              implementat pentru a oferi o experiență de utilizare excepțională atât pentru publicul local, cât și pentru
              cel internațional.
            </p>
            <p>
              Pe lângă designul atrăgător, ne axăm și pe funcționalități avansate care să optimizeze performanța
              magazinului online și să răspundă nevoilor în schimbare ale clienților.
            </p>
            <Button href="/contact/">Contactează-ne</Button>
          </div>
        </div>
      </Section>

      <Section center title="Ce oferim?">
        <div className="grid-4">
          {OFFER.map((points, i) => (
            <Box key={i}>
              <ul className="points">
                {points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </Box>
          ))}
        </div>
      </Section>

      <ServiceGrid />

      <Section center title="Alege unul dintre pachetele noastre pentru a dezvolta afacerea ta online.">
        <p className="section-sub">
          Pornind de la aceste pachete noi putem crea și consolida viitorul magazin online sau platforma digitală în
          funcție de necesitățile fiecărui business în parte.
        </p>
        <div className="grid-3">
          {PACKAGES.map((pkg) => (
            <Card key={pkg.title} className="package">
              <h3>{pkg.title}</h3>
              <p className="package__from">Începând de la</p>
              <p className="package__price">{pkg.price}</p>
              <ul className="points">
                {pkg.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <Button href="/contact/">Cere oferta</Button>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
