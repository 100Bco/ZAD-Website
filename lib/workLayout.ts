import type { Project } from "./content";

export type CardVariant = "small" | "wide" | "tall" | "banner" | "square" | "landscape" | "full";
export type PlacedProject = { project: Project; variant: CardVariant; delay: number };

/**
 * Blocks repeat the Figma work grid:
 *  A: two small cards + one wide card on the left, one tall + one banner on the right
 *  B: square + landscape (every other B is mirrored)
 */
export type WorkBlock =
  | { kind: "a"; left: PlacedProject[]; right: PlacedProject[] }
  | { kind: "b"; flip: boolean; items: PlacedProject[] }
  | { kind: "single"; items: PlacedProject[] };

export function buildWorkLayout(items: Project[]): WorkBlock[] {
  const blocks: WorkBlock[] = [];
  let i = 0;
  let block = 0;

  while (i < items.length) {
    const left = items.length - i;
    let d = 0;
    const take = (variant: CardVariant): PlacedProject => {
      const placed = { project: items[i++], variant, delay: Math.min(d, 0.5) };
      d += 0.08;
      return placed;
    };

    if (block % 2 === 0 && left >= 5) {
      // Items keep their order: small, small, tall (right), wide (left), banner (right)
      const s1 = take("small");
      const s2 = take("small");
      const tall = take("tall");
      const wide = take("wide");
      const banner = take("banner");
      blocks.push({ kind: "a", left: [s1, s2, wide], right: [tall, banner] });
    } else if (left >= 2) {
      const flip = block % 4 === 3;
      const items2 = flip ? [take("landscape"), take("square")] : [take("square"), take("landscape")];
      blocks.push({ kind: "b", flip, items: items2 });
    } else {
      blocks.push({ kind: "single", items: [take("full")] });
    }
    block++;
  }
  return blocks;
}
