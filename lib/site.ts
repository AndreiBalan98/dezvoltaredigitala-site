// Site-wide facts shown in the header, footer and pages (spec 003). One phone number everywhere.

export const PHONE = { display: "+40 749 589 848", href: "tel:+40749589848" };
export const EMAIL = { display: "contact@dezvoltaredigitala.ro", href: "mailto:contact@dezvoltaredigitala.ro" };
export const ADDRESS = "C&A Connect S.R.L, Botoșani, Strada Dobosari, 79 H";
export const FACEBOOK = "https://www.facebook.com/dezvoltaredigitala";
// The live bubble's target, read from its "Call Now Button" config (spec 003, PO decision).
export const MESSENGER = "https://m.me/156617447529801";

export type MenuItem = { label: string; href?: string; children?: { label: string; href: string }[] };

export const MENU: MenuItem[] = [
  { label: "Acasă", href: "/" },
  { label: "Finanțări nerambursabile", href: "/finantari-nerambursabile/" },
  {
    label: "Servicii",
    children: [
      { label: "Creare website", href: "/servicii/creare-website/" },
      { label: "Digitalizare și automatizare", href: "/servicii/digitalizare-si-automatizare/" },
      {
        label: "Consultanță soluții IT și studii de fezabilitate",
        href: "/servicii/consultanta-solutii-it-si-studii-de-fezabilitate/",
      },
      {
        label: "Consultanță pentru accesarea fondurilor nerambursabile",
        href: "/servicii/consultanta-pentru-accesarea-fondurilor-nerambursabile/",
      },
    ],
  },
  { label: "Contact", href: "/contact/" },
];
