// Exported WordPress HTML → clean HTML that uses only the shared component classes (specs 003, 004).
// String-based on purpose (no parser dependency): the exported markup is regular block output.

import { EMOJI_ICONS, iconSvg, type IconName } from "./icons.ts";

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
  "eb-feature-list-items": "icon-list",
  "stk-button": "btn",
  "stk-row": "grid-2",
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

// Emoji pasted as pictures (from Facebook's servers, or embedded as data: images): an <img> whose alt
// text is one emoji becomes that emoji character, which emojiIcons() then turns into an SVG icon.
function emojiImages(html: string): string {
  const only = new RegExp(`^(?:${EMOJI})$`, "u");
  return html.replace(/<img\b[^>]*>/g, (img) => {
    const alt = img.match(/\salt="([^"]*)"/)?.[1] ?? "";
    return only.test(alt) ? alt : img;
  });
}

// Removes every <div> whose opening tag and content satisfy `drop`, with everything inside it.
function dropDivs(html: string, drop: (open: string, inner: string) => boolean): string {
  const opening = /<div\b[^>]*>/g;
  let match: RegExpExecArray | null;
  while ((match = opening.exec(html))) {
    const tags = /<\/?div\b[^>]*>/g;
    tags.lastIndex = match.index + match[0].length;
    let depth = 1;
    let tag: RegExpExecArray | null;
    while (depth > 0 && (tag = tags.exec(html))) depth += tag[0][1] === "/" ? -1 : 1;
    if (depth > 0) break;
    const inner = html.slice(match.index + match[0].length, tags.lastIndex - "</div>".length);
    if (drop(match[0], inner)) {
      html = html.slice(0, match.index) + html.slice(tags.lastIndex);
      opening.lastIndex = match.index;
    }
  }
  return html;
}

const textOf = (html: string) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

// The older articles' sidebar ("Categorii populare" → "Blog", "Postări populare" post grid) and the
// builder's icon-font boxes: page-builder leftovers (PRODUCT.md), on content/cuts.json.
export function dropLeftovers(html: string): string {
  return dropDivs(
    html,
    (open, inner) =>
      open.includes("neobot_categorytitle") ||
      open.includes("wp-block-essential-blocks-post-grid") ||
      open.includes("eb-feature-list-icon-box") ||
      (open.includes("wp-block-essential-blocks-feature-list") && textOf(inner) === "Blog"),
  );
}

// One emoji, without ©, ® and ™ (also "pictographic" in Unicode, but real text).
const EMOJI = "(?![\\u00A9\\u00AE\\u2122])\\p{Extended_Pictographic}(?:\\uFE0F|\\u200D\\p{Extended_Pictographic})*\\uFE0F?";
const LEADING = new RegExp(`^((?:\\s|&nbsp;|<(?:strong|b|em|span)\\b[^>]*>)*)((?:${EMOJI})+)\\s*`, "u");

// A line starting with an emoji → its icon and the line without it. Throws for an emoji with no icon.
function leadingIcon(line: string): { icon: IconName; rest: string } | null {
  const m = line.match(LEADING);
  if (!m) return null;
  const first = m[2].match(new RegExp(EMOJI, "u"))![0].replaceAll("️", "");
  const icon = EMOJI_ICONS[first];
  if (!icon) throw new Error(`No icon for emoji ${first} (${first.codePointAt(0)!.toString(16)}) in: ${textOf(line).slice(0, 60)}`);
  return { icon, rest: m[1] + line.slice(m[0].length) };
}

const badged = ({ icon, rest }: { icon: IconName; rest: string }) =>
  `<span class="icon-badge">${iconSvg(icon)}</span><span>${rest.trim()}</span>`;

// Emoji at the start of a line become SVG icons (PRODUCT.md): a <br>-separated paragraph turns into
// paragraphs and icon lists, a list item or heading gets an icon badge. Other emoji are removed.
function emojiIcons(html: string): string {
  // A "heading" holding several <br>-separated lines is the builder's body text, not a heading.
  html = html.replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g, (whole, _tag: string, inner: string) =>
    /<br\s*\/?>/.test(inner) ? `<p>${inner}</p>` : whole,
  );
  html = html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/g, (whole, attrs: string, inner: string) => {
    const lines = inner.replace(/<\/?span\b[^>]*>/g, "").split(/<br\s*\/?>/);
    if (!lines.some((l) => leadingIcon(l))) return whole;
    for (const line of lines) {
      for (const tag of ["strong", "b", "em", "a"]) {
        const opened = line.match(new RegExp(`<${tag}\\b`, "g"))?.length ?? 0;
        const closed = line.match(new RegExp(`</${tag}>`, "g"))?.length ?? 0;
        if (opened !== closed) throw new Error(`<${tag}> crosses a line break in: ${textOf(line).slice(0, 60)}`);
      }
    }
    const out: string[] = [];
    let plain: string[] = [];
    let items: string[] = [];
    const flush = () => {
      if (plain.length) out.push(`<p${attrs}>${plain.join("<br>")}</p>`);
      if (items.length) out.push(`<ul class="icon-list">${items.join("")}</ul>`);
      plain = [];
      items = [];
    };
    for (const line of lines) {
      const lead = leadingIcon(line);
      if (!textOf(line)) flush();
      else if (lead) {
        if (plain.length) flush();
        items.push(`<li>${badged(lead)}</li>`);
      } else {
        if (items.length) flush();
        plain.push(line);
      }
    }
    flush();
    return out.join("\n");
  });
  html = html.replace(/<li\b([^>]*)>([\s\S]*?)<\/li>/g, (whole, attrs: string, inner: string) => {
    const lead = leadingIcon(inner);
    return lead ? `<li${attrs}>${badged(lead)}</li>` : whole;
  });
  html = html.replace(/<ul\b[^>]*>([\s\S]*?)<\/ul>/g, (whole, inner: string) => {
    const items = inner.match(/<li\b[^>]*>/g) ?? [];
    const badges = inner.match(/<li\b[^>]*><span class="icon-badge">/g) ?? [];
    return items.length && badges.length === items.length ? `<ul class="icon-list">${inner}</ul>` : whole;
  });
  html = html.replace(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/g, (whole, tag: string, inner: string) => {
    const lead = leadingIcon(inner);
    return lead ? `<${tag} class="icon-item">${badged(lead)}</${tag}>` : whole;
  });
  return stripEmoji(html);
}

// Removes emoji (and one space after each), the same way check:text does on the live text.
export function stripEmoji(text: string): string {
  return text.replace(new RegExp(`(?:${EMOJI})+ ?`, "gu"), "");
}

// Builder leftovers with nothing visible in them.
function dropEmpty(html: string): string {
  let before: string;
  do {
    before = html;
    html = html.replace(/<(h[1-6]|p|span|div|figure)\b[^>]*>(?:\s|&nbsp;|<br\s*\/?>)*<\/\1>/g, "");
  } while (html !== before);
  return html;
}

// Shared classes (including the icon badge and lists added above) are kept as they are.
const SHARED = new Set([...Object.values(CLASS_MAP).flatMap((c) => c.split(" ")), "icon-badge", "icon", "icon-list", "icon-item"]);

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
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\s(?:srcset|sizes)="[^"]*"/g, "");
  out = emojiImages(out);
  out = dropLeftovers(out);
  out = addIcons(out);
  out = emojiIcons(out);
  out = mapClasses(out);
  out = dropEmpty(out);
  out = localUrls(out, mediaMap);
  out = applyFixes(out, fixes);
  return out.replace(/\n{3,}/g, "\n\n").trim();
}
