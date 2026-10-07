# Spec 005 — Polish

**Milestone:** M4 · **Status:** approved · **Date:** 2026-10-07

## Goal
Home and the newest article reach Lighthouse mobile Performance ≥ 90 and Accessibility ≥ 95 (PRODUCT.md
success criteria), guarded by a DoD check. The PO gets one readable list of every text change for a last read,
and every open question is written down with a recommendation. This closes the MVP.

## Not doing
- Lighthouse on other pages (the bar is home + newest article); SEO / Best-practices scores are not gated.
- The screenshot-diff guard for approved pages (STATE.md known debt) — later.
- Answering the open questions (hosting, form, domain, …) — they are listed, not acted on.

## Approach
- PO decision (2026-10-07): `lighthouse` as a dev dependency (free, Google, open source; never sent to visitors).
- `npm run check:lighthouse` (`scripts/check-lighthouse.mjs`): starts the built site like `check:width`
  (`next start`, its own port), runs Lighthouse's Node API with the mobile preset on `/` and
  `/finantare-sisteme-stocare-energie/` in Playwright's Chromium. Each page 3 runs, the median counts
  (scores wobble). Fails below Performance 90 / Accessibility 95 and names the failing audits.
  Added to `.claude/dod-commands`.
- Fix only what keeps those two pages below the bar, in them or the shared components they use. A fix that
  changes what a visitor sees beyond a small contrast shade is asked first.
- `npm run fixes:list` (`scripts/fixes-list.mjs`) writes `compare/fixes.html` (git-ignored): every
  `content/fixes.json` and `content/cuts.json` entry grouped by page, before → after with the changed letters
  highlighted, plus the rule-based changes (Romanian date order, emoji → icons, one phone number).
  STATE.md gets counts per page and the notable changes. (ROADMAP says "listed in STATE.md"; the full list
  — 77 fixes, 25 cuts, 31 of them whole legal sentences — lives in that page so STATE stays readable.)
- STATE.md "Open questions for the PO", each with a recommendation: production hosting, contact form service,
  domain switch date, ISO certificates' expiry (18.12.2024), possibly closed 2025 funding calls, odd slugs
  `/test-2/` `/test-3/` `/877-2/`, the two "match live?" widths, the old number inside 3 poster images, street
  name "Dobosari", header full-width on wide screens.
- Git: this spec is the first commit of `feat/m4-polish`; one PR the PO merges.

## Files and interfaces
| File / interface | New / changed | What |
|---|---|---|
| `package.json`, `package-lock.json` | changed | `lighthouse` devDependency; `check:lighthouse`, `fixes:list` |
| `scripts/check-lighthouse.mjs` | new | the Lighthouse gate |
| `scripts/fixes-list.mjs` | new | `compare/fixes.html` |
| `.claude/dod-commands` | changed | + `npm run check:lighthouse` |
| components / CSS / home | changed | only what the failing audits need |
| `docs/ROADMAP.md`, `docs/STATE.md` | changed | M4 done, open questions |

## Touches existing code
- Fixes for the audits touch approved pages (home, newest article): each is listed; visible ones asked first.
- DoD gets slower by the Lighthouse runs (target: the whole DoD stays under ~2 min).

## Test plan
| Case | Type | Expected |
|---|---|---|
| home, newest article on mobile preset | `check:lighthouse` | Perf ≥ 90, A11y ≥ 95 (median of 3) |
| a heavy unoptimised image added to home on purpose | `check:lighthouse` | red, naming the audit |
| every fixes / cuts entry | `fixes:list` | appears exactly once in `compare/fixes.html` |

## Definition of Done (commands)
```
npm run lint
npm run build
npm test
npm run check:routes
npm run check:links
npm run check:text
npm run check:width
npm run check:lighthouse
```

## Assumptions made
- Median of 3 runs is a fair reading; Lighthouse runs locally against `next start`, not the Vercel URL.
- The full fixes list lives in `compare/fixes.html`, STATE summarises.

## Risks
- Local scores can differ from PageSpeed on Vercel; the PO can cross-check on pagespeed.web.dev.

## Needs a decision from the Product Owner
- [x] Lighthouse as a dev dependency (2026-10-07)
