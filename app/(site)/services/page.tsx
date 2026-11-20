import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/JsonLd";
import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";
import { pages } from "@/data/pages";
import { serviceRows, servicesHero } from "@/data/services";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.services;
export const metadata: Metadata = pageMetadata(page);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={pageSchema(page)} />
      <PageHero
        title={servicesHero.title}
        descriptionHtml={servicesHero.text}
        bg={servicesHero.image.src}
        crumbs={crumbsFor(page)}
        actions={
          <Button href={servicesHero.button.href} variant="accent" size="lg">
            {servicesHero.button.label}
          </Button>
        }
      />

      {/* Service rows */}
      {serviceRows.map((row, i) => (
        <section key={row.title} className={`px-5 py-14 md:px-6 md:py-20 ${i % 2 === 1 ? "bg-brand-50" : "bg-white"}`}>
          <div className="e-container grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
            <Reveal className={`reveal-up ${row.imageFirst ? "md:order-1" : "md:order-2"}`}>
              <Image
                src={row.image.src}
                alt={row.image.alt}
                width={row.image.width}
                height={row.image.height}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full rounded-card object-cover shadow-card"
              />
            </Reveal>
            <Reveal className={`reveal-up flex flex-col gap-4 ${row.imageFirst ? "md:order-2" : "md:order-1"}`}>
              <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{row.title}</h2>
              <span className="block h-1.5 w-16 rounded-full bg-brand" role="separator" />
              <RichText html={row.html} className="font-inter text-[15px] leading-7 text-muted [&_p]:mb-4" />
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}
