import { cleanBody, page } from "@/lib/content";
import PageHead from "./PageHead";

// The two legal pages (spec 004): the exported text through lib/clean-html.ts, with the diacritics added
// in content/fixes.json (PO decision 2026-10-07: fix all diacritics, no other word changes).
export default function LegalPage({ slug }: { slug: string }) {
  const entry = page(slug);
  return (
    <article className="article">
      <PageHead title={entry.title} />
      <div className="container">
        <div className="prose legal" dangerouslySetInnerHTML={{ __html: cleanBody(entry) }} />
      </div>
    </article>
  );
}
