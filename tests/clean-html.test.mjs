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
