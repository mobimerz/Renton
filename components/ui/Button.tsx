import Link from "next/link";

type Variant = "primary" | "outline" | "navy" | "accent" | "white" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  // Brand-blue primary (kept key for existing pages)
  primary: "bg-cta text-white border-transparent hover:bg-brand-700 focus-visible:outline-brand",
  outline: "bg-white text-brand-navy border-slate-300 hover:border-brand hover:text-brand focus-visible:outline-brand",
  navy: "bg-brand-navy text-white border-transparent hover:bg-brand focus-visible:outline-brand",
  // Green accent — used sparingly (e.g. WhatsApp CTA)
  accent: "bg-accent text-[#063e24] border-transparent hover:brightness-95 focus-visible:outline-accent",
  white: "bg-white text-brand border-transparent hover:bg-brand-50 focus-visible:outline-white",
  ghost: "bg-transparent text-brand border-transparent hover:bg-brand-50 focus-visible:outline-brand",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5 text-[14px]",
  md: "px-7 py-3.5 text-[15px] md:px-9 md:py-4 md:text-[16px]",
  lg: "px-9 py-4 text-[16px] md:px-12 md:py-[18px] md:text-[18px]",
};

/** Site button/link. Renders <Link> for internal hrefs, <a> for external. */
export default function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  newTab = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  newTab?: boolean;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl border text-center font-inter leading-none font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 ${sizes[size]} ${variants[variant]} ${className}`;
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={cls} {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
