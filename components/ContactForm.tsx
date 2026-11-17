"use client";

import { useEffect, useRef, useState } from "react";
import { PRODUCT_OPTIONS, TERMS_VALUE, contactSchema } from "@/lib/contact-schema";

type Errors = Partial<Record<"name" | "email" | "phone" | "product" | "requirements" | "terms" | "form", string>>;

const label = "-mt-[15px] block font-raleway text-[17.6px] leading-[26.4px] font-bold text-[#3d3d3d]";
const input = "block w-full border border-[#bbb] bg-white px-[17.6px] font-raleway text-[16px] text-body focus:border-[#999] focus:outline-none";
const Req = () => <span className="font-normal text-[#ff0000]"> *</span>;
const Err = ({ id, msg }: { id: string; msg?: string }) =>
  msg ? (
    <em id={id} className="mt-[5px] block font-raleway text-[14px] not-italic text-[#990000]" role="alert">
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
      <div className="mx-auto mt-[30px] w-[290px] max-w-full border border-[#b4d39b] bg-[#dff0d8] px-5 py-[15px] font-raleway text-[16px] text-[#3c763d]" role="status">
        <p>Thanks for contacting us! We will be in touch with you shortly.</p>
      </div>
    );
  }

  const aria = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `cf-${k}-error` } : {});

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto mt-[30px] w-[290px] max-w-full">
      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="py-2.5">
        <label htmlFor="cf-name" className={label}>
          Name<Req />
        </label>
        <input id="cf-name" name="name" type="text" required autoComplete="name" className={`${input} h-[43px]`} {...aria("name")} />
        <Err id="cf-name-error" msg={errors.name} />
      </div>

      <div className="py-2.5">
        <label htmlFor="cf-email" className={label}>
          Email<Req />
        </label>
        <input id="cf-email" name="email" type="email" required autoComplete="email" className={`${input} h-[43px]`} {...aria("email")} />
        <Err id="cf-email-error" msg={errors.email} />
      </div>

      <div className="py-2.5">
        <label htmlFor="cf-phone" className={label}>
          Mob Numbers<Req />
        </label>
        {/* The live site leaves this number input with the browser's default inset border */}
        <input
          id="cf-phone"
          name="phone"
          type="number"
          inputMode="tel"
          required
          autoComplete="tel"
          className="block h-[43px] w-full border-2 [border-style:inset] border-[#767676] bg-white px-0.5 py-px font-raleway text-[16px] text-body"
          {...aria("phone")}
        />
        <Err id="cf-phone-error" msg={errors.phone} />
      </div>

      <div className="py-2.5">
        <label htmlFor="cf-product" className={label}>
          Products
        </label>
        <select
          id="cf-product"
          name="product"
          defaultValue={PRODUCT_OPTIONS[0]}
          className="block h-[34px] w-[174px] max-w-full border border-[#bbb] bg-transparent pr-2 pl-[18px] font-raleway text-[16px] text-body"
          {...aria("product")}
        >
          {PRODUCT_OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <Err id="cf-product-error" msg={errors.product} />
      </div>

      <div className="py-2.5">
        <label htmlFor="cf-requirements" className={label}>
          Leave Your Requirements
        </label>
        <textarea id="cf-requirements" name="requirements" className={`${input} h-[120px] py-[17.6px]`} {...aria("requirements")} />
        <Err id="cf-requirements-error" msg={errors.requirements} />
      </div>

      <div className="py-2.5">
        {/* <legend> ignores negative margins, so the group label is a plain element */}
        <p id="cf-terms-label" className={label}>
          Terms of Service<Req />
        </p>
        <div className="mt-1 flex items-start" role="group" aria-labelledby="cf-terms-label">
          <input id="cf-terms" name="terms" type="checkbox" value={TERMS_VALUE} required className="mt-[3px] mr-2.5 ml-[3px] size-[13px] shrink-0" {...aria("terms")} />
          <label htmlFor="cf-terms" className="font-raleway text-[17.6px] leading-[23px] text-[#3d3d3d]">
            {TERMS_VALUE}
          </label>
        </div>
        <Err id="cf-terms-error" msg={errors.terms} />
      </div>

      {errors.form && <Err id="cf-form-error" msg={errors.form} />}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-[14px] h-[53px] bg-[#f0f0f0] px-[35px] font-raleway text-[13px] font-semibold text-body hover:bg-[#e2e2e2] disabled:opacity-70"
      >
        {status === "sending" ? "Sending..." : "Submit"}
      </button>
    </form>
  );
}
