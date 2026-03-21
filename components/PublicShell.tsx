"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  return (
    <>
      {!isDashboard && <Navbar />}
      <div className={isDashboard ? "h-screen" : "flex-1"}>{children}</div>
      {!isDashboard && <Footer />}
    </>
  );
}
