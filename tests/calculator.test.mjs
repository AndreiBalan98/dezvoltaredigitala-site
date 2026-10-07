import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { calc, fmt, lei, parseNum } from "../lib/calculator.ts";

// The live calculator's own code, taken from the WordPress export: CONFIG + the LOGIC block.
function liveLogic() {
  const html = JSON.parse(readFileSync(new URL("../content/pages/calculator-baterii.json", import.meta.url), "utf8")).html;
  const start = html.indexOf("var CONFIG = {");
  const end = html.indexOf("// LOGIC END");
  assert.ok(start > 0 && end > start, "could not find the logic block in the exported calculator page");
  return new Function(html.slice(start, end) + "\nreturn { calc, parseNum, fmt, lei };")();
}

// Spec 003 — five fixed inputs (kWh, total, own contribution).
test("15 kWh, 25.000 lei, own 10.000 lei → 57,5 points", () => {
  const r = calc(15, 25000, 10000);
  assert.equal(r.status, "ok");
  assert.equal(r.p1, 20);
  assert.equal(r.p2, 37.5);
  assert.equal(fmt(r.total), "57,5");
  assert.equal(lei(r.afm), "15.000 lei");
  assert.equal(lei(r.own), "10.000 lei");
  assert.equal(r.ownPct, 40);
});

test("20 kWh, 30.000 lei, own 18.750 lei → 100 points, no tips", () => {
  const r = calc(20, 30000, 18750);
  assert.equal(r.status, "ok");
  assert.equal(r.total, 100);
  assert.equal(lei(r.afm), "11.250 lei");
  assert.deepEqual(r.tips, []);
});

test("10 kWh, 15.000 lei, own 5.000 lei → 40 points and two tips", () => {
  const r = calc(10, 15000, 5000);
  assert.equal(r.status, "ok");
  assert.equal(r.p1, 15);
  assert.equal(r.p2, 25);
  assert.equal(r.total, 40);
  assert.equal(lei(r.afm), "10.000 lei");
  assert.equal(r.tips.length, 2);
  assert.equal(r.tips[0].apply, 9375);
  assert.match(r.tips[0].text, /9\.375 lei.*\+35 puncte/);
  assert.match(r.tips[1].text, /20 kWh.*\+25 puncte/);
});

test("12,5 kWh, 20.000 lei, own 4.000 lei → own contribution too low (minimum 5.000 lei)", () => {
  const r = calc(12.5, 20000, 4000);
  assert.equal(r.status, "incomplet");
  assert.equal(r.minCp, 5000);
  assert.match(r.err.cp, /^Minimum 5\.000 lei pentru acest proiect/);
});

test("8 kWh → not eligible", () => {
  const r = calc(8, 20000, 5000);
  assert.equal(r.status, "neeligibil");
  assert.match(r.err.kwh, /Minimum 10 kWh/);
});

test("Romanian number parsing", () => {
  assert.equal(parseNum("25.000", true), 25000);
  assert.equal(parseNum("25000", true), 25000);
  assert.equal(parseNum("12,5", false), 12.5);
  assert.equal(parseNum("12.5", false), 12.5);
  assert.equal(parseNum("", true), null);
  assert.ok(Number.isNaN(parseNum("abc", true)));
});

test("ported logic gives the same result as the live script on every input combination", () => {
  const live = liveLogic();
  const kwhs = [null, NaN, 0, 5, 9.9, 10, 12.5, 15, 20, 25];
  const totals = [null, NaN, 0, 10000, 15000, 25000, 40000];
  const owns = [null, NaN, 0, 3000, 5000, 9375, 10000, 15625, 25000, 50000];
  let n = 0;
  for (const k of kwhs)
    for (const v of totals)
      for (const c of owns) {
        assert.deepStrictEqual(calc(k, v, c), live.calc(k, v, c), `different result for kwh=${k}, total=${v}, own=${c}`);
        n++;
      }
  for (const s of ["25.000", "25000", "1.234.567", "12,5", "12.5", "1.5", "1,234.5", " 7 500 ", "", "abc", "-5"]) {
    for (const bani of [true, false]) assert.deepStrictEqual(parseNum(s, bani), live.parseNum(s, bani), `parseNum("${s}", ${bani})`);
  }
  assert.equal(n, 700);
});
