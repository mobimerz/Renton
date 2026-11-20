import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { Slide } from "@/components/ui/ImageCarousel";
import { productBlurbs } from "@/data/home-extra";

/** Rental products as a responsive card grid (replaces the old duplicated carousel markup). */
export default function ProductsGrid({ slides }: { slides: Slide[] }) {
  return (
    <Reveal className="reveal-stagger mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {slides.map((s) => {
        const label = s.caption ?? s.alt;
        return (
          <article
            key={s.src}
            className="group flex flex-col overflow-hidden rounded-card border border-slate-100 bg-white shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
          >
            <div className="relative aspect-[16/11] overflow-hidden bg-brand-50">
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
            <div className="flex grow flex-col gap-2 p-5">
              <h3 className="font-poppins text-[19px] font-semibold text-brand-navy">{label}</h3>
              <p className="grow font-inter text-[14px] leading-6 text-muted">{productBlurbs[label] ?? "Available for flexible rent."}</p>
              <Link
                href="/contact/"
                className="mt-1 inline-flex w-fit items-center gap-1.5 font-inter text-[14px] font-semibold text-brand transition-colors hover:text-brand-700"
              >
                Get Quote
                <svg viewBox="0 0 20 20" className="size-4 fill-current transition-transform group-hover:translate-x-0.5" aria-hidden>
                  <path d="M7.5 4l6 6-6 6-1.1-1.1L11.3 10 6.4 5.1z" />
                </svg>
              </Link>
            </div>
          </article>
        );
      })}
    </Reveal>
  );
}
