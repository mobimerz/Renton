"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";

export type Slide = { src: string; alt: string; caption?: string; width?: number; height?: number };

/**
 * Elementor image carousel: infinite loop, autoplay, pause on hover/interaction,
 * arrows + dots, 1 / 2 / 3 slides at mobile / tablet / desktop, 40px gap.
 */
export default function ImageCarousel({
  slides,
  autoplay = 5000,
  speed = 500,
  gap = 40,
  imageAspect = 424 / 252,
}: {
  slides: Slide[];
  autoplay?: number;
  speed?: number;
  gap?: number;
  /** width / height of each slide image (Elementor keeps the ratio, 424x252 on desktop) */
  imageAspect?: number;
}) {
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(0); // index into the extended list
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false); // pause_on_interaction
  const n = slides.length;

  useEffect(() => {
    const update = () => setPerView(window.innerWidth < 767 ? 1 : window.innerWidth < 1024 ? 2 : 3);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // clone slides on both sides for a seamless loop
  const extended = [...slides, ...slides, ...slides];
  const pos = index + n;

  const go = useCallback((d: number) => {
    setAnimate(true);
    setIndex((i) => i + d);
  }, []);

  // jump back into the middle copy without animation once we pass an edge
  useEffect(() => {
    if (index >= n || index < 0) {
      const t = setTimeout(() => {
        setAnimate(false);
        setIndex((i) => ((i % n) + n) % n);
      }, speed);
      return () => clearTimeout(t);
    }
  }, [index, n, speed]);

  useEffect(() => {
    if (!animate) {
      const r = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(r);
    }
  }, [animate]);

  useEffect(() => {
    if (paused || stopped || !autoplay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => go(1), autoplay);
    return () => clearInterval(t);
  }, [paused, stopped, autoplay, go]);

  const track = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const active = ((index % n) + n) % n;
  const slideW = `calc((100% - ${(perView - 1) * gap}px) / ${perView})`;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setStopped(true);
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      aria-roledescription="carousel"
    >
      <div className="overflow-hidden">
        <div
          ref={track}
          className="flex"
          style={{
            gap,
            transform: `translateX(calc(-${pos} * (${slideW} + ${gap}px)))`,
            transition: animate ? `transform ${speed}ms ease` : "none",
          }}
        >
          {extended.map((s, i) => (
            <figure
              key={i}
              className="m-0 shrink-0 text-center"
              style={{ width: slideW }}
              aria-hidden={i < pos || i >= pos + perView}
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={s.width ?? 600}
                height={s.height ?? 400}
                sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full rounded-lg object-cover"
                style={{ aspectRatio: imageAspect }}
              />
              {s.caption && (
                <figcaption className="mt-5 font-poppins text-[20px] leading-[30px] font-bold text-body">{s.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={() => {
          setStopped(true);
          go(-1);
        }}
        className="absolute left-2.5 z-10 text-[30px] text-[rgba(237,237,237,0.9)]"
        style={{ top: "calc((100% - 80px) / 2 - 15px)" }}
      >
        <Icon name="chevron-left" />
      </button>
      <button
        type="button"
        aria-label="Next slide"
        onClick={() => {
          setStopped(true);
          go(1);
        }}
        className="absolute right-2.5 z-10 text-[30px] text-[rgba(237,237,237,0.9)]"
        style={{ top: "calc((100% - 80px) / 2 - 15px)" }}
      >
        <Icon name="chevron-right" />
      </button>

      <div className="flex h-[30px] items-center justify-center">
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active}
            onClick={() => {
              setStopped(true);
              setAnimate(true);
              setIndex(i);
            }}
            // 24x24 tap target; the -3.5px margins keep the 17px dot pitch of the original 5px dots + 6px margins
            className="-mx-[3.5px] inline-flex size-6 cursor-pointer items-center justify-center p-0"
          >
            <span className="block size-[5px] rounded-full bg-black" style={{ opacity: i === active ? 1 : 0.2 }} aria-hidden="true" />
          </button>
        ))}
      </div>
    </div>
  );
}
