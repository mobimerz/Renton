import type { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string | string[] }> };

/** Only same-site /admin paths are allowed as a post-login target (no open redirects). */
function safeNext(next: string | string[] | undefined): string {
  const n = Array.isArray(next) ? next[0] : next;
  return n && /^\/admin(\/|$)/.test(n) && !n.startsWith("//") ? n : "/admin/";
}

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/images/email-logo.png" alt="Renton" width={56} height={48} priority />
          <h1 className="mt-3 text-xl font-semibold text-slate-900">Renton Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage the blog and homepage.</p>
        </div>
        <LoginForm next={safeNext(next)} />
      </div>
    </main>
  );
}
