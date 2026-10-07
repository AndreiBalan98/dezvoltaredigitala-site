import Image from "next/image";
import Link from "next/link";
import { ADDRESS, EMAIL, PHONE } from "@/lib/site";
import Button from "./Button";
import IconList from "./IconList";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link href="/">
            <Image src="/media/2025/02/logo-1.png" alt="Dezvoltare digitală" width={335} height={129} />
          </Link>
          <p>O treaptă mai sus în afacerea ta</p>
          <Button href="/contact/">Contactează-ne!</Button>
        </div>
        <div>
          <h2 className="site-footer__title">Contact</h2>
          <IconList
            items={[
              { icon: "mail", content: <a href={EMAIL.href}>{EMAIL.display}</a> },
              { icon: "phone", content: <a href={PHONE.href}>{PHONE.display}</a> },
              { icon: "map-pin", content: ADDRESS },
            ]}
          />
        </div>
        <div>
          <h2 className="site-footer__title">Compania</h2>
          <ul className="site-footer__links">
            <li>
              <Link href="/contact/">Contact</Link>
            </li>
            <li>
              <Link href="/politica-de-confidentialitate/">Politica de confidențialitate</Link>
            </li>
            <li>
              <Link href="/termeni-si-conditii/">Termeni și condiții</Link>
            </li>
            <li>
              <a href="https://anpc.ro/" target="_blank" rel="noopener noreferrer">
                ANPC
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-row">
          <p>© {new Date().getFullYear()}. Dezvoltaredigitala.ro Toate drepturile rezervate.</p>
          <div className="site-footer__badges">
            <a href="https://reclamatiisal.anpc.ro/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/media/2025/02/anpc-logo-2.png"
                alt="ANPC – Soluționarea alternativă a litigiilor"
                width={419}
                height={120}
              />
            </a>
            <a
              href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=RO"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/media/2025/02/solutionare-1.png"
                alt="Soluționarea online a litigiilor"
                width={451}
                height={112}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
