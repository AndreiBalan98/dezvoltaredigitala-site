import { test } from "node:test";
import assert from "node:assert/strict";
import { cleanHtml } from "../lib/clean-html.ts";

const mediaMap = {
  "https://dezvoltaredigitala.ro/wp-content/uploads/2025/02/a-300x200.jpg": "/media/2025/02/a-300x200.jpg",
};
const clean = (html, fixes = []) => cleanHtml(html, { mediaMap, fixes });

test("removes <style>, <script> and comments", () => {
  const out = clean('<style>.x{}</style><!-- wp:paragraph --><p>Text</p><script>alert(1)</script>');
  assert.equal(out, "<p>Text</p>");
});

test("live image URL → local /media path (map first, then the uploads folder)", () => {
  assert.equal(
    clean('<img src="https://dezvoltaredigitala.ro/wp-content/uploads/2025/02/a-300x200.jpg">'),
    '<img src="/media/2025/02/a-300x200.jpg">',
  );
  assert.equal(
    clean('<img src="https://dezvoltaredigitala.ro/wp-content/uploads/2025/03/b.png">'),
    '<img src="/media/2025/03/b.png">',
  );
});

test("live page link → relative path; external links untouched", () => {
  assert.equal(clean('<a href="https://dezvoltaredigitala.ro/contact/">C</a>'), '<a href="/contact/">C</a>');
  assert.equal(clean('<a href="https://dezvoltaredigitala.ro">H</a>'), '<a href="/">H</a>');
  assert.equal(clean('<a href="https://anpc.ro/">A</a>'), '<a href="https://anpc.ro/">A</a>');
});

test("builder classes → shared classes; unknown classes dropped", () => {
  assert.equal(clean('<p class="dd-fact wp-block-paragraph">F</p>'), '<p class="card card--fact">F</p>');
  assert.equal(clean('<h2 class="wp-block-heading">T</h2>'), "<h2>T</h2>");
  assert.equal(clean('<div class="wp-block-group dd-calc is-layout-flow">B</div>'), '<div class="box">B</div>');
});

test("icon blocks get an SVG badge before their content", () => {
  const out = clean('<p class="dd-ico dd-who wp-block-paragraph">Solicitantul</p>');
  assert.match(out, /^<p class="icon-item"><span class="icon-badge"><svg class="icon"[^>]*>.*<\/svg><\/span><span>Solicitantul<\/span><\/p>$/);
});

test("fixes replace text", () => {
  const fixes = [{ page: "/x/", from: "utilizand", to: "utilizând", why: "diacritic" }];
  assert.equal(clean("<p>utilizand roboți</p>", fixes), "<p>utilizând roboți</p>");
});

// Spec 004 — the older articles.
const ICON = '<span class="icon-badge"><svg class="icon"[^>]*>.*?</svg></span>';

test("emoji lines of a <br> paragraph → paragraphs + icon list; mid-line emoji removed", () => {
  const out = clean("<p>📍 <strong>Eligibilitate:</strong><br>✅ IMM<br>📌 Bacău | 📌 Iași<br><br>Text simplu<br>a doua linie</p>");
  assert.match(
    out,
    new RegExp(
      `^<ul class="icon-list"><li>${ICON}<span><strong>Eligibilitate:</strong></span></li>` +
        `<li>${ICON}<span>IMM</span></li><li>${ICON}<span>Bacău \\| Iași</span></li></ul>\\n` +
        "<p>Text simplu<br>a doua linie</p>$",
    ),
  );
});

test("a heading holding <br> lines is body text; a list item or heading starting with an emoji gets an icon", () => {
  assert.equal(clean("<h5>Unu<br>Doi</h5>"), "<p>Unu<br>Doi</p>");
  assert.match(clean("<ul><li>👤 <strong>Persoane</strong> fizice</li></ul>"), new RegExp(`^<ul class="icon-list"><li>${ICON}<span><strong>Persoane</strong> fizice</span></li></ul>$`));
  assert.match(clean("<h2>❌ Mit</h2>"), new RegExp(`^<h2 class="icon-item">${ICON}<span>Mit</span></h2>$`));
});

test("emoji pictures (Facebook or data: images) become icons; © and ™ stay text", () => {
  const out = clean('<p><img src="https://static.xx.fbcdn.net/images/emoji.php/v9/t33/1/16/2705.png" alt="✅"> Speța</p>');
  assert.match(out, new RegExp(`^<ul class="icon-list"><li>${ICON}<span>Speța</span></li></ul>$`));
  assert.equal(clean("<p>© 2025 Firma™</p>"), "<p>© 2025 Firma™</p>");
});

test("an emoji with no icon fails loudly instead of disappearing", () => {
  assert.throws(() => clean("<p>🦄 Unicorn</p>"), /No icon for emoji 🦄/);
});

test("the sidebar blocks and srcset are dropped; the article text stays", () => {
  const out = clean(
    '<div class="col"><p>Articol</p><img src="https://dezvoltaredigitala.ro/wp-content/uploads/2025/03/b.png" srcset="https://dezvoltaredigitala.ro/x.png 300w" sizes="100vw"></div>' +
      '<div class="wp-block-essential-blocks-advanced-heading neobot_categorytitle"><h5>Categorii populare</h5></div>' +
      '<div class="wp-block-essential-blocks-feature-list"><ul><li><a href="https://dezvoltaredigitala.ro/finantari-nerambursabile/">Blog</a></li></ul></div>' +
      '<div class="root-eb-post-grid-7w6po wp-block-essential-blocks-post-grid"><div><h2>Postări populare</h2></div></div>',
  );
  assert.equal(out, '<div><p>Articol</p><img src="/media/2025/03/b.png"></div>');
});

test("every exported post cleans without error, emoji or builder leftovers", async () => {
  const { readdirSync, readFileSync } = await import("node:fs");
  const dir = new URL("../content/posts/", import.meta.url);
  for (const file of readdirSync(dir)) {
    const out = clean(JSON.parse(readFileSync(new URL(file, dir), "utf8")).html);
    assert.doesNotMatch(out, /\p{Extended_Pictographic}/u, `${file}: emoji left`);
    assert.doesNotMatch(out, /class="[^"]*\b(?:eb|ebpg|stk|wp-block|uagb)-/, `${file}: builder class left`);
    assert.doesNotMatch(out, /srcset|fbcdn|Postări populare/, `${file}: live srcset, Facebook image or sidebar left`);
  }
});
