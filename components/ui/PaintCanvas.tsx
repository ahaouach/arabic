"use client";

import ObjectCard from "./ObjectCard";
import type { PaintGameSection } from "@/lib/lessonSections";

type PaintObject = PaintGameSection["objects"][number];

interface PaintCanvasProps {
  objects: PaintObject[];
  fills: Record<number, string>;
  statuses: Record<number, "idle" | "correct" | "wrong">;
  onPaint: (index: number) => void;
  disabledIndexes?: Set<number>;
}

export default function PaintCanvas({
  objects,
  fills,
  statuses,
  onPaint,
  disabledIndexes,
}: PaintCanvasProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {objects.map((obj, i) => (
        <ObjectCard
          key={`${obj.kind}-${i}`}
          name={obj.name}
          kind={obj.kind}
          fill={fills[i] ?? "#f3f4f6"}
          status={statuses[i] ?? "idle"}
          onPaint={() => onPaint(i)}
          disabled={disabledIndexes?.has(i)}
        />
      ))}
    </div>
  );
}
