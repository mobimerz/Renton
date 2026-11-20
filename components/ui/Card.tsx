import type { ReactNode } from "react";

/**
 * Rounded surface card with soft brand shadow and an optional hover lift.
 * `as` lets callers render it as <article>, <li>, etc.
 */
export default function Card({
  children,
  className = "",
  hover = true,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "li" | "figure";
}) {
  const hoverCls = hover
    ? "transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
    : "";
  return (
    <Tag className={`rounded-card border border-slate-100 bg-white p-6 shadow-card md:p-7 ${hoverCls} ${className}`}>
      {children}
    </Tag>
  );
}
