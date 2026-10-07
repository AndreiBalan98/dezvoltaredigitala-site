# Spec 002 — Setup

**Milestone:** M1 · **Status:** approved · **Date:** 2026-10-07
Approval: the PO approved the plan (PRODUCT.md + ROADMAP.md) and said "Run M0 and M1" on 2026-10-07.

## Goal
An empty Next.js site (one placeholder page, no design) with the reused export, content, media,
calculator logic and checks, a DoD that is proven able to fail, and `npm run compare` that puts old and
new screenshots side by side. Then the PO imports the repo on Vercel and the preview URL works.

## Not doing
- No design, no components, no page rebuilt (M2+). Nothing visual is copied from `dezvoltaredigitala-next`.
- No `proxy.ts`, `lib/design*`, `lib/content.ts`, `lib/posts.ts`, `components/`, `app/` of the old repo.
- Not the old repo's other tests (`content`, `leftovers`, `pages-text`, `styles`) — they test its designs.

## Approach
- `create-next-app`-equivalent files written by hand, matching the old repo's working config:
  Next 16.3.8, React 19.2.8, TypeScript, ESLint (`eslint-config-next`), `trailingSlash: true`,
  `vercel.json` with `"framework": "nextjs"`. Same versions → no new dependency decision.
- Copied as-is from `../dezvoltaredigitala-next` (PRODUCT.md list): `scripts/export-wp.mjs`,
  `scripts/check-routes.mjs`, `scripts/check-links.mjs`, `content/`, `public/media/`,
  `lib/calculator.ts`, `tests/calculator.test.mjs`.
- `npm test` = `node --test` (Node 22 strips TypeScript types, as in the old repo).
- `check:routes` will be **red** until M3 builds every URL. So in M1 it runs with an allow-list of
  "not built yet" URLs (`scripts/routes-pending.json`), which shrinks to `[]` by the end of M3.
  A pending URL that *is* built also fails, so the list cannot go stale.
- `npm run compare` (`scripts/compare.mjs`): builds and starts the site, screenshots every URL at the 3
  widths into `compare/new/`, and writes `compare/index.html` with old | new per page and width.
  Pages not built yet show "not built yet". `compare/` is git-ignored (rebuilt on demand).

## Files and interfaces
| File / interface | New / changed | What |
|---|---|---|
| `package.json` | changed | next, react, react-dom, TS, ESLint; scripts lint/build/start/test/check:*/compare/capture/export:wp |
| `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vercel.json`, `next-env.d.ts` | new | config |
| `app/layout.tsx`, `app/page.tsx` | new | placeholder home (title + "în lucru"), `lang="ro"` |
| `scripts/export-wp.mjs`, `check-routes.mjs`, `check-links.mjs` | copied | `check-routes` gains the pending list |
| `scripts/routes-pending.json` | new | URLs not built yet |
| `scripts/compare.mjs` | new | `compare/index.html` |
| `content/`, `public/media/`, `lib/calculator.ts`, `tests/calculator.test.mjs` | copied | unchanged |
| `.claude/dod-commands` | changed | the 5 commands below |
| `.gitignore` | changed | `compare/`, `next-env.d.ts`, `*.tsbuildinfo` |

## Touches existing code
`package.json` from M0 gains dependencies; `scripts/capture.mjs` unchanged.

## Test plan
| Case | Type | Expected |
|---|---|---|
| each DoD command on the clean setup | integration | exit 0 |
| lint: an unused variable in `app/page.tsx` | proof of failure | `npm run lint` exits 1 |
| build: a type error | proof of failure | `npm run build` exits 1 |
| test: change a calculator constant | proof of failure | `npm test` exits 1 |
| routes: remove `/contact/` from the pending list | proof of failure | `check:routes` exits 1 naming `/contact/` |
| links: a link to `/nu-exista/` on the placeholder | proof of failure | `check:links` exits 1 naming it |
| compare | integration | `compare/index.html` exists, lists every URL × 3 widths |

## Definition of Done (commands)
```
npm run lint
npm run build
npm test
npm run check:routes
npm run check:links
```
End-to-end check: the PO opens the Vercel preview URL and sees the placeholder home page.

## Assumptions made
- Same package versions as the old repo (known to build on Vercel).
- `check:routes` uses an allow-list of pending URLs rather than being left out of the DoD until M3.

## Risks
- `public/media/` is 25 MB in git — acceptable (old repo did the same); cleanup is in ROADMAP "Later".

## Needs a decision from the Product Owner
- [ ] HUMAN TASK: import the repo on vercel.com (steps in STATE.md)

## Result (2026-10-07)
Copies verified identical: `diff -rq ../dezvoltaredigitala-next/content content` and `… public/media` → no output.
Clean setup, all exit 0: `lint` · `build` (routes `/`, `/_not-found`) · `test` (pass 7, fail 0) ·
`check:routes — 1 of 23 exported URLs built, 22 pending.` · `check:links — 14 internal links on 2 pages, 0 broken.`
The Stop hook (`.claude/hooks/dod-check.sh`) runs all five in 10 s, exit 0.

Proven able to fail (each broken on purpose, then restored):
| Check | Broken how | Output | Exit |
|---|---|---|---|
| lint | `const unused = 1;` in `app/page.tsx` | `ESLint found too many warnings (maximum: 0).` | 1 |
| build | `Math.round("x")` in `app/page.tsx` | `error TS2345: Argument of type 'string' is not assignable…` | 1 |
| test | `maxSuma: 16000` in `lib/calculator.ts` | `not ok 7 - ported logic gives the same result as the live script…` | 1 |
| routes | `/contact/` removed from pending | `Missing: /contact/` | 1 |
| routes | `/` added to pending while built | `Remove from scripts/routes-pending.json: /` | 1 |
| links | `<a href="/nu-exista/">` on home | `Broken: /  →  /nu-exista/` | 1 |

Deviation: the first lint proof exited **0** — ESLint reports unused variables as warnings. `lint` is now
`eslint --max-warnings 0`, so any warning fails the DoD.
`npm run compare` → `compare — 26 URLs × 3 widths, 2 built.` (51 s); `compare/index.html` has 26 sections,
72 "not built yet" cells (24 pages × 3), the test server on port 3210 is stopped afterwards.
