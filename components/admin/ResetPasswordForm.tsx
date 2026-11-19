"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Field, Input } from "./ui";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordForm({ token }: { token: string }) {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not reset the password. Please try again.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-700">
          This reset link is missing its token. Please request a new link.
        </div>
        <Link href="/admin/forgot/" className="block text-center text-sm font-medium text-blue-700 hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-md bg-green-50 px-3 py-2.5 text-sm text-green-800">
          Your password has been changed. You can now sign in with the new password.
        </div>
        <Link
          href="/admin/login/"
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-700 px-3.5 py-2 text-sm font-medium text-white hover:bg-blue-800"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" noValidate>
      <Field label="New password" htmlFor="password" hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}>
        <Input id="password" name="password" type="password" autoComplete="new-password" required autoFocus minLength={MIN_PASSWORD_LENGTH} />
      </Field>
      <Field label="Confirm new password" htmlFor="confirm">
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={MIN_PASSWORD_LENGTH} />
      </Field>
      {error && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full">
        Set new password
      </Button>
      <Link href="/admin/login/" className="block text-center text-sm font-medium text-blue-700 hover:underline">
        Back to sign in
      </Link>
    </form>
  );
}
