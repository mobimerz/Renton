"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const NAV = [
  { href: "/admin/", label: "Dashboard", exact: true },
  { href: "/admin/blogs/", label: "Blogs" },
  { href: "/admin/homepage/", label: "Homepage" },
];

/** Sidebar + content area for every signed-in admin page. The sidebar becomes a drawer on small screens. */
export default function AdminShell({ email, children }: { email: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    const p = pathname.endsWith("/") ? pathname : pathname + "/";
    return exact ? p === href : p.startsWith(href);
  };

  async function logout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout/", { method: "POST" });
      if (!res.ok) throw new Error();
      router.replace("/admin/login/");
      router.refresh();
    } catch {
      toast.error("Could not sign out. Please try again.");
      setLoggingOut(false);
    }
  }

  const sidebar = (
    <nav className="flex h-full flex-col">
      <Link href="/admin/" onClick={() => setOpen(false)} className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex size-9 items-center justify-center rounded-md bg-white">
          <Image src="/images/email-logo.png" alt="" width={26} height={22} />
        </span>
        <span className="text-[15px] font-semibold text-white">Renton Admin</span>
      </Link>
      <ul className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href, item.exact) ? "page" : undefined}
              className={`block rounded-md px-3 py-2 text-sm font-medium ${
                isActive(item.href, item.exact) ? "bg-white/15 text-white" : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <a href="/" target="_blank" rel="noreferrer" className="block rounded-md px-3 py-2 text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white">
            View website ↗
          </a>
        </li>
      </ul>
      <div className="border-t border-white/15 p-4">
        <p className="truncate text-xs text-blue-200" title={email}>
          {email}
        </p>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="mt-2 w-full rounded-md bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/20 disabled:opacity-60"
        >
          {loggingOut ? "Signing out…" : "Log out"}
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 bg-[#0a2b9b] lg:fixed lg:inset-y-0 lg:block">{sidebar}</aside>

      {/* Mobile top bar + drawer */}
      <div className="sticky top-0 z-30 flex items-center justify-between bg-[#0a2b9b] px-4 py-3 lg:hidden">
        <span className="font-semibold text-white">Renton Admin</span>
        <button type="button" onClick={() => setOpen(true)} className="rounded-md px-2 py-1 text-white hover:bg-white/10" aria-label="Open menu">
          ☰
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <button type="button" className="absolute inset-0 bg-black/40" aria-label="Close menu" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#0a2b9b] shadow-xl">{sidebar}</aside>
        </div>
      )}

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:ml-60 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
