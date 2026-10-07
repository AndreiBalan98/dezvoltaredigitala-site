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
Sources: **[G]** theme `jadro` global-styles CSS (`--wp--preset--*`) in the live HTML · **[C]** computed
styles at 1280 px, `reference/styles.json` (counts are summed over all 26 pages) · **[S]** screenshots.

| Token | Live value | Source |
|---|---|---|
| Accent (buttons, header CTA, links, "Servicii oferite" eyebrow, portfolio titles) | `#9164ff` | [G] `--primary`; [C] 101 texts, 69 backgrounds |
| Body text | `#434343` | [G] `--base`; [C] 405 texts |
| Headings | `#313131` (some pages `#000`) | [G] `--secondary`; [C] |
| Muted text (dates, card captions) | `#989bb1` | [C] 122 texts |
| Light section background | `#f3f6fb` | [G] `--tertiary`; [S] home services / about |
| Footer background | `#2f2f2f`, text white | [G] `--senary`; [C] 52 |
| Borders / input lines | `#cccccc`, `#e7e7e7` | [G] `--quinary`, `--quaternary` |
| Logo colours (image, not CSS) | blue + red on white | [S] |
| Body font | system stack (`-apple-system, …`) | [C] 1084 text nodes |
| Heading font | Inter 700 (Google Fonts) | [G] `font-family--inter`; [C] all h1–h4 |
| Body size | 15 px / 1.7 in content; 18 px / 1.7 in the home hero | [C] 198 + 9 paragraphs |
| Heading sizes at 1280 | h1 56.8 px (home) / 42.6 px (page titles) · h2 32 px · h3 24–28 px · card h 18 px | [C]; [G] clamp scale `xx-large`, `x-large`, `large`, `medium` |
| Spacing scale | 0.44 · 0.67 · 1 · 1.5 · 2.25 · 3.38 · 5.06 rem; page side padding 20 px | [G] `--spacing--20…80`, root padding |
| Button | accent bg, white text, 16 px, padding 15×30 px, pill radius 25 px (header CTA: 14 px / 600, 9×15 px) | [C] 28 + 26 buttons |
| Card | white, large radius (≈40 px on home services), soft grey shadow; bordered variant 1 px `#ccc` radius 5 px | [C] boxes; [S] |
| Footer | logo + slogan + CTA · Contact (email, phone, address with icons) · Companie links · ANPC / SOL badges | [S] |

## Inconsistencies, page by page *(filled by M0)*
This is the work list for M2–M3. "Width" = horizontal scroll measured on the live page (scrollWidth > viewport).

**Site-wide**
- Three accents: purple `#9164ff` (theme, every page), blue `#236581`/`#42adec` (newest article only),
  and odd button colours on one page each (`#7967ff`, `#444ce7`, `#ff6363`).
- Six font families: system stack, Inter, Red Hat Display (older articles + sidebar), Figtree, Poppins, Lato, Raleway.
- Five button shapes (radius 0 / 5 / 6 / 8 / 25 px) and three card styles (bordered 5 px, big-radius
  shadow cards, the newest article's 1 px `#e2e8ec` boxes).
- Two phone numbers: `+40 749 589 848` (contact, footer, newest article) and `0770 102 495`
  (877-2, economia-circulara, ghidul-incepatorului, start-up-nation-2025; also baked into one image).
- Footer address without diacritics: "Botosani, Strada Dobosari"; footer © year "2025".
- Floating Messenger button (`#0033ff`) and a page preloader on every page.

**Home `/`** — hero H1 hyphen-breaks "Transformă-/ți"; "Despre noi" text in two odd white blobs; the
"Finanțări nerambursabile" teaser shows two cropped poster images and cut-off excerpts; ISO certificate
section; portfolio cards titles in accent; client-logo carousel. Width: 830 px at 768 (overflows).
**Articles (11 older)** — page-builder blocks (Stackable + Essential Blocks); body in Red Hat Display,
unlike the rest; emoji used as icons (economia-circulara 33, apelul-regional-vinnovate-2025 23,
ghidul-incepatorului 12, investitii-… 10, o-regiune-… 8, start-up-nation-2025 7, test-2 6, 877-2 3,
ai-o-microintreprindere-… 1); sidebar "Categorii populare / Postări populare" on the left, with titles
breaking mid-word ("microîntreprinc…"); title "Economia Circulara" without diacritics.
Width: investitii-… 401 px at 375; 877-2 904 px at 768 and text under 14 px.
**Newest article `/finantare-sisteme-stocare-energie/`** — clean but in its own blue palette and font sizes; text under 14 px in one place.
**`/finantari-nerambursabile/`** — post list, no diacritic problems.
**`/servicii/` + 4 service pages** — each built with a different plugin set (Essential Blocks rows,
infoboxes, pricing); creare-website: purple-tint `#e9e0ff` boxes with "•" typed bullets, "Dezvoltare digitala"
without diacritics, "Cos de produse usor", "avansata", "vanzări"; digitalizare-…: Poppins headings,
text under 14 px at 768; consultanta-solutii-it-…: Lato, **1446 px wide at 768** (worst overflow);
consultanta-pentru-accesarea-…: Figtree 24 px paragraphs + Raleway.
**`/contact/`** — Spectra blocks with letter-spaced text; Google Maps embed; contact form (non-goal);
`mailto:contact@dezvolatredigitala.ro` typo (visible text is correct).
**`/calculator-baterii/`** — text under 14 px at 375 and 768.
**Legal pages** — plain text; termeni-si-conditii has one cedilla letter (ş/ţ) instead of comma (ș/ț).
**`/category/blog/`, `/author/dezvoltarev2/`** — archive lists of all posts (theme default), not in `content/`.
**404** — theme default "Nu am găsit pagina".

## Assumptions made
- `/category/blog/` and `/author/dezvoltarev2/` are live URLs found in the sitemap, so they are captured.
  Whether they are rebuilt in M3 follows PRODUCT.md ("+ whatever M0 finds") — default: yes, same URL.
- The 404 reference is `/pagina-care-nu-exista/`.

## Risks
- Scroll animations / preloader may leave parts blank in screenshots → mitigated by scrolling and hiding the preloader.

## Needs a decision from the Product Owner
- [x] Nothing failed to capture → no HUMAN TASK for M0.
- [x] (for M2) One accent colour → **PO, 2026-10-07: the newest article's colours, the same as the logo.**
      Palette: `#236581` main, `#42adec` second, `#e8f4fc` tint, `#e2e8ec` lines, `#56636c` muted text.
      Logo pixels (`public/media/2025/02/logo-1-300x116.png`): `≈#006080`, `≈#00a8e8`, red `≈#e83030`
      — the two blues match. Purple `#9164ff` is dropped everywhere.

## Result (2026-10-07)
`npm run capture` → `capture — 26 URLs × 3 widths: 78 screenshots in reference/.` (exit 0, 4 min 25 s).
Proven able to fail: `LIVE_SITE=https://dezvoltaredigitala.invalid npm run capture` →
`Error: ENOTFOUND for https://dezvoltaredigitala.invalid/wp-sitemap.xml`, exit 1.
First run showed the home services/about sections blank: the "Blocks Animation" plugin hides `.animated`
blocks until scrolled into view; the script now shows them in their final state (re-captured).
Screenshots are 45 MB → `reference/*.png` is git-ignored; `reference/styles.json` is committed.
Regenerate them with `npm run capture` (the file list is in STATE.md).
