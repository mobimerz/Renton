import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";
import WhyChooseIcon from "@/components/home/WhyChooseIcon";
import type { InfoBox } from "@/data/home";

/** "Why Choose Renton?" feature cards. Presentation only — titles/text come from data/DB. */
export default function WhyChoose({ title, text, boxes }: { title: string; text: string; boxes: InfoBox[] }) {
  return (
    <section className="bg-brand-50">
      <div className="e-container px-5 py-14 md:px-6 md:py-20">
        <Reveal className="reveal-up mx-auto flex max-w-[720px] flex-col items-center gap-3 text-center">
          <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{title}</h2>
          <RichText html={text} className="font-inter text-[15px] leading-7 text-muted md:text-[17px] [&_p]:m-0" />
        </Reveal>

        <Reveal className="reveal-stagger mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {boxes.map((b, i) => (
            <article
              key={`${i}-${b.title}`}
              className="group relative overflow-hidden rounded-card border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-card-hover"
            >
              {/* soft colour glow that fades in on hover (per-card accent colour) */}
              <span
                aria-hidden
                className="pointer-events-none absolute -top-10 -right-10 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25"
                style={{ backgroundColor: b.iconColor }}
              />
              {/* thin accent bar that slides in from the left edge on hover */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-300 ease-out group-hover:scale-y-100"
                style={{ backgroundColor: b.iconColor }}
              />
              <div className="relative flex flex-col gap-4">
                <WhyChooseIcon icon={b.icon} color={b.iconColor} label={b.iconAlt} />
                <h3 className="font-poppins text-[19px] font-semibold text-brand-navy">{b.title}</h3>
                <RichText html={b.text} className="font-inter text-[14px] leading-6 text-muted [&_p]:m-0" />
                <span
                  aria-hidden
                  className="mt-1 h-1 w-9 rounded-full transition-all duration-300 ease-out group-hover:w-16"
                  style={{ backgroundColor: b.iconColor }}
                />
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
