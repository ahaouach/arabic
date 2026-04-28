"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import DrawingCanvas from "./DrawingCanvas";
import DrawingToolbar from "./DrawingToolbar";
import ShapeSvg from "./ShapeSvg";
import ReplayButton from "@/components/ui/colors/ReplayButton";
import { useAudio } from "@/lib/useAudio";
import { useDrawing } from "@/lib/hooks/useDrawing";
import { generateRoundSeed, pickOne } from "@/lib/utils/random";
import type {
  ArabicColor,
  ArabicShape,
  DrawShapeZone as DrawShapeZoneType,
} from "@/lib/types/shapesLesson.types";

export interface DrawShapeZoneProps {
  shapes: ArabicShape[];
  colors: ArabicColor[];
  zone: DrawShapeZoneType;
  onComplete?: () => void;
  onAdvance?: () => void;
}

/** Safely trigger a PNG download from a data URL. User-initiated only. */
function downloadPng(dataUrl: string, filename: string): void {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export default function DrawShapeZone({
  shapes,
  colors,
  zone,
  onComplete,
  onAdvance,
}: DrawShapeZoneProps) {
  const { playAudio } = useAudio();
  const prefersReducedMotion = useReducedMotion();

  const [seed, setSeed] = useState<number | null>(null);
  useEffect(() => {
    setSeed(generateRoundSeed());
  }, []);

  // Deterministic fallback on first render (SSR-safe) so the canvas is
  // always mounted — otherwise the pointer listeners in `useDrawing`
  // attach to a null ref and drawing silently doesn't work.
  const target = useMemo<ArabicShape>(
    () => (seed === null ? shapes[0] : pickOne(shapes, seed)),
    [shapes, seed],
  );

  const [showGuide, setShowGuide] = useState<boolean>(zone.showGuideByDefault);
  const [confirmClear, setConfirmClear] = useState(false);
  const [done, setDone] = useState(false);
  const [savedDataUrl, setSavedDataUrl] = useState<string | null>(null);
  const [announced, setAnnounced] = useState(false);

  // Fall back to a sensible stroke palette if the zone config is missing.
  const brushSizes =
    zone.brushSizes.length > 0 ? zone.brushSizes : [4, 8, 14];

  const drawing = useDrawing({
    shape: target,
    showGuide,
    maxUndoStack: zone.maxUndoStack,
  });

  // Seed the brush colour from the first palette entry on mount / shape change.
  useEffect(() => {
    if (colors.length > 0) drawing.setColor(colors[0].hex);
    if (brushSizes.length > 0) drawing.setBrushSize(brushSizes[1] ?? brushSizes[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.key]);

  // Announce the target shape once per round.
  useEffect(() => {
    if (!target) return;
    const id = window.setTimeout(() => {
      playAudio(undefined, `اُرْسُمْ ${target.nameAr}`);
    }, 250);
    return () => window.clearTimeout(id);
  }, [target, playAudio]);

  const handleDone = useCallback(() => {
    const url = drawing.toDataURL();
    setSavedDataUrl(url);
    setDone(true);
    playAudio(undefined, "أَحْسَنْتَ! رَسْمٌ جَمِيلٌ");
    if (!announced) {
      setAnnounced(true);
      onComplete?.();
    }
  }, [drawing, playAudio, announced, onComplete]);

  const handleSave = useCallback(() => {
    if (!target) return;
    const url = drawing.toDataURL();
    if (!url) return;
    downloadPng(url, `shape-${target.key}-${Date.now()}.png`);
  }, [drawing, target]);

  const nextShape = useCallback(() => {
    setSeed(generateRoundSeed());
    setDone(false);
    setSavedDataUrl(null);
    drawing.clear();
  }, [drawing]);

  const redoCurrent = useCallback(() => {
    setDone(false);
    setSavedDataUrl(null);
    drawing.clear();
  }, [drawing]);

  const skipZone = useCallback(() => {
    if (!announced) {
      setAnnounced(true);
      onComplete?.();
    }
    onAdvance?.();
  }, [announced, onComplete, onAdvance]);

  return (
    <section
      className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
      aria-labelledby="shapes-draw-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3
            id="shapes-draw-title"
            className="text-2xl font-black text-gray-900"
            lang="ar"
            dir="rtl"
            style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
          >
            {zone.title ?? "اُرْسُمِ الشَّكْلَ"}
          </h3>
          {zone.description && (
            <p
              className="mt-1 text-sm font-medium text-gray-600"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              {zone.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={skipZone}
          className="inline-flex min-h-10 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-black text-gray-700 shadow ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
          lang="ar"
          dir="rtl"
          style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
        >
          تَخَطَّ الْمِنْطَقَةَ
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key="draw"
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }
            }
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {/* Reference header */}
            <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 ring-black/5">
              <div className="h-16 w-16">
                <ShapeSvg
                  shape={target}
                  fill="#FCD34D"
                  className="h-full w-full"
                />
              </div>
              <p
                lang="ar"
                dir="rtl"
                className="text-lg font-black text-gray-900 sm:text-xl"
                style={{
                  fontFamily:
                    '"Amiri", "Noto Naskh Arabic", "Scheherazade New", serif',
                }}
              >
                اُرْسُمْ{" "}
                <span className="text-amber-600">{target.nameAr}</span>
                <span className="ms-1" aria-hidden>
                  {target.emoji}
                </span>
              </p>
              <motion.button
                type="button"
                onClick={() =>
                  playAudio(target.audioUrl, `اُرْسُمْ ${target.audioText}`)
                }
                whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.94 }}
                aria-label="Replay the instruction"
                className="ms-auto flex h-11 w-11 items-center justify-center rounded-full bg-gray-900 text-base text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
              >
                🔊
              </motion.button>
            </div>

            {/* Drawing surface */}
            <div className="mx-auto mt-5 aspect-[4/3] max-h-[60vh] w-full max-w-3xl">
              <DrawingCanvas
                canvasRef={drawing.canvasRef}
                ariaLabel="مِنْطَقَةُ الرَّسْمِ"
              />
            </div>

            {/* Toolbar */}
            <div className="mt-4">
              <DrawingToolbar
                colors={colors}
                color={drawing.color}
                onSelectColor={drawing.setColor}
                brushSizes={brushSizes}
                brushSize={drawing.brushSize}
                onSelectBrush={drawing.setBrushSize}
                showGuide={showGuide}
                onToggleGuide={() => setShowGuide((g) => !g)}
                canUndo={drawing.canUndo}
                onUndo={drawing.undo}
                onRequestClear={() => setConfirmClear(true)}
                onDone={handleDone}
              />
            </div>

            {/* Clear confirm dialog */}
            <AnimatePresence>
              {confirmClear && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="clear-confirm-title"
                >
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: 0, scale: 0.92 }
                    }
                    animate={{ opacity: 1, scale: 1 }}
                    exit={
                      prefersReducedMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.92 }
                    }
                    className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10 text-center"
                  >
                    <h4
                      id="clear-confirm-title"
                      className="text-xl font-black text-gray-900"
                      lang="ar"
                      dir="rtl"
                      style={{
                        fontFamily: '"Amiri", "Noto Naskh Arabic", serif',
                      }}
                    >
                      هَلْ تُرِيدُ مَسْحَ الرَّسْمِ؟
                    </h4>
                    <div className="mt-5 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmClear(false)}
                        className="min-h-11 rounded-full bg-gray-100 px-5 py-2 text-sm font-black text-gray-800 shadow ring-1 ring-black/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                        lang="ar"
                        dir="rtl"
                        style={{
                          fontFamily: '"Amiri", "Noto Naskh Arabic", serif',
                        }}
                      >
                        لَا
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          drawing.clear();
                          setConfirmClear(false);
                        }}
                        className="min-h-11 rounded-full bg-rose-500 px-5 py-2 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-300/70"
                        lang="ar"
                        dir="rtl"
                        style={{
                          fontFamily: '"Amiri", "Noto Naskh Arabic", serif',
                        }}
                      >
                        نَعَمْ، اِمْسَحْ
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="celebrate"
            initial={
              prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9 }
            }
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-white p-8 text-center shadow-inner ring-1 ring-black/5"
          >
            <motion.div
              aria-hidden
              animate={
                prefersReducedMotion ? undefined : { rotate: [0, -6, 6, 0] }
              }
              transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              className="text-6xl"
            >
              🏆
            </motion.div>
            <p
              className="mt-3 text-2xl font-black text-gray-900"
              lang="ar"
              dir="rtl"
              style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
            >
              أَحْسَنْتَ! رَسْمٌ جَمِيلٌ!
            </p>

            {savedDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={savedDataUrl}
                alt="Your drawing"
                className="mx-auto mt-4 max-h-64 rounded-2xl bg-white shadow ring-1 ring-black/5"
              />
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="min-h-12 rounded-full bg-white px-5 py-2.5 text-sm font-black text-gray-800 shadow-md ring-1 ring-black/5 transition-colors hover:bg-yellow-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-300/70"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                اِحْفَظْ ⬇
              </button>
              <ReplayButton onClick={redoCurrent} size="sm" label="أَعِدْ" />
              <button
                type="button"
                onClick={nextShape}
                className="min-h-12 rounded-full bg-gradient-to-br from-amber-400 to-rose-500 px-5 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300/70"
                lang="ar"
                dir="rtl"
                style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
              >
                شَكْلٌ آخَرُ 🔀
              </button>
              {onAdvance && (
                <button
                  type="button"
                  onClick={onAdvance}
                  className="min-h-12 rounded-full bg-gradient-to-br from-emerald-400 to-sky-500 px-5 py-2.5 text-sm font-black text-white shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-300/70"
                  lang="ar"
                  dir="rtl"
                  style={{ fontFamily: '"Amiri", "Noto Naskh Arabic", serif' }}
                >
                  إِنْهَاءُ الدَّرْسِ →
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
