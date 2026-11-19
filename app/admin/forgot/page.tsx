import type { Metadata } from "next";
import Image from "next/image";
import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/images/email-logo.png" alt="Renton" width={56} height={48} priority />
          <h1 className="mt-3 text-xl font-semibold text-slate-900">Forgot your password?</h1>
          <p className="mt-1 text-sm text-slate-500">Enter your admin email and we&apos;ll send a reset link.</p>
        </div>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
