import { BadgeCheck, CalendarClock, CreditCard, Headset, RefreshCw, Truck, type LucideIcon } from "lucide-react";

/**
 * Icon in the coloured oval on the Home "Why Choose Renton?" boxes.
 *
 * The live site's icon files (noun_*.png) return 404, so these lucide-react icons stand in.
 * To use the original artwork later: put the PNGs in /public/images and set `src` for that key
 * in `originals` below. An <img> is then rendered instead of the lucide icon.
 */
export type WhyChooseIconKey = "delivery" | "payment" | "duration" | "quality" | "replacement" | "support";

const lucide: Record<WhyChooseIconKey, LucideIcon> = {
  delivery: Truck,
  payment: CreditCard,
  duration: CalendarClock,
  quality: BadgeCheck,
  replacement: RefreshCw,
  support: Headset,
};

/** Original WordPress filenames, for when they are recovered. */
const originals: Record<WhyChooseIconKey, { file: string; src?: string }> = {
  delivery: { file: "noun_money-beg_2256476.png" },
  payment: { file: "noun_code_721883-1.png" },
  duration: { file: "noun_test_1672713-1.png" },
  quality: { file: "noun_marketing_2481623.png" },
  replacement: { file: "noun_User-Management_1845018.png" },
  support: { file: "noun_SEO_1248986.png" },
};

export default function WhyChooseIcon({ icon, color, label }: { icon: WhyChooseIconKey; color: string; label: string }) {
  const Lucide = lucide[icon];
  const original = originals[icon].src;
  return (
    <span
      role="img"
      aria-label={label}
      className="flex size-[60px] shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:-rotate-6 group-hover:scale-110"
      style={{ backgroundColor: color, boxShadow: `0 10px 22px -6px ${color}73` }}
    >
      {original ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={original} alt="" className="max-h-[30px] max-w-[50px]" />
      ) : (
        <Lucide aria-hidden="true" className="size-7 text-white transition-transform duration-300 ease-out group-hover:scale-110" strokeWidth={2.2} />
      )}
    </span>
  );
}
