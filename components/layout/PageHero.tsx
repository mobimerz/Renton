import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";

type Crumb = { name: string; path: string };

/**
 * Shared inner-page hero: the same brand-gradient banner as the home hero, so every page's
 * top looks consistent. Content (title, subtitle, image, actions) is per-page.
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  descriptionHtml,
  image,
  actions,
  crumbs,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  descriptionHtml?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  actions?: ReactNode;
  crumbs?: Crumb[];
}) {
  const hasImage = Boolean(image);
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#0a2b9b_0%,#142344_60%,#07164f_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:26px_26px]"
      />
      <div
        className={`e-container relative gap-10 px-5 py-14 md:px-6 md:py-20 ${
          hasImage ? "grid items-center md:grid-cols-2" : "flex flex-col items-center text-center"
        }`}
      >
        <Reveal className={`reveal-up flex flex-col gap-4 ${hasImage ? "" : "items-center"}`}>
          {crumbs && crumbs.length > 1 && (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 font-inter text-[12px] font-medium text-white/60">
                {crumbs.map((c, i) => (
                  <li key={c.path} className="flex items-center gap-1.5">
                    {i > 0 && <span aria-hidden>/</span>}
                    {i < crumbs.length - 1 ? (
                      <Link href={c.path} className="transition-colors hover:text-white">
                        {c.name}
                      </Link>
                    ) : (
                      <span className="text-white/80" aria-current="page">
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
          <h1 className="font-poppins text-[30px] leading-[1.1] font-bold text-white md:text-[46px]">{title}</h1>
          {subtitle && <p className="font-poppins text-[18px] leading-snug font-semibold text-accent md:text-[22px]">{subtitle}</p>}
          {descriptionHtml && (
            <RichText html={descriptionHtml} className="max-w-[620px] font-inter text-[15px] leading-7 text-white/80 [&_p]:m-0" />
          )}
          {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
        </Reveal>

        {image && (
          <Reveal className="reveal-up" delay={150}>
            <div className="relative mx-auto max-w-[560px]">
              <div aria-hidden className="absolute -inset-4 rounded-[32px] bg-brand-bright/20 blur-2xl" />
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 1024}
                height={image.height ?? 683}
                priority
                sizes="(max-width: 767px) 100vw, 45vw"
                className="relative w-full rounded-[24px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
              />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
