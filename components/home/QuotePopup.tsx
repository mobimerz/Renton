"use client";

import { useEffect, useState } from "react";
import ContactForm from "@/components/ContactForm";

const STORAGE_KEY = "renton:quote-popup-dismissed";
const OPEN_DELAY_MS = 2500;

/**
 * Lead-capture popup for the homepage. Opens a few seconds after load with the
 * working quote form (ContactForm → /api/contact). Shown once per browser
 * session: closing it (X, backdrop or Escape) is remembered in sessionStorage.
 */
export default function QuotePopup() {
  const [open, setOpen] = useState(false);

  // Open after a short delay, unless already dismissed this session.
  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* sessionStorage unavailable (private mode) — just show it */
    }
    if (dismissed) return;
    const t = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  // Lock body scroll + close on Escape while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-popup-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-brand-navy/60 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
      />

      {/* Dialog */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[480px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_-20px_rgba(10,43,155,0.5)] animate-[popIn_250ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header band */}
        <div className="relative shrink-0 bg-brand px-6 py-6 text-white">
          <button
            type="button"
            aria-label="Close popup"
            onClick={close}
            className="absolute top-3.5 right-3.5 flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
              <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41L10.59 13.4l-6.3 6.3 1.41 1.41 6.3-6.3 6.3 6.3 1.41-1.41-6.3-6.3 6.3-6.3z" />
            </svg>
          </button>
          <h2 id="quote-popup-title" className="font-poppins text-[22px] leading-tight font-bold">
            Get a Free Quote
          </h2>
          <p className="mt-1 font-inter text-[14px] text-white/85">
            Tell us what you need — we&apos;ll get back to you shortly.
          </p>
        </div>

        {/* Form (scrolls if tall) */}
        <div className="overflow-y-auto px-6 py-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
