import type { Metadata } from "next";
import Link from "next/link";
import { cleanBody, nextPost, post, posts, previousPost, roDate } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts().map(({ slug }) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: post((await params).slug).title };
}

export default async function Article({ params }: Props) {
  const { slug } = await params;
  const entry = post(slug);
  const previous = previousPost(slug);
  const next = nextPost(slug);
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
      {(previous || next) && (
        <nav className="article__nav container" aria-label="Articole">
          {previous && (
            <Link href={previous.path}>
              <span className="article__nav-label">Anterior:</span> {previous.title}
            </Link>
          )}
          {next && (
            <Link href={next.path} className="article__nav-next">
              <span className="article__nav-label">Următor:</span> {next.title}
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
