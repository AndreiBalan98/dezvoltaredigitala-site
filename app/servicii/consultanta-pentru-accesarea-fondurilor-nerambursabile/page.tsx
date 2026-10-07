import type { Metadata } from "next";
import Image from "next/image";
import Button from "@/components/Button";
import Card from "@/components/Card";
import PageHead from "@/components/PageHead";
import Section from "@/components/Section";
import ServiceGrid from "@/components/ServiceGrid";

export const metadata: Metadata = { title: "Consultanță pentru accesarea fondurilor nerambursabile" };

// Texts: content/pages/consultanta-pentru-accesarea-fondurilor-nerambursabile.json with content/fixes.json
// (spec 004). Live, each card hides its second half behind "Citește mai mult"; here the whole text shows.
const SERVICES = [
  "Identificarea oportunităților de finanțare (analiză eligibilitate, potrivirea proiectului cu un program de finanțare).",
  "Redactarea și depunerea cererilor de finanțare (documentație, plan de afaceri, studii de fezabilitate, bugetare).",
  "Implementare și management de proiect (asistență în raportare, monitorizare, respectarea condițiilor de finanțare).",
];

const ADVANTAGES = [
  [
    "Evaluarea șanselor și calculul punctajului înainte de redactarea proiectului",
    "Analizăm criteriile de selecție și calculăm punctajul estimativ înainte de a începe redactarea proiectului.",
    "Dacă punctajul nu este suficient pentru aprobare, îți oferim soluții de îmbunătățire a proiectului pentru a crește șansele de succes.",
    "Evităm respingerea proiectului din cauza unui punctaj insuficient sau a unor aspecte neeligibile.",
  ],
  [
    "Economie de timp și resurse",
    "Procesul de accesare a fondurilor implică multă birocrație – consultanții preiau acest efort, iar tu te poți concentra pe afacerea ta.",
    "Nu trebuie să înveți regulile complicate ale programelor de finanțare – experții se ocupă de tot.",
    "Eviți întârzierile cauzate de neînțelegeri privind regulile de eligibilitate.",
  ],
  [
    "Alegerea programului de finanțare potrivit.",
    "Un consultant analizează profilul firmei tale și îți recomandă fondul nerambursabil cel mai avantajos.",
    "Te ghidează în identificarea celui mai potrivit apel de proiecte.",
    "Te ajută să eviți programele cu cerințe restrictive sau cu concurență foarte mare, maximizând șansele de succes.",
  ],
  [
    "Optimizarea bugetului și planului de afaceri.",
    "Consultanții te ajută să îți planifici corect cheltuielile, astfel încât să respecți regulile finanțatorului.",
    "Îți oferă soluții pentru asigurarea cofinanțării (dacă este necesară).",
    "Pregătesc proiecții financiare realiste, astfel încât proiectul să fie fezabil și sustenabil pe termen lung.",
  ],
  [
    "Sprijin în implementarea și raportarea proiectului",
    "După obținerea finanțării, consultanții te ajută să respecți condițiile impuse de finanțator.",
    "Se ocupă de pregătirea rapoartelor și documentelor necesare pentru decontarea cheltuielilor.",
    "Te asistă în gestionarea eventualelor inspecții sau audituri ale autorităților.",
  ],
  [
    "Acces la surse alternative de finanțare",
    "Pe lângă fondurile europene, consultanții pot identifica și alte opțiuni de finanțare: granturi guvernamentale, credite preferențiale, finanțare prin investitori.",
  ],
];

export default function ConsultantaFonduri() {
  return (
    <>
      <PageHead title="Consultanță pentru accesarea fondurilor nerambursabile" />
      <Section>
        <div className="split">
          <div className="split__text">
            <h2>Servicii:</h2>
            <ul className="points">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <Image
            src="/media/2025/03/about-us-bg.png"
            alt="Doi consultanți care lucrează la un laptop"
            width={629}
            height={720}
            sizes="(max-width: 900px) 100vw, 600px"
          />
        </div>
      </Section>

      <Section light center>
        <header className="section-head">
          <h2>
            Accesarea fondurilor nerambursabile poate fi un proces complex, iar o echipă de consultanță specializată îți
            poate crește semnificativ șansele de succes
          </h2>
          <p className="section-sub">Iată principalele avantaje ale apelării la consultanță profesională:</p>
        </header>
        <div className="grid-3">
          {ADVANTAGES.map(([title, ...text], i) => (
            <Card key={title} className="step">
              <p className="step__number">{String(i + 1).padStart(2, "0")}</p>
              <h3>{title}</h3>
              {text.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </Card>
          ))}
        </div>
        <div className="section-actions">
          <Button href="/contact/">Spre pagina de contact</Button>
        </div>
      </Section>

      <ServiceGrid />
    </>
  );
}
