import type { Metadata } from "next";
import Image from "next/image";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset password" };

type Props = { searchParams: Promise<{ token?: string | string[] }> };

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const value = (Array.isArray(token) ? token[0] : token) ?? "";
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/images/email-logo.png" alt="Renton" width={56} height={48} priority />
          <h1 className="mt-3 text-xl font-semibold text-slate-900">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-500">Choose a new password for your admin account.</p>
        </div>
        <ResetPasswordForm token={value} />
      </div>
    </main>
  );
}
