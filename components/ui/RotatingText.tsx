"use client";

import { useEffect, useState } from "react";

/**
 * Royal Addons "advanced text" (rotate-1 effect): words flip in on the X axis one after another.
 * All words are rendered for SEO/accessibility; only the active one is visible.
 */
export default function RotatingText({ words, interval = 2500, className = "" }: { words: string[]; interval?: number; className?: string }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={`relative inline-block [perspective:300px] ${className}`}>
      {/* invisible sizer keeps the line height stable */}
      <span className="invisible block whitespace-nowrap" aria-hidden="true">
        {words.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      {words.map((w, n) => (
        <b
          key={w}
          aria-hidden={n !== i}
          className={`absolute top-0 left-0 font-[inherit] whitespace-nowrap transition-[transform,opacity] duration-[1200ms] [transform-origin:50%_100%] ${
            n === i ? "[transform:rotateX(0deg)] opacity-100" : "[transform:rotateX(180deg)] opacity-0"
          }`}
        >
          {w}
        </b>
      ))}
    </span>
  );
}
