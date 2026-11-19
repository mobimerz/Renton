"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Field, Input } from "./ui";

export default function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/forgot/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.get("email") }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-md bg-green-50 px-3 py-2.5 text-sm text-green-800">
          If that email belongs to the admin account, a reset link is on its way. Check your inbox (and spam) and open the
          link within the hour.
        </div>
        <Link href="/admin/login/" className="block text-center text-sm font-medium text-blue-700 hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <Field label="Email" htmlFor="email" hint="We'll email a link to reset your password.">
        <Input id="email" name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Send reset link
      </Button>
      <Link href="/admin/login/" className="block text-center text-sm font-medium text-blue-700 hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}
