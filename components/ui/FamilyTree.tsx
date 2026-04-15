"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useAudio } from "@/lib/useAudio";
import type { FamilyTreeSection } from "@/lib/lessonSections";

export default function FamilyTree({ section }: { section: FamilyTreeSection }) {
  const { playAudio } = useAudio();
  const [selected, setSelected] = useState<string | null>(null);

  // Group nodes by level so we can render each level as its own row.
  const rows = useMemo(() => {
    const byLevel = new Map<number, FamilyTreeSection["nodes"]>();
    for (const n of section.nodes) {
      const list = byLevel.get(n.level) ?? [];
      list.push(n);
      byLevel.set(n.level, list);
    }
    return Array.from(byLevel.entries())
      .sort(([a], [b]) => a - b)
      .map(([, list]) => list);
  }, [section.nodes]);

  const play = (node: FamilyTreeSection["nodes"][number]) => {
    setSelected(node.id);
    playAudio(undefined, node.audioText ?? node.name);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-sky-50 via-white to-fuchsia-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
      <div className="mb-5">
        {section.title && (
          <h3
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {section.title}
          </h3>
        )}
        {section.instructions && (
          <p
            className="mt-1 text-sm font-medium text-gray-600"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {section.instructions}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-0">
        {rows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex w-full flex-col items-center">
            <div className="flex flex-wrap items-center justify-center gap-5">
              {row.map((node) => {
                const active = selected === node.id;
                return (
                  <motion.button
                    key={node.id}
                    type="button"
                    onClick={() => play(node)}
                    onMouseEnter={() => play(node)}
                    whileHover={{ y: -3, scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    aria-label={`Play ${node.name}`}
                    className={`flex flex-col items-center gap-1 rounded-3xl bg-white px-4 py-3 shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70 ${
                      active ? "ring-4 ring-gray-900" : "ring-1 ring-black/5"
                    }`}
                  >
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-100 to-pink-100 text-4xl shadow-inner"
                    >
                      <span aria-hidden>{node.emoji}</span>
                    </motion.div>
                    <div
                      className="text-base font-black text-gray-900"
                      lang="ar"
                      dir="rtl"
                      style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                    >
                      {node.name}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Connector between rows */}
            {rowIdx < rows.length - 1 && (
              <div className="my-2 flex flex-col items-center" aria-hidden>
                <div className="h-4 w-0.5 bg-gray-300" />
                <div className="h-0.5 w-24 bg-gray-300" />
                <div className="h-4 w-0.5 bg-gray-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
