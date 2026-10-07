// After `next build`: every exported WordPress URL must have a prerendered HTML page.
// Usage: npm run check:routes   (exits 1 and names each missing URL)

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const BUILT = path.join(ROOT, ".next", "server", "app");

if (!existsSync(BUILT)) {
  console.error("No build output in .next/server/app — run `npm run build` first.");
  process.exit(1);
}

const readJson = (...parts) => JSON.parse(readFileSync(path.join(ROOT, ...parts), "utf8"));
const paths = [
  ...["pages", "posts"].flatMap((dir) =>
    readdirSync(path.join(ROOT, "content", dir))
      .filter((f) => f.endsWith(".json"))
      .map((f) => readJson("content", dir, f).path),
  ),
  // Live URLs that are not in the export (archive lists found in the sitemap, spec 003).
  ...readJson("scripts", "routes-extra.json"),
];

// URLs not rebuilt yet (spec 002). The list shrinks milestone by milestone and is [] after M3.
const pending = new Set(readJson("scripts", "routes-pending.json"));

const htmlFile = (urlPath) => (urlPath === "/" ? "index.html" : `${urlPath.slice(1, -1)}.html`);
const isBuilt = (p) => existsSync(path.join(BUILT, htmlFile(p)));
const missing = paths.filter((p) => !isBuilt(p) && !pending.has(p));
if (!existsSync(path.join(BUILT, "_not-found.html"))) missing.push("(404 page)");
// A pending URL that is built (or no longer exported) means the list is stale: take it off.
const stale = [...pending].filter((p) => isBuilt(p) || !paths.includes(p));

const built = paths.filter(isBuilt).length;
console.log(`check:routes — ${built} of ${paths.length} known URLs built, ${pending.size} pending.`);
if (missing.length) console.error("Missing:\n  " + missing.join("\n  "));
if (stale.length) console.error("Remove from scripts/routes-pending.json:\n  " + stale.join("\n  "));
if (missing.length || stale.length) process.exit(1);
