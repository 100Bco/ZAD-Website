import siteData from "@/data/site.json";
import homeData from "@/data/home.json";
import aboutData from "@/data/about.json";
import pagesData from "@/data/pages.json";
import projectsData from "@/data/projects.json";
import teamData from "@/data/team.json";

export type Link = { label: string; href: string };

export type Project = {
  id: string;
  title: string;
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

export const site = siteData;
export const home = homeData;
export const about = aboutData;
export const pages = pagesData;
export const categories: Category[] = projectsData.categories;
export const projects: Project[] = projectsData.projects;
export const team: TeamMember[] = teamData;

export const featuredProjects: Project[] = projects
  .filter((p) => typeof p.featured === "number")
  .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));
