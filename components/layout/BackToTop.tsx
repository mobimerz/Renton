"use client";

import { useEffect, useState } from "react";

/** Phlox "go to top" button: round outline button, bottom-right, shown after scrolling. */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group fixed right-[50px] bottom-[30px] z-[140] flex size-[35px] items-center justify-center overflow-hidden rounded-full bg-white shadow-[inset_0_0_0_1px_#d5d5d5] transition-all duration-300 hover:bg-[#444] ${
        show ? "visible translate-y-0 opacity-100" : "invisible translate-y-[100px] opacity-0"
      }`}
    >
      <svg viewBox="0 0 10 12" className="h-3 w-2.5 text-black group-hover:text-white" aria-hidden="true">
        <path d="M5 1v10M1 5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  );
}
