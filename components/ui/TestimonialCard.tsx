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

/** Modern light quote card: big decorative quote mark, accent stars, avatar + attribution. */
export default function TestimonialCard({ t }: { t: Testimonial }) {
  const rating = Math.max(1, Math.min(5, Math.round(t.rating ?? 5)));
  return (
    <figure className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-card border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover">
      {/* accent bar on top */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0a2b9b,#28e98c)]" />
      {/* big decorative quote mark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-3 right-5 font-poppins text-[96px] leading-none font-bold text-brand-50 select-none"
      >
        &rdquo;
      </span>

      <div className="relative flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} viewBox="0 0 20 20" className={`size-4 ${i < rating ? "fill-accent" : "fill-slate-200"}`} aria-hidden>
            <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15l-5.2 2.6 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
          </svg>
        ))}
      </div>

      <blockquote className="relative grow font-inter text-[15px] leading-7 text-slate-600">{t.content}</blockquote>

      <figcaption className="relative mt-1 flex items-center gap-3 border-t border-slate-100 pt-4">
        {t.img ? (
          <Image src={t.img.src} alt={t.img.alt} width={48} height={48} className="size-12 rounded-full object-cover ring-2 ring-brand-50" />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#0a2b9b,#142344)] font-poppins text-[15px] font-semibold text-white">
            {initials(t.name)}
          </span>
        )}
        <span>
          <cite className="block font-poppins text-[15px] font-semibold text-brand-navy not-italic">{t.name}</cite>
          {t.job && <span className="block font-inter text-[13px] text-muted">{t.job}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
