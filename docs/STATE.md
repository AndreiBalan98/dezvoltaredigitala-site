# STATE

> Rewritten at the end of every work block. Written for someone returning after **three weeks**.

**Last updated:** 2026-10-07
**Current milestone:** M1 — Setup (status: review — waiting for the Vercel import)
**Current spec:** `docs/specs/002-setup.md` (M0's `001-capture-live-site.md` is done)
**Branch:** main (pushed)

## Where we are
- **M0 done.** `npm run capture` screenshots all 26 live URLs (23 known + `/category/blog/`,
  `/author/dezvoltarev2/`, and a 404) at 375 / 768 / 1280 px into `reference/`. Design tokens and the
  page-by-page inconsistency list are in spec 001.
- **M1 built, DoD green.** Empty Next.js site (placeholder home "Site în lucru."), reused export,
  content, media, calculator and checks. All 5 DoD commands pass and each was broken once to see it
  fail (table in spec 002). `npm run compare` writes `compare/index.html` (old | new, per page and width).
- Not on Vercel yet: needs the human task below.

## Next step
1. PO does the Vercel import (HUMAN TASK below) and pastes the URL. Claude checks it with `curl`, marks M1 done.
2. M2: plan mode → spec 003 (header, footer, home, newest article). First question in it: the accent colour.

## Why the current approach
- Screenshots + computed styles (not only CSS files): the live page mixes 8 plugins' CSS, and the
  computed value is what the visitor sees.
- `check:routes` has a pending list instead of being left out of the DoD until M3, so it guards from day one.

## In progress / committed but unfinished
- M1 DoD item "preview URL works" — waits on Vercel import.

## Blocked on the human

### HUMAN TASK — Import the repo on Vercel
1. Open `https://vercel.com/new` in the browser. If asked to log in: **Continue with GitHub**.
2. Under **Import Git Repository**, find `dezvoltaredigitala-site` and click **Import** next to it.
   If it is not in the list: click **Adjust GitHub App Permissions** (link under the list) → under
   **Repository access** pick **Only select repositories** → add `dezvoltaredigitala-site` → **Save** →
   go back to the Vercel tab; the repo now appears → **Import**.
3. On **Configure Project**: leave the name as it is. **Framework Preset** must say **Next.js**
   (if it says "Other", choose Next.js from the list). Root Directory: `./`. Do not open
   Build and Output Settings or Environment Variables — nothing to change there.
4. Click **Deploy**. Wait about 1–2 minutes until you see **Congratulations!**.
5. Click **Continue to Dashboard**. Under **Domains** copy the address (ends in `.vercel.app`).
6. Done looks like: opening that address shows **Dezvoltare digitală** and **Site în lucru.**
   Paste the address to Claude.
What Claude does next: `curl` the address (HTTP 200, the placeholder text), writes it here, marks M1
done in ROADMAP, then every push to `main` deploys by itself.

## Decisions made since last review
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
- Open question for M2 (in spec 001): one accent colour — purple `#9164ff` (every page; recommended) or
  the newest article's blue `#236581`.
