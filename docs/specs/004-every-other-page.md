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

## Result — PR 1 (`feat/m3-articles`): 11 articles, 3 post lists, 404
Built: all 12 posts (`app/[slug]`, with Anterior + Următor), `/finantari-nerambursabile/`, `/category/blog/`,
`/author/dezvoltarev2/`, our 404 (`app/not-found.tsx`). `routes-pending.json` keeps the 9 PR 2 URLs.

How (beyond the Approach above):
- Cleaner (`lib/clean-html.ts`): drops `srcset`/`sizes` (13 pointed at the live server); emoji pasted as
  pictures — from Facebook's servers (17) or embedded `data:` images — become the emoji, then an icon; a
  "heading" holding `<br>` lines (the builder's subtitle, e.g. the whole VInnovate text sat in one `<h5>`)
  becomes a paragraph; builder `<span>`s are dropped before splitting lines, and any `<strong>/<em>/<a>`
  crossing a line break fails the build instead of producing broken HTML. 50 emoji → 31 SVG icons
  (`lib/icons.ts`, `EMOJI_ICONS`; added shirt and health for the VInnovate sector list). Stackable columns
  (`ghidul…` "Mit | Adevăr") → `grid-2`.
- Post lists: the live lists are now saved by `node scripts/export-wp.mjs --lists-only` into
  `content/site/list-*.html` — the archives' `/page/2/` posts appended, so all 12 are on one page — plus the
  live 404 into `content/site/404.html`; `lib/lists.ts` reads the lists at build (same posts, order,
  images, excerpts).
  One card: `components/PostCard.tsx`, now also used by the home funding section.
- One image missing from the M1 export was downloaded: `public/media/2026/10/bun-e1791350285289.jpg`
  (the newest post's card image, cropped on the live site after the export).
- Under I1 the sandbox only lets Node reach the network through its proxy: run `export-wp.mjs` with
  `NODE_USE_ENV_PROXY=1`. Not `compare`: there the flag also routes its localhost check through the proxy
  and it hangs; `compare` gives the browser the proxy itself (`HTTPS_PROXY`).

Checks:
- `check:text` now also covers the 3 lists and the 404 (from `content/site/`), strips emoji on both sides
  with the cleaner's own `stripEmoji`, removes the article sidebar on the live side with the cleaner's own
  `dropLeftovers` (posts only — the home funding section is the same post-grid block) and counts it
  (213 lines), and turns live "martie 3, 2025" into "3 martie 2025" as one rule (the PO's date decision;
  the two home date fixes it replaces were removed). Result: 19 sources, 382 blocks in order, 12 fixes, 9 cuts, 0 problems.
- Proven able to fail after the change: one emoji-list line deleted from the built `economia-circulara`
  → `missing: "Reducerea deșeurilor și a consumului de resurse"`, exit 1; restored → 0 problems.
- New unit tests (6): emoji lines → icon list, headings/list items with emoji, emoji pictures, unknown
  emoji throws, sidebar + srcset dropped, every exported post cleans without emoji/builder classes/
  srcset/Facebook/sidebar. Proven: 📌 removed from the table → 2 tests red; restored → green. After review:
  an image alone on a line of an emoji paragraph is kept (test red without the guard, green with it); 20/20.
- The approved pages are unchanged: newest article `<main>` byte-identical before/after; home identical
  apart from two invisible React `<!-- -->` markers (the excerpt and "…" are now one string).

Fixes and cuts added (for the PO's list): old number `0770 102 495` / `0770102495` → `+40 749 589 848`
on 4 articles; funding-list excerpts "viitorul.Apelul", "Nord-Est?Obține" get their missing space; dates in
Romanian order everywhere. Cut: the article sidebars (Categorii populare, Postări populare), archive
pagination "1 2 Next Page→" (all 12 posts on one page), the 404 search box and its sentence "You can
search the site below, or return to the front page." (the "Înapoi la prima pagină" button replaces it) —
both on `content/cuts.json` / `fixes.json` (page "404").
Known: the EduWebLab poster in `/877-2/` shows the old number inside the image (like the 2 home posters).

Spec review (`spec-reviewer`, PR 1): found that `/category/blog/` and `/author/dezvoltarev2/` showed only
10 of 12 posts (page 1 of the live archive saved; "BIZZ CLUB BT" and "O nouă provocare profesională!"
missing) while the cuts said "all 12 on one page", and that the 404 removals were not on the cuts list.
Both fixed as above; also the image-only-line guard. Checked sound by the reviewer: sidebar removal drops
only sidebar text on all 12 posts, every content image survives, cleaned HTML is balanced, `stripEmoji`
and the date rule cannot hide a dropped sentence, no out-of-scope changes.
PO after PR 1 (merged): did not answer the two "match live?" questions (funding list ~1430 px wide on live;
live article photos up to ~1270 px) → defaults kept (1200 px page width, photos at text width); open in STATE.

## Result — PR 2 (`feat/m3-pages`): services, contact, legal pages, calculator
Built: `/servicii/` + the 4 service pages, `/contact/`, `/politica-de-confidentialitate/`,
`/termeni-si-conditii/`, `/calculator-baterii/`. `routes-pending.json` is `[]`: all 25 known URLs + the 404.

PO decisions during the build (2026-10-07):
- "Creare website" has a packages section that is **invisible on live** (its scroll-in animation never
  fires; `check:text` found it, with prices). PO: **show it, prices included** ("Începând de la €400 / €800 /
  €1200", "Cere oferta"). The same never-firing animation hides "Ce servicii oferim?" on "Consultanță IT"; it
  is shown too (texts only, no prices).
- The two legal pages: **fix all diacritics**, no other word changes (31 entries in `content/fixes.json`,
  whole sentences so each can be read side by side; one real typo: "livarea" → "livrarea"; cedilla "ţ" → "ț").

How:
- Service pages, `/servicii/` and contact are TSX (like home), texts from `content/pages/*.json`; `check:text`
  proves every line is there in order. Shared pieces: `components/PageHead.tsx` (the one centred `<h1>`),
  `components/ServiceGrid.tsx` ("Servicii diversificate", identical on all 4 pages), the existing Card, Box,
  Button, IconList, Section. New CSS patterns: `.split` (photo + text), `.points`, `.grid-4`, `.step`
  (numbered / check cards), `.package`. Live coloured cards (purple, orange, cyan) → the one card / box style;
  red and purple buttons → the blue button (spec Assumptions).
- Live-only interactions dropped, content kept: the "Ce oferim:" slider on Digitalizare → one check-icon list;
  the 6 "Citește mai mult / Arată mai puțin" toggles on Consultanță fonduri → full text shown (12 cuts).
  The long sentence live renders as a second `<h1>` there is an `<h2>` (one `<h1>` per page).
- "GE S TIUNE": a stray link to eduweblab.ro inside the GESTIUNE heading is gone (text unchanged).
- Contact: phone icon link to the old number and the `mailto:contact@dezvolatredigitala.ro` typo are fixed
  (both use `lib/site.ts`); the form's 4 labels are cuts; "Deschide în Google Maps" opens the same search the
  live map embeds ("C&A Connect", zoom 15).
- Legal pages: the export through `lib/clean-html.ts` (`components/LegalPage.tsx`, `page()` in `lib/content.ts`).
- Calculator: `components/Calculator.tsx`, the live display script ported to React on `lib/calculator.ts`
  (same texts, messages, blur formatting, "Aplică", phone sticky bar, back link to the previous on-site page).
  New token `--c-error` (`#b42318`) for its red error states.

Checks:
- `check:text`: 28 sources, 639 blocks in order, 77 fixes, 25 cuts, 0 problems. Each page's fixes were added
  only after `check:text` named the exact live line, so every entry is used (stale entries fail the check).
- `check:routes`: 25 of 25 known URLs built, 0 pending (proven: with the 9 PR 2 URLs still pending it
  failed, "Remove from scripts/routes-pending.json").
- `check:width` now also runs the calculator on the built page: 15 / 25000 / 10000 shows "–" until all six
  conditions are ticked, then "57,5"; "Aplică" on the first tip → "87,5" (values from `lib/calculator.ts`).
  Proven: the six-conditions rule removed → `score shown before the six conditions are ticked`, exit 1;
  restored → 0 problems.

Spec review (`spec-reviewer`, PR 2): one real gap — a new CSS rule (`.box .btn`) also moved the approved
newest article's "Calculează-ți punctajul" button down 16 px. Scoped to `.stack-boxes .box .btn`; measured
after: newest article 0 px (as approved), new boxes 16 px. No check sees CSS-only changes to approved pages
(text checks compare text) — known debt in STATE. Checked sound by the reviewer: every legal fix only adds
diacritics (possessives "său / săi / sa" right), service-page Romanian, a reverse check (no unexpected extra
text), every live image and button target kept, no old phone number or `dezvolatre` anywhere (54 `tel:`,
28 `mailto:` correct), the calculator matches the live script branch by branch, one `<h1>` per page.
Noted for the PO: the stray eduweblab.ro link inside "GESTIUNE" (Consultanță IT) is gone; the street name
"Dobosari" is kept as on live (the approved footer has it too); the legal pages keep live's heading levels
(h1 → h5), which Lighthouse would flag if it were measured there.
