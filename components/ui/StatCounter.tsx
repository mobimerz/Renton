"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animated count-up stat. Counts from 0 to `value` once it scrolls into view,
 * using requestAnimationFrame (no animation library). Respects prefers-reduced-motion
 * and no-JS/SSR by rendering the final value immediately.
 */
export default function StatCounter({
  value,
  suffix = "",
  prefix = "",
  label,
  duration = 1600,
  className = "",
  tone = "brand",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
  /** "brand" = blue number on light bg; "onDark" = white number for dark bands */
  tone?: "brand" | "onDark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value); // SSR / no-JS shows the final number

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // Reduced motion / no IntersectionObserver: leave the final value in place (no animation).
    if (reduce || typeof IntersectionObserver === "undefined") return;
    let raf = 0;
    let start = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const step = (t: number) => {
          if (!start) start = t;
          const p = Math.min((t - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(Math.round(value * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  const numberCls = tone === "onDark" ? "text-white" : "text-brand";
  const labelCls = tone === "onDark" ? "text-white/70" : "text-muted";
  return (
    <div ref={ref} className={`flex flex-col items-center text-center ${className}`}>
      <div className={`font-poppins text-[38px] leading-none font-bold md:text-[48px] ${numberCls}`}>
        {prefix}
        {display.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className={`mt-2 font-inter text-[14px] font-medium md:text-[15px] ${labelCls}`}>{label}</div>
    </div>
  );
}
