"use client";

import { useState } from "react";
import Icon, { type IconName } from "@/components/Icon";

/** Phlox single-post share button: share icon that reveals a dark tooltip with share links. */
export default function PostShare({ url, title }: { url: string; title: string }) {
  const [open, setOpen] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links: { label: string; icon: IconName; href: string }[] = [
    { label: "Facebook", icon: "facebook-f", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "X (Twitter)", icon: "x-twitter", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { label: "LinkedIn", icon: "linkedin-in", href: `https://www.linkedin.com/shareArticle?mini=true&url=${u}&title=${t}` },
    { label: "Pinterest", icon: "pinterest", href: `https://pinterest.com/pin/create/button/?url=${u}&description=${t}` },
    { label: "WhatsApp", icon: "whatsapp", href: `https://wa.me/?text=${t}%20${u}` },
  ];
  return (
    <div className="aux-single-post-share relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label="Share this post"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-1.5 text-[14px] text-[#3d3d3d] hover:text-[#1bb0ce]"
      >
        <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18 16.1c-.8 0-1.4.3-2 .8l-7.1-4.2c.1-.2.1-.5.1-.7s0-.5-.1-.7L16 7.2c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .2 0 .5.1.7L8 9.8C7.5 9.3 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.4-.1.6 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9-1.2-2.9-2.8-2.9z"
          />
        </svg>
      </button>
      <ul
        className={`absolute right-0 bottom-full z-10 mb-2 flex gap-1 rounded bg-[#3d3d3d] p-1.5 transition-opacity ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${l.label}`}
              className="flex size-8 items-center justify-center text-[14px] text-white hover:text-[#1bb0ce]"
            >
              <Icon name={l.icon} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
