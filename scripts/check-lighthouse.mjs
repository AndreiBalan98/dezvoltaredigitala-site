// After `next build` (spec 005): Lighthouse, mobile preset, on home and the newest article — the pages
// PRODUCT.md sets the bar for. Each page runs 3 times (scores wobble); the median must reach
// Performance 90 and Accessibility 95. Runs in Playwright's Chromium against `next start`.
// Usage: npm run check:lighthouse   (exits 1 and names the failing audits)

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import lighthouse from "lighthouse";
import { chromium } from "playwright";

const ROOT = path.resolve(import.meta.dirname, "..");
const PORT = 3212;
const DEBUG_PORT = 9223;
const BASE = `http://localhost:${PORT}`;
const PAGES = ["/", "/finantare-sisteme-stocare-energie/"];
const BAR = { performance: 90, accessibility: 95 };
const RUNS = 3;

if (!existsSync(path.join(ROOT, ".next", "server", "app"))) {
  console.error("No build output in .next/server/app — run `npm run build` first.");
  process.exit(1);
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

const server = spawn("npx", ["next", "start", "-p", String(PORT)], { cwd: ROOT, stdio: "ignore", detached: true });
const stop = () => process.kill(-server.pid);

const problems = [];
const rows = [];
try {
  for (let i = 0; ; i++) {
    if (await fetch(BASE).then(() => true, () => false)) break;
    if (i > 60) throw new Error("next start did not answer within 30 s");
    await new Promise((r) => setTimeout(r, 500));
  }
  const browser = await chromium.launch({ args: [`--remote-debugging-port=${DEBUG_PORT}`] });
  try {
    for (const page of PAGES) {
      const runs = [];
      for (let i = 0; i < RUNS; i++) {
        const { lhr } = await lighthouse(BASE + page, {
          port: DEBUG_PORT,
          output: "json",
          logLevel: "error",
          onlyCategories: Object.keys(BAR),
        });
        runs.push(lhr);
      }
      const scores = Object.fromEntries(
        Object.keys(BAR).map((cat) => [cat, median(runs.map((lhr) => Math.round(lhr.categories[cat].score * 100)))]),
      );
      rows.push(`${page.padEnd(38)} performance ${scores.performance}  accessibility ${scores.accessibility}`);
      for (const [cat, min] of Object.entries(BAR)) {
        if (scores[cat] >= min) continue;
        // The audits that cost points in the median run of this category.
        const lhr = runs.find((r) => Math.round(r.categories[cat].score * 100) === scores[cat]);
        const failing = lhr.categories[cat].auditRefs
          .filter((ref) => ref.weight > 0 && lhr.audits[ref.id].score !== null && lhr.audits[ref.id].score < 0.9)
          .map((ref) => `${ref.id} (${lhr.audits[ref.id].displayValue ?? lhr.audits[ref.id].score})`);
        problems.push(`${page} ${cat} ${scores[cat]} < ${min}: ${failing.join(", ")}`);
      }
    }
  } finally {
    await browser.close();
  }
} finally {
  stop();
}

console.log(`check:lighthouse — mobile, median of ${RUNS} runs:\n  ${rows.join("\n  ")}`);
if (problems.length) {
  console.error("Below the bar:\n  " + problems.join("\n  "));
  process.exit(1);
}
