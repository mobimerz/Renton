"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCT_OPTIONS, TERMS_VALUE, contactSchema } from "@/lib/contact-schema";

type Errors = Partial<Record<"name" | "email" | "phone" | "product" | "requirements" | "terms" | "form", string>>;

const label = "block text-[14px] font-medium text-brand-navy";
const inputBase =
  "block w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-brand-navy placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2";
const Req = () => <span className="font-normal text-red-500"> *</span>;
const Err = ({ id, msg }: { id: string; msg?: string }) =>
  msg ? (
    <em id={id} className="mt-1.5 block text-[13px] not-italic text-red-600" role="alert">
      {msg}
    </em>
  ) : null;

/**
 * Rebuild of WPForms form #9362 on /contact/ — same labels, field order, options and button.
 * Validates in the browser, then again on the server (/api/contact). Includes a honeypot + timing trap.
 */
export default function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      product: String(fd.get("product") ?? ""),
      requirements: String(fd.get("requirements") ?? ""),
      terms: fd.get("terms") === TERMS_VALUE,
      website: String(fd.get("website") ?? ""),
      startedAt: startedAt.current || Date.now(),
    };

    const check = contactSchema.omit({ website: true, startedAt: true }).safeParse(payload);
    if (!check.success) {
      setErrors(Object.fromEntries(check.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; errors?: Errors; error?: string };
      if (json.ok) {
        setStatus("sent");
        return;
      }
      setErrors(json.errors ?? { form: json.error ?? "Something went wrong. Please try again." });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    }
    setStatus("idle");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-6 py-10 text-center" role="status">
        <span className="flex size-14 items-center justify-center rounded-full bg-green-500 text-white">
          <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden>
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
          </svg>
        </span>
        <p className="font-poppins text-[17px] font-semibold text-green-800">Thanks for contacting us!</p>
        <p className="font-inter text-[14px] text-green-700">We will be in touch with you shortly.</p>
      </div>
    );
  }

  const aria = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `cf-${k}-error` } : {});
  const cls = (k: keyof Errors) =>
    `${inputBase} ${errors[k] ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : "border-slate-300 focus:border-brand focus:ring-brand/20"}`;

  return (
    <form onSubmit={onSubmit} noValidate className="flex w-full flex-col gap-5">
      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-name" className={label}>
          Name<Req />
        </label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" className={cls("name")} {...aria("name")} />
        <Err id="cf-name-error" msg={errors.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-email" className={label}>
          Email<Req />
        </label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" className={cls("email")} {...aria("email")} />
        <Err id="cf-email-error" msg={errors.email} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-phone" className={label}>
          Mob Numbers<Req />
        </label>
        <input id="cf-phone" name="phone" type="number" inputMode="tel" required autoComplete="tel" className={cls("phone")} {...aria("phone")} />
        <Err id="cf-phone-error" msg={errors.phone} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-product" className={label}>
          Products
        </label>
        <select id="cf-product" name="product" defaultValue={PRODUCT_OPTIONS[0]} className={`${cls("product")} pr-8`} {...aria("product")}>
          {PRODUCT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Err id="cf-product-error" msg={errors.product} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cf-requirements" className={label}>
          Leave Your Requirements
        </label>
        <textarea id="cf-requirements" name="requirements" rows={4} className={`${cls("requirements")} min-h-28 resize-y`} {...aria("requirements")} />
        <Err id="cf-requirements-error" msg={errors.requirements} />
      </div>

      <div className="flex flex-col gap-1.5">
        <p id="cf-terms-label" className={label}>
          Terms of Service<Req />
        </p>
        <div className="mt-0.5 flex items-start gap-2.5" role="group" aria-labelledby="cf-terms-label">
          <input
            id="cf-terms"
            name="terms"
            type="checkbox"
            value={TERMS_VALUE}
            required
            className="mt-0.5 size-4 shrink-0 rounded border-slate-300 text-brand accent-[#0a2b9b]"
            {...aria("terms")}
          />
          <label htmlFor="cf-terms" className="text-[14px] leading-[22px] text-slate-600">
            {TERMS_VALUE}
          </label>
        </div>
        <Err id="cf-terms-error" msg={errors.terms} />
      </div>

      {errors.form && <Err id="cf-form-error" msg={errors.form} />}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 inline-flex h-[52px] items-center justify-center gap-2 rounded-xl bg-cta px-8 font-inter text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-r-transparent" aria-hidden />
            Sending...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
