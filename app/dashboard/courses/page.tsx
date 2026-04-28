import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_OPTIONS } from "@/lib/auth";
import GameCard from "@/components/ui/GameCard";

export const dynamic = "force-dynamic";

interface ThemeDTO {
  id: string;
  name: string;
  title: string;
  lessonsCount: number;
}

/**
 * Slugs surfaced as cards on the courses dashboard. The DB may carry
 * additional themes (e.g. legacy `islam`, catch-all `others`) but only
 * the three core tracks are advertised — keeps the discovery screen
 * focused on the kid's actual learning paths.
 */
const VISIBLE_THEME_SLUGS = ["arabic", "islamic", "quran"] as const;
type VisibleThemeSlug = (typeof VISIBLE_THEME_SLUGS)[number];

async function loadThemes(): Promise<ThemeDTO[]> {
  // Defense-in-depth: re-verify the session server-side even though the
  // dashboard layout already guards this route.
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) redirect("/login");

  const rows = await prisma.theme.findMany({
    where: { name: { in: [...VISIBLE_THEME_SLUGS] } },
    select: {
      id: true,
      name: true,
      title: true,
      _count: { select: { themeLessons: true } },
    },
  });

  // Re-order to match VISIBLE_THEME_SLUGS so display follows the
  // pedagogical sequence (Arabic → Islamic → Quran), independent of DB
  // sortOrder which can drift.
  const byName = new Map(rows.map((r) => [r.name, r]));
  return VISIBLE_THEME_SLUGS.flatMap((slug) => {
    const r = byName.get(slug);
    if (!r) return [];
    return [{ id: r.id, name: r.name, title: r.title, lessonsCount: r._count.themeLessons }];
  });
}

/* -------------------------------------------------------------------------- */
/*  Twinkling starfield                                                       */
/*                                                                            */
/*  Server-rendered SSR-safe constant: a fixed pseudo-random scatter of star  */
/*  positions. CSS keyframes animate the twinkle so we don't pay framer-      */
/*  motion's hydration cost for ~30 decorative dots.                          */
/* -------------------------------------------------------------------------- */

const STARS = Array.from({ length: 36 }, (_, i) => {
  // Deterministic pseudo-random — same seed → same layout each SSR.
  const r = Math.sin((i + 1) * 9.91) * 10000;
  const fract = r - Math.floor(r);
  const r2 = Math.sin((i + 1) * 17.31) * 10000;
  const fract2 = r2 - Math.floor(r2);
  const r3 = Math.sin((i + 1) * 23.71) * 10000;
  const fract3 = r3 - Math.floor(r3);
  return {
    left: `${(fract * 100).toFixed(2)}%`,
    top: `${(fract2 * 100).toFixed(2)}%`,
    size: 1 + (fract3 * 3),
    delay: (fract3 * 4).toFixed(2),
    duration: (2 + fract * 4).toFixed(2),
  };
});

export default async function CoursesPage() {
  const themes = await loadThemes();

  return (
    <div className="relative min-h-full overflow-hidden p-6 pt-12 sm:p-10 sm:pt-16">
      {/* Cosmic background — pastel twilight gradient + nebulae */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-br from-indigo-100 via-fuchsia-50 to-amber-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-violet-300/40 blur-3xl"
        style={{ animation: "nebula-pulse 8s ease-in-out infinite" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-pink-300/40 blur-3xl"
        style={{ animation: "nebula-pulse 9s ease-in-out infinite 1s" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/4 -z-10 h-96 w-96 rounded-full bg-amber-300/40 blur-3xl"
        style={{ animation: "nebula-pulse 10s ease-in-out infinite 2s" }}
      />

      {/* Twinkling stars layer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: s.left,
              top: s.top,
              width: `${s.size}px`,
              height: `${s.size}px`,
              boxShadow: `0 0 ${s.size * 2}px rgba(255, 255, 255, 0.9)`,
              animation: `star-twinkle ${s.duration}s ease-in-out infinite ${s.delay}s`,
            }}
          />
        ))}
      </div>

      <header className="mx-auto max-w-6xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-violet-700 shadow ring-1 ring-violet-200 backdrop-blur">
          <span aria-hidden>🪐</span>
          Galactic Hub
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-900">
          Choose your planet
          <span className="ml-2 inline-block animate-rocket" aria-hidden>
            🚀
          </span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Three worlds. Hundreds of activities. Tap a planet to land.
        </p>
      </header>

      <section
        className="mx-auto mt-16 grid max-w-6xl gap-12 sm:gap-16 lg:gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center pb-20"
        aria-label="Course planets"
      >
        {themes.map((theme, i) => (
          <GameCard
            key={theme.id}
            id={theme.id}
            name={theme.title}
            slug={theme.name as VisibleThemeSlug}
            index={i}
            lessonsCount={theme.lessonsCount}
          />
        ))}
      </section>

      {/* Inline keyframes — Tailwind can't generate these with arbitrary delays */}
      <style>{`
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes nebula-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
        @keyframes rocket-wave {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          25% { transform: rotate(-12deg) translateY(-2px); }
          50% { transform: rotate(8deg) translateY(-4px); }
          75% { transform: rotate(-6deg) translateY(-1px); }
        }
        .animate-rocket { animation: rocket-wave 2.6s ease-in-out infinite; transform-origin: center; display: inline-block; }
      `}</style>
    </div>
  );
}
