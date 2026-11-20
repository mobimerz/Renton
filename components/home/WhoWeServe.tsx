import { Building2, Rocket, CalendarDays, GraduationCap, User, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const audiences: { icon: LucideIcon; title: string }[] = [
  { icon: Building2, title: "Corporates" },
  { icon: Rocket, title: "Startups" },
  { icon: CalendarDays, title: "Events" },
  { icon: GraduationCap, title: "Educational institutes" },
  { icon: User, title: "Individuals & students" },
];

/** Who Renton serves — compact icon cards. */
export default function WhoWeServe() {
  return (
    <section className="bg-brand-50">
      <div className="e-container px-5 py-14 md:px-6 md:py-20">
        <SectionHeader eyebrow="Who we serve" title="Built for every kind of team" subtitle="Scalable IT rental for organisations of every size." />
        <Reveal className="reveal-stagger mt-10 grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-5">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="group flex flex-col items-center gap-3 rounded-card border border-slate-100 bg-white p-6 text-center shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <span className="flex size-14 items-center justify-center rounded-2xl bg-brand text-white transition-transform duration-300 group-hover:scale-110">
                <a.icon className="size-6" aria-hidden />
              </span>
              <h3 className="font-poppins text-[15px] font-semibold text-brand-navy">{a.title}</h3>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
