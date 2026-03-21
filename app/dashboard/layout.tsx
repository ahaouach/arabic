import { cookies } from "next/headers";
import { verifyToken, COOKIE_OPTIONS } from "@/lib/auth";
import DashboardShell from "@/components/DashboardShell";

export const metadata = {
  title: "Dashboard — AQ Academy",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_OPTIONS.name)?.value;
  const user = token ? await verifyToken(token) : null;

  return (
    <DashboardShell
      userName={user?.name ?? ""}
      userEmail={user?.email ?? ""}
    >
      {children}
    </DashboardShell>
  );
}
