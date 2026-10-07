// Battery score calculator (AFM programme for prosumers) — logic ported unchanged from the live
// /calculator-baterii/ page (the block between `// LOGIC START` and `// LOGIC END` in
// content/pages/calculator-baterii.json). Only `var` → `const`/`let` and TypeScript types were added.
// tests/calculator.test.mjs runs the live script's own code side by side with this file.

// ===== CONFIG: toate regulile programului. Pentru o schimbare de ghid, modifici doar aici. =====
export const CONFIG = {
  minKwh: 10, // capacitate minimă eligibilă (kWh), art. 16
  maxProcent: 0.75, // finanțare AFM: max 75% din valoarea totală, art. 5
  maxSuma: 15000, // finanțare AFM: max 15.000 lei cu TVA, art. 5
  costStd: 1500, // standard de cost: lei / kWh, cu TVA, art. 5
  maxContrib: 50,
  maxBaterie: 50,
  kwhMaxPuncte: 20, // de la această capacitate se ia punctajul maxim la baterie
  procentMaxContrib: 0.625, // 30 * cp / (total - cp) = 50  =>  cp = 62,5% din total
  contribPoints: (cp: number, afm: number) => (30 * cp) / afm, // art. 19 alin. 4 lit. a
  bateriePoints: (kwh: number) => 2.5 * kwh, // art. 19 alin. 4 lit. b
};

export type Field = "kwh" | "vt" | "cp";
/** null = empty field, NaN = not a number. */
export type Num = number | null;
export type Tip = { text: string; apply?: number };
export type Result = {
  status: "ok" | "incomplet" | "neeligibil";
  /** '' = ok, 'req' = empty, otherwise the error message. */
  err: Record<Field, string>;
  warn: Partial<Record<Field, string>>;
  p1: number;
  p2: number;
  total: number;
  afm: number | null;
  own: number | null;
  ownPct: number | null;
  minCp: number | null;
  tips: Tip[];
};

export function clamp(v: number, max: number) {
  return Math.max(0, Math.min(max, v));
}
export function fmt(n: number) {
  return (Math.round(n * 10) / 10).toLocaleString("ro-RO");
}
export function lei(n: number) {
  return Math.round(n).toLocaleString("ro-RO") + " lei";
}
// Citește numere scrise românește: 25.000 / 25000 / 12,5 / 12.5
export function parseNum(str: string, bani: boolean): Num {
  let s = String(str).replace(/\s/g, "");
  if (s === "") return null;
  if (!/^[0-9.,]+$/.test(s)) return NaN;
  if (s.indexOf(",") !== -1) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (bani) {
    if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  }
  if ((s.match(/[.,]/g) || []).length > 1) return NaN;
  const v = parseFloat(s);
  return isNaN(v) ? NaN : v;
}
// Verifică un câmp: '' = ok, 'req' = gol, altfel mesajul de eroare
function check(v: Num) {
  if (v === null) return "req";
  if (isNaN(v)) return "Scrie doar cifre, de exemplu 25.000 sau 12,5.";
  if (!(v > 0)) return "Valoarea trebuie să fie mai mare decât 0.";
  return "";
}
export function calc(kwh: Num, vt: Num, cp: Num): Result {
  const r: Result = {
    status: "ok",
    err: { kwh: check(kwh), vt: check(vt), cp: check(cp) },
    warn: {},
    p1: 0,
    p2: 0,
    total: 0,
    afm: null,
    own: null,
    ownPct: null,
    minCp: null,
    tips: [],
  };
  if (cp === 0) r.err.cp = "";
  // After check(), a field without an error holds a real number; the casts below only tell TypeScript that.
  if (!r.err.kwh) {
    if ((kwh as number) < CONFIG.minKwh) {
      r.err.kwh = "Minimum " + CONFIG.minKwh + " kWh. Proiectul nu este eligibil.";
      r.status = "neeligibil";
    }
  }
  if (!r.err.kwh) {
    if (!r.err.vt) {
      r.minCp =
        (vt as number) - Math.min(CONFIG.maxProcent * (vt as number), CONFIG.maxSuma, (kwh as number) * CONFIG.costStd);
      if (!r.err.cp) {
        if ((cp as number) >= (vt as number)) {
          r.err.cp = "Trebuie să fie mai mică decât valoarea totală.";
          r.status = "neeligibil";
        } else if ((cp as number) < r.minCp - 0.5) {
          r.err.cp =
            "Minimum " +
            lei(r.minCp) +
            " pentru acest proiect: AFM plătește cel mult 75% din total și cel mult " +
            lei(CONFIG.maxSuma) +
            ".";
        }
      }
    }
  }
  if (r.status === "ok") {
    if (r.err.kwh || r.err.vt || r.err.cp) r.status = "incomplet";
  }
  if (r.status !== "ok") return r;
  const k = kwh as number;
  const v = vt as number;
  const c = cp as number;
  r.afm = v - c;
  r.own = c;
  r.ownPct = (c / v) * 100;
  r.p1 = clamp(CONFIG.contribPoints(c, r.afm), CONFIG.maxContrib);
  r.p2 = clamp(CONFIG.bateriePoints(k), CONFIG.maxBaterie);
  r.total = r.p1 + r.p2;
  if (r.p1 < CONFIG.maxContrib - 0.05) {
    const cpMax = Math.ceil(v * CONFIG.procentMaxContrib);
    r.tips.push({
      text:
        "Dacă plătești tu " +
        lei(cpMax) +
        " (AFM " +
        lei(v - cpMax) +
        "), iei punctajul maxim la contribuție: +" +
        fmt(CONFIG.maxContrib - r.p1) +
        " puncte. Primești mai puțini bani, dar ai șanse mai mari.",
      apply: cpMax,
    });
  }
  if (r.p2 < CONFIG.maxBaterie - 0.05) {
    r.tips.push({
      text:
        "Cu o baterie de " +
        CONFIG.kwhMaxPuncte +
        " kWh iei punctajul maxim la baterie: +" +
        fmt(CONFIG.maxBaterie - r.p2) +
        " puncte.",
    });
  }
  return r;
}
