import Image from "next/image";

export type Testimonial = {
  content: string;
  name: string;
  job?: string;
  /** optional, existing DB data has { src, alt } or null */
  img?: { src: string; alt: string } | null;
  /** optional 1–5 rating; falls back to 5 when absent so existing data still renders */
  rating?: number;
};

/** Initials for the avatar fallback when no image is set. */
function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** Quote card with stars, avatar (or initials) and attribution. All new fields are optional. */
export default function TestimonialCard({ t }: { t: Testimonial }) {
  const rating = Math.max(1, Math.min(5, Math.round(t.rating ?? 5)));
  return (
    <figure className="flex h-full flex-col gap-4 rounded-card border border-white/10 bg-card-dark p-7 text-white shadow-card transition-transform duration-300 ease-out hover:-translate-y-1.5">
      <div className="flex items-center gap-0.5 text-accent" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className={`size-4 ${i < rating ? "fill-accent" : "fill-white/20"}`} aria-hidden>
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
          </svg>
        ))}
      </div>
      <blockquote className="grow font-inter text-[15px] leading-7 text-white/90">{t.content}</blockquote>
      <figcaption className="mt-1 flex items-center gap-3 border-t border-white/10 pt-4">
        {t.img ? (
          <Image src={t.img.src} alt={t.img.alt} width={48} height={48} className="size-12 rounded-full object-cover" />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full bg-brand font-poppins text-[15px] font-semibold text-white">
            {initials(t.name)}
          </span>
        )}
        <span>
          <cite className="block font-poppins text-[15px] font-semibold text-white not-italic">{t.name}</cite>
          {t.job && <span className="block font-inter text-[13px] text-white/60">{t.job}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
