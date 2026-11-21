import StatCounter from "@/components/ui/StatCounter";
import Reveal from "@/components/ui/Reveal";
import { homeStats } from "@/data/home-extra";

/** Animated counters on a premium dark brand band. Values are placeholders (data/home-extra.ts TODO). */
export default function StatsStrip() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(120deg,#0a2b9b_0%,#142344_60%,#07164f_100%)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10] [background-image:radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:26px_26px]"
      />
      <div className="e-container relative px-5 py-12 md:px-6 md:py-16">
        <Reveal className="reveal-stagger grid-auto-4 gap-y-10 md:divide-x md:divide-white/10">
          {homeStats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} prefix={s.prefix} label={s.label} tone="onDark" className="px-2" />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
