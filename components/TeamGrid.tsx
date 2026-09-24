"use client";

import Image from "next/image";
import { useState } from "react";
import type { TeamMember } from "@/lib/content";
import MoreDivider from "./MoreDivider";

type Props = { members: TeamMember[]; initialVisible: number; moreLabel: string; lessLabel: string };

export default function TeamGrid({ members, initialVisible, moreLabel, lessLabel }: Props) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = members.length > initialVisible;
  const shown = expanded ? members : members.slice(0, initialVisible);

  return (
    <>
      <ul className="team__grid">
        {shown.map((m, i) => (
          <li
            key={m.name}
            className={`member ${i < initialVisible ? "reveal" : "is-entering"}`}
            style={{ ["--delay" as string]: `${(i % 5) * 0.06}s` }}
          >
            <div className="member__photo">
              <Image
                src={m.image}
                alt={m.name}
                fill
                sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 17vw"
                style={{ ["--pos" as string]: m.focus ?? "50%" }}
              />
            </div>
            <p className="member__name">{m.name}</p>
            <p className="member__role">{m.role}</p>
          </li>
        ))}
      </ul>
      {canExpand ? (
        <MoreDivider
          className="team__more"
          icon="down"
          label={expanded ? lessLabel : moreLabel}
          expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        />
      ) : (
        <hr className="team__more team__rule" />
      )}
    </>
  );
}
