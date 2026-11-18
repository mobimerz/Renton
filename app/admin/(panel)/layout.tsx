import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

/** Every signed-in admin page. proxy.ts already guards /admin; this re-checks on the server. */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login/");
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
