import { MapPin, Phone, Mail, Clock } from "lucide-react";
import GoogleMap from "@/components/GoogleMap";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

const openHref = "https://www.google.com/maps/search/?api=1&query=Renton+Technologies+LLP+Electronic+City";

/** Location card: address + contact details beside the embedded map. */
export default function LocationMap() {
  return (
    <section className="bg-white">
      <div className="e-container px-5 py-14 md:px-6 md:py-20">
        <SectionHeader eyebrow="Visit us" title="Find Renton in Electronic City" subtitle="Drop by our office or reach us — we're happy to help." />
        <Reveal className="reveal-up mt-10 grid grid-cols-1 overflow-hidden rounded-card border border-slate-100 shadow-card lg:grid-cols-2">
          <div className="flex flex-col gap-5 bg-[linear-gradient(135deg,#0a2b9b_0%,#142344_100%)] p-7 text-white md:p-9">
            <h3 className="font-poppins text-[20px] font-semibold text-white">{site.legalName}</h3>
            <ul className="flex flex-col gap-4 font-inter text-[14px] leading-6 text-white/85">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <span>{site.address.full}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                <span>Open daily · 9:00 AM – 5:00 PM</span>
              </li>
            </ul>
            <a
              href={openHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 font-inter text-[14px] font-semibold text-brand transition-transform duration-300 hover:-translate-y-0.5"
            >
              <MapPin className="size-4" aria-hidden />
              Open in Maps
            </a>
          </div>
          <div className="min-h-[320px]">
            <GoogleMap src={site.mapEmbed} title="Renton Technologies LLP location" height={420} className="h-full min-h-[320px]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
