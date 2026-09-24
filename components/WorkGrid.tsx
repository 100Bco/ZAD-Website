import type { CSSProperties } from "react";
import type { Project } from "@/lib/content";
import { buildWorkLayout, type PlacedProject } from "@/lib/workLayout";
import WorkCard from "./WorkCard";

type Props = {
  projects: Project[];
  /** "reveal": animate in on scroll (home). "enter": animate immediately (work page filters). */
  animation: "reveal" | "enter";
  className?: string;
};

export default function WorkGrid({ projects, animation, className }: Props) {
  const blocks = buildWorkLayout(projects);

  const card = ({ project, variant, delay }: PlacedProject) => (
    <WorkCard
      key={project.id}
      project={project}
      variant={variant}
      className={animation === "reveal" ? "reveal" : "is-entering"}
      style={{ "--delay": `${delay}s` } as CSSProperties}
    />
  );

  return (
    <div className={`works ${className ?? ""}`}>
      {blocks.map((b, i) => {
        if (b.kind === "a") {
          return (
            <div key={i} className="works__a">
              <div className="works__a-left">{b.left.map(card)}</div>
              <div className="works__a-right">{b.right.map(card)}</div>
            </div>
          );
        }
        if (b.kind === "b") {
          return (
            <div key={i} className={`works__b${b.flip ? " works__b--flip" : ""}`}>
              {b.items.map(card)}
            </div>
          );
        }
        return (
          <div key={i} className="works__d">
            {b.items.map(card)}
          </div>
        );
      })}
    </div>
  );
}
