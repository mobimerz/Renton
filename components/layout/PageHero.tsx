import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";

type Crumb = { name: string; path: string };

/**
 * Shared inner-page hero: a full-bleed background photo with a brand-blue overlay and the
 * text laid over it, so every page's banner looks consistent and premium.
 * Content (title, subtitle, actions) is per-page; `bg` is the background image.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  descriptionHtml,
  bg,
  actions,
  crumbs,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  descriptionHtml?: string;
  bg?: string;
  actions?: ReactNode;
  crumbs?: Crumb[];
}) {
  return (
    <section className="relative isolate flex min-h-[320px] items-center overflow-hidden md:min-h-[420px]">
      {bg && (
        <Image src={bg} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      )}
      {/* Brand-blue gradient overlay keeps the white text AA-legible over any photo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(10,43,155,0.92)_0%,rgba(20,35,68,0.84)_55%,rgba(7,22,79,0.9)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:26px_26px]"
      />
      <div className="e-container relative flex w-full flex-col items-center px-5 py-16 text-center md:px-6 md:py-20">
        <Reveal className="reveal-up flex flex-col items-center gap-4">
          {crumbs && crumbs.length > 1 && (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center justify-center gap-1.5 font-inter text-[12px] font-medium text-white/60">
                {crumbs.map((c, i) => (
                  <li key={c.path} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.path} className="transition-colors hover:text-white">
                        {c.name}
                      </Link>
                    ) : (
                      <span className="text-white/85" aria-current="page">
                        {c.name}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          {eyebrow && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-white/90 uppercase ring-1 ring-white/15">
              {eyebrow}
            </span>
          )}
          <h1 className="font-poppins text-[30px] leading-[1.1] font-bold text-white drop-shadow-sm md:text-[48px]">{title}</h1>
          {subtitle && <p className="font-poppins text-[18px] leading-snug font-semibold text-accent md:text-[22px]">{subtitle}</p>}
          {descriptionHtml && (
            <RichText html={descriptionHtml} className="max-w-[640px] font-inter text-[15px] leading-7 text-white/85 [&_p]:m-0" />
          )}
          {actions && <div className="mt-2 flex flex-wrap justify-center gap-3">{actions}</div>}
        </Reveal>
      </div>
    </section>
  );
}
