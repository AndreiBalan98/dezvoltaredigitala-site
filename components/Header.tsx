import Image from "next/image";
import Link from "next/link";
import { FACEBOOK, MENU, PHONE } from "@/lib/site";
import Icon from "./Icon";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header__bar">
        <Link href="/" className="site-header__logo">
          <Image src="/media/2025/02/logo-1.png" alt="Dezvoltare digitală" width={335} height={129} priority />
        </Link>
        <MobileMenu>
          <nav aria-label="Meniu principal">
            <ul className="nav">
              {MENU.map((item) =>
                item.children ? (
                  <li key={item.label} className="nav__item nav__item--sub">
                    <button type="button" className="nav__link" aria-haspopup="true">
                      {item.label}
                      <Icon name="chevron-down" />
                    </button>
                    <ul className="nav__sub">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link href={child.href}>{child.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ) : (
                  <li key={item.label} className="nav__item">
                    <Link className="nav__link" href={item.href!}>
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </MobileMenu>
        <div className="site-header__icons">
          <a className="site-header__icon site-header__phone" href={PHONE.href} aria-label={`Sună: ${PHONE.display}`}>
            <Icon name="phone" />
          </a>
          <a className="site-header__icon" href={FACEBOOK} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
            <Icon name="facebook" />
          </a>
        </div>
      </div>
    </header>
  );
}
