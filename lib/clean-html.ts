// Exported WordPress HTML → clean HTML that uses only the shared component classes (spec 003).
// String-based on purpose (no parser dependency): the exported markup is regular block output.
// M3 extends CLASS_MAP / ICON_CLASSES for the older articles.

import { iconSvg, type IconName } from "./icons.ts";

export type Fix = { page: string; from: string; to: string; why: string };

const LIVE = "https://dezvoltaredigitala.ro";

// Builder class → shared class. Any class not listed here is dropped.
const CLASS_MAP: Record<string, string> = {
  "dd-lead": "lead",
  "dd-facts": "grid-2",
  "dd-fact": "card card--fact",
  "dd-calc": "box",
  "dd-dash": "list-dash",
  "wp-block-buttons": "actions",
  "wp-block-button__link": "btn",
  "dd-score": "score",
  "dd-crit": "score__item",
  "dd-crit-a": "score__item--a",
  "dd-crit-b": "score__item--b",
  "dd-note": "note",
  "dd-cond": "stack",
  "dd-ico": "icon-item",
  "dd-help": "card card--help",
  "dd-org": "org",
  "dd-tel": "icon-item icon-item--inline",
  "dd-mail": "icon-item icon-item--inline",
  "dd-fine": "fine",
};

// Blocks that get an icon badge in front of their content.
const ICON_CLASSES: Record<string, IconName> = {
  "dd-who": "user",
  "dd-sys": "shield",
  "dd-tel": "phone",
  "dd-mail": "mail",
};

function addIcons(html: string): string {
  return html.replace(/<p class="([^"]*)">([\s\S]*?)<\/p>/g, (whole, classes: string, inner: string) => {
    const icon = classes.split(/\s+/).map((c) => ICON_CLASSES[c]).find(Boolean);
    if (!icon) return whole;
    return `<p class="${classes}"><span class="icon-badge">${iconSvg(icon)}</span><span>${inner}</span></p>`;
  });
}

// Shared classes (including the icon badge added above) are kept as they are.
const SHARED = new Set([...Object.values(CLASS_MAP).flatMap((c) => c.split(" ")), "icon-badge", "icon"]);

function mapClasses(html: string): string {
  return html.replace(/\sclass="([^"]*)"/g, (_, classes: string) => {
    const mapped = [
      ...new Set(classes.split(/\s+/).flatMap((c) => (SHARED.has(c) ? c : (CLASS_MAP[c] ?? "")).split(" ")).filter(Boolean)),
    ];
    return mapped.length ? ` class="${mapped.join(" ")}"` : "";
  });
}

function localUrls(html: string, mediaMap: Record<string, string>): string {
  return html.replace(/(href|src)="(https:\/\/dezvoltaredigitala\.ro[^"]*)"/g, (_, attr: string, url: string) => {
    const local = mediaMap[url] ?? (url.includes("/wp-content/uploads/") ? url.replace(`${LIVE}/wp-content/uploads`, "/media") : url.slice(LIVE.length) || "/");
    return `${attr}="${local}"`;
  });
}

export function applyFixes(text: string, fixes: Fix[]): string {
  return fixes.reduce((t, f) => t.replaceAll(f.from, f.to), text);
}

export function cleanHtml(html: string, { mediaMap, fixes }: { mediaMap: Record<string, string>; fixes: Fix[] }): string {
  let out = html
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  out = addIcons(out);
  out = mapClasses(out);
  out = localUrls(out, mediaMap);
  out = applyFixes(out, fixes);
  return out.replace(/\n{3,}/g, "\n\n").trim();
}
