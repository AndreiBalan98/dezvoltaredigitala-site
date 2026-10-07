// The one icon set (spec 003): 24×24 SVG bodies, shared by components/Icon.tsx and lib/clean-html.ts.
// Stroke icons take `currentColor`; `fill: true` icons are solid shapes.

export type IconName =
  | "phone"
  | "mail"
  | "map-pin"
  | "user"
  | "shield"
  | "menu"
  | "close"
  | "chevron-down"
  | "arrow-right"
  | "facebook"
  | "messenger"
  | "check"
  | "globe"
  | "idea"
  | "rocket"
  | "target"
  | "users"
  | "calendar"
  | "clock"
  | "chart"
  | "trending"
  | "money"
  | "building"
  | "tool"
  | "laptop"
  | "lock"
  | "cart"
  | "leaf"
  | "recycle"
  | "zap"
  | "heart"
  | "info"
  | "star"
  | "note"
  | "shirt"
  | "health";

export const ICONS: Record<IconName, { body: string; fill?: boolean }> = {
  phone: {
    body: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  },
  mail: { body: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>' },
  "map-pin": { body: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>' },
  user: { body: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>' },
  shield: { body: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>' },
  menu: { body: '<path d="M3 6h18M3 12h18M3 18h18"/>' },
  close: { body: '<path d="M6 6l12 12M18 6 6 18"/>' },
  "chevron-down": { body: '<path d="m6 9 6 6 6-6"/>' },
  "arrow-right": { body: '<path d="M5 12h14M13 6l6 6-6 6"/>' },
  facebook: {
    fill: true,
    body: '<path d="M24 12a12 12 0 1 0-13.9 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9V12h3.4l-.5 3.5h-2.9v8.4A12 12 0 0 0 24 12z"/>',
  },
  messenger: {
    fill: true,
    body: '<path d="M12 2C6.4 2 2 6.1 2 11.7c0 2.9 1.2 5.5 3.2 7.2V22l3-1.7c1.2.3 2.4.5 3.8.5 5.6 0 10-4.1 10-9.7S17.6 2 12 2zm1 13-2.6-2.7-5 2.7 5.5-5.8 2.6 2.7 4.9-2.7L13 15z"/>',
  },
  check: { body: '<path d="M20 6 9 17l-5-5"/>' },
  globe: { body: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>' },
  idea: { body: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/>' },
  rocket: {
    body: '<path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
  },
  target: { body: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>' },
  users: {
    body: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  },
  calendar: { body: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
  clock: { body: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' },
  chart: { body: '<path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-7"/>' },
  trending: { body: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>' },
  money: { body: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>' },
  building: {
    body: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
  },
  tool: {
    body: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9z"/>',
  },
  laptop: { body: '<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M2 20h20"/>' },
  lock: { body: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>' },
  cart: {
    body: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  },
  leaf: { body: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z"/><path d="M2 21c0-3 1.9-5.4 5.2-6"/>' },
  recycle: { body: '<path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>' },
  zap: { body: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>' },
  heart: {
    body: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
  },
  info: { body: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>' },
  star: { body: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>' },
  note: { body: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>' },
  shirt: {
    body: '<path d="M20.4 3.5 16 2a4 4 0 0 1-8 0L3.6 3.5a2 2 0 0 0-1.3 2.2l.6 3.5a1 1 0 0 0 1 .8H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.1a1 1 0 0 0 1-.8l.6-3.5a2 2 0 0 0-1.3-2.2z"/>',
  },
  health: { body: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/>' },
};

// Emoji the old articles used as line "icons" (PRODUCT.md: emoji icons → real SVG icons).
// Keys are written without the U+FE0F variation selector. A line-leading emoji missing here fails the build.
export const EMOJI_ICONS: Record<string, IconName> = {
  "✅": "check", "✔": "check", "❌": "close",
  "📍": "map-pin", "📌": "map-pin",
  "📞": "phone", "📱": "phone", "📧": "mail", "📩": "mail",
  "🌐": "globe", "🌍": "globe",
  "➡": "arrow-right", "👉": "arrow-right", "🔹": "arrow-right",
  "💡": "idea", "🧪": "idea", "🚀": "rocket", "🎯": "target",
  "👥": "users", "🤝": "users", "👤": "user",
  "📅": "calendar", "⏳": "clock", "📊": "chart", "📈": "trending", "💰": "money",
  "🏢": "building", "🏛": "building", "🏗": "building",
  "🛠": "tool", "🔧": "tool", "⚙": "tool",
  "💻": "laptop", "🔐": "lock", "🛒": "cart",
  "🌱": "leaf", "🌾": "leaf", "🌲": "leaf", "♻": "recycle", "🔁": "recycle",
  "⚡": "zap", "👗": "shirt", "🧳": "globe", "🏥": "health", "❤": "heart", "🙏": "heart", "ℹ": "info", "💯": "star", "🙂": "star", "📝": "note",
};

export function iconSvg(name: IconName, className = "icon"): string {
  const { body, fill } = ICONS[name];
  const paint = fill
    ? 'fill="currentColor"'
    : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  return `<svg class="${className}" viewBox="0 0 24 24" ${paint} aria-hidden="true" focusable="false">${body}</svg>`;
}
