import { Building2, Rocket, CalendarDays, GraduationCap, User, ArrowUpRight, type LucideIcon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const audiences: { icon: LucideIcon; title: string }[] = [
  { icon: Building2, title: "Corporates" },
  { icon: Rocket, title: "Startups" },
  { icon: CalendarDays, title: "Events" },
  { icon: GraduationCap, title: "Educational institutes" },
  { icon: User, title: "Individuals & students" },
];

/** Asymmetric editorial layout: sticky intro on the left, audience list on the right. */
export default function WhoWeServe() {
  return (
    <section className="bg-brand-50">
      <div className="e-container grid gap-10 px-5 py-14 md:px-6 md:py-20 lg:grid-cols-[0.9fr_1.3fr] lg:gap-16">
        <Reveal className="reveal-up flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold tracking-wide text-brand-700 uppercase ring-1 ring-brand-100">
            Who we serve
          </span>
          <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">Built for every kind of team</h2>
          <p className="font-inter text-[15px] leading-7 text-muted md:text-[17px]">Scalable IT rental for organisations of every size.</p>
        </Reveal>

        <Reveal className="reveal-stagger divide-y divide-slate-200 overflow-hidden rounded-card border border-slate-100 bg-white shadow-card">
          {audiences.map((a) => (
            <div key={a.title} className="group flex items-center gap-4 px-6 py-5 transition-colors hover:bg-brand-50">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                <a.icon className="size-6" aria-hidden />
              </span>
              <h3 className="flex-1 font-poppins text-[17px] font-semibold text-brand-navy md:text-[19px]">{a.title}</h3>
              <ArrowUpRight className="size-5 shrink-0 text-brand-300 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand" aria-hidden />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
