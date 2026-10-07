# ROADMAP

Status: `todo` → `spec` → `building` → `review` → `done`, plus `cancelled`. One milestone at a time.
Direction changes are edits to this file in a `docs:` commit — never decided in chat only.
I0 until M2's look-check (Claude commits and pushes to `main`, Vercel deploys each push), then I1.
**Look is the PO's call:** a machine checks routes, links, text, widths and speed; only the PO judges
"same site, but clean".

## M0 — Capture the live site · status: done · ~30 min
**Outcome:** a reference of how the site looks today, so "faithful" can be checked.
**Definition of Done:**
- [x] `scripts/capture.mjs` saves full-page screenshots of every live URL at 375, 768 and 1280 px
      into `reference/` (git-ignored if > 20 MB; then the list of files goes in STATE.md)
- [x] the live theme's colours, fonts, font sizes, spacing and button/card styles are read from its
      CSS and written into `docs/specs/001-*.md` as the design tokens, with where each came from
- [x] a list of every inconsistency found (fonts, colours, boxes, broken icons, typos), page by page,
      in the same spec — this is what M2–M3 fix
- [x] if something cannot be captured: a HUMAN TASK for the PO (wp-admin / cPanel), before M1

## M1 — Setup · status: done · ~30 min
**Outcome:** empty Next.js site with the reused export and checks, live on Vercel.
**Definition of Done:**
- [x] `.gitignore` before `npm install`; reused files copied from `dezvoltaredigitala-next` (list in PRODUCT.md)
- [x] `.claude/dod-commands`: `npm run lint`, `npm run build`, `npm test`, `npm run check:routes`,
      `npm run check:links` — each proven able to fail once
- [x] `npm run compare` builds `compare/index.html`: old screenshot next to new, per page and width
- [x] **HUMAN TASK:** PO imports the repo on vercel.com (steps in STATE.md); preview URL works

## M2 — The reference pages: header, footer, home, newest article · status: review · ~1.5 h
**Outcome:** home and *Finanțare pentru sisteme de stocare a energiei* rebuilt to the faithfulness
rule in PRODUCT.md, from shared components (header, footer, section, card, icon list, button, box).
**Definition of Done:**
- [x] same sections in the same order as the reference; text test passes (cuts listed)
- [x] no horizontal scroll at 375 / 768 / 1280 (automated check)
- [x] `compare/` updated for both pages
- [ ] **PO LOOK-CHECK** on the Vercel URL, phone + laptop, with `compare/` open: approve or say what to
      change. Nothing else starts before this. After approval: switch to I1.

## M3 — Every other page · status: todo · ~2.5 h
**Outcome:** all URLs in the same style, made only of M2's components.
**Definition of Done:**
- [ ] 11 older articles: page-builder HTML converted into the shared components; texts kept, fixes listed
- [ ] funding list, `/servicii/` + 4 service pages, contact, legal pages, calculator (same results — tests), 404
- [ ] `check:routes` green — no old URL missing; width check green on every page
- [ ] PR with `compare/` for every page; PO merges

## M4 — Polish · status: todo · ~45 min
**Definition of Done:**
- [ ] Lighthouse mobile on home + newest article: Performance ≥ 90, Accessibility ≥ 95 (numbers in STATE.md)
- [ ] all typo / diacritic / phone fixes listed in STATE.md for the PO's last read
- [ ] STATE.md: open questions for the PO (hosting, form, domain switch)

## Later (not now)
Contact form, "Eligibilitate preliminară" form, production hosting, domain switch with the old site as
fallback, unused images cleaned out of git.