import type { Metadata } from "next";
import Image from "next/image";
import Box from "@/components/Box";
import Button from "@/components/Button";
import PageHead from "@/components/PageHead";
import Section from "@/components/Section";
import ServiceGrid from "@/components/ServiceGrid";

export const metadata: Metadata = { title: "Consultanță soluții IT și studii de fezabilitate" };

// Texts: content/pages/consultanta-solutii-it-si-studii-de-fezabilitate.json with content/fixes.json
// (spec 004). Live, the "Ce servicii oferim?" text is invisible (its scroll-in animation never starts);
// it is shown here, as on the other service pages.
const SERVICES = [
  [
    "Analiza fezabilității digitalizării uneia sau mai multor activități dintre cele autorizate: se stabilesc activitățile specifice care pot beneficia de programul de digitalizare;",
    "Colectare, interpretare și validare informații privind indicatorii DESI (Digital Economy & Society Index) la momentul analizei se analizează fiecare indicator DESI;",
  ],
  [
    "Propunere minim 1 soluție de digitalizare, cu detalierea domeniilor de aplicare;",
    "Studiu de fezabilitate digitală conform cu cerințele din Ghidul PR Nord-Est Transformarea digitală a IMM-urilor orientată către creșterea intensității digitale;",
    "Suport pentru realizarea studiului de piață (minim 2 oferte) aferente soluțiilor de digitalizare propuse;",
  ],
];

export default function ConsultantaIT() {
  return (
    <>
      <PageHead title="Consultanță soluții IT și studii de fezabilitate" />
      <Section light>
        <div className="split">
          <Image
            className="split__crop"
            src="/media/2025/02/hands-working-with-laptop-scaled.jpg"
            alt="Mâini care lucrează pe un laptop"
            width={1707}
            height={2560}
            sizes="(max-width: 900px) 100vw, 600px"
          />
          <div className="split__text">
            <h2>Consultanță IT digitalizare</h2>
            <p>
              Dacă te afli în etapa de explorare a digitalizării sau ai deja un proiect în desfășurare, consultarea cu
              experți din industria IT sau a specialiștilor în consultanță în afaceri reprezintă un pas esențial pentru a
              asigura succesul inițiativei tale digitale.
            </p>
            <p>
              Prin colaborarea cu acești specialiști, vei putea identifica o strategie eficientă de digitalizare,
              beneficiind de perspective relevante asupra tendințelor actuale din domeniul tehnologic.
            </p>
            <p>
              Consultanța lor poate acoperi diverse aspecte, de la selecția tehnologiilor potrivite la optimizarea
              proceselor operaționale, contribuind astfel la transformarea digitală reușită a afacerii tale.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="split">
          <Image
            src="/media/2025/02/group-young-business-people-working-office-scaled.jpg"
            alt="Echipă de tineri care lucrează într-un birou"
            width={2560}
            height={1707}
            sizes="(max-width: 900px) 100vw, 600px"
          />
          <div className="split__text">
            <h2>Ce servicii oferim?</h2>
            <div className="stack-boxes">
              {SERVICES.map((points, i) => (
                <Box key={i}>
                  <ul className="points">
                    {points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <Button href="/contact/">Contactează-ne</Button>
                </Box>
              ))}
            </div>
          </div>
        </div>
        <Image
          className="wide-image"
          src="/media/2025/02/close-up-server-hub-it-professional-debugging-optimizing-code-scaled.jpg"
          alt="Monitoare cu cod într-un birou IT"
          width={2560}
          height={1707}
          sizes="(max-width: 1240px) 100vw, 1200px"
        />
      </Section>

      <ServiceGrid />
    </>
  );
}
