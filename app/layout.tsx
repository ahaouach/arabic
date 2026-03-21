import type { Metadata } from "next";
import { cookies } from "next/headers";
import "@/styles/globals.css";
import PublicShell from "@/components/PublicShell";
import { LanguageProvider } from "@/components/LanguageProvider";
import { getLocaleFromString, isRTL } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "AQ Academy — Arabic & Quran for Children",
    template: "%s — AQ Academy",
  },
  description:
    "Interactive online Arabic and Quran lessons for non-Arabic-speaking children aged 5 to 12. Structured levels, qualified teachers, fun learning.",
  keywords: [
    "learn arabic online",
    "quran for kids",
    "arabic lessons children",
    "online quran classes",
    "arabic alphabet kids",
  ],
  authors: [{ name: "AQ Academy" }],
  creator: "AQ Academy",
  robots: { index: true, follow: true },
  openGraph: { type: "website", siteName: "AQ Academy" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read stored preference server-side for correct initial lang/dir on first render
  const cookieStore = await cookies();
  const locale = getLocaleFromString(cookieStore.get("aq_lang")?.value);
  const dir = isRTL(locale) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>

        <LanguageProvider initialLocale={locale}>
          <PublicShell>{children}</PublicShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
