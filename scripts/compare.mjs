// Old next to new (spec 002): builds and starts the site, screenshots every URL captured in reference/
// at the same widths into compare/new/, and writes compare/index.html with old | new side by side.
// Spec 004 adds one laptop screen (1536×864, first screen only) per built page, live and new taken now:
// the M2 hero needed three rounds because only full-page shots at 1280 px had been compared.
// Usage: npm run compare   (then open compare/index.html). The browser uses HTTPS_PROXY when set (I1 sandbox);
// do not set NODE_USE_ENV_PROXY here: it would send the localhost readiness check through the proxy.

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
const LAPTOP = { width: 1536, height: 864 };
const LIVE = process.env.LIVE_SITE ?? "https://dezvoltaredigitala.ro";
// Same as SHOW_ALL in scripts/capture.mjs: no preloader, scroll-in blocks in their final state.
const SHOW_ALL = "#sl-preloader{display:none!important}.animated{visibility:visible!important;animation:none!important;opacity:1!important;transform:none!important}";
const PROXY = process.env.HTTPS_PROXY ?? process.env.https_proxy;

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
  await mkdir(path.join(OUT, "old"), { recursive: true });
  const browser = await chromium.launch(PROXY ? { proxy: { server: PROXY, bypass: "localhost,127.0.0.1" } } : {});
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

  const laptop = await browser.newPage({ viewport: LAPTOP });
  const liveShot = new Set();
  for (const slug of slugs.filter((s) => built.has(s))) {
    await laptop.goto(BASE + pathOf(slug), { waitUntil: "load" });
    await laptop.waitForTimeout(500);
    await laptop.screenshot({ path: path.join(OUT, "new", `${slug}-laptop.png`) });
    try {
      await laptop.goto(LIVE + pathOf(slug), { waitUntil: "load", timeout: 60_000 });
      await laptop.addStyleTag({ content: SHOW_ALL });
      await laptop.waitForTimeout(1500);
      await laptop.screenshot({ path: path.join(OUT, "old", `${slug}-laptop.png`) });
      liveShot.add(slug);
    } catch (err) {
      console.error(`live ${pathOf(slug)} not captured: ${err.message.split("\n")[0]}`);
    }
  }
  await laptop.close();
  await browser.close();

  const cell = (slug, width) =>
    built.has(slug) ? `<img src="new/${slug}-${width}.png" loading="lazy" alt="">` : `<p class="todo">not built yet</p>`;
  const laptopRow = (slug) =>
    built.has(slug)
      ? `<h3>laptop screen ${LAPTOP.width}×${LAPTOP.height} (first screen, live taken now)</h3><div class="pair"><figure><figcaption>old</figcaption>${
          liveShot.has(slug) ? `<img src="old/${slug}-laptop.png" loading="lazy" alt="">` : `<p class="todo">live site not reachable</p>`
        }</figure><figure><figcaption>new</figcaption><img src="new/${slug}-laptop.png" loading="lazy" alt=""></figure></div>`
      : "";
  const rows = slugs
    .map(
      (slug) => `<section id="${slug}"><h2>${pathOf(slug)}</h2>${laptopRow(slug)}${WIDTHS.map(
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
