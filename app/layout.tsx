import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MessengerButton from "@/components/MessengerButton";
import "./tokens.css";
import "./globals.css";

// Headings only (spec 003); text uses the system stack.
const inter = Inter({ subsets: ["latin", "latin-ext"], weight: ["600", "700"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Dezvoltare digitală",
    template: "%s – Dezvoltare digitală",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <MessengerButton />
      </body>
    </html>
  );
}
