// Old next to new (spec 002): builds and starts the site, screenshots every URL captured in reference/
// at the same widths into compare/new/, and writes compare/index.html with old | new side by side.
// Usage: npm run compare   (then open compare/index.html)

import { execSync, spawn } from "node:child_process";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");
const REFERENCE = path.join(ROOT, "reference");
const OUT = path.join(ROOT, "compare");
const PORT = 3210;
const BASE = `http://localhost:${PORT}`;
const WIDTHS = [375, 768, 1280];
const NOT_FOUND_PATH = "/pagina-care-nu-exista/";

// Inverse of slugOf() in scripts/capture.mjs.
const pathOf = (slug) => (slug === "home" ? "/" : slug === "404" ? NOT_FOUND_PATH : `/${slug.replaceAll("--", "/")}/`);

const slugs = (await readdir(REFERENCE))
  .filter((f) => f.endsWith("-1280.png"))
  .map((f) => f.slice(0, -"-1280.png".length))
  .sort((a, b) => (a === "home" ? -1 : b === "home" ? 1 : a.localeCompare(b)));
if (!slugs.length) {
  console.error("No screenshots in reference/ — run `npm run capture` first.");
  process.exit(1);
}

execSync("npm run build", { cwd: ROOT, stdio: "inherit" });
const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore", detached: true });
const stop = () => process.kill(-server.pid);

try {
  for (let i = 0; ; i++) {
    if (await fetch(BASE).then(() => true, () => false)) break;
    if (i > 60) throw new Error("next start did not answer within 30 s");
    await new Promise((r) => setTimeout(r, 500));
  }

  await rm(OUT, { recursive: true, force: true });
  await mkdir(path.join(OUT, "new"), { recursive: true });
  const browser = await chromium.launch();
  const built = new Set();
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const slug of slugs) {
      // Not "networkidle": Next's prefetches of not-yet-built pages never finish under `next start`
      // (spec 003). Scroll so lazy images load, then wait until every image is complete.
      const res = await page.goto(BASE + pathOf(slug), { waitUntil: "load" });
      if (res?.status() !== 200 && slug !== "404") continue;
      built.add(slug);
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 50));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForFunction(() => [...document.images].every((img) => img.complete), null, { timeout: 15000 });
      await page.screenshot({ path: path.join(OUT, "new", `${slug}-${width}.png`), fullPage: true });
    }
    await page.close();
  }
  await browser.close();

  const cell = (slug, width) =>
    built.has(slug) ? `<img src="new/${slug}-${width}.png" loading="lazy" alt="">` : `<p class="todo">not built yet</p>`;
  const rows = slugs
    .map(
      (slug) => `<section id="${slug}"><h2>${pathOf(slug)}</h2>${WIDTHS.map(
        (w) => `<h3>${w} px</h3><div class="pair"><figure><figcaption>old</figcaption><img src="../reference/${slug}-${w}.png" loading="lazy" alt=""></figure><figure><figcaption>new</figcaption>${cell(slug, w)}</figure></div>`,
      ).join("")}</section>`,
    )
    .join("\n");
  const nav = slugs.map((s) => `<a href="#${s}">${pathOf(s)}</a>`).join(" · ");
  await writeFile(
    path.join(OUT, "index.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>Old vs new</title>
<style>body{font:14px/1.4 system-ui,sans-serif;margin:16px}nav{margin-bottom:24px}section{border-top:2px solid #ccc;padding-top:8px}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}figure{margin:0}img{max-width:100%;border:1px solid #ddd}
.todo{color:#a00;font-weight:600}</style>
<h1>Old vs new — ${built.size} of ${slugs.length} pages built</h1><nav>${nav}</nav>
${rows}
</html>
`,
  );
  console.log(`compare — ${slugs.length} URLs × ${WIDTHS.length} widths, ${built.size} built. Open compare/index.html`);
} finally {
  stop();
}
