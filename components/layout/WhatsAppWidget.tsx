"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { whatsappWidget as wa } from "@/data/site";

/** Modern floating WhatsApp chat button + popup (CSS-only open/close animation). */
export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="font-inter">
      {/* Popup */}
      <div
        role="dialog"
        aria-label={wa.title}
        aria-hidden={!open}
        className={`fixed z-[9999] w-[340px] max-w-[calc(100vw-40px)] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_-12px_rgba(0,0,0,0.3)] ring-1 ring-black/5 transition-all duration-300 ease-out ${
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible translate-y-3 scale-95 opacity-0"
        }`}
        style={{ right: wa.right, bottom: wa.bottom + 76 }}
      >
        <div className="relative flex items-center gap-3 bg-[linear-gradient(135deg,#2db742_0%,#1f9e36_100%)] px-5 py-4 text-white">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Icon name="whatsapp" className="text-[26px] text-white" />
          </span>
          <div>
            <div className="text-[16px] leading-tight font-semibold">{wa.title}</div>
            <div className="pt-0.5 text-[12px] leading-[1.5] text-white/90">
              {wa.description.before}
              <strong>{wa.description.strong}</strong>
              {wa.description.after}
            </div>
          </div>
        </div>
        <div className="p-4">
          <a
            href={wa.chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="relative flex items-center gap-3 rounded-xl bg-[#f5f7f9] p-3 transition-colors hover:bg-[#eef0f3]"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#55cd6c]">
              <Icon name="whatsapp" className="text-[24px] text-white" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] leading-tight font-semibold text-[#363c47]">{wa.account.name}</span>
              <span className="block pt-0.5 text-[11px] leading-tight text-[#989b9f]">{wa.account.title}</span>
            </span>
            <Icon name="whatsapp" className="text-[20px] text-[#2db742]" />
          </a>
        </div>
      </div>

      {/* Floating button + label */}
      <div className="fixed z-[9999] flex items-center" style={{ right: wa.right, bottom: wa.bottom }}>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mr-2.5 rounded-xl bg-white px-3.5 py-2.5 text-left text-[12px] leading-[18px] text-[#43474e] shadow-[0_6px_18px_-4px_rgba(0,0,0,0.2)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5"
          >
            {wa.buttonLabel.text} <strong>{wa.buttonLabel.strong}</strong>
          </button>
        )}
        <button
          type="button"
          aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`flex size-14 items-center justify-center rounded-full text-white shadow-[0_8px_20px_-4px_rgba(45,183,66,0.6)] transition-transform duration-200 hover:scale-105 ${open ? "" : "animate-wa-pulse"}`}
          style={{ backgroundColor: wa.color }}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <Icon name="whatsapp" className="text-[32px]" />
          )}
        </button>
      </div>
    </div>
  );
}
