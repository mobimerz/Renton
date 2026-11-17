import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { preload } from "react-dom";
import PageTitleBar from "@/components/layout/PageTitleBar";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import RichText from "@/components/ui/RichText";
import { pages } from "@/data/pages";
import { aboutCards, aboutCta, aboutHero, advantages, sixD, whyUs } from "@/data/about";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.about;
export const metadata: Metadata = pageMetadata(page);

const body = "font-raleway text-[16px] leading-6 text-body [&_p]:mb-4";

export default function AboutPage() {
  // hero background is a CSS image, so the browser would only find it after the stylesheet
  preload("/images/about-bg-img.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <JsonLd data={pageSchema(page)} />
      <PageTitleBar title={page.pageTitle} crumbs={crumbsFor(page)} />
      <BoxedContent>
        {/* Hero banner */}
        <section className="flex min-h-[440px] flex-col justify-center bg-[url('/images/about-bg-img.jpg')] bg-cover bg-center px-[30px] pt-[60px] md:min-h-[500px] md:px-2.5 md:pt-0">
          <div className="flex flex-col gap-5 text-center text-white">
            {/* Second <h1> on the page, as on WordPress (theme title "About" + this "About Us") */}
            <h1 className="mt-[15px] font-raleway text-[43.2px] leading-none font-semibold md:mt-0">{aboutHero.title}</h1>
            <h4 className="font-raleway text-[22px] leading-none font-semibold">{aboutHero.subtitle}</h4>
            <RichText html={aboutHero.text} className="font-raleway text-[16px] leading-6 [&_p]:mb-4" />
          </div>
        </section>

        {/* Vision / Mission / What We Do */}
        <section className="relative -mt-[50px] mb-[51px] flex flex-col gap-[14px] px-[30px] py-[7px] md:-mt-[110px] md:mb-[91px] md:flex-row md:gap-[30px] md:p-[15px]">
          {aboutCards.map((c) => (
            <div key={c.title} className="flex flex-1 flex-col gap-5 p-[30px] shadow-[0_0_40px_rgba(36,42,86,0.15)] md:p-[35px]">
              <span className="block w-[50px] border-t-[7px] border-[#0c0d0e]" role="separator" />
              <h3 className="font-raleway text-[27px] leading-none font-semibold text-body">{c.title}</h3>
              {"html" in c ? (
                <RichText html={c.html} className={body} />
              ) : (
                <ul>
                  {c.list.map((li) => (
                    <li key={li} className="flex items-center font-raleway text-[16px] leading-[30.4px] text-body">
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
          <h2 className="mb-5 text-center font-raleway text-[33.6px] leading-none font-semibold text-body">{sixD.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {sixD.steps.map((s) => (
              <div key={s.title} className="flex flex-col gap-5 p-5 md:p-10">
                <h4 className="font-raleway text-[22px] leading-none font-semibold text-body">{s.title}</h4>
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
            <h2 className="font-raleway text-[33.6px] leading-none font-semibold text-body">{whyUs.title}</h2>
            <RichText html={whyUs.html} className={body} />
          </div>
        </section>

        {/* Our Core Advantages */}
        <section className="my-2.5 bg-white md:pt-[60px] md:pb-[15px]">
          <div className="p-2.5 text-center">
            <h2 className="mb-5 font-raleway text-[30px] leading-none font-semibold text-body">{advantages.kicker}</h2>
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
              <h3 className="mt-2.5 mb-[15px] font-raleway text-[18px] leading-none font-semibold text-body">{a.title}</h3>
              <RichText html={a.html} className={body} />
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="px-[30px] pt-2.5 pb-[30px] md:px-0 md:py-5">
          <div className="flex flex-col gap-5 py-[15px] md:flex-row md:py-[30px]">
            <div className="flex flex-col gap-5 md:w-[69%]">
              <h3 className="font-raleway text-[26px] leading-none font-semibold text-body">{aboutCta.title}</h3>
              <RichText html={aboutCta.html} className={body} />
            </div>
            <div className="mt-5 flex flex-col justify-center md:mt-0 md:flex-1">
              <Link
                href={aboutCta.button.href}
                className="inline-block self-start rounded-[3px] md:self-end bg-[#69727d] px-6 py-3 font-raleway text-[15px] leading-none text-white hover:bg-[#5a636e]"
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
