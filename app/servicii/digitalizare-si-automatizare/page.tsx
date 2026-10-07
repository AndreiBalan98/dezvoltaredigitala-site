import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import IconList from "@/components/IconList";
import PageHead from "@/components/PageHead";
import Section from "@/components/Section";
import ServiceGrid from "@/components/ServiceGrid";

export const metadata: Metadata = { title: "Digitalizare și automatizare" };

// Texts: content/pages/digitalizare-si-automatizare.json with content/fixes.json (spec 004). Live, the six
// "Ce oferim:" points are a slider showing one or two at a time; here they are one list.
const OFFER = [
  "Beneficii diverse, asigurate printr-o colaborare continuă",
  "Creșterea eficienței și productivității organizației",
  "Reducerea costurilor și riscurilor operaționale",
  "Îmbunătățirea satisfacției clienților și angajaților",
  "Accesarea de informații și date în timp real",
  "Adaptarea rapidă la schimbările pieței și ale cerințelor legale",
];

const STEPS = [
  [
    "Identifică procesele care pot fi automatizate.",
    "Acestea sunt de obicei sarcini repetitive, complexe și de mare volum, care nu necesită intervenție umană sau creativitate.",
    "De exemplu, introducerea datelor, generarea rapoartelor, validarea facturilor, procesarea comenzilor, etc.",
  ],
  [
    "Alege o soluție software potrivită pentru nevoile tale.",
    "Există pe piață diferite soluții software care oferă servicii de automatizare a proceselor software, bazate pe tehnologii avansate precum roboți software și Internet of Things (IOT).",
    "Trebuie să alegi o soluție care să fie personalizabilă, scalabilă, sigură și eficientă.",
  ],
  [
    "Colaborează cu echipa noastră de specialiști.",
    "Pentru a implementa cu succes roboți software în afacerea ta, ai nevoie de ajutorul unei echipe de specialiști în domeniul software, care să te consilieze, să îți ofere suport tehnic și să îți asigure mentenanța și actualizarea soluției software.",
  ],
  [
    "Monitorizează și evaluează rezultatele.",
    "După ce ai implementat roboți software în afacerea ta, trebuie să monitorizezi și să evaluezi rezultatele obținute.",
    "Poți folosi instrumente de analiză a datelor și generare de rapoarte, care să îți arate gradul de eficiență și productivitate al roboților software.",
  ],
];

export default function Digitalizare() {
  return (
    <>
      <PageHead title="Digitalizare și automatizare" />
      <Section>
        <div className="split">
          <div className="split__text">
            <h2>Servicii de furnizare de ERP, CMS, și digitalizarea afacerii</h2>
            <p>
              Folosim cele mai noi tehnologii și metodologii de lucru, pentru a asigura calitatea și securitatea
              produselor noastre.
            </p>
            <p>
              Avem o echipă de experți în domeniul IT, care vă pot oferi consultanță, proiectare, dezvoltare,
              implementare, testare, întreținere și suport tehnic pentru soluțiile software pe care le livrăm.
            </p>
          </div>
          <Image
            src="/media/2025/02/computer-engineer-typing-keyboard-writing-code-build-firewalls-scaled.jpg"
            alt="Inginer IT care scrie cod la calculator"
            width={2560}
            height={1707}
            sizes="(max-width: 900px) 100vw, 600px"
          />
        </div>
      </Section>

      <Section light>
        <div className="split">
          <Image
            src="/media/2025/03/handsome-businessman-doing-job-digital-tablet-reading-something-standing-white-background.jpg"
            alt="Om de afaceri care citește pe o tabletă"
            width={972}
            height={872}
            sizes="(max-width: 900px) 100vw, 600px"
          />
          <div className="split__text">
            <h2>Ce oferim:</h2>
            <IconList items={OFFER.map((text) => ({ icon: "check" as const, content: text }))} />
            <Button href="/contact/">Contactează-ne</Button>
          </div>
        </div>
      </Section>

      <Section>
        <div className="split">
          <Image
            src="/media/2025/02/business-scene-top-view-scaled.jpg"
            alt="Echipă la o masă de lucru, văzută de sus"
            width={2560}
            height={1709}
            sizes="(max-width: 900px) 100vw, 600px"
          />
          <div className="split__text">
            <h2>Automatizare roboți software și IOT</h2>
            <p>Cum vă pot ajuta aceste tehnologii să vă optimizați afacerea?</p>
            <p>
              Într-o lume din ce în ce mai conectată și competitivă, este esențial să găsiți soluții eficiente și
              inovatoare pentru a vă îmbunătăți performanța și productivitatea afacerii dumneavoastră.
            </p>
            <p>
              De aceea, vă oferim o gamă variată de servicii de automatizare a proceselor software, bazate pe
              tehnologii avansate precum roboți software și Internet of Things (IOT).
            </p>
          </div>
        </div>
      </Section>

      <Section center title="Pentru a integra roboți software în afacerea ta, trebuie să urmezi câțiva pași esențiali:">
        <div className="grid-4">
          {STEPS.map(([title, ...text]) => (
            <Card key={title} className="step">
              <span className="icon-badge">
                <Icon name="check" />
              </span>
              <h3>{title}</h3>
              {text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Card>
          ))}
        </div>
        <div className="section-actions">
          <Button href="/contact/">Contactează-ne</Button>
        </div>
      </Section>

      <ServiceGrid />
    </>
  );
}
