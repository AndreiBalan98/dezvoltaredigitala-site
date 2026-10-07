// After `next build` (spec 003): starts the built site and loads every built page at 375 / 768 / 1280 px.
// Fails if a page scrolls sideways, and if the phone menu or the keyboard "Servicii" submenu do not work.
// Usage: npm run check:width   (exits 1 and names each page @ width with its widest element)

import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");
const BUILT = path.join(ROOT, ".next", "server", "app");
const PORT = 3211;
const BASE = `http://localhost:${PORT}`;
const WIDTHS = [375, 768, 1280];

if (!existsSync(BUILT)) {
  console.error("No build output in .next/server/app — run `npm run build` first.");
  process.exit(1);
}

const pages = readdirSync(BUILT, { recursive: true })
  .map((f) => String(f).split(path.sep).join("/"))
  .filter((f) => f.endsWith(".html") && !f.startsWith("_"))
  .map((f) => (f === "index.html" ? "/" : `/${f.slice(0, -".html".length)}/`))
  .sort();

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore", detached: true });
const stop = () => process.kill(-server.pid);

const problems = [];
try {
  for (let i = 0; ; i++) {
    if (await fetch(BASE).then(() => true, () => false)) break;
    if (i > 60) throw new Error("next start did not answer within 30 s");
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch();
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 800 } });
    for (const urlPath of pages) {
      await page.goto(BASE + urlPath, { waitUntil: "load" });
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        if (doc.scrollWidth <= doc.clientWidth) return null;
        let widest = { right: 0, name: "" };
        for (const el of document.body.querySelectorAll("*")) {
          const right = el.getBoundingClientRect().right;
          if (right > widest.right) widest = { right, name: el.tagName.toLowerCase() + (el.className ? `.${String(el.className).split(" ")[0]}` : "") };
        }
        return { scrollWidth: doc.scrollWidth, widest: widest.name };
      });
      if (overflow) problems.push(`${urlPath} @ ${width}: ${overflow.scrollWidth} px wide (widest: ${overflow.widest})`);
    }
    await page.close();
  }

  // Phone menu: opens with the button, closes with Esc.
  const phone = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await phone.goto(BASE + "/");
  await phone.click(".menu-toggle");
  if (!(await phone.isVisible("#site-menu a[href='/contact/']"))) problems.push("/ @ 375: menu button does not open the menu");
  // The four Servicii links are reachable with Tab in the open phone menu.
  const tabbed = new Set();
  for (let i = 0; i < 15; i++) {
    await phone.keyboard.press("Tab");
    tabbed.add(await phone.evaluate(() => document.activeElement?.closest(".nav__sub") && document.activeElement.getAttribute("href")));
  }
  if ([...tabbed].filter(Boolean).length < 4) problems.push("/ @ 375: Servicii links not reachable by keyboard in the phone menu");
  await phone.keyboard.press("Escape");
  if (await phone.isVisible("#site-menu")) problems.push("/ @ 375: Esc does not close the menu");
  // Desktop: the Servicii submenu opens on keyboard focus.
  await phone.setViewportSize({ width: 1280, height: 800 });
  await phone.focus(".nav__item--sub .nav__link");
  if (!(await phone.isVisible(".nav__sub a"))) problems.push("/ @ 1280: Servicii submenu does not open on keyboard focus");
  await browser.close();
} finally {
  stop();
}

console.log(`check:width — ${pages.length} pages × ${WIDTHS.length} widths, ${problems.length} problems.`);
if (problems.length) {
  console.error("Problems:\n  " + problems.join("\n  "));
  process.exit(1);
}
