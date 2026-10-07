# STATE

> Rewritten at the end of every work block. Written for someone returning after **three weeks**.

**Last updated:** 2026-10-07
**Current milestone:** M3 — every other page (status: spec approved, PR open; build next)
**Current spec:** `docs/specs/004-every-other-page.md` (M0 = 001, M1 = 002, M2 = 003, all done)
**Branch:** `docs/m3-spec` (PR to `main`). **Involvement I1 since 2026-10-07:** Claude works on branches and
opens PRs; only the PO merges. Vercel deploys `main` and makes a preview URL for each PR.
**Live preview:** https://dezvoltaredigitala-site.vercel.app — home and
https://dezvoltaredigitala-site.vercel.app/finantare-sisteme-stocare-energie/ are the rebuilt pages (M2).

## Where we are
- **M0 done.** `npm run capture` screenshots all 26 live URLs (23 known + `/category/blog/`,
  `/author/dezvoltarev2/`, and a 404) at 375 / 768 / 1280 px into `reference/`. Design tokens and the
  page-by-page inconsistency list are in spec 001.
- **M1 done.** Empty Next.js site (placeholder home "Site în lucru."), reused export, content, media,
  calculator and checks. All 5 DoD commands pass and each was broken once to see it fail (table in
  spec 002). `npm run compare` writes `compare/index.html` (old | new, per page and width).
- **M2 done (PO approved 2026-10-07).** Header, footer, Messenger bubble, home and the newest article from shared
  components (`components/`, `app/tokens.css`, `app/globals.css`). 7 DoD commands green in 16 s; the new
  `check:text` and `check:width` and the loosened `check:links` / `check:routes` were each broken once (spec
  003 "Result"). Text fixes and cuts are data: `content/fixes.json`, `content/cuts.json`.
- **Look-check round 1 (2026-10-07):** PO liked everything except the home hero ("bigger, the original was
  pretty good"). Round 2 (PO disliked bigger fonts alone): hero now copies the live *layout* — narrow text
  column, big photo beside the heading, photo hidden on phone/tablet like live. Round 3 (PO: "even worse"):
  the real difference was only visible on a laptop screen — live hero spans the full screen width in two
  halves, photo fills the right half. Copied; approved. Spec 003 "Result".
  **Lesson:** always compare one laptop screen (1366 / 1536 / 1920), not only full-page shots at 1280.
- **I1 switched on.** `.claude/settings.json` = `.claude/presets/settings.I1.json` plus three network
  domains the sandbox needs: `fonts.googleapis.com`, `fonts.gstatic.com` (`next/font` downloads Inter at
  build) and `dezvoltaredigitala.ro` (measuring / `compare` against the live site).
- **M3 spec 004 approved.** PO decisions: `/servicii/` gets the 4 service cards; contact gets a
  "Deschide în Google Maps" button instead of the embedded map.

## Next step
PO merges the `docs/m3-spec` PR (HUMAN TASK below). Then I build PR 1 on `feat/m3-articles` (11 articles,
3 post lists, 404) and PR 2 on `feat/m3-pages` (services, contact, legal, calculator), each with a look-check.

## Why the current approach
- Screenshots + computed styles (not only CSS files): the live page mixes 8 plugins' CSS, and the
  computed value is what the visitor sees.
- `check:routes` has a pending list instead of being left out of the DoD until M3, so it guards from day one.

## In progress / committed but unfinished
- none

## Blocked on the human
**HUMAN TASK — merge the spec PR (about 1 minute).**
1. Open the PR link I gave you (or in the terminal: `gh pr view docs/m3-spec --web`, Enter).
2. It changes only documents and Claude's settings; no page changes. Click the green **"Merge pull request"**
   button, then **"Confirm merge"**.
3. Done = the PR page shows a purple "Merged" label. Tell me "merged".
What I do with it: start PR 1 (articles) from the updated `main`.

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
