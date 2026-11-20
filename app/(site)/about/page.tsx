import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import RichText from "@/components/ui/RichText";
import { pages } from "@/data/pages";
import { aboutCards, aboutCta, aboutHero, advantages, sixD, whyUs } from "@/data/about";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.about;
export const metadata: Metadata = pageMetadata(page);

const body = " text-[16px] leading-6 text-body [&_p]:mb-4";

export default function AboutPage() {
  return (
    <>
      <JsonLd data={pageSchema(page)} />
      <PageHero
        title={aboutHero.title}
        subtitle={aboutHero.subtitle}
        descriptionHtml={aboutHero.text}
        bg="/images/about-bg-img.jpg"
        crumbs={crumbsFor(page)}
      />
      <BoxedContent>
        {/* Vision / Mission / What We Do */}
        <section className="mt-[40px] mb-[51px] flex flex-col gap-[14px] px-[30px] py-[7px] md:mt-[60px] md:mb-[91px] md:flex-row md:gap-[30px] md:p-[15px]">
          {aboutCards.map((c) => (
            <div key={c.title} className="flex flex-1 flex-col gap-5 rounded-card border border-slate-100 bg-white p-[30px] shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover md:p-[35px]">
              <span className="block w-[50px] border-t-[7px] border-[#0c0d0e]" role="separator" />
              <h3 className=" text-[27px] leading-none font-semibold text-body">{c.title}</h3>
              {"html" in c ? (
                <RichText html={c.html} className={body} />
              ) : (
                <ul>
                  {c.list.map((li) => (
                    <li key={li} className="flex items-center text-[16px] leading-[30.4px] text-body">
                      <Icon name="caret-right" className="w-[17.5px]! text-[14px]" />
                      <span className="pl-[5px]">{li}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>

        {/* Our 6-D Process */}
        <section className="px-5 py-5 md:px-0 md:pt-0 md:pb-[50px]">
          <h2 className="mb-5 text-center text-[33.6px] leading-none font-semibold text-body">{sixD.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {sixD.steps.map((s) => (
              <div key={s.title} className="flex flex-col gap-5 p-5 md:p-10">
                <h4 className=" text-[22px] leading-none font-semibold text-body">{s.title}</h4>
                <RichText html={s.html} className={body} />
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us? */}
        <section className="flex flex-col md:min-h-[510px] md:flex-row">
          <div className="flex flex-col justify-center md:w-1/2">
            <Image src={whyUs.image.src} alt={whyUs.image.alt} width={whyUs.image.width} height={whyUs.image.height} sizes="(max-width: 767px) 100vw, 50vw" className="w-full" />
          </div>
          <div className="flex flex-col gap-5 px-[25px] py-[50px] md:w-1/2 md:p-20">
            <h2 className=" text-[33.6px] leading-none font-semibold text-body">{whyUs.title}</h2>
            <RichText html={whyUs.html} className={body} />
          </div>
        </section>

        {/* Our Core Advantages */}
        <section className="my-2.5 bg-white md:pt-[60px] md:pb-[15px]">
          <div className="p-2.5 text-center">
            <h2 className="mb-5 text-[30px] leading-none font-semibold text-body">{advantages.kicker}</h2>
            <h2 className="mb-2.5 font-poppins text-[20px] leading-none font-medium text-black md:text-[32px]">{advantages.title}</h2>
          </div>
        </section>
        <section className="grid grid-cols-1 bg-white px-5 py-[30px] md:grid-cols-4 md:p-0">
          {advantages.items.map((a, i) => (
            <div key={a.title} className={`flex flex-col items-start md:mt-0 md:p-5 ${i > 0 ? "mt-[30px]" : ""}`}>
              <Image
                src={a.image.src}
                alt={a.image.alt}
                width={a.image.width}
                height={a.image.height}
                sizes="(max-width: 767px) 100vw, 25vw"
                // Elementor stretches the 2nd and 3rd images to a fixed 138px height (object-fit: fill)
                className={`mb-[15px] w-full ${i === 1 || i === 2 ? "h-[138px] object-fill" : ""}`}
              />
              <h3 className="mt-2.5 mb-[15px] text-[18px] leading-none font-semibold text-body">{a.title}</h3>
              <RichText html={a.html} className={body} />
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="px-[30px] pt-2.5 pb-[30px] md:px-0 md:py-5">
          <div className="flex flex-col gap-5 py-[15px] md:flex-row md:py-[30px]">
            <div className="flex flex-col gap-5 md:w-[69%]">
              <h3 className=" text-[26px] leading-none font-semibold text-body">{aboutCta.title}</h3>
              <RichText html={aboutCta.html} className={body} />
            </div>
            <div className="mt-5 flex flex-col justify-center md:mt-0 md:flex-1">
              <Link
                href={aboutCta.button.href}
                className="inline-block self-start rounded-[3px] md:self-end bg-[#69727d] px-6 py-3 text-[15px] leading-none text-white hover:bg-[#5a636e]"
              >
                {aboutCta.button.label}
              </Link>
            </div>
          </div>
        </section>
      </BoxedContent>
    </>
  );
}
