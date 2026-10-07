// After `next build`: every internal link and image on every built page must resolve to a built
// page, a file in public/, or a /_next/ build asset. External links are not checked.
// Usage: npm run check:links   (exits 1 and names each broken link with its page)

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BUILT = path.join(ROOT, ".next", "server", "app");
const PUBLIC = path.join(ROOT, "public");

if (!existsSync(BUILT)) {
  console.error("No build output in .next/server/app — run `npm run build` first.");
  process.exit(1);
}

const htmlFiles = readdirSync(BUILT, { recursive: true })
  .filter((f) => f.endsWith(".html") && f !== "_global-error.html")
  .map((f) => f.split(path.sep).join("/"));

const pageOf = (file) => (file === "index.html" ? "/" : `/${file.slice(0, -".html".length)}/`);
const pages = new Set(htmlFiles.filter((f) => f !== "_not-found.html").map(pageOf));
// Links to pages not rebuilt yet are expected until M3 (spec 003); any other unbuilt target fails.
const pending = new Set(JSON.parse(readFileSync(path.join(ROOT, "scripts", "routes-pending.json"), "utf8")));

const isFile = (p) => existsSync(p) && statSync(p).isFile();

function resolves(link) {
  const url = new URL(link, "http://site");
  const target = decodeURIComponent(url.pathname);
  if (target === "/_next/image" || target === "/_next/image/") {
    const source = url.searchParams.get("url");
    return Boolean(source?.startsWith("/")) && resolves(source);
  }
  if (target.startsWith("/_next/static/")) {
    return isFile(path.join(ROOT, ".next", "static", target.slice("/_next/static/".length)));
  }
  const page = target.endsWith("/") ? target : `${target}/`;
  if (pages.has(page) || pending.has(page)) return true;
  return isFile(path.join(PUBLIC, target));
}

const unescape = (s) => s.replaceAll("&amp;", "&");
const ATTR = /\s(?:href|src|srcSet|srcset|imageSrcSet|imagesrcset)="([^"]*)"/g;

let checked = 0;
const broken = [];
for (const file of htmlFiles) {
  const html = readFileSync(path.join(BUILT, file), "utf8");
  for (const [, value] of html.matchAll(ATTR)) {
    const links = value.split(",").map((part) => unescape(part.trim().split(/\s+/)[0]));
    for (const link of links) {
      if (!link.startsWith("/") || link.startsWith("//")) continue;
      checked++;
      if (!resolves(link)) broken.push(`${pageOf(file)}  →  ${link}`);
    }
  }
}

console.log(`check:links — ${checked} internal links on ${htmlFiles.length} pages, ${broken.length} broken.`);
if (broken.length) {
  console.error("Broken:\n  " + [...new Set(broken)].join("\n  "));
  process.exit(1);
}
