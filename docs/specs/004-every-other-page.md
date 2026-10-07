# Spec 004 — Every other page

**Milestone:** M3 · **Status:** approved · **Date:** 2026-10-07

## Goal
Every remaining live URL (22 of the 26 captured) opens on the new site at the same address, with the same texts,
images and section order, built only from M2's components, in the same clean style as the approved home
and newest article. Delivered in two PRs the PO looks at and merges.

## Not doing
- Forms: the article comment form, the contact form, the 404 search box (non-goals: no backend).
- The embedded Google Map on `/contact/` (PO decision: a link button instead).
- New copy or new images. The only new section is the `/servicii/` card list (PO decision).
- Lighthouse tuning (M4). Header full-width on wide screens (not asked; offered to the PO in M2).

## What the visitor sees
| Page(s) | Live | New |
|---|---|---|
| 11 older articles (9 share one Essential Blocks template; `ghidul-…` uses Stackable) | big image, then one long emoji paragraph; left sidebar; Anterior / Următor; comment form | image, text as paragraphs + icon lists (emoji → SVG icons), Anterior / Următor. Sidebar and comment form removed |
| `/finantari-nerambursabile/`, `/category/blog/`, `/author/dezvoltarev2/` | grid of post cards: date, title, image, excerpt, "Citește mai mult" | one `PostCard` grid, same posts in the same order as each live page |
| 4 service pages | photos + text, "Ce oferim?" tinted cards, numbered orange cards, "Servicii diversificate" icon cards, red/purple buttons | same sections in TSX (like home): one card style, blue buttons |
| `/servicii/` | empty (title only) | title + 4 service cards linking to the 4 service pages (**PO decision**) |
| `/contact/` | address, phone, hours, e-mail, Google Map, form | same details as an icon list + "Deschide în Google Maps" button (**PO decision**); form removed |
| 2 legal pages | plain text | `.prose` through the cleaner |
| `/calculator-baterii/` | own green style | same fields and results in the site style; client component on `lib/calculator.ts` |
| 404 | "404 / Oops! Page not found", search box | same text + "Înapoi la prima pagină" button; no search |

Removed, each on `content/cuts.json` (listed for the PO): article sidebars ("Categorii populare",
"Postări populare"), comment and contact forms, the 404 search box, the map embed.

## Approach
- **Articles** keep going through `lib/clean-html.ts` (string-based, no new dependency), extended with:
  Essential Blocks / Stackable / Spectra classes in `CLASS_MAP`; sidebar blocks dropped; a `<br>`-separated
  paragraph split into lines, where lines starting with an emoji become an icon list. Emoji→icon table in
  `lib/icons.ts` (✅ check, 📍📌 map-pin, 📧 mail, 📞 phone, 💡 idea, …), new SVGs in the stroke style of
  `components/Icon.tsx`. Emoji in the middle of a line ("📌 Bacău | 📌 Botoșani") are removed. Old number
  `0770 102 495` → `+40 749 589 848` via `content/fixes.json`. If the cleaner gets unworkable: stop and ask
  about an HTML-parser dependency.
- `app/[slug]/page.tsx` builds every post; the nav shows Anterior and Următor like live.
- Service pages, `/servicii/` and contact are TSX from the components, texts copied from the export
  (as home in spec 003); `check:text` proves nothing was dropped.
- **Calculator:** client component on `lib/calculator.ts`, which the existing tests already compare to the live code.
- **`compare`** adds a laptop-screen row per page: the first screen at 1536×864, live vs new, fresh from
  the live site. (M2 lesson: the hero took three rounds because only full-page shots at 1280 were compared.)
- **Git (I1):** `docs/m3-spec` (M2 closed, I1 settings, this spec) → PR merged first; then
  `feat/m3-articles` (PR 1: articles, lists, 404) and `feat/m3-pages` (PR 2: services, contact, legal,
  calculator), each with DoD output, `spec-reviewer` and `compare/`.

## Files and interfaces
| File / interface | New / changed | What |
|---|---|---|
| `lib/clean-html.ts`, `lib/icons.ts`, `components/Icon.tsx` | changed | builder classes, sidebar drop, emoji lines → icon list, new icons |
| `app/[slug]/page.tsx` | changed | all posts; Anterior + Următor |
| `components/PostCard.tsx`, `PostGrid.tsx`, `ArticleNav.tsx`, `Calculator.tsx` | new | repeated patterns only |
| `app/finantari-nerambursabile/`, `app/category/blog/`, `app/author/dezvoltarev2/` | new | post lists |
| `app/servicii/` + 4 sub-pages, `app/contact/`, `app/politica-de-confidentialitate/`, `app/termeni-si-conditii/`, `app/calculator-baterii/`, `app/not-found.tsx` | new | pages |
| `content/fixes.json`, `content/cuts.json` | changed | fixes and cuts per page |
| `scripts/routes-pending.json` | changed | ends empty |
| `scripts/check-text.mjs` | changed | emoji are not text (stripped both sides) |
| `scripts/compare.mjs` | changed | laptop-screen row (1536×864) |
| `tests/` | changed | emoji-table coverage test; cleaner tests for the new blocks |

## Touches existing code
- `lib/clean-html.ts` also renders the approved newest article: its output must stay the same (existing tests + `check:text`).
- `app/globals.css`: new rules only for new blocks; the existing components are reused, not restyled.
- `check:text` change could hide a dropped sentence: proven able to fail after the change.

## Test plan
| Case | Type | Expected |
|---|---|---|
| every live URL is built | `check:routes` | 26 known, 0 pending, 0 missing |
| no sentence dropped / out of order | `check:text` | all pages, only listed cuts |
| emoji with no icon | unit | test fails naming the emoji |
| older article HTML → shared classes | unit | no builder class left; icon list for emoji lines |
| calculator 15 kWh / 25.000 / 10.000 | unit (existing) + e2e on built page | "57,5" puncte |
| no horizontal scroll | `check:width` | every page at 375 / 768 / 1280 |
| old phone number anywhere | `check:text` | fails if present |

## Definition of Done (commands)
```
npm run lint
npm run build
npm test
npm run check:routes
npm run check:links
npm run check:text
npm run check:width
```
End-to-end check that proves the feature works: `npm run compare`, every page reviewed at 375 / 768 / 1280
and the 1536 laptop screen before the PO is asked; PO look-check per PR.

## Assumptions made
- Article sidebar removed entirely (its content: the "Blog" link and duplicated recent posts).
- 404 text stays English, as on live ("Oops! Page not found…").
- Coloured cards (purple, orange) all become the one card style; red and green buttons become the blue button.
- `/test-2/`, `/test-3/`, `/877-2/` keep their URLs (PRODUCT open question default).

## Risks
- Emoji paragraphs vary between articles: the line splitter may need per-article fixes (kept as data).
- Service pages are long; copying text by hand risks drops — `check:text` catches them.

## Needs a decision from the Product Owner
- [x] `/servicii/` content → 4 service cards (2026-10-07)
- [x] contact map → link button, no embed (2026-10-07)
