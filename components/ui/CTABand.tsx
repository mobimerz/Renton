import type { ReactNode } from "react";

/**
 * Full-width call-to-action band on a brand-blue gradient.
 * Text is white (AA contrast on the dark brand gradient). Pass buttons as children.
 */
export default function CTABand({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-card bg-[linear-gradient(120deg,#0a2b9b_0%,#142344_100%)] px-6 py-10 text-center md:px-12 md:py-14 ${className}`}
    >
      {/* subtle brand dot pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:22px_22px]"
      />
      <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-5">
        <h2 className="font-poppins text-[24px] leading-tight font-bold text-white md:text-[34px]">{title}</h2>
        {subtitle && <p className="font-inter text-[15px] leading-7 text-white/85 md:text-[17px]">{subtitle}</p>}
        {children && <div className="mt-1 flex flex-wrap items-center justify-center gap-3">{children}</div>}
      </div>
    </div>
  );
}
