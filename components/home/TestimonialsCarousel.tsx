"use client";

import { useRef } from "react";
import TestimonialCard, { type Testimonial } from "@/components/ui/TestimonialCard";

/** Horizontal scroll-snap carousel of testimonials with prev/next controls. */
export default function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    track.scrollBy({ left: dir * amount, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className="relative mt-10">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((t, i) => (
          <div key={`${i}-${t.name}`} data-card className="w-[88%] shrink-0 snap-start sm:w-[46%] lg:w-[31.5%]">
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollByCards(-1)}
          aria-label="Previous testimonials"
          className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand transition-colors hover:border-brand hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden>
            <path d="M12.5 4L6.5 10l6 6 1.1-1.1L8.7 10l4.9-4.9z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scrollByCards(1)}
          aria-label="Next testimonials"
          className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand transition-colors hover:border-brand hover:bg-brand-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <svg viewBox="0 0 20 20" className="size-5 fill-current" aria-hidden>
            <path d="M7.5 4l6 6-6 6-1.1-1.1L11.3 10 6.4 5.1z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
