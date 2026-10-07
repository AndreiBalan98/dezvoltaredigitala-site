import type { Metadata } from "next";
import Button from "@/components/Button";

export const metadata: Metadata = { title: "Pagina nu a fost găsită" };

// The live 404 text (spec 004). Its search box needs a backend, so it is gone, and with it the sentence
// "You can search the site below, or return to the front page." — the button below replaces both.
export default function NotFound() {
  return (
    <section className="section not-found">
      <div className="container">
        <h1>404</h1>
        <p className="not-found__title">
          <strong>Oops! Page not found</strong>
        </p>
        <p>
          Sorry but the page you are looking for could not be found. It might have been deleted, renamed, or is
          temporarily unavailable.
        </p>
        <Button href="/">Înapoi la prima pagină</Button>
      </div>
    </section>
  );
}
