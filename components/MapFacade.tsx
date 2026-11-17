"use client";

import { useState } from "react";

/**
 * Click-to-load Google Map. Until the visitor clicks/taps, it shows a static snapshot of the same
 * embed (scripts/capture-maps.mjs) at native scale, centred on the pin exactly like the iframe, plus
 * the compact "Open in Maps" chip and attribution Google draws at these sizes. The real iframe
 * (about 600 KB of Maps scripts) only loads after the click.
 */
export default function MapFacade({
  src,
  title,
  height,
  snapshot,
  className = "",
}: {
  src: string;
  title: string;
  height: number;
  snapshot: { src: string; src2x: string };
  className?: string;
}) {
  const [active, setActive] = useState(false);
  const q = new URL(src).searchParams.get("q") ?? "Renton Technologies LLP";
  const openHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

  if (active)
    return (
      <iframe
        src={src}
        title={title}
        aria-label={title}
        referrerPolicy="no-referrer-when-downgrade"
        className={`block w-full border-0 ${className}`}
        style={{ height }}
      />
    );

  return (
    <div className={`@container relative block w-full overflow-hidden bg-[#e5e3df] ${className}`} style={{ height }}>
      <button
        type="button"
        onClick={() => setActive(true)}
        aria-label={`Load interactive map: ${title}`}
        className="absolute inset-0 block size-full cursor-pointer p-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- density srcset keeps native map scale with object-fit:none */}
        <img
          src={snapshot.src}
          srcSet={`${snapshot.src} 1x, ${snapshot.src2x} 2x`}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block size-full max-w-none object-none object-center"
        />
      </button>
      {/* Google's compact place chip (shown instead of the full card at these map sizes) */}
      <a
        href={openHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-2 left-2 inline-flex h-8 items-center gap-1.5 rounded-[2px] bg-white px-3 font-roboto text-[14px] leading-none font-medium text-[#1a73e8] shadow-[0_1px_4px_-1px_rgba(0,0,0,0.3)]"
      >
        <span className="hidden @[300px]:inline">Open in Maps</span>
        <span className="@[300px]:hidden">Maps</span>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="currentColor">
          <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
        </svg>
      </a>
      <span className="pointer-events-none absolute right-0 bottom-0 bg-[rgba(245,245,245,0.7)] px-1.5 font-roboto text-[10px] leading-[14px] text-black">
        Map data ©2026 Google
      </span>
    </div>
  );
}
