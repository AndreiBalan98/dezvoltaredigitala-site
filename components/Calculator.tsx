"use client";

// The battery calculator (spec 004): the live /calculator-baterii/ page's display script, ported to React.
// The scoring itself is lib/calculator.ts, which tests/calculator.test.mjs checks against the live code.
// Same texts, fields, messages, "Aplică" tips and phone sticky bar as live; only the look is the site's.

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CONFIG, calc, clamp, fmt, lei, parseNum, type Field } from "@/lib/calculator";

const CONDITIONS = [
  "Am panouri fotovoltaice racordate la rețea și contract de prosumator.",
  "Am invertor hibrid sau îl montez pe banii mei, până la punerea în funcțiune a bateriei.",
  "Bateria e nouă, fără plumb, cu BMS, garanție de minimum 5 ani și minimum 5.000 de cicluri.",
  "Nu am datorii la bugetul de stat sau la cel local.",
  "La adresă nu se desfășoară activități economice (sau consumul lor e contorizat separat).",
  "Nu am beneficiat de finanțare din alte fonduri publice, naționale sau europene, pentru bateria de stocare.",
];

const FIELDS: { key: Field; label: string; unit: string; placeholder: string; hint: string }[] = [
  { key: "kwh", label: "Capacitatea bateriei", unit: "kWh", placeholder: "ex. 15", hint: "Minimum 10 kWh pentru a fi eligibil." },
  {
    key: "vt",
    label: "Valoarea totală",
    unit: "lei",
    placeholder: "ex. 25.000",
    hint: "Cu TVA: baterie, montaj și invertor hibrid, dacă e cazul.",
  },
  { key: "cp", label: "Contribuția proprie", unit: "lei", placeholder: "ex. 10.000", hint: "Cât plătești tu. Minimum 25% din total." },
];

const NAMES: Record<Field, string> = { kwh: "capacitatea bateriei", vt: "valoarea totală", cp: "contribuția proprie" };

export default function Calculator() {
  const [values, setValues] = useState<Record<Field, string>>({ kwh: "", vt: "", cp: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [typed, setTyped] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(CONDITIONS.map(() => false));
  const [resultVisible, setResultVisible] = useState(true);
  const result = useRef<HTMLDivElement>(null);

  const num = (k: Field) => parseNum(values[k], k !== "kwh");
  const r = calc(num("kwh"), num("vt"), num("cp"));
  const ticked = checked.filter(Boolean).length;
  const conditions = ticked === CONDITIONS.length;
  const ok = r.status === "ok" && conditions;

  // Phone sticky bar: only once something was typed and while the result is off screen.
  useEffect(() => {
    if (!result.current || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => setResultVisible(entries[0].isIntersecting));
    observer.observe(result.current);
    return () => observer.disconnect();
  }, []);

  // Back link: to the page the visitor came from, when it is on this site ("" while rendering on the server).
  const ref = useSyncExternalStore(
    () => () => {},
    () => (document.referrer.startsWith(location.origin) && document.referrer !== location.href ? document.referrer : ""),
    () => "",
  );
  const back = ref
    ? { href: ref, label: "← Înapoi" }
    : { href: "/finantari-nerambursabile/", label: "← Toate finanțările nerambursabile" };

  const setValue = (k: Field, v: string) => {
    setTyped(true);
    setValues((old) => ({ ...old, [k]: v }));
  };

  // On leaving a field: 25000 → 25.000, 12.5 → 12,5.
  const leave = (k: Field) => {
    setTouched((old) => ({ ...old, [k]: true }));
    const v = num(k);
    if (v === null || isNaN(v)) return;
    setValues((old) => ({ ...old, [k]: k === "kwh" ? String(v).replace(".", ",") : Math.round(v).toLocaleString("ro-RO") }));
  };

  let message: React.ReactNode = null;
  if (r.status === "incomplet") {
    const missing = FIELDS.filter((f) => r.err[f.key] === "req").map((f) => NAMES[f.key]);
    let text = missing.length
      ? "Completează " +
        (missing.length > 1 ? missing.slice(0, -1).join(", ") + " și " + missing[missing.length - 1] : missing[0]) +
        " pentru a vedea punctajul."
      : "Corectează valorile marcate cu roșu pentru a vedea punctajul.";
    if (r.minCp !== null && r.err.cp === "req") text += " Contribuția ta minimă pentru acest proiect: " + lei(r.minCp) + ".";
    message = <p className="calc__msg">{text}</p>;
  } else if (r.status === "neeligibil") {
    message = (
      <p className="calc__msg calc__msg--err">Cu aceste valori proiectul nu poate fi finanțat. Vezi câmpul marcat cu roșu.</p>
    );
  } else if (!conditions) {
    message = (
      <p className="calc__msg calc__msg--err">
        Bifează toate cele {CONDITIONS.length} condiții de bază (ai bifat {ticked}). Dacă una nu e îndeplinită, cererea nu e
        eligibilă și punctajul nu se calculează.
      </p>
    );
  } else if (r.tips.length) {
    message = (
      <div className="calc__msg calc__msg--tip">
        <strong>Cum poți crește punctajul</strong>
        <ul>
          {r.tips.map((tip) => (
            <li key={tip.text}>
              <span>{tip.text}</span>
              {tip.apply !== undefined && (
                <button type="button" className="calc__apply" onClick={() => setValue("cp", tip.apply!.toLocaleString("ro-RO"))}>
                  Aplică
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="calc">
      <Link className="calc__back" href={back.href}>
        {back.label}
      </Link>
      <p className="calc__intro">
        Estimează punctajul și finanțarea pentru programul AFM de baterii pentru prosumatori. Completează exact valorile din
        oferta instalatorului.
      </p>

      <fieldset className={`card calc__card${r.status === "ok" && !conditions ? " calc__card--bad" : ""}`}>
        <legend className="calc__step">
          <span>1</span>Condiții de bază
        </legend>
        <ul className="calc__checks">
          {CONDITIONS.map((text, i) => (
            <li key={text}>
              <label>
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={(e) => setChecked((old) => old.map((c, j) => (j === i ? e.target.checked : c)))}
                />
                {text}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      <div className="card calc__card">
        <p className="calc__step">
          <span>2</span>Datele proiectului
        </p>
        <div className="calc__fields">
          {FIELDS.map((f) => {
            const err = r.err[f.key];
            const shown = err === "req" ? !!touched[f.key] : !!err;
            const hint = err === "req" ? (touched[f.key] ? "Câmp obligatoriu." : f.hint) : err || r.warn[f.key] || f.hint;
            return (
              <div key={f.key} className="calc__field">
                <label htmlFor={`calc-${f.key}`}>{f.label}</label>
                <div className="calc__input">
                  <input
                    id={`calc-${f.key}`}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder={f.placeholder}
                    aria-describedby={`calc-${f.key}-h`}
                    aria-invalid={shown}
                    value={values[f.key]}
                    onChange={(e) => setValue(f.key, e.target.value)}
                    onBlur={() => leave(f.key)}
                  />
                  <span>{f.unit}</span>
                </div>
                <span id={`calc-${f.key}-h`} className={`calc__hint${shown ? " calc__hint--err" : ""}`}>
                  {hint}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card calc__card" ref={result}>
        <p className="calc__step">
          <span>3</span>Rezultat
        </p>
        <p className={`calc__total${ok ? "" : r.status === "neeligibil" ? " calc__total--bad" : " calc__total--empty"}`}>
          <strong>{ok ? fmt(r.total) : "–"}</strong>
          <span>{r.status === "neeligibil" ? "Neeligibil" : "/ 100 puncte"}</span>
        </p>
        <div className="calc__bar">
          <span style={{ width: `${ok ? clamp(r.total, 100) : 0}%` }} />
        </div>
        <p className="calc__context">
          Nu există un prag fix: cererile se finanțează în ordinea punctajului, până se termină bugetul. Cu cât punctajul e
          mai mare, cu atât șansele sunt mai bune.
        </p>
        <dl className="calc__rows">
          <dt>Punctaj contribuție</dt>
          <dd>
            {ok ? fmt(r.p1) : "–"} / {CONFIG.maxContrib}
          </dd>
          <dt>Punctaj baterie</dt>
          <dd>
            {ok ? fmt(r.p2) : "–"} / {CONFIG.maxBaterie}
          </dd>
          <dt className="calc__sep">Plătește AFM</dt>
          <dd className="calc__sep">{ok ? lei(r.afm!) : "–"}</dd>
          <dt>Plătești tu</dt>
          <dd>{ok ? `${lei(r.own!)} (${fmt(r.ownPct!)}%)` : "–"}</dd>
        </dl>
        <div aria-live="polite">{message}</div>
      </div>

      <p className="calc__note">
        Estimare orientativă, calculată după ghidul de finanțare AFM. Nu garantează obținerea finanțării. Punctajul se
        stabilește din ce declari la înscriere; dacă la final bateria sau contribuția proprie sunt mai mici decât ai declarat
        și punctajul ar scădea, AFM nu decontează finanțarea.
      </p>
      <p>
        <Link className="btn" href="/contact/">
          Vrei ajutor cu dosarul? Contactează-ne
        </Link>
      </p>

      <div className={`calc__sticky${typed && !resultVisible ? " calc__sticky--show" : ""}`} aria-hidden="true">
        <span>
          <strong>{ok ? fmt(r.total) : "–"}</strong> / 100 puncte
        </span>
        <button type="button" tabIndex={-1} onClick={() => result.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>
          Vezi rezultatul
        </button>
      </div>
    </div>
  );
}
