import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Button from "@/components/ui/Button";
import JsonLd from "@/components/JsonLd";
import RichText from "@/components/ui/RichText";
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
      {serviceRows.map((row) => (
        <section key={row.title} className="py-10">
          <div className={`flex flex-col ${row.imageFirst ? "md:flex-row" : "md:flex-row"}`}>
            <div className={`p-5 ${row.imageFirst ? "order-1 md:w-[51.75%]" : "order-2 md:order-2 md:w-[51.75%]"}`}>
              <Image
                src={row.image.src}
                alt={row.image.alt}
                width={row.image.width}
                height={row.image.height}
                sizes="(max-width: 767px) 100vw, 52vw"
                className="w-full"
              />
            </div>
            <div className={`flex flex-col justify-center p-5 md:w-[48.25%] ${row.imageFirst ? "order-2" : "order-1"}`}>
              <h2 className="mb-1 font-poppins text-[25px] leading-[30px] font-semibold tracking-[0.2px] text-[#2b2b2b] md:mb-2.5 md:text-[45px] md:leading-[58.5px]">
                {row.title}
              </h2>
              <div className="mb-1 py-[15px] md:mb-2.5" role="separator">
                <span className="block w-[35%] border-t-[9.6px] border-[#ff1d40] md:border-t-[10px]" />
              </div>
              <RichText
                html={row.html}
                className=" text-[13px] leading-[19.5px] tracking-[0.2px] text-[#7e7e7e] md:text-[15px] md:leading-[22.5px] [&_p]:mb-[13.5px] md:[&_p]:mb-[15.5px]"
              />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
