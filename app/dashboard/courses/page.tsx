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
}

async function loadThemes(): Promise<ThemeDTO[]> {
  // Defense-in-depth: re-verify the session server-side even though the
  // dashboard layout already guards this route.
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) redirect("/login");

  return prisma.theme.findMany({
    select: { id: true, name: true, title: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export default async function CoursesPage() {
  const themes = await loadThemes();

  return (
    <div className="relative min-h-full overflow-hidden p-6 sm:p-10">
      {/* Playful background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 -z-10 h-96 w-96 rounded-full bg-yellow-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 -z-10 h-96 w-96 rounded-full bg-pink-200/40 blur-3xl"
      />

      <header className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
          Choose your adventure 🚀
        </h1>
        <p className="mt-2 text-base text-gray-600">
          Pick a theme and start collecting stars!
        </p>
      </header>

      <section
        className="mx-auto mt-10 grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Course themes"
      >
        {themes.map((theme, i) => (
          <GameCard
            key={theme.id}
            id={theme.id}
            name={theme.title}
            slug={theme.name}
            index={i}
            level={i + 1}
            badge={i === 0 ? "New" : `Level ${i + 1}`}
          />
        ))}
      </section>
    </div>
  );
}
