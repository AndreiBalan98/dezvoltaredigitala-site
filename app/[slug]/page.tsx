import type { Metadata } from "next";
import Link from "next/link";
import { cleanBody, post, previousPost, roDate } from "@/lib/content";

// M2 rebuilds only the newest article (spec 003); M3 adds the others here.
const BUILT = ["finantare-sisteme-stocare-energie"];

export const dynamicParams = false;

export function generateStaticParams() {
  return BUILT.map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: post((await params).slug).title };
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const entry = post(slug);
  const previous = previousPost(slug);
  return (
    <article className="article">
      <header className="article__head container">
        <h1>{entry.title}</h1>
        <p className="article__meta">
          <time dateTime={entry.date}>{roDate(entry.date)}</time>
          <span aria-hidden="true">·</span>
          <Link href="/category/blog/">Blog</Link>
        </p>
      </header>
      <div className="container">
        <div className="prose" dangerouslySetInnerHTML={{ __html: cleanBody(entry) }} />
      </div>
      {previous && (
        <nav className="article__nav container" aria-label="Articole">
          <Link href={previous.path}>
            <span className="article__nav-label">Anterior:</span> {previous.title}
          </Link>
        </nav>
      )}
    </article>
  );
}
