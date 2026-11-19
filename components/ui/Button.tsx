import Link from "next/link";

type Variant = "primary" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-cta text-white border-cta-border hover:bg-[#0366d6]",
  outline: "bg-white text-[#15063f] border-[#b5bbcc] capitalize hover:bg-[#f3f4f8]",
};

/** Elementor button widget (Inter 600, 8px radius). External links open like on WordPress (same tab). */
export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const cls = `inline-block rounded-lg border-[0.8px] px-10 py-[18px] text-center font-inter text-[14px] leading-none font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg md:px-[60px] md:py-5 md:text-[18px] ${variants[variant]} ${className}`;
  return href.startsWith("/") ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
