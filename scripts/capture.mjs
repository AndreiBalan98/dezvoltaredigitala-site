// Reference capture of the live WordPress site (spec 001).
// Full-page screenshots of every sitemap URL (+ a 404) at 375, 768 and 1280 px into reference/,
// and the computed styles the visitor actually sees (at 1280 px) into reference/styles.json.
// Usage: npm run capture   (exits 1 and names each URL that failed)

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const SITE = process.env.LIVE_SITE ?? "https://dezvoltaredigitala.ro";
const WIDTHS = [375, 768, 1280];
const NOT_FOUND_PATH = "/pagina-care-nu-exista/";
const OUT = path.resolve(import.meta.dirname, "..", "reference");

const slugOf = (urlPath) => (urlPath === "/" ? "home" : urlPath === NOT_FOUND_PATH ? "404" : urlPath.slice(1, -1).replaceAll("/", "--"));

async function sitemapPaths() {
  const locs = async (url) => {
    const res = await fetch(url).catch((err) => {
      throw new Error(`${err.cause?.code ?? err.message} for ${url}`);
    });
    if (!res.ok) throw new Error(`${res.status} for ${url}`);
    return [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  };
  const paths = [];
  for (const sitemap of await locs(`${SITE}/wp-sitemap.xml`)) {
    for (const url of await locs(sitemap)) paths.push(new URL(url).pathname);
  }
  return [...paths, NOT_FOUND_PATH];
}

// Runs in the page: what the visitor sees, as computed by the browser.
function readStyles() {
  const pick = (el) => {
    const s = getComputedStyle(el);
    return {
      text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 60),
      font: s.fontFamily.split(",")[0].replaceAll('"', ""),
      size: s.fontSize,
      weight: s.fontWeight,
      lineHeight: s.lineHeight,
      color: s.color,
      background: s.backgroundColor,
      radius: s.borderRadius,
      padding: s.padding,
    };
  };
  const visible = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
  const count = (values) => {
    const m = {};
    for (const v of values) if (v) m[v] = (m[v] ?? 0) + 1;
    return Object.fromEntries(Object.entries(m).sort((a, b) => b[1] - a[1]));
  };
  const all = [...document.querySelectorAll("body *")].filter(visible);
  const withText = all.filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  const boxes = all.filter((el) => {
    const s = getComputedStyle(el);
    return (s.borderTopWidth !== "0px" && s.borderTopStyle !== "none") || s.boxShadow !== "none" || s.borderRadius !== "0px";
  });
  const sel = (q) => [...document.querySelectorAll(q)].filter(visible).map(pick);
  return {
    headings: sel("h1, h2, h3, h4"),
    buttons: sel(".wp-block-button__link, .wp-element-button, button, a[class*='button'], a[class*='btn']"),
    paragraphSizes: count(sel("main p, main li").map((p) => `${p.font} ${p.size}/${p.lineHeight} ${p.color}`)),
    textColors: count(withText.map((el) => getComputedStyle(el).color)),
    backgrounds: count(all.map((el) => getComputedStyle(el).backgroundColor).filter((c) => c !== "rgba(0, 0, 0, 0)")),
    fonts: count(withText.map((el) => getComputedStyle(el).fontFamily.split(",")[0].replaceAll('"', ""))),
    boxes: count(boxes.map((el) => {
      const s = getComputedStyle(el);
      return `radius ${s.borderRadius} · border ${s.borderTopWidth} ${s.borderTopColor} · shadow ${s.boxShadow}`;
    })),
  };
}

// The preloader overlay is hidden; scroll-in animations ("Blocks Animation" plugin, class .animated)
// keep blocks invisible until they enter the viewport, so they are shown in their final state.
const SHOW_ALL = "#sl-preloader{display:none!important}.animated{visibility:visible!important;animation:none!important;opacity:1!important;transform:none!important}";

async function settle(page) {
  await page.addStyleTag({ content: SHOW_ALL }).catch(() => {});
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(800);
}

const paths = await sitemapPaths();
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const failed = [];
const styles = {};
let shots = 0;

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const urlPath of paths) {
    try {
      const res = await page.goto(SITE + urlPath, { waitUntil: "load", timeout: 60_000 });
      const expected = urlPath === NOT_FOUND_PATH ? 404 : 200;
      if (res?.status() !== expected) throw new Error(`HTTP ${res?.status()}, expected ${expected}`);
      await settle(page);
      await page.screenshot({ path: path.join(OUT, `${slugOf(urlPath)}-${width}.png`), fullPage: true });
      shots++;
      if (width === 1280) styles[urlPath] = await page.evaluate(readStyles);
    } catch (err) {
      failed.push(`${urlPath} @ ${width}px — ${err.message.split("\n")[0]}`);
    }
  }
  await context.close();
}
await browser.close();
await writeFile(path.join(OUT, "styles.json"), JSON.stringify(styles, null, 1) + "\n");

console.log(`capture — ${paths.length} URLs × ${WIDTHS.length} widths: ${shots} screenshots in reference/.`);
if (failed.length) {
  console.error("Failed:\n  " + failed.join("\n  "));
  process.exit(1);
}
