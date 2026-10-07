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
  | "messenger";

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
};

export function iconSvg(name: IconName, className = "icon"): string {
  const { body, fill } = ICONS[name];
  const paint = fill
    ? 'fill="currentColor"'
    : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  return `<svg class="${className}" viewBox="0 0 24 24" ${paint} aria-hidden="true" focusable="false">${body}</svg>`;
}
