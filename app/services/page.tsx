import Image from "next/image";
import type { Metadata } from "next";
import PageTitleBar from "@/components/layout/PageTitleBar";
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
      <PageTitleBar title={page.pageTitle} crumbs={crumbsFor(page)} />

      {/* Hero */}
      <section className="bg-[#233857] px-5 py-10 md:px-0 md:py-[50px]">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="flex flex-col items-center justify-center text-center md:mr-[60px] md:w-[calc(50%-60px)] md:items-start md:text-left">
            <h1 className="font-poppins text-[28px] leading-8 font-semibold text-white md:text-[37px] md:leading-[56px]">{servicesHero.title}</h1>
            <p className="font-roboto text-[16px] leading-6 text-white md:my-5 md:mr-20">{servicesHero.text}</p>
            <a
              href={servicesHero.button.href}
              className="inline-block rounded-[10px] bg-[linear-gradient(120deg,#f3931b_0%,#eb5c2b_100%)] px-10 py-5 font-roboto text-[16px] leading-5 text-white uppercase"
            >
              {servicesHero.button.label}
            </a>
          </div>
          <div className="relative flex items-center md:w-1/2">
            <div className="flex w-full shrink-0 justify-end md:w-[104.6%] md:justify-center">
              <Image
                src={servicesHero.image.src}
                alt={servicesHero.image.alt}
                width={servicesHero.image.width}
                height={servicesHero.image.height}
                priority
                sizes="(max-width: 767px) 340px, 600px"
                // Elementor sizes this image to a fixed 320px height (object-fit: fill), max 600px wide
                className="h-[320px] w-[340px] max-w-none object-fill md:w-[600px]"
              />
            </div>
            <Image
              src={servicesHero.layer.src}
              alt=""
              aria-hidden="true"
              width={servicesHero.layer.width}
              height={servicesHero.layer.height}
              className="absolute top-[72px] left-[256px] z-[1] w-20 md:top-[227px] md:left-[394.5px] md:w-[125px]"
            />
          </div>
        </div>
      </section>

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
                className="font-lato text-[13px] leading-[19.5px] tracking-[0.2px] text-[#7e7e7e] md:text-[15px] md:leading-[22.5px] [&_p]:mb-[13.5px] md:[&_p]:mb-[15.5px]"
              />
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
