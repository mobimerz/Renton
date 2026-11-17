"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import { whatsappWidget as wa } from "@/data/site";

/** Rebuild of the WP WhatsApp (NinjaTeam) floating chat button + popup used on every page. */
export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="font-[Arial,Helvetica,sans-serif]">
      {/* Popup */}
      <div
        role="dialog"
        aria-label={wa.title}
        aria-hidden={!open}
        className={`fixed z-[9999] w-[351px] max-w-[calc(100vw-40px)] overflow-hidden rounded-[5px_5px_8px_8px] shadow-[0_10px_10px_4px_rgba(0,0,0,0.04)] transition-all duration-300 ${
          open ? "visible translate-y-0 opacity-100" : "invisible translate-y-[50px] opacity-0"
        }`}
        style={{ right: wa.right, bottom: wa.bottom + 72 }}
      >
        <div className="relative pt-[15px] pr-[43px] pb-[17px] pl-[74px]" style={{ background: wa.color }}>
          <Icon name="whatsapp" className="absolute top-1/2 left-[25px] -translate-y-1/2 text-[34px] text-white" />
          <div className="pt-0.5 text-[18px] leading-tight text-white">{wa.title}</div>
          <div className="pt-1 text-[12px] leading-[1.5] text-[#d9ebc6]">
            {wa.description.before}
            <strong>{wa.description.strong}</strong>
            {wa.description.after}
          </div>
        </div>
        <div className="bg-white pt-[13px] pr-5 pb-[21px] pl-[19px]">
          <a
            href={wa.chatUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="relative block rounded-[2px] border-l-2 border-[#2db742] bg-[#f5f7f9] pt-[13px] pr-10 pb-3 pl-[74px] hover:bg-[#eef0f3]"
          >
            <span className="absolute top-1/2 left-3 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-[#55cd6c]">
              <Icon name="whatsapp" className="text-[28px] text-white" />
            </span>
            <span className="block text-[14px] leading-tight text-[#363c47]">{wa.account.name}</span>
            <span className="block pt-0.5 text-[11px] leading-tight text-[#989b9f]">{wa.account.title}</span>
            <Icon name="whatsapp" className="absolute top-1/2 right-4 -translate-y-1/2 text-[20px] text-[#2db742]" />
          </a>
        </div>
      </div>

      {/* Floating button + label */}
      <div className="fixed z-[9999] flex items-center" style={{ right: wa.right, bottom: wa.bottom }}>
        {!open && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mr-[7px] w-[156px] rounded px-3 py-2 text-left text-[12px] leading-[18px] text-[#43474e] shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
            style={{ backgroundColor: "#f5f7f9" }}
          >
            {wa.buttonLabel.text} <strong>{wa.buttonLabel.strong}</strong>
          </button>
        )}
        <button
          type="button"
          aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="flex size-14 items-center justify-center rounded-full text-white shadow-[0_6px_8px_2px_rgba(0,0,0,0.14)]"
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
