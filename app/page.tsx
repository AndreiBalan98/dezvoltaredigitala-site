import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Section from "@/components/Section";
import { post, roDate } from "@/lib/content";

// The home page (spec 003). Texts are the exported home (content/pages/sample-page.json) with the
// fixes in content/fixes.json; `npm run check:text` proves none is missing and the order is the same.

const SERVICES = [
  {
    icon: "/media/2025/02/analiza-teh.svg",
    title: "Creare site-uri web",
    text: "Oferim servicii de creare web personalizate, concepute să se adapteze perfect nevoilor și cerințelor afacerii dvs.",
  },
  {
    icon: "/media/2025/02/crm.svg",
    title: "Magazine Online",
    text: "Vă ajutăm să vă extindeți afacerea în mediul online, oferindu-vă o platformă de comerț electronic sigură, eficientă și ușor de utilizat.",
  },
  {
    icon: "/media/2025/02/gest.svg",
    title: "Promovare Web",
    text: "Dezvoltăm campanii de promovare web personalizate și eficiente, care vizează platformele de socializare potrivite pentru afacerea dvs.",
  },
];

// The same two posts as the live home, with the excerpt as it is shown there.
const FUNDING = [
  {
    slug: "investitii-pentru-modernizarea-microintreprinderilor",
    image: { src: "/media/2025/03/microintreprinderi.png", width: 940, height: 788 },
    excerpt:
      "Dacă ai o microîntreprindere și îți dorești să o modernizezi, acest program de finanțare este șansa ideală de a accesa fonduri nerambursabile pentru investiții care îți pot transforma activitatea! Ce presupune acest apel de finanțare? Programul „Investiții pentru modernizarea microîntreprinderilor” oferă sprijin",
  },
  {
    slug: "877-2",
    image: { src: "/media/2025/03/475461050_1167877742007512_4746665179111776104_n.jpg", width: 940, height: 788 },
    excerpt:
      "C&A Connect te invită să fii parte din proiectul EduWebLab, un program dedicat susținerii tinerelor talente din domeniul IT și dezvoltării digitale a mediului de afaceri. În colaborare cu Universitatea „Ștefan cel Mare” din Suceava, oferim oportunitatea antreprenorilor de a",
  },
];

const CERTIFICATES = [
  {
    href: "https://www.eduweblab.ro/assets/images/SKM_C3320i25032608200.pdf",
    src: "/media/2025/02/Screenshot-2025-03-27-144026-702x1024.jpg",
    width: 702,
    height: 1024,
    alt: "Certificat ISO/IEC 27001:2013 – C&A Connect S.R.L.",
  },
  {
    href: "https://www.eduweblab.ro/assets/images/SKM_C3320i25032608201.pdf",
    src: "/media/2025/03/Screenshot-2025-03-27-144118.jpg",
    width: 630,
    height: 914,
    alt: "Certificat ISO/IEC 20000-1:2018 – C&A Connect S.R.L.",
  },
];

const PROJECTS = [
  { name: "Jocurinoi.ro", type: "Magazin online", href: "https://www.jocurinoi.ro/", src: "/media/2025/02/jocuri-noi1.png" },
  { name: "antiv.ro", type: "Magazin online", href: "https://www.antiv.ro/", src: "/media/2025/02/antiv-resize.png" },
  { name: "xat.ro", type: "Găzduire web", href: "https://www.xat.ro/", src: "/media/2025/02/portfolio-xat-768x435.png" },
  { name: "eduweblab.ro", type: "Creare site-uri", href: "https://www.eduweblab.ro/", src: "/media/2025/02/portfolio-eduweblab-768x435.png" },
  { name: "Farmaciaanca.ro", type: "Magazin online", href: "https://www.farmaciaanca.ro/", src: "/media/2025/02/farmacia-anca1.png" },
  {
    name: "C&A Connect",
    type: "Website de prezentare",
    href: "https://www.caconnect.ro/",
    src: "/media/2025/02/395330181_831555735639716_1570820402123901229_n-1-1024x719.jpg",
  },
];

const LOGOS = [
  { src: "/media/2025/02/antiv-logo-1.png", width: 291, height: 64, alt: "antiv" },
  { src: "/media/2025/02/eduweblab-logo-1024x154.png", width: 1024, height: 154, alt: "EduWebLab" },
  { src: "/media/2025/02/xat-logo.png", width: 320, height: 50, alt: "xat host" },
  { src: "/media/2025/02/b2b-logo.webp", width: 467, height: 141, alt: "B2B" },
  { src: "/media/2025/02/jocurinoi-logo.webp", width: 315, height: 114, alt: "Jocurinoi" },
  { src: "/media/2025/02/buygames-logo.webp", width: 449, height: 114, alt: "BuyGames" },
  { src: "/media/2025/02/caconnect-logo-1.png", width: 395, height: 141, alt: "C&A Connect" },
];

export default function Home() {
  return (
    <>
      <section className="section hero">
        <div className="container hero__grid">
          <div className="hero__text">
            <h1>
              <span className="nowrap">Transformă-ți</span> afacerea cu soluții digitale inovatoare
            </h1>
            <p>
              Descoperă potențialul nelimitat al lumii digitale cu serviciile noastre de{" "}
              <strong>dezvoltare digitală</strong>!
            </p>
            <p>
              Dacă te afli în etapa de explorare a digitalizării sau ai deja un proiect în desfășurare, consultarea cu
              experți din industria IT sau a specialiștilor în consultanță în afaceri reprezintă un pas esențial pentru a
              asigura succesul inițiativei tale digitale.
            </p>
            <p>
              Echipa noastră de experți dedicați te va ajuta să-ți crești afacerea și să atingi obiectivele dorite prin
              strategii eficiente de lead generation și soluții personalizate.
            </p>
            <Button href="/servicii/consultanta-solutii-it-si-studii-de-fezabilitate/" arrow>
              Află mai multe despre consultanță soluții IT și studii de fezabilitate
            </Button>
          </div>
          <Image
            className="hero__image"
            src="/media/2025/02/young-business-woman-pointing-office-Photoroom.png"
            alt="Consultantă care arată spre text"
            width={1280}
            height={853}
            sizes="(min-width: 900px) 50vw, 1px"
            priority
          />
        </div>
      </section>

      <Section light eyebrow="Servicii oferite" title="Soluțiile noastre pentru dezvoltare" className="services">
        <Card className="services__intro">
          <p>
            Oferim soluții inteligente de automatizare a proceselor de afaceri utilizând <strong>roboți software</strong>,
            care vă pot ajuta să economisiți timp, bani și resurse.
          </p>
        </Card>
        <div className="grid-3">
          {SERVICES.map((s) => (
            <Card key={s.title} className="service">
              <Image src={s.icon} alt="" width={72} height={72} />
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <Button href="/servicii/creare-website/">Vezi mai mult</Button>
            </Card>
          ))}
        </div>
      </Section>

      <Section light eyebrow="Dezvoltaredigitala.ro" title="Despre noi" className="about">
        <div className="about__grid">
          <Image
            className="about__image"
            src="/media/2025/02/395330181_831555735639716_1570820402123901229_n-1-1024x719.jpg"
            alt="Sediul C&A Connect din Botoșani"
            width={1024}
            height={719}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div className="about__text">
            <Card>
              <p>
                Suntem specializați într-o gamă variată de servicii, precum crearea de site-uri web, dezvoltarea software
                personalizată, optimizarea SEO și promovarea pe rețelele sociale.
              </p>
            </Card>
            <Card>
              <p>
                Echipa noastră, alcătuită din profesioniști talentați și dedicați, este gata să vă ofere expertiza și
                experiența necesare pentru a vă concretiza viziunile în proiecte digitale.
              </p>
            </Card>
            <Button href="/contact/">Contactează-ne</Button>
          </div>
        </div>
      </Section>

      <Section center title="Finanțări nerambursabile">
        <div className="grid-2">
          {FUNDING.map((f) => {
            const p = post(f.slug);
            return (
              <Card key={f.slug} className="teaser">
                <Link className="teaser__image" href={p.path} tabIndex={-1} aria-hidden="true">
                  <Image src={f.image.src} alt="" width={f.image.width} height={f.image.height} sizes="(max-width: 900px) 100vw, 50vw" />
                </Link>
                <h3>
                  <Link href={p.path}>{p.title}</Link>
                </h3>
                <p className="teaser__date">
                  <time dateTime={p.date}>{roDate(p.date)}</time>
                </p>
                <p>{f.excerpt}…</p>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section center title="Suntem certificați ISO">
        <div className="certificates">
          {CERTIFICATES.map((c) => (
            <a key={c.href} className="card certificate" href={c.href} target="_blank" rel="noopener noreferrer">
              <Image src={c.src} alt={c.alt} width={c.width} height={c.height} sizes="(max-width: 700px) 100vw, 360px" />
            </a>
          ))}
        </div>
      </Section>

      <Section light center title="O parte din proiectele finalizate" className="projects">
        <p className="section-sub">Cu ce ne lăudăm?</p>
        <div className="grid-3">
          {PROJECTS.map((p) => (
            <a key={p.name} className="card project" href={p.href} target="_blank" rel="noopener noreferrer">
              <Image src={p.src} alt="" width={770} height={380} sizes="(max-width: 700px) 100vw, 360px" />
              <h3>{p.name}</h3>
              <p>{p.type}</p>
            </a>
          ))}
        </div>
        <div className="logos">
          {LOGOS.map((l) => (
            <Image key={l.src} src={l.src} alt={l.alt} width={l.width} height={l.height} />
          ))}
        </div>
      </Section>
    </>
  );
}
