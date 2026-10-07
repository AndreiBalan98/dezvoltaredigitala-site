# STATE

> Rewritten at the end of every work block. Written for someone returning after **three weeks**.

**Last updated:** 2026-10-07
**Current milestone:** M3 — every other page (status: review — PR 1 merged, PR 2 waiting for the PO)
**Current spec:** `docs/specs/004-every-other-page.md` (M0 = 001, M1 = 002, M2 = 003, all done)
**Branch:** `feat/m3-pages` (PR 2 to `main`). **Involvement I1 since 2026-10-07:** Claude works on branches
and opens PRs; only the PO merges. Vercel deploys `main` and makes a preview URL for each PR.
**Live preview:** https://dezvoltaredigitala-site.vercel.app (M2 + PR 1 pages); PR 2's preview link is on the PR.

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
- **M3 spec 004 approved and merged** (PR #1). PO decisions: `/servicii/` gets the 4 service cards; contact
  gets a "Deschide în Google Maps" button instead of the embedded map.
- **M3 PR 1 built** (`feat/m3-articles`): the 11 older articles (emoji → SVG icons, sidebar removed, Anterior /
  Următor), `/finantari-nerambursabile/`, `/category/blog/`, `/author/dezvoltarev2/` (all 12 posts), our 404.
  DoD 7/7 green; spec-reviewer found 2 gaps (archives missing 2 posts; 404 cuts not listed), both fixed.
  Details and evidence: spec 004 "Result — PR 1". `npm run compare` now also has a laptop-screen row.
  **PR 1 merged** by the PO ("is ok"). The two "match live?" questions were not answered → defaults kept
  (funding list 1200 px wide, article photos at text width). Still open: say "match live" any time.
- **M3 PR 2 built** (`feat/m3-pages`): `/servicii/` (4 cards), the 4 service pages, contact, the 2 legal pages,
  the calculator. All 25 known URLs + 404 built (`routes-pending.json` = `[]`). PO decisions: the hidden
  "Creare website" packages are **shown with prices** (€400 / €800 / €1200); legal pages get **all diacritics
  fixed** (31 listed fixes). spec-reviewer found 1 gap (a CSS rule moved a button on the approved newest
  article by 16 px), fixed and measured. Details and evidence: spec 004 "Result — PR 2".

## Next step
PO look-check of PR 2 (HUMAN TASK below). Merged → M3 done; then M4 (polish: Lighthouse on home + newest
article, the PO's final read of all fixes, open questions) — spec 005.

## Why the current approach
- Screenshots + computed styles (not only CSS files): the live page mixes 8 plugins' CSS, and the
  computed value is what the visitor sees.
- `check:routes` has a pending list instead of being left out of the DoD until M3, so it guards from day one.

## In progress / committed but unfinished
- none

## Blocked on the human
**HUMAN TASK — PR 2 look-check (about 10 minutes).**
1. On the laptop, in the project folder, type `xdg-open compare/index.html` and press Enter.
   (Missing? First type `npm run compare`, wait ~5 min.)
2. Click a page name at the top; the first row is one laptop screen, live left, new right. Look at:
   `/servicii/`, the 4 `/servicii/…` pages, `/contact/`, `/calculator-baterii/`, the 2 legal pages.
3. On the phone, open the PR's Vercel preview link (PR page → "View deployment") and try the calculator:
   tick the 6 boxes, type 15, 25000, 10000 → it must show **57,5**; press "Aplică" → **87,5**.
4. Done = reply **"PR 2 OK"** and merge ("Merge pull request" → "Confirm merge"), or a list of changes.
What I do with it: OK → M3 done, I write spec 005 (M4). A list → I fix it on the same branch and ask again.

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
- `NODE_USE_ENV_PROXY=1 npm run compare`: the flag sends compare's localhost check through the sandbox proxy
  and it hangs forever. Use it only for `node scripts/export-wp.mjs` (Node's fetch to the live site).
- Giving Playwright the proxy URL as one string: it needs `username` / `password` separately (compare.mjs does).
- `git pull` on `main` under I1: the sandbox blocks rewriting `.claude/settings.json`. Instead:
  `git fetch`, then `git reset --mixed origin/main`, then `git checkout -- docs/` (or any other changed paths).
- `pkill -f <pattern>` / `pgrep -f` inside a command whose own text contains the pattern kills that command.

## Known debt
- `content/fixes.json` and `content/cuts.json` sit in `content/`, which `npm run export:wp` deletes and
  rewrites. Before any re-export, copy them aside (git would show them deleted).
- Until M3 builds them, Next's link prefetches of unbuilt pages hang under `next start`; `compare` no longer
  waits for "networkidle" because of it (spec 003 Result).
- The two home funding posters and the EduWebLab poster (`/877-2/`) still show the old number inside the
  image (not editable as text).
- Under I1 the sandbox mounts placeholder files in the project folder (`.bashrc`, `.gitconfig`, `.idea`,
  `.claude/commands` …, owned by "nobody"). Never `git add -A`: add files by name.
- `public/media/` is 25 MB in git (ROADMAP "Later": remove unused images).
- No check catches a CSS-only change to an approved page (`check:text` compares text). PR 2 moved a button
  on the newest article by 16 px until the reviewer measured it. Possible M4 item: screenshot-diff the
  approved pages against a saved baseline.
- `git pull` doesn't work under I1 (sandbox protects `.claude/settings.json`). To sync after a merge:
  `git fetch`, `git switch main`, `git reset --mixed origin/main`, `git checkout -- . ':!.claude/settings.json'`.
- Legal pages keep live's heading levels (h1 → h5 / h1 → h3 → h5); street name "Dobosari" kept as on live.
- Under I1 the sandbox mounts placeholder files (see above), and `compare` reaches the live site only through
  the proxy (handled in `scripts/compare.mjs`).
