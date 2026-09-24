"use client";

import { useEffect, useState } from "react";
import type { Category, Project } from "@/lib/content";
import WorkGrid from "./WorkGrid";

type Props = { categories: Category[]; projects: Project[]; emptyText: string };

/** Filter tabs + project grid. Supports deep links such as /work#brand. */
export default function WorkBrowser({ categories, projects, emptyText }: Props) {
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fromHash = () => {
      const key = window.location.hash.replace("#", "");
      if (categories.some((c) => c.id === key)) setFilter(key);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [categories]);

  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <>
      <div className="filters" role="group" aria-label="Lọc dự án">
        {categories.map((c) => (
          <button key={c.id} type="button" aria-pressed={filter === c.id} onClick={() => setFilter(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {visible.length ? (
          <WorkGrid key={filter} projects={visible} animation="enter" className="works--page" />
        ) : (
          <p className="works__empty">{emptyText}</p>
        )}
      </div>
    </>
  );
}
