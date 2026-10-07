// The PO's last read (spec 005): every text change the new site makes to the live texts, in one page.
// Reads content/fixes.json and content/cuts.json, groups them by page, highlights the changed words, and
// lists the rule-based changes that are code, not data. Writes compare/fixes.html (git-ignored).
// Usage: npm run fixes:list   (then open compare/fixes.html)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const readJson = (file) => JSON.parse(readFileSync(path.join(ROOT, file), "utf8"));
const fixes = readJson("content/fixes.json");
const cuts = readJson("content/cuts.json");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Before → after with the changed words marked. Diacritic fixes keep the word count, so words pair up;
// otherwise the common start and end are kept plain and the middle is marked.
function diff(from, to) {
  const a = from.split(" ");
  const b = to.split(" ");
  if (a.length === b.length) {
    return [
      a.map((w, i) => (w === b[i] ? esc(w) : `<del>${esc(w)}</del>`)).join(" "),
      b.map((w, i) => (w === a[i] ? esc(w) : `<ins>${esc(w)}</ins>`)).join(" "),
    ];
  }
  let start = 0;
  while (start < from.length && from[start] === to[start]) start++;
  let end = 0;
  while (end < from.length - start && end < to.length - start && from.at(-1 - end) === to.at(-1 - end)) end++;
  const mark = (s, tag) => esc(s.slice(0, start)) + `<${tag}>${esc(s.slice(start, s.length - end))}</${tag}>` + esc(s.slice(s.length - end));
  return [mark(from, "del"), mark(to, "ins")];
}

const pages = [...new Set([...fixes.map((f) => f.page), ...cuts.map((c) => c.page)])];
const label = (page) => (page === "footer" ? "Footer (every page)" : page === "404" ? "404 page" : page);
const sections = pages.map((page) => {
  const rows = [
    ...fixes
      .filter((f) => f.page === page)
      .map((f) => {
        const [before, after] = diff(f.from, f.to.replaceAll("{year}", String(new Date().getFullYear())));
        return `<tr><td>${before}</td><td>${after}</td><td>${esc(f.why)}</td></tr>`;
      }),
    ...cuts.filter((c) => c.page === page).map((c) => `<tr><td><del>${esc(c.text)}</del></td><td><em>removed</em></td><td>${esc(c.why)}</td></tr>`),
  ];
  return `<section><h2>${esc(label(page))} <small>${rows.length}</small></h2><table><thead><tr><th>Live</th><th>New</th><th>Why</th></tr></thead><tbody>${rows.join("")}</tbody></table></section>`;
});

const RULES = [
  "One phone number everywhere: +40 749 589 848 (header, footer, contact, articles). The old 0770 102 495 fails the build (check:text).",
  "Dates in Romanian order everywhere: “martie 3, 2025” → “3 martie 2025” (PO decision, spec 003).",
  "Emoji used as icons in the articles → SVG icons in the site blue; emoji in the middle of a line removed (spec 004).",
  "The older articles' left sidebar (“Categorii populare”, “Postări populare”) removed: 213 lines on 10 articles (spec 004).",
  "© year in the footer follows the current year.",
  "Typed “->” on buttons → an arrow icon; typed “•” / “–” bullets → real list bullets.",
];

mkdirSync(path.join(ROOT, "compare"), { recursive: true });
writeFileSync(
  path.join(ROOT, "compare", "fixes.html"),
  `<!doctype html><html lang="ro"><meta charset="utf-8"><title>Text changes</title>
<style>body{font:15px/1.5 system-ui,sans-serif;margin:24px;max-width:1200px}table{border-collapse:collapse;width:100%;margin-bottom:24px}
th,td{border:1px solid #ddd;padding:6px 8px;vertical-align:top;text-align:left}th{background:#f3f6fb}
del{background:#fdecea;color:#b42318}ins{background:#e3f6e8;color:#14532d;text-decoration:none}h2 small{color:#777;font-weight:400}</style>
<h1>Every text change — ${fixes.length} fixes, ${cuts.length} cuts, ${pages.length} pages</h1>
<p>Red = live text, green = new text. Source: <code>content/fixes.json</code>, <code>content/cuts.json</code>. Say which ones to undo.</p>
<h2>Rules (code, not single entries)</h2><ul>${RULES.map((r) => `<li>${esc(r)}</li>`).join("")}</ul>
${sections.join("\n")}
</html>
`,
);
console.log(`fixes:list — ${fixes.length} fixes, ${cuts.length} cuts on ${pages.length} pages → compare/fixes.html`);
