import viSite from "@/data/vi/site.json";
import viHome from "@/data/vi/home.json";
import viAbout from "@/data/vi/about.json";
import viPages from "@/data/vi/pages.json";
import viUi from "@/data/vi/ui.json";
import enSite from "@/data/en/site.json";
import enHome from "@/data/en/home.json";
import enAbout from "@/data/en/about.json";
import enPages from "@/data/en/pages.json";
import enUi from "@/data/en/ui.json";
import projectsData from "@/data/projects.json";
import teamData from "@/data/team.json";
import type { Locale } from "./i18n";

export type Link = { label: string; href: string };

export type Project = {
  id: string;
  /** Vietnamese title */
  title: string;
  /** English title; the Vietnamese one is used when it is missing */
  titleEn?: string;
  image: string;
  categories: string[];
  /** Position in the home page "Dự án nổi bật" grid (1 = first). Omit to hide from home. */
  featured?: number;
};

export type Category = { id: string; label: string };

export type TeamMember = {
  name: string;
  role: string;
  image: string;
  /** Horizontal focus point of the portrait crop, e.g. "57%". */
  focus?: string;
};

export type RichText = { text?: string; strong?: string }[];

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);

/**
 * The English files hold only the translated text; everything else (images, video, logos,
 * numbers) comes from the Vietnamese files. Objects merge key by key; a list of objects with
 * the same length merges item by item; any other value in the English file replaces the
 * Vietnamese one.
 */
function overlay<T>(base: T, over: unknown): T {
  if (over === undefined) return base;
  if (Array.isArray(base) && Array.isArray(over)) {
    if (over.length === base.length && over.every(isPlain) && base.every(isPlain)) {
      return base.map((b, i) => overlay(b, over[i])) as T;
    }
    return over as T;
  }
  if (isPlain(base) && isPlain(over)) {
    const out: Plain = { ...base };
    for (const [k, v] of Object.entries(over)) out[k] = overlay(base[k], v);
    return out as T;
  }
  return over as T;
}

const vi = { site: viSite, home: viHome, about: viAbout, pages: viPages, ui: viUi };
export type Content = typeof vi;

const en: Content = {
  site: overlay(viSite, enSite),
  home: overlay(viHome, enHome),
  about: overlay(viAbout, enAbout),
  pages: overlay(viPages, enPages),
  ui: overlay(viUi, enUi),
};

const byLocale: Record<Locale, Content> = { vi, en };

export const categories: Category[] = projectsData.categories;
export const team: TeamMember[] = teamData;
const allProjects: Project[] = projectsData.projects;

/** Everything a page needs, in one language. */
export function getContent(locale: Locale) {
  const projects = allProjects.map((p) => ({ ...p, title: locale === "en" ? (p.titleEn ?? p.title) : p.title }));
  const featuredProjects = projects
    .filter((p) => typeof p.featured === "number")
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
  return { ...byLocale[locale], projects, featuredProjects, categories, team };
}
