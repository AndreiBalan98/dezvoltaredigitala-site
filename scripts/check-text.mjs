// After `next build` (spec 003): for every rebuilt page, every text block of the exported live page
// (after content/fixes.json) must appear on the built page, in the same order, unless it is on
// content/cuts.json. The live footer is checked against the built home. A fix or cut that matches
// nothing fails too, and the old phone number must not appear anywhere.
// Usage: npm run check:text   (exits 1 and names each missing, out-of-order or stale item)

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BUILT = path.join(ROOT, ".next", "server", "app");
const readJson = (file) => JSON.parse(readFileSync(path.join(ROOT, file), "utf8"));

if (!existsSync(BUILT)) {
  console.error("No build output in .next/server/app — run `npm run build` first.");
  process.exit(1);
}

const htmlFile = (urlPath) => (urlPath === "/" ? "index.html" : `${urlPath.slice(1, -1)}.html`);
const builtHtml = (urlPath) => {
  const file = path.join(BUILT, htmlFile(urlPath));
  return existsSync(file) ? readFileSync(file, "utf8") : null;
};

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "…" };
const decode = (s) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, e) =>
    e[0] === "#"
      ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1)))
      : (ENTITIES[e.toLowerCase()] ?? whole),
  );
const norm = (s) => s.replace(/\s+/g, " ").trim();

const BLOCK_TAG =
  /<\/?(?:address|article|aside|blockquote|br|button|dd|div|dl|dt|figcaption|figure|footer|form|h[1-6]|header|hr|img|label|li|main|nav|ol|p|section|table|td|th|tr|ul)\b[^>]*>/gi;

// Visible text of an HTML fragment, one entry per block element.
function blocks(html) {
  return decode(
    html
      .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(BLOCK_TAG, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .split("\n")
    .map(norm)
    .filter(Boolean);
}

const region = (html, tag) => {
  const start = html.indexOf(`<${tag}`);
  const end = html.lastIndexOf(`</${tag}>`);
  return start >= 0 && end > start ? html.slice(start, end) : "";
};

const year = String(new Date().getFullYear());
const fixes = readJson("content/fixes.json").map((f) => ({ ...f, to: f.to.replaceAll("{year}", year), used: 0 }));
const cuts = readJson("content/cuts.json").map((c) => ({ ...c, used: 0 }));

// Every exported entry that is built, plus the site footer (against the built home).
const sources = ["pages", "posts"]
  .flatMap((dir) => readdirSync(path.join(ROOT, "content", dir)).map((f) => readJson(`content/${dir}/${f}`)))
  .filter((e) => builtHtml(e.path))
  .map((e) => ({ page: e.path, source: e.html, built: region(builtHtml(e.path), "main") }));
if (builtHtml("/")) {
  sources.push({
    page: "footer",
    source: readFileSync(path.join(ROOT, "content", "site", "footer.html"), "utf8"),
    built: region(builtHtml("/"), "footer"),
  });
}

const problems = [];
let checked = 0;
for (const { page, source, built } of sources) {
  const builtText = blocks(built).join(" ");
  let cursor = 0;
  for (let block of blocks(source)) {
    for (const f of fixes.filter((f) => f.page === page && block.includes(f.from))) {
      block = block.replaceAll(f.from, f.to);
      f.used++;
    }
    const cut = cuts.find((c) => c.page === page && c.text === block && c.used === 0);
    if (cut) {
      cut.used++;
      continue;
    }
    checked++;
    const at = builtText.indexOf(block, cursor);
    if (at >= 0) cursor = at + block.length;
    else if (builtText.includes(block)) problems.push(`${page}  out of order: "${block}"`);
    else problems.push(`${page}  missing: "${block}"`);
  }
}

const builtPages = new Set(sources.map((s) => s.page));
for (const f of fixes) if (builtPages.has(f.page) && !f.used) problems.push(`${f.page}  stale fix: "${f.from}"`);
for (const c of cuts) if (builtPages.has(c.page) && !c.used) problems.push(`${c.page}  stale cut: "${c.text}"`);

// One phone number everywhere (PRODUCT.md): the old one must not be in any built page, text or link.
const OLD_PHONE = /(?:\+?40|0)\s?770[\s.]?102[\s.]?495/;
for (const file of readdirSync(BUILT, { recursive: true }).filter((f) => String(f).endsWith(".html"))) {
  if (OLD_PHONE.test(readFileSync(path.join(BUILT, file), "utf8"))) problems.push(`${file}  old phone number 0770 102 495`);
}

const fixed = fixes.filter((f) => f.used).length;
const cut = cuts.filter((c) => c.used).length;
console.log(
  `check:text — ${sources.length} sources, ${checked} blocks found in order, ${fixed} fixes, ${cut} cuts, ${problems.length} problems.`,
);
if (problems.length) {
  console.error("Problems:\n  " + problems.join("\n  "));
  process.exit(1);
}
