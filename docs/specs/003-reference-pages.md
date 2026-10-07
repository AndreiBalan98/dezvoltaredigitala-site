# Spec 003 — The reference pages: header, footer, home, newest article

**Milestone:** M2 · **Status:** review · **Date:** 2026-10-07

## Goal
A visitor opening `/` or `/finantare-sisteme-stocare-energie/` on the Vercel preview sees the same site
as dezvoltaredigitala.ro — same menu, sections, texts, images and footer — but in one clean style, in the
logo blues, and working at phone, tablet and desktop width. Both pages are built from shared components
that M3 reuses for every other page. The PO then does the look-check; nothing else starts before it.

## Not doing
- Any other page (M3). Links to them stay in place; they lead to Vercel's default 404 page until M3.
- Our own 404 page (M3).
- Forms: the "Eligibilitate preliminară" popup form, the article comment form, contact form (non-goals).
- New sections, new copy, new images. Lighthouse tuning (M4).
- Editing images: the old number `0770 102 495` baked into both home funding posters (microîntreprinderi, EduWebLab) stays.

## What the visitor sees (from `reference/` and the live HTML)
**Header** (every page): logo · Acasă · Finanțări nerambursabile · Servicii ▾ (Creare website,
Digitalizare și automatizare, Consultanță soluții IT și studii de fezabilitate, Consultanță pentru accesarea
fondurilor nerambursabile) · Contact · Facebook icon. (The live "Eligibilitate preliminară" button is removed — PO decision.)
Phone and tablet: logo, menu button (☰), phone icon, Facebook icon. Every page: the blue Messenger bubble, bottom right.
The phone icon now dials **+40 749 589 848** (live: `0770 102 495`).

**Home `/`** — in this order:
1. Hero: "Transformă-ți afacerea cu soluții digitale inovatoare", three paragraphs, button "Află mai multe
   despre consultanță soluții IT și studii de fezabilitate ->", photo of the woman pointing.
2. Services (light background): eyebrow "Servicii oferite", "Soluțiile noastre pentru dezvoltare", the
   intro box ("…roboți software…"), three cards with their icons — Creare site-uri web, Magazine Online,
   Promovare Web — each with "Vezi mai mult".
3. Despre noi (light background): eyebrow "Dezvoltaredigitala.ro", building photo, the two paragraphs,
   "Contactează-ne".
4. Finanțări nerambursabile: the same two posts as live (modernizarea microîntreprinderilor; EduWebLab),
   each with date, title, poster image (whole, not cropped) and excerpt.
5. "Suntem certificați ISO": the two certificates, each linking to its PDF.
6. "O parte din proiectele finalizate" / "Cu ce ne lăudăm?": six portfolio cards (screenshot, name, type,
   external link).
7. Client logos row (7 logos).

**Newest article** — title, date · "Blog", lead, two fact cards, the "Vrei să vezi dacă te încadrezi?" box
with "Calculează-ți punctajul" (→ `/calculator-baterii/`), "Cum se face selecția?" with the 50 / 50 bar,
"Condiții importante" (two items with icons), "Ai nevoie de ajutor?" (phone, e-mail), the fine print,
then "Anterior: Ghidul începătorului…" link to the previous article.

**Footer** (every page): logo, "O treaptă mai sus în afacerea ta", "Contactează-ne!" · Contact (e-mail,
phone, address) · Compania (Contact, Politica de confidențialitate, Termeni și condiții, ANPC) ·
© line · ANPC SAL and SOL badges.

## Approach
- **Tokens** (`app/tokens.css`): spec 001 values, accents replaced by the PO palette — main `#236581`,
  second `#42adec`, tint `#e8f4fc`, lines `#e2e8ec`, muted `#56636c`; body text `#434343`, headings `#313131`,
  section background `#f3f6fb`, footer `#2f2f2f`. Spacing = the live scale (0.44 → 5.06 rem).
  **Font pair = the live one:** Inter 700 for headings (via `next/font/google`, part of Next — no new
  dependency, self-hosted at build), system stack for text. One heading scale with `clamp()`.
- **One of each:** button (pill, radius 25 px, as the theme's 54 buttons), card (white, 1 px `#e2e8ec`,
  radius 16 px, soft shadow), box (tint background, radius 16 px), heading style, section (max width
  1200 px, 20 px side padding, same vertical rhythm).
- **Icons:** one inline-SVG set in `components/Icon.tsx` (phone, mail, map-pin, facebook, messenger, menu, chevron,
  user, shield, arrow), drawn in the accent colour. The service icons and logos stay the site's own images.
- **Header menu on phones:** one small client component (button toggles the panel; Esc and link click close
  it). The Servicii dropdown opens on hover and on keyboard focus.
- **Home** is written in TSX from the components; its texts are copied from
  `content/pages/sample-page.json` (the exported home). **The article** is rendered from its exported HTML
  through `lib/clean-html.ts`, which: drops `<style>` and builder classes, maps the article's blocks to the
  shared components (`dd-fact` → card, `dd-calc` → box, `dd-cond` item → icon list, …), inserts the SVG
  icons, rewrites live links/images to local paths (`content/media-map.json`), and applies the fixes list.
  String-based, no new dependency (M3 reuses it for the 11 older articles). If that gets unworkable I stop
  and ask about an HTML-parser dependency.
- **Fixes and cuts are data**, so they are listed for the PO and tested: `content/fixes.json`
  (`page, from, to, why`) and `content/cuts.json` (`page, text, why`).
- **New checks, both added to the DoD and each broken once to show it go red:**
  - `npm run check:text` — for every rebuilt page, every text block of the exported page (after fixes)
    appears on the built page, **in the same order** (this is the "same sections in the same order" check),
    unless it is on the cuts list. A fix or cut that matches nothing also fails, so the lists cannot go stale.
  - `npm run check:width` — starts the built site (`next start`, port 3211) and, with Playwright, loads every
    built page at 375 / 768 / 1280 px: fails if `scrollWidth > innerWidth`.
- `check:links` also accepts links to URLs in `scripts/routes-pending.json` (built in M3); any other
  unbuilt target still fails. `/category/blog/` and `/author/dezvoltarev2/` (the article's "Blog" link)
  join the known URLs via `scripts/routes-extra.json` — this pays the known debt in STATE.md now.
- I0: commits go straight to `main`; each push deploys the preview. `npm run compare` refreshes `compare/`.

## Files and interfaces
| File / interface | New / changed | What |
|---|---|---|
| `app/tokens.css`, `app/globals.css` | new | tokens; base, button, card, box, section, heading, prose styles |
| `app/layout.tsx` | changed | Inter font, header + footer around every page |
| `app/page.tsx` | changed | the home page (replaces the placeholder) |
| `app/[slug]/page.tsx` | new | article page; `generateStaticParams` = the newest article only in M2, `dynamicParams = false` |
| `components/Header.tsx`, `MobileMenu.tsx`, `Footer.tsx`, `MessengerButton.tsx` | new | site header (menu, dropdown, phone menu), footer, Messenger link bubble |
| `components/Section.tsx`, `Card.tsx`, `Box.tsx`, `Button.tsx`, `IconList.tsx`, `Icon.tsx` | new | shared components |
| `lib/icons.ts` | new | the SVG bodies, shared by `Icon.tsx` and the cleaner (added while building) |
| `lib/site.ts` | new | phone, e-mail, address, Facebook, Messenger, menu (added while building) |
| `tsconfig.json` | changed | `allowImportingTsExtensions` so `node --test` can import `lib/*.ts` (added while building) |
| `scripts/compare.mjs` | changed | waits for load + images instead of "networkidle" (added while building, see Result) |
| `lib/content.ts` | new | reads `content/` JSON (page by path, post by slug, previous post) |
| `lib/clean-html.ts` | new | exported HTML → clean HTML with shared classes |
| `content/fixes.json`, `content/cuts.json` | new | every text change / removal, with the reason |
| `scripts/check-text.mjs`, `scripts/check-width.mjs` | new | the two checks above |
| `scripts/check-links.mjs` | changed | pending URLs count as known |
| `scripts/check-routes.mjs`, `scripts/routes-extra.json` | changed / new | the two archive URLs are known |
| `scripts/routes-pending.json` | changed | `/finantare-sisteme-stocare-energie/` off; the two archive URLs on |
| `package.json` | changed | scripts `check:text`, `check:width` (no new dependency) |
| `.claude/dod-commands` | changed | + `npm run check:text`, `npm run check:width` |
| `tests/clean-html.test.mjs` | new | unit tests for the cleaner |

## Touches existing code
- The placeholder home is replaced. `check-links` and `check-routes` get looser in one controlled way
  (pending/extra URLs), so each gets a new failure proof. `compare.mjs` changes how it
  waits (see Result). `export-wp.mjs`, `capture.mjs`, calculator and its tests are unchanged.

## Test plan
| Case | Type | Expected |
|---|---|---|
| cleaner: live image URL → `/media/…`; live page link → relative; `<style>` removed; `dd-fact` → card class; a fix applied | unit | `npm test` passes |
| home + article text, in order | integration (`check:text`) | exit 0, prints blocks checked / fixed / cut |
| proof: delete the "Despre noi" second paragraph from `app/page.tsx` | proof of failure | `check:text` exit 1, names the sentence |
| proof: swap the ISO and portfolio sections | proof of failure | `check:text` exit 1, "out of order" |
| proof: a fix whose `from` is not on the page | proof of failure | `check:text` exit 1, "stale fix" |
| no horizontal scroll, 2 pages × 3 widths | e2e (`check:width`) | exit 0 |
| proof: a 500 px wide element on the home | proof of failure | `check:width` exit 1, names `/` @ 375 |
| proof: link to `/nu-exista/` (neither built nor pending) | proof of failure | `check:links` exit 1 |
| one phone number | integration (in `check:text`) | built pages contain no `770 102 495` / `0770102495` as text or `tel:` |
| `/contact/` link on home (pending) | integration | `check:links` exit 0 |
| phone menu opens, closes with Esc, Servicii reachable by keyboard | e2e (in `check:width` run) | pass at 375 |
| look | manual — **PO LOOK-CHECK** | PO says "same site, but clean" or lists changes |

## Definition of Done (commands)
```
npm run lint
npm run build
npm test
npm run check:routes
npm run check:links
npm run check:text
npm run check:width
npm run compare        # not in the DoD (slow); run once, compare/index.html for both pages
```
End-to-end check: on the Vercel URL, home and the newest article at phone and laptop width, next to
`compare/index.html` — the PO look-check (HUMAN TASK in STATE.md). After approval: switch to I1.

## Assumptions made (the PO may overturn any)
- **Comment form ("Lasă un răspuns") removed** from the article — it needs a backend (non-goal). On the cuts list.
- **Preloader removed.** It is a loading effect, not content.
- **Client logos: a still row that wraps**, not a sliding carousel (same 7 logos; no extra script).
- Home hero heading becomes the page's `h1` (live: `h2`) — looks the same, better for Google and screen readers.
- Dates in Romanian order: "6 octombrie 2026" (live: "octombrie 6, 2026", "Martie 14, 2025").
- © year: the build's year (live: "2025").
- Fixes found so far (full list in `content/fixes.json` when built): "utilizand" → "utilizând";
  "Botosani" → "Botoșani" (footer); hero no longer breaks as "Transformă-/ți"; footer and header phone
  → +40 749 589 848. "Strada Dobosari" stays as written (street name — the ISO certificates spell it the same).

## Risks
- The exported article HTML is WordPress block markup; a string-based cleaner can miss a case → the text
  check and the unit tests catch dropped text; layout misses show in `compare/`.
- `next/font/google` downloads Inter at build time: a build without network fails (Vercel has network).
- `check:width` adds ~15 s to the Stop hook; fine now, re-measured in M3 with 26 pages.

## Needs a decision from the Product Owner
- [x] "Eligibilitate preliminară" button (live: opens a popup form, which is a non-goal).
      **PO, 2026-10-07: remove the button** (header and phone menu). On the cuts list.
- [x] Floating Messenger button. Live it is drawn by the third-party "Call Now Button" script
      (`user.callnowbutton.com`, the PO's account), whose config is: `#0033ff` bubble, bottom right, opens
      `https://m.me/156617447529801` in a new tab. **PO, 2026-10-07: same button as a plain link, no
      outside script** → `components/MessengerButton.tsx`, on every page, white Messenger icon (in `Icon.tsx`).
- [x] **PO approved this spec on 2026-10-07.**

## Result (2026-10-07)
All DoD commands exit 0 on the finished code (whole run 16 s):
`lint` · `build` (routes `/`, `/_not-found`, `/finantare-sisteme-stocare-energie`) · `test` (pass 13, fail 0) ·
`check:routes — 2 of 25 known URLs built, 23 pending.` · `check:links — 269 internal links on 3 pages, 0 broken.` ·
`check:text — 3 sources, 83 blocks found in order, 7 fixes, 2 cuts, 0 problems.` ·
`check:width — 2 pages × 3 widths, 0 problems.`
`npm run compare` → `compare — 26 URLs × 3 widths, 3 built.` (home, article, 404 = Next's default until M3).

Proven able to fail (each broken on purpose, then restored):
| Check | Broken how | Output | Exit |
|---|---|---|---|
| text | 2nd "Despre noi" paragraph deleted | `/  missing: "Echipa noastră, alcătuită din …"` | 1 |
| text | ISO and portfolio sections swapped | `/  out of order: "Farmaciaanca.ro"` (and others) | 1 |
| text | fix whose `from` is not on the page | `/  stale fix: "text care nu există"` | 1 |
| text | "Sună 0770 102 495" added to home | `index.html  old phone number 0770 102 495` | 1 |
| width | 500×10 px element on home | `/ @ 375: 500 px wide (widest: div.proof)` | 1 |
| width | Esc handler broken in `MobileMenu` | `/ @ 375: Esc does not close the menu` | 1 |
| width | (after review) Servicii links hidden in the phone menu | `/ @ 375: Servicii links not reachable by keyboard in the phone menu` | 1 |
| links | button to `/nu-exista/` | `Broken: /  →  /nu-exista/` | 1 |
| routes | `/category/blog/` removed from pending | `Missing: /category/blog/` | 1 |
| test | (found while building) the cleaner dropped its own `icon-badge` class | `not ok 12 - icon blocks get an SVG badge…` → fixed | 1 |

Deviations / findings:
- The first width proof used an element 0 px high and stayed **green** — the browser does not count empty boxes
  as overflow. The check was right, the proof was wrong; redone with 10 px height → red.
- `compare` hung on the new home: under `next start`, Next's link prefetches of not-yet-built pages
  (`/contact/?_rsc=…`) get a 404 whose body never ends, so "networkidle" never comes. `compare` now waits for
  `load`, scrolls (lazy images), and waits until every image is complete. Goes away for each page built in M3.
- `content/fixes.json` / `cuts.json` live in `content/`, which `npm run export:wp` deletes and rewrites —
  re-exporting would remove them (git shows it). Noted in STATE.md.
- Fixes applied (`content/fixes.json`): "utilizand" → "utilizând"; missing spaces in "activitatea!Ce …
  finanțare?Programul"; typed "->" → arrow icon; "Botosani" → "Botoșani"; © 2025 → current year;
  "martie 14, 2025" / "martie 3, 2025" → "14 martie 2025" / "3 martie 2025". Header phone icon → +40 749 589 848 (not in `fixes.json`:
  the header is not exported text; it comes from `lib/site.ts`, and `check:text` fails on any `0770 102 495`).
  Cuts (`content/cuts.json`): the two hidden screen-reader copies of the funding post titles.

PO look-check (2026-10-07): "hero section bigger, the original one was pretty good; the rest is good."
→ home hero set to the live sizes (`reference/styles.json`: h1 75.68 px, text ~22 px at 1280): `--fs-hero`
36–56 px → 40–76 px, new `--fs-hero-text` 19–22 px, more space above/below on desktop. `--fs-hero` is used
only by the home hero. DoD 7/7 green after the change; `compare` re-run.
Round 2: PO "worst, don't like it, make it like the original". Bigger fonts alone were the wrong fix: the
live hero's *shape* differs. Measured live with Playwright: text column 464 px (heading on 5 lines at 1280),
photo 639 px wide beside the heading (top-aligned, not centred), text 24 px with a blank line between
paragraphs, photo **hidden at 768 and 375**. Copied: `.hero__grid` 29rem | 1fr, photo `display:none` below
900 px (its `sizes` now `1px` there, so phones don't download it), `--fs-hero` 42→76 px, `--fs-hero-text`
19.5→24 px, paragraph gap 1.7em. Kept: site font pair, blue pill button, "Transformă-ți" not split by a hyphen.
DoD 7/7 green; side-by-side checked at 375 / 768 / 1280.
Round 3: PO "even worse — the image is bigger, the text fits the screen". Root cause of both misses: we
compared only full-page shots at 1280, never one screen at real laptop sizes. Measured live at 1024 / 1366 /
1536 / 1920: the hero is **two equal halves of the full screen width** (not the 1200 px page container), text
64 px from the left edge and 112 px short of the middle, photo filling the right half (778 px at 1536, 985 px
at 1920), button centred under the text. Copied that from 900 px up. Compared one-screen captures at 1366 /
1536 / 1920: same heading lines, photo size and text wrapping. DoD 7/7 green.
Lesson: check layouts at one-screen laptop sizes (1366 / 1536 / 1920), not only the three reference widths.
