import Image from "next/image";
import { clientLogos } from "@/data/home-extra";

/** Auto-scrolling client-logos strip (CSS marquee, pauses on hover). Placeholders until real logos are added. */
export default function LogosMarquee() {
  // Duplicate the list so the -50% translate loops seamlessly.
  const row = [...clientLogos, ...clientLogos];
  return (
    <section className="border-y border-slate-100 bg-white">
      <div className="e-container px-5 py-10 md:px-6">
        <p className="mb-6 text-center font-inter text-[13px] font-semibold tracking-wide text-muted uppercase">
          Trusted by teams across Bangalore
        </p>
        <div className="marquee-group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="animate-marquee flex w-max items-center gap-12">
            {row.map((logo, i) => (
              <li key={i} className="flex h-12 w-[140px] shrink-0 items-center justify-center">
                {logo.src ? (
                  <Image src={logo.src} alt={logo.name} width={140} height={48} className="max-h-10 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0" />
                ) : (
                  // TODO: replace placeholder with a real client logo
                  <span className="flex h-12 w-full items-center justify-center rounded-xl bg-brand-50 font-poppins text-[13px] font-semibold text-brand-300">
                    {logo.name}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
