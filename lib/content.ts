// Reads the exported site in content/ at build time (the new site never calls the old server).

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { cleanHtml, type Fix } from "./clean-html";

export type Entry = {
  id: number;
  type: "post" | "page";
  slug: string;
  path: string;
  title: string;
  date: string;
  excerpt: string;
  featuredImage: { src: string; alt: string } | null;
  html: string;
};

const CONTENT = path.join(process.cwd(), "content");
const readJson = <T>(file: string): T => JSON.parse(readFileSync(path.join(CONTENT, file), "utf8"));

export function posts(): Entry[] {
  return readdirSync(path.join(CONTENT, "posts"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson<Entry>(`posts/${f}`))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function post(slug: string): Entry {
  const found = posts().find((p) => p.slug === slug);
  if (!found) throw new Error(`No exported post "${slug}"`);
  return found;
}

// WordPress "Anterior": the next older post by date.
export function previousPost(slug: string): Entry | undefined {
  const all = posts();
  return all[all.findIndex((p) => p.slug === slug) + 1];
}

// WordPress "Următor": the next newer post by date.
export function nextPost(slug: string): Entry | undefined {
  const all = posts();
  return all[all.findIndex((p) => p.slug === slug) - 1];
}

export function cleanBody(entry: Entry): string {
  const fixes = readJson<Fix[]>("fixes.json").filter((f) => f.page === entry.path);
  return cleanHtml(entry.html, { mediaMap: readJson("media-map.json"), fixes });
}

const MONTHS = [
  "ianuarie", "februarie", "martie", "aprilie", "mai", "iunie",
  "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie",
];

// "2026-10-06T11:10:41" → "6 octombrie 2026"
export function roDate(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
