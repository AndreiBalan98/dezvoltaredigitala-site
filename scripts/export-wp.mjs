// One-off export of the old WordPress site into content/ and public/media/.
// Usage: node scripts/export-wp.mjs                (everything; deletes and rewrites content/)
//        node scripts/export-wp.mjs --lists-only   (only content/site/list-*.html, spec 004)
// Exits 1 if any count differs from the API's X-WP-Total or any image fails to download.

import { mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";

const SITE = process.env.WP_SITE ?? "https://dezvoltaredigitala.ro";
const API = `${SITE}/wp-json/wp/v2`;
const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content");
const MEDIA_DIR = path.join(ROOT, "public", "media");
const UPLOADS = "/wp-content/uploads/";

const UPLOAD_URL_RE = /https?:\/\/[^\s"'()<>,]*?\/wp-content\/uploads\/[^\s"'()<>,]+/g;

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return {
    data: await res.json(),
    total: Number(res.headers.get("x-wp-total")),
    totalPages: Number(res.headers.get("x-wp-totalpages")),
  };
}

async function fetchAll(type) {
  const items = [];
  let total = 0;
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page += 1) {
    const res = await getJson(`${API}/${type}?per_page=100&page=${page}&status=publish`);
    ({ total, totalPages } = res);
    items.push(...res.data);
  }
  return { items, total };
}

async function getHtml(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function extractTag(html, tag) {
  return html.match(new RegExp(`<${tag}\\b[\\s\\S]*?</${tag}>`))?.[0] ?? "";
}

function extractMainToFooter(html) {
  const start = html.indexOf("<main");
  const end = html.indexOf("<footer", start);
  return start === -1 || end === -1 ? "" : html.slice(start, end).trim();
}

function wpPath(link) {
  return new URL(link).pathname;
}

function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function localMediaPath(url) {
  const { pathname } = new URL(url);
  return "/media/" + decodeURIComponent(pathname.slice(pathname.indexOf(UPLOADS) + UPLOADS.length));
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, buf);
  return buf.length;
}

// Post lists are theme templates, not in the API: keep the live list (from its <h1> up to the site
// <footer>) as the text reference that check:text compares the rebuilt lists against.
const LIST_PAGES = ["/finantari-nerambursabile/", "/category/blog/", "/author/dezvoltarev2/"];

async function saveListPages() {
  await mkdir(path.join(CONTENT_DIR, "site"), { recursive: true });
  for (const page of LIST_PAGES) {
    const html = await getHtml(SITE + page);
    const start = html.indexOf("<h1");
    const end = html.indexOf("<footer", start);
    if (start === -1 || end === -1) throw new Error(`No <h1> … <footer> on ${page}`);
    const list = html.slice(start, end).replace(/<(script|style)\b[\s\S]*?<\/\1>/g, "").trim();
    const file = `list-${page.slice(1, -1).replaceAll("/", "--")}.html`;
    await writeFile(path.join(CONTENT_DIR, "site", file), list + "\n");
  }
}

async function main() {
  if (process.argv.includes("--lists-only")) return saveListPages();
  const [posts, pages] = await Promise.all([fetchAll("posts"), fetchAll("pages")]);

  const featuredIds = [...new Set([...posts.items, ...pages.items].map((i) => i.featured_media).filter(Boolean))];
  const featured = new Map();
  for (const id of featuredIds) {
    const { data } = await getJson(`${API}/media/${id}?_fields=id,source_url,alt_text`);
    featured.set(id, data);
  }

  const imageUrls = new Set();
  await rm(CONTENT_DIR, { recursive: true, force: true });

  for (const [type, { items }] of [["posts", posts], ["pages", pages]]) {
    await mkdir(path.join(CONTENT_DIR, type), { recursive: true });
    for (const it of items) {
      // Theme-templated pages (home) have no API content: take the live page from <main> up to
      // the site <footer> instead (home has its ISO + portfolio sections between the two).
      const html = it.content.rendered || extractMainToFooter(await getHtml(it.link));
      for (const u of html.match(UPLOAD_URL_RE) ?? []) imageUrls.add(u);
      const fm = featured.get(it.featured_media);
      if (fm) imageUrls.add(fm.source_url);
      const record = {
        id: it.id,
        type: type === "posts" ? "post" : "page",
        slug: it.slug,
        path: wpPath(it.link),
        title: decodeEntities(it.title.rendered),
        date: it.date,
        modified: it.modified,
        excerpt: it.excerpt ? it.excerpt.rendered : "",
        parent: it.parent ?? 0,
        categories: it.categories ?? [],
        featuredImage: fm ? { src: localMediaPath(fm.source_url), alt: fm.alt_text ?? "" } : null,
        html,
      };
      await writeFile(path.join(CONTENT_DIR, type, `${it.slug}.json`), JSON.stringify(record, null, 2) + "\n");
    }
  }

  // The footer is a theme template part, not in the API.
  const footer = extractTag(await getHtml(`${SITE}/`), "footer");
  if (!footer) throw new Error("No <footer> found on the live home page.");
  for (const u of footer.match(UPLOAD_URL_RE) ?? []) imageUrls.add(u);
  await mkdir(path.join(CONTENT_DIR, "site"), { recursive: true });
  await writeFile(path.join(CONTENT_DIR, "site", "footer.html"), footer + "\n");
  await saveListPages();

  const mediaMap = {};
  const failed = [];
  let bytes = 0;
  for (const url of [...imageUrls].sort()) {
    const local = localMediaPath(url);
    mediaMap[url] = local;
    const dest = path.join(MEDIA_DIR, local.slice("/media/".length));
    try {
      bytes += await download(url, dest);
    } catch (err) {
      failed.push(`${url} — ${err.message}`);
    }
  }
  await writeFile(path.join(CONTENT_DIR, "media-map.json"), JSON.stringify(mediaMap, null, 2) + "\n");

  const rows = [...posts.items.map((i) => ["post", i]), ...pages.items.map((i) => ["page", i])];
  console.log("\nINVENTORY");
  console.log("type  date        path  —  title");
  for (const [type, i] of rows) {
    console.log(`${type.padEnd(5)} ${i.date.slice(0, 10)}  ${wpPath(i.link)}  —  ${decodeEntities(i.title.rendered)}`);
  }

  console.log("\nCOUNTS");
  console.log(`posts  saved ${posts.items.length} / X-WP-Total ${posts.total}`);
  console.log(`pages  saved ${pages.items.length} / X-WP-Total ${pages.total}`);
  console.log(`images downloaded ${imageUrls.size - failed.length} / referenced ${imageUrls.size} (${(bytes / 1e6).toFixed(1)} MB)`);

  let ok = true;
  if (posts.items.length !== posts.total || pages.items.length !== pages.total) {
    console.error("\nERROR: saved counts differ from X-WP-Total.");
    ok = false;
  }
  if (failed.length) {
    console.error(`\nERROR: ${failed.length} image(s) failed:\n  ` + failed.join("\n  "));
    ok = false;
  }
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
