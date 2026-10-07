// The live post lists (funding page, blog category, author archive), saved by
// `node scripts/export-wp.mjs --lists-only` into content/site/list-*.html (spec 004).
// Each list keeps the live title, posts, order, card images and excerpts.

import { readFileSync } from "node:fs";
import path from "node:path";
import { applyFixes, stripEmoji, type Fix } from "./clean-html";
import { posts, type Entry } from "./content";

export type ListCard = { post: Entry; image: { src: string; width: number; height: number }; excerpt?: string };
export type PostList = { title: string; cards: ListCard[] };

const CONTENT = path.join(process.cwd(), "content");
const UPLOADS = "https://dezvoltaredigitala.ro/wp-content/uploads/";
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…" };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, e: string) =>
    e[0] === "#"
      ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
      : (ENTITIES[e.toLowerCase()] ?? whole),
  );
// Plain text of an HTML fragment: React escapes it again when rendering.
const text = (html: string) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

export function postList(page: "/finantari-nerambursabile/" | "/category/blog/" | "/author/dezvoltarev2/"): PostList {
  const html = readFileSync(path.join(CONTENT, "site", `list-${page.slice(1, -1).replaceAll("/", "--")}.html`), "utf8");
  const fixes = (JSON.parse(readFileSync(path.join(CONTENT, "fixes.json"), "utf8")) as Fix[]).filter((f) => f.page === page);
  const all = posts();
  const title = text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)![1]);
  // Funding page: Essential Blocks <article> cards; blog and author archives: WordPress <li class="wp-block-post">.
  const cards = html
    .split(/<article\b|<li class="wp-block-post\b/)
    .slice(1)
    .map((article): ListCard => {
      const href = article.match(/<a\b[^>]*\shref="([^"]+)"/)![1];
      const post = all.find((p) => href.endsWith(p.path));
      if (!post) throw new Error(`List ${page}: no exported post for ${href}`);
      const img = article.match(/<img\b[^>]*>/)![0];
      const attr = (name: string) => img.match(new RegExp(`\\s${name}="([^"]*)"`))![1];
      const excerpt = article.match(/ebpg-grid-post-excerpt">\s*<p>([\s\S]*?)<\/p>/)?.[1];
      return {
        post,
        image: { src: attr("src").replace(UPLOADS, "/media/"), width: Number(attr("width")), height: Number(attr("height")) },
        excerpt: excerpt === undefined ? undefined : applyFixes(stripEmoji(text(excerpt)), fixes),
      };
    });
  return { title, cards };
}
