import type { ReactNode } from "react";

type Tone = "brand" | "accent" | "navy" | "soft";

const tones: Record<Tone, string> = {
  brand: "bg-brand text-white",
  accent: "bg-accent/15 text-[#0b7a46]",
  navy: "bg-brand-navy text-white",
  soft: "bg-brand-50 text-brand-700",
};

/** Small pill — used for category chips and trust badges. Green accent used sparingly. */
export default function Badge({
  children,
  tone = "soft",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
