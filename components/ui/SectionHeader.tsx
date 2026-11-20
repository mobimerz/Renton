import type { ReactNode } from "react";

/**
 * Consistent section heading: small eyebrow + title + optional subtitle.
 * Presentational only — pass DB/data strings straight in.
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
  titleAs: Title = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
  className?: string;
  titleAs?: "h1" | "h2" | "h3";
}) {
  const alignCls = align === "center" ? "mx-auto text-center items-center" : "text-left items-start";
  return (
    <div className={`flex max-w-[720px] flex-col gap-3 ${alignCls} ${className}`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold tracking-wide text-brand-700 uppercase">
          {eyebrow}
        </span>
      )}
      <Title className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{title}</Title>
      {subtitle && <p className="font-inter text-[15px] leading-7 text-muted md:text-[17px]">{subtitle}</p>}
    </div>
  );
}
