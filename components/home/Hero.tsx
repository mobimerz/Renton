import Image from "next/image";
import RichText from "@/components/ui/RichText";
import RotatingText from "@/components/ui/RotatingText";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

type Hero = {
  kicker: string;
  headline: string;
  rotating: string[];
  text: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  image: { src: string; alt: string; width?: number; height?: number };
};

const trust = ["24-hour delivery", "1 month–3 year plans", "24/7 support"];
/** Full-bleed hero background photo. */
const HERO_BG = "/images/pexels-photo-1181354-1181354-scaled.jpg";

export default function Hero({ hero }: { hero: Hero }) {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden md:min-h-[640px]">
      <Image src={HERO_BG} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
      {/* Brand-blue gradient overlay keeps the white text legible over the photo */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(120deg,rgba(7,22,79,0.94)_0%,rgba(10,43,155,0.82)_45%,rgba(20,35,68,0.72)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.10] [background-image:radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:26px_26px]"
      />
      <div className="e-container relative px-5 py-16 md:px-6 md:py-24">
        <Reveal className="reveal-up flex max-w-[680px] flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[12px] font-semibold tracking-wide text-white/90 uppercase ring-1 ring-white/15">
            {hero.kicker}
          </span>
          <h1 className="font-poppins text-[36px] leading-[1.06] font-bold text-white md:text-[56px]">
            {hero.headline}
            <br />
            <RotatingText words={hero.rotating} className="text-accent" />
          </h1>
          <RichText html={hero.text} className="max-w-[560px] font-inter text-[15px] leading-7 text-white/85 md:text-[16px] [&_p]:m-0" />

          <ul className="flex flex-wrap gap-2.5">
            {hero.rotating.map((r) => (
              <li
                key={r}
                className="rounded-full bg-white/10 px-3.5 py-1.5 text-[13px] font-medium text-white ring-1 ring-white/15 backdrop-blur-sm"
              >
                {r}
              </li>
            ))}
          </ul>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <Button href={hero.primary.href} variant="white" size="lg">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="accent" size="lg" newTab>
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm5.9 14.2c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.1-.8-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.9c.2-.3.4-.2.6-.1l1.9.9c.2.1.4.2.5.3.1.2.1.6-.1 1.1z" />
              </svg>
              WhatsApp
            </Button>
          </div>

          <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/80">
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <svg viewBox="0 0 20 20" className="size-4 fill-accent" aria-hidden>
                  <path d="M8 13.2L4.8 10l-1.1 1.1L8 15.4l8.4-8.4-1.1-1.1z" />
                </svg>
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
