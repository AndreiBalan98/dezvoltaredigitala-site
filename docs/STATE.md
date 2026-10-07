# STATE

> Rewritten at the end of every work block. Written for someone returning after **three weeks**.

**Last updated:** 2026-10-07
**Current milestone:** M4 — polish (status: review — PR open; after the merge the MVP is complete)
**Current spec:** `docs/specs/005-polish.md` (M0 = 001, M1 = 002, M2 = 003, M3 = 004, all done)
**Branch:** `feat/m4-polish` (PR to `main`). **Involvement I1 since 2026-10-07:** Claude works on branches
and opens PRs; only the PO merges. Vercel deploys `main` and makes a preview URL for each PR.
**Live preview:** https://dezvoltaredigitala-site.vercel.app — the whole new site (all 25 old URLs + a 404).

## Where we are
- **The rebuild is complete.** Every URL of dezvoltaredigitala.ro exists on the new site at the same address,
  with the same texts, images and order, in one clean style (logo blues, one card / box / button / heading
  style, real SVG icons, one phone number, diacritics fixed). Old site untouched; the domain still points to it.
- **M0** capture of the live site (`reference/`, spec 001) · **M1** setup, checks, Vercel (spec 002) ·
  **M2** header, footer, home, newest article (spec 003; hero took 3 look-check rounds) · **M3** every other
  page in 2 PRs (spec 004) · **M4** Lighthouse gate + the PO's last read + open questions (spec 005).
- **Lighthouse (mobile, median of 3, local `next start`):** home performance **96**, accessibility **100**;
  newest article performance **97**, accessibility **100**. Bar: 90 / 95 (PRODUCT.md). Guarded in the DoD.
- **DoD = 8 commands** (`.claude/dod-commands`), all green, each proven able to fail once: lint, build,
  test (20), check:routes (25/25), check:links (1748 links), check:text (28 sources, 639 blocks in order,
  77 fixes, 25 cuts), check:width (25 pages × 3 widths + menu + calculator), check:lighthouse.

## Next step
PO merges the M4 PR, then answers the open questions below at his own pace. The next milestone is a PO
decision (ROADMAP "Later"): most likely production hosting + domain switch, then the contact form.

## Blocked on the human
**HUMAN TASK — last read and merge (about 15 minutes).**
1. In the project folder type `npm run fixes:list` and press Enter, then `xdg-open compare/fixes.html` and
   press Enter. Every text change is there, red = live, green = new, grouped by page. Read the rules at the
   top and skim the tables; the legal pages are long (diacritics only).
2. Open the PR link from the chat (or `gh pr view feat/m4-polish --web`). Click **"Merge pull request"** →
   **"Confirm merge"**.
3. Done = the PR shows "Merged". Reply "merged", plus any fix you want undone (e.g. "keep 'Cere oferta'").
What I do with it: close M4; undo any fix you name on a small branch; then wait for your next milestone choice.

## Open questions for the PO (none blocks anything; my recommendation first)
1. **Production hosting.** Recommendation: Vercel Hobby is free but for non-commercial use; a company site
   should move to Vercel Pro (~20 $/month) or a free static host (Cloudflare Pages / Netlify free tier allow
   commercial sites). Your call: money.
2. **Domain switch date.** Recommendation: switch only after (1), keep the old WordPress online for a month as
   a fallback, check Google Search Console after the switch.
3. **Contact form.** Recommendation: a free form service (e.g. Formspree / Web3Forms) before writing a backend.
   Today the contact page has phone, e-mail, address and the map button only.
4. **ISO certificates** on home say "data expirării 18.12.2024". Still valid? If renewed, send the new images.
5. **2025 funding calls** (Start-Up Nation 2025, VInnovate 2025, …) may be closed. Keep as news, or mark closed?
6. **Odd URLs** `/test-2/`, `/test-3/`, `/877-2/` are real posts. Recommendation: keep (links out there may
   point to them); rename later with redirects if you want nicer URLs.
7. **"Match live" widths** (asked after M3 PR 1, no answer → defaults kept): funding list 1200 px (live ~1430);
   article photos at text width (live up to ~1270 px). Say "match live" for either.
8. **Old phone number inside 3 poster images** (home: 2 funding posters; `/877-2/`: EduWebLab poster).
   Recommendation: send me corrected images, or I crop/cover the number (visible change → your OK).
9. **Street name** "Dobosari": real spelling "Doboșari"? Kept as on live in footer, contact and privacy policy.
10. **Header on wide screens** stays in the 1200 px box (live runs edge to edge). Change only if it bothers you.

## Text changes — summary for the last read (full list: `npm run fixes:list` → `compare/fixes.html`)
- Rules: one phone number (+40 749 589 848) everywhere; dates in Romanian order; emoji icons → SVG icons;
  article sidebars removed (213 lines on 10 articles); © year automatic; typed "->", "•", "–" → icons/bullets.
- 77 fixes on 15 pages + footer + 404: legal pages 31 (all diacritics, typo "livarea" → "livrarea"), Digitalizare 14,
  Creare website 10, Consultanță IT 5, Consultanță fonduri 4, phone number on 4 articles, home 3, footer 2,
  funding-list excerpts 2, contact 1, 404 1.
- 25 cuts: 12 "Citește mai mult / Arată mai puțin" toggles (text now always shown), 6 archive pagination
  links (all 12 posts on one page), 4 contact-form labels, 2 hidden screen-reader title copies, 1 search label.
- Visible additions you decided: `/servicii/` cards; packages with prices on Creare website; Google Maps
  button on contact. Shown because live hides them by a broken animation: those packages, "Ce servicii oferim?".

## Decisions made (PO unless marked "assumption")
- Look: logo blues (`#236581`, `#42adec`, tint `#e8f4fc`), purple dropped; Inter headings + system text;
  home hero = live layout (two full-width halves).
- Removed: header "Eligibilitate preliminară" popup button; all forms (comment, contact, 404 search);
  embedded Google Map → link button; outside scripts (Messenger bubble = plain link to `m.me/156617447529801`).
- `/servicii/` = 4 cards; packages shown with prices; legal pages: all diacritics fixed, no other word changes.
- Lighthouse added as a dev dependency (M4). Repo is public.
- Assumptions (may be overturned): preloader removed; client logos as a still row; 404 text stays English;
  coloured cards → one card style; red/green buttons → blue; archives show all posts on one page.

## Why the current approach
- Faithful rebuild checked by machines where possible: `check:text` proves no live sentence is dropped or
  reordered (only listed fixes / cuts); `compare` shows live vs new, including one laptop screen per page
  (lesson from the M2 hero: always compare a real laptop screen, not only full-page shots).
- Content is exported once into `content/` + `public/media/`; the new site never calls the old server.

## In progress / committed but unfinished
- none

## Tried and rejected — don't retry
- Capturing without forcing `.animated` blocks visible: home sections come out blank.
- `NODE_USE_ENV_PROXY=1` with `compare` / `check:*`: their localhost check goes through the sandbox proxy and
  hangs. Use it only for `node scripts/export-wp.mjs`.
- Giving Playwright the proxy URL as one string: it needs `username` / `password` separately (compare.mjs does).
- `pkill -f` / `pgrep -f` with a pattern that is also in the running command's own text: it kills that command.

## How-tos under I1 (the sandbox)
- Sync after a merge (`git pull` can't rewrite the protected `.claude/settings.json`): `git fetch`,
  `git switch main`, `git reset --mixed origin/main`, `git checkout -- . ':!.claude/settings.json'`.
- Never `git add -A`: the sandbox mounts placeholder files (`.bashrc`, `.gitconfig`, `.idea`, …, owner
  "nobody") in the project folder. Add files by name.
- `npm install` needs `--cache "$TMPDIR/npm-cache"`; `gh` needs to run outside the sandbox (permission prompt).

## Known debt
- `content/fixes.json`, `content/cuts.json` live in `content/`, which `npm run export:wp` deletes and rewrites:
  copy them aside before any full re-export (`--lists-only` is safe).
- No check catches a CSS-only change to an approved page (text checks compare text). Idea: screenshot-diff
  the approved pages against a saved baseline.
- `public/media/` is 25 MB in git (ROADMAP "Later": remove unused images).
- Legal pages keep live's heading levels (h1 → h5); Lighthouse would flag heading order there (not gated).
- `npm audit`: 5 "high" in dev-only lint tooling (`eslint-config-next` → … → `braces`), nothing in what the
  site ships; fixing needs a breaking lint upgrade — later.
- Reference screenshots (`reference/*.png`, 45 MB) are git-ignored; `npm run capture` re-creates them only
  while the old site is online. Do it before the domain switch if you want to keep them.
