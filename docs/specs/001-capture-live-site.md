# Spec 001 — Capture the live site

**Milestone:** M0 · **Status:** approved · **Date:** 2026-10-07
Approval: the PO approved the plan (PRODUCT.md + ROADMAP.md) and said "Run M0 and M1" on 2026-10-07.
This spec only restates ROADMAP M0; the sections marked *(filled by M0)* are its output.

## Goal
A reference of how dezvoltaredigitala.ro looks today: full-page screenshots of every live URL at
375, 768 and 1280 px, the theme's real design tokens, and a page-by-page list of inconsistencies.
This is the bar every later milestone is compared against.

## Not doing
- No Next.js app, no copying from `dezvoltaredigitala-next` (that is M1).
- No fixing anything — M0 only records.

## Approach
- Playwright (approved dev dependency in PRODUCT.md) drives headless Chromium.
- URL list = the live `wp-sitemap.xml` (pages, posts, category, author) + one missing URL for the 404 page.
- Before each screenshot: wait for network idle, hide the "cute preloader" overlay, scroll to the bottom
  and back so lazy images and scroll animations load.
- At 1280 px the script also reads the **computed** styles of the rendered page (headings, body text,
  buttons, links, boxes) into `reference/styles.json` — computed values are what the visitor sees,
  whatever plugin wrote the CSS.
- Tokens and inconsistencies are written into this spec by hand from `styles.json`, the screenshots
  and the theme's `global-styles` CSS.

## Files and interfaces
| File / interface | New / changed | What |
|---|---|---|
| `package.json`, `package-lock.json` | new | `playwright` dev dependency, `npm run capture` |
| `scripts/capture.mjs` | new | screenshots + computed styles; exits 1 if any URL fails |
| `reference/<slug>-<width>.png` | new | screenshots (git-ignored if the folder is > 20 MB) |
| `reference/styles.json` | new | computed styles per page (committed) |
| `docs/specs/001-capture-live-site.md` | new | this file, incl. tokens + inconsistencies |

## Touches existing code
None — the repo has no code yet.

## Test plan
| Case | Type | Expected |
|---|---|---|
| every sitemap URL × 3 widths | integration (the script) | 3 PNGs per URL, script prints the count and exits 0 |
| a URL that fails (bad host) | integration, run once | script exits 1 and names the URL |
| 404 URL | integration | captured, HTTP 404 is accepted only for this one URL |

## Definition of Done (commands)
```
npm run capture        # exits 0, prints "<n> URLs × 3 widths"
ls reference/*.png | wc -l
```
End-to-end check: open three screenshots (home 375, newest article 1280, contact 768) and see the real page.

## Design tokens *(filled by M0)*

## Inconsistencies, page by page *(filled by M0)*

## Assumptions made
- `/category/blog/` and `/author/dezvoltarev2/` are live URLs found in the sitemap, so they are captured.
  Whether they are rebuilt in M3 follows PRODUCT.md ("+ whatever M0 finds") — default: yes, same URL.
- The 404 reference is `/pagina-care-nu-exista/`.

## Risks
- Scroll animations / preloader may leave parts blank in screenshots → mitigated by scrolling and hiding the preloader.

## Needs a decision from the Product Owner
- [ ] none expected; anything that cannot be captured becomes a HUMAN TASK in STATE.md
