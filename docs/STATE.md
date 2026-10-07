# STATE

> Rewritten at the end of every work block. Written for someone returning after **three weeks**.

**Last updated:** 2026-10-07
**Current milestone:** M2 — header, footer, home, newest article (status: review — waiting for the PO look-check)
**Current spec:** `docs/specs/003-reference-pages.md` (M0 = `docs/specs/001-capture-live-site.md`, M1 = `docs/specs/002-setup.md`, both done)
**Branch:** main (pushed; Vercel deploys every push)
**Live preview:** https://dezvoltaredigitala-site.vercel.app — home and
https://dezvoltaredigitala-site.vercel.app/finantare-sisteme-stocare-energie/ are the rebuilt pages (M2).

## Where we are
- **M0 done.** `npm run capture` screenshots all 26 live URLs (23 known + `/category/blog/`,
  `/author/dezvoltarev2/`, and a 404) at 375 / 768 / 1280 px into `reference/`. Design tokens and the
  page-by-page inconsistency list are in spec 001.
- **M1 done.** Empty Next.js site (placeholder home "Site în lucru."), reused export, content, media,
  calculator and checks. All 5 DoD commands pass and each was broken once to see it fail (table in
  spec 002). `npm run compare` writes `compare/index.html` (old | new, per page and width).
- **M2 built, in review.** Header, footer, Messenger bubble, home and the newest article from shared
  components (`components/`, `app/tokens.css`, `app/globals.css`). 7 DoD commands green in 16 s; the new
  `check:text` and `check:width` and the loosened `check:links` / `check:routes` were each broken once (spec
  003 "Result"). Text fixes and cuts are data: `content/fixes.json`, `content/cuts.json`.

## Next step
PO look-check (HUMAN TASK below). Approved → M2 done, switch to I1 (`.claude/presets/settings.I1.json`),
then M3 (spec 004: every other page from the same components). Changes asked → fix, re-run, ask again.

## Why the current approach
- Screenshots + computed styles (not only CSS files): the live page mixes 8 plugins' CSS, and the
  computed value is what the visitor sees.
- `check:routes` has a pending list instead of being left out of the DoD until M3, so it guards from day one.

## In progress / committed but unfinished
- none

## Blocked on the human
**HUMAN TASK — M2 look-check (about 10 minutes).** Nothing else starts before this.
1. On the laptop, in the project folder, open the side-by-side page: in the terminal type
   `xdg-open compare/index.html` and press Enter. (Missing? First type `npm run compare`, wait ~1 min.)
2. In that page, click `/` at the top. Scroll: for each width (375, 768, 1280) the old page is on the left,
   the new one on the right. Then do the same for `/finantare-sisteme-stocare-energie/`.
3. On the laptop browser open https://dezvoltaredigitala-site.vercel.app and
   https://dezvoltaredigitala-site.vercel.app/finantare-sisteme-stocare-energie/ — click around: menu,
   "Servicii", buttons, footer links. (Links to other pages show "404" until M3 — expected.)
4. On your phone open the same two addresses. Tap ☰ (menu), the phone icon, the blue Messenger bubble.
5. Done = you reply either **"M2 approved"** or a list like "home: logos too small; article: …".
   Things to judge: is it "same site, but clean"? Font, button shape (rounded pill), card style, blues.
What I do with it: approved → close M2, switch to I1, write spec 004. A list → fix each item, show you again.

## Decisions made since last review
- Not asked, PO may overturn (spec 003 "Assumptions"): article comment form removed (needs a backend),
  preloader removed, client logos as a still row, Romanian date order, © year automatic.
- PO (spec 003): the header's "Eligibilitate preliminară" button is **removed** (live it opens a popup form).
- PO (spec 003): the Messenger bubble stays as a **plain link** to `m.me/156617447529801`. Live, it is drawn
  by the third-party "Call Now Button" script on the PO's account; the new site loads no outside script.
- PO: accent colours = **the newest article's palette, same as the logo**: `#236581`, `#42adec`, tint
  `#e8f4fc`, lines `#e2e8ec`, muted `#56636c`. Purple `#9164ff` is dropped everywhere (spec 001).
- PO: the GitHub repo stays **public** (PRODUCT.md updated, 2026-10-07).
- 26 URLs captured: the sitemap also lists `/category/blog/` and `/author/dezvoltarev2/` (archive lists
  of all posts). PRODUCT.md says "+ whatever M0 finds" → default: rebuilt in M3 at the same URLs.
- Reference screenshots are 45 MB → `reference/*.png` is git-ignored; `reference/styles.json` is committed.
  Files: `reference/<slug>-<375|768|1280>.png` for slugs `home`, `404`, `servicii`,
  `servicii--creare-website`, `servicii--digitalizare-si-automatizare`,
  `servicii--consultanta-solutii-it-si-studii-de-fezabilitate`,
  `servicii--consultanta-pentru-accesarea-fondurilor-nerambursabile`, `finantari-nerambursabile`,
  `contact`, `calculator-baterii`, `politica-de-confidentialitate`, `termeni-si-conditii`,
  `category--blog`, `author--dezvoltarev2`, and the 12 post slugs in `content/posts/`.
  Lost them? `npm run capture` re-creates them (4–5 min) — but only while the old site is still online.
- The capture shows scroll-in animated blocks in their final state and hides the preloader.
- `npm run lint` fails on warnings too (`--max-warnings 0`): ESLint treats unused variables as warnings,
  so plain `eslint` let them through.
- Same Next / React / ESLint versions as `dezvoltaredigitala-next` (16.3.8 / 19.2.8 / 9).
- Specs 001 and 002 were marked approved from your message "Run M0 and M1" (they only restate ROADMAP
  M0/M1). Say so if you want to read specs before code in future milestones too.

## Tried and rejected — don't retry
- Capturing without forcing `.animated` blocks visible: the home services and "Despre noi" sections come
  out blank (the plugin only shows them when scrolled into view slowly).

## Known debt
- `content/fixes.json` and `content/cuts.json` sit in `content/`, which `npm run export:wp` deletes and
  rewrites. Before any re-export, copy them aside (git would show them deleted).
- Until M3 builds them, Next's link prefetches of unbuilt pages hang under `next start`; `compare` no longer
  waits for "networkidle" because of it (spec 003 Result).
- The two home funding posters still show the old number 0770 102 495 inside the image (not editable as text).
- `public/media/` is 25 MB in git (ROADMAP "Later": remove unused images).
