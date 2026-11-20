import StatCounter from "@/components/ui/StatCounter";
import Reveal from "@/components/ui/Reveal";
import { homeStats } from "@/data/home-extra";

/** Animated counters band. Values are placeholders (see data/home-extra.ts TODO). */
export default function StatsStrip() {
  return (
    <section className="bg-brand-50">
      <div className="e-container px-5 py-10 md:px-6 md:py-12">
        <Reveal className="reveal-stagger grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-4">
          {homeStats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} prefix={s.prefix} label={s.label} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
