# STATE

> Rewritten at the end of every work block. Written for someone returning after **three weeks**.

**Last updated:** 2026-10-07
**Current milestone:** M2 — header, footer, home, newest article (status: todo — spec not written yet)
**Current spec:** — (M0 = `docs/specs/001-capture-live-site.md`, M1 = `docs/specs/002-setup.md`, both done)
**Branch:** main (pushed; Vercel deploys every push)
**Live preview:** https://dezvoltaredigitala-site.vercel.app (checked: `/` → 200 with the placeholder,
`/nu-exista/` → 404, `/media/…` images → 200)

## Where we are
- **M0 done.** `npm run capture` screenshots all 26 live URLs (23 known + `/category/blog/`,
  `/author/dezvoltarev2/`, and a 404) at 375 / 768 / 1280 px into `reference/`. Design tokens and the
  page-by-page inconsistency list are in spec 001.
- **M1 done.** Empty Next.js site (placeholder home "Site în lucru."), reused export, content, media,
  calculator and checks. All 5 DoD commands pass and each was broken once to see it fail (table in
  spec 002). `npm run compare` writes `compare/index.html` (old | new, per page and width).

## Next step
M2: plan mode → spec 003 from `.claude/templates/SPEC.md` (header, footer, home, newest article, shared
components) using the tokens in spec 001 and the PO's accent decision below → PO approves → build.

## Why the current approach
- Screenshots + computed styles (not only CSS files): the live page mixes 8 plugins' CSS, and the
  computed value is what the visitor sees.
- `check:routes` has a pending list instead of being left out of the DoD until M3, so it guards from day one.

## In progress / committed but unfinished
- none

## Blocked on the human
- none

## Decisions made since last review
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
- `check:routes` only knows URLs in `content/`; `/category/blog/` and `/author/dezvoltarev2/` are not
  there. Add them to the check in M3 when they are built.
- `public/media/` is 25 MB in git (ROADMAP "Later": remove unused images).
