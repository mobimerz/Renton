import type { ReactNode } from "react";

/**
 * Icon badge + title + description. The icon colour defaults to the brand blue;
 * pass `color` (any CSS colour) to tint the badge, e.g. per-feature colours from data.
 */
export default function IconFeature({
  icon,
  title,
  children,
  color,
  className = "",
}: {
  icon: ReactNode;
  title: ReactNode;
  children?: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <div className={`group flex flex-col gap-4 ${className}`}>
      <span
        className={`flex size-14 shrink-0 items-center justify-center rounded-2xl text-[22px] text-white transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110 ${color ? "" : "bg-brand"}`}
        style={color ? { backgroundColor: color } : undefined}
        aria-hidden
      >
        {icon}
      </span>
      <h3 className="font-poppins text-[18px] leading-tight font-semibold text-brand-navy">{title}</h3>
      {children && <div className="font-inter text-[15px] leading-7 text-muted">{children}</div>}
    </div>
  );
}
