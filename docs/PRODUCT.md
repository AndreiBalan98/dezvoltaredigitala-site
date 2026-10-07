# PRODUCT

> Pre-filled from the 7 Oct 2026 planning chat. Changes need the Product Owner.
> This is a **faithful rebuild**, not a redesign. Yesterday's repo (`dezvoltaredigitala-next`, six new
> designs) is a different product: only its export, checks and calculator logic are reused.

## Operating settings
| Setting | Value |
|---|---|
| **Involvement level** | I0 until the PO approves the look (M2), then I1 |
| **Maturity level** | L1 |
| Budget ceiling / month | 0 (Vercel Hobby for previews; production hosting is a PO decision later) |
| Deadline | none |
| Who else touches this code | nobody |
| **Repository visibility** | private |

## Riskiest assumption
*We can rebuild every page so it is recognisably the same site, while making it consistent.*
Settled in M0 (content is already exportable — proven on 6 Oct): reference screenshots of every live
page at 375, 768 and 1280 px, plus the live theme's real colours, fonts and spacing, captured by Claude.
If a page cannot be captured or its look cannot be read from the HTML/CSS, the PO gets a HUMAN TASK
(copy from wp-admin or cPanel) — Claude fetches everything else itself.

## Problem
dezvoltaredigitala.ro (C&A Connect S.R.L., Botoșani — EU-funding consultancy, websites,
digitalisation) looks assembled from pieces: every article has a different style (three page
builders), there are broken emoji, typos, two phone numbers, and some layouts break on phones.

## Users
Business owners in Romania (mostly Nord-Est) looking for non-refundable funding or a website/digital
service; they arrive from Google or Facebook, often on a phone.

## Core loop
Land on an article or service page → understand quickly if it applies to them → call or write.

## The faithfulness rule (the bar for every page)
**Keep:** the same pages and URLs, sections in the same order, the same texts, the same images (hero
photo, service icons, building photo, ISO certificates, portfolio, client logos), the same menu and
footer, the live site's colours.
**Change only:**
- one font pair, one spacing scale, one card/box style, one heading style — on every page
- broken or emoji "icons" → real SVG icons in the site's colour
- typos and diacritics fixed (every change listed for the PO)
- one phone number everywhere: **+40 749 589 848**; the contact `mailto` typo fixed
- layouts that work at phone, tablet and desktop width (no horizontal scroll, readable text, tappable buttons)
- page-builder leftovers removed (empty blocks, duplicated "Postări populare" sidebars)
Anything else that would change what a visitor sees → ask the PO first.

## MVP scope
- every URL of the live site (23: home, funding list, 12 articles, `/servicii/` + 4 service pages,
  contact, 2 legal pages, calculator, + whatever M0 finds) with the same address
- the battery calculator, same results as the live one
- a 404 page in the same style

## Non-goals
- a new design, new sections or new copy
- contact form, the "Eligibilitate preliminară" application form, CMS, backend, database (later)
- domain switch (later, PO decision)

## Success criteria
- the PO looks at each page next to its old screenshot and says "same site, but clean"
- every page passes at 375 / 768 / 1280 px with no horizontal scroll
- no old URL missing, no broken internal link, no old sentence dropped without being on the cuts list
- Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95 on home and the newest article

## Technical decisions
| Area | Decision | Why |
|---|---|---|
| Delivery target | static website | |
| Stack | Next.js (App Router, TypeScript), plain CSS with tokens | yesterday's setup worked |
| Data & storage | content exported once into `content/` and `public/media/` | the new site never calls the old server |
| Auth | none | |
| External services | none | |
| Hosting | Vercel Hobby (previews), `vercel.json` with `"framework": "nextjs"` | the import without it served only `public/` |
| Screenshots | Playwright as a dev dependency (approved with this plan) | reference + comparison at 3 widths |
| Architecture | monolith | default |

## Reused from `dezvoltaredigitala-next` (copied in M1, not its design)
`scripts/export-wp.mjs`, `scripts/check-routes.mjs`, `scripts/check-links.mjs`, the exported
`content/` and `public/media/`, the calculator logic and its 5 fixed-input tests.

## Constraints
- Do not run `npm run dev` in a Claude session (Next 16 writes into CLAUDE.md / creates AGENTS.md).
  Use `npm run build && npx next start`.
- The site is the PO's own company site; content is his.

## Open questions
- OPEN QUESTION: ISO certificates say "data expirării 18.12.2024" — still valid? (default: shown as is)
- OPEN QUESTION: 2025 funding calls may be closed (default: kept, with their date)
- OPEN QUESTION: `/test-2/`, `/test-3/`, `/877-2/` are real posts with odd slugs (default: same URLs)
- OPEN QUESTION (later): production hosting, contact form service, domain switch date