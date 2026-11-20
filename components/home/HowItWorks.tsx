import { ClipboardList, FileText, Truck, LifeBuoy, type LucideIcon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const steps: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: ClipboardList, title: "Share your requirement", text: "Tell us the devices, specs and duration you need." },
  { icon: FileText, title: "Get a quick quote", text: "Receive a tailored quote with flexible rental plans." },
  { icon: Truck, title: "Fast delivery & setup", text: "We deliver and set up your hardware, ready to work." },
  { icon: LifeBuoy, title: "Support & replacement", text: "Ongoing 24/7 support with rapid device replacement." },
];

/** 4-step process with a connecting line behind the numbered icons. */
export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="e-container px-5 py-14 md:px-6 md:py-20">
        <SectionHeader eyebrow="How it works" title="Renting made simple" subtitle="From requirement to support — four easy steps." />
        <Reveal className="reveal-stagger relative mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* connecting line (desktop) */}
          <div aria-hidden className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-brand-100 lg:block" />
          {steps.map((s, i) => (
            <div key={s.title} className="relative flex flex-col items-center gap-4 text-center">
              <span className="relative flex size-14 items-center justify-center rounded-2xl bg-brand text-white shadow-card">
                <s.icon className="size-6" aria-hidden />
                <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-[#063e24]">
                  {i + 1}
                </span>
              </span>
              <h3 className="font-poppins text-[17px] font-semibold text-brand-navy">{s.title}</h3>
              <p className="max-w-[240px] font-inter text-[14px] leading-6 text-muted">{s.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
