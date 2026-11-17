import Image from "next/image";
import type { Metadata } from "next";
import { preload } from "react-dom";
import PageTitleBar from "@/components/layout/PageTitleBar";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";
import GoogleMap from "@/components/GoogleMap";
import Icon from "@/components/Icon";
import Accordion from "@/components/ui/Accordion";
import RichText from "@/components/ui/RichText";
import { pages } from "@/data/pages";
import { contactCards, contactFaq, contactFormBlock, contactHeadline, contactIntro, contactMap } from "@/data/contact";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.contact;
export const metadata: Metadata = pageMetadata(page);

const card = "flex flex-col items-center rounded-[3px] border border-[rgba(122,122,122,0.25)] p-2.5 md:m-5 md:flex-1 md:px-5 md:py-0";
const cardIcon = "flex h-8 items-start justify-center text-[25px] text-[#69727d]";

export default function ContactPage() {
  // hero background is a CSS image, so the browser would only find it after the stylesheet
  preload("/images/about-bg-img.jpg", { as: "image", fetchPriority: "high" });
  return (
    <>
      <JsonLd data={pageSchema(page, contactFaq.items)} />
      <PageTitleBar title={page.pageTitle} crumbs={crumbsFor(page)} />

      {/* Banner image */}
      <div className="min-h-[400px] bg-[url('/images/about-bg-img.jpg')] bg-cover bg-center px-[30px] md:min-h-[230px] md:px-2.5" />

      {/* Intro */}
      <section className="flow-root bg-white px-5 py-[75px] md:p-0">
        <h2 className="text-center font-raleway text-[45px] leading-none font-semibold text-[#1e148b]">{contactIntro.title}</h2>
        <h2 className="mt-5 text-center font-raleway text-[30px] leading-none font-semibold text-[#e93378]">{contactIntro.subtitle}</h2>
        <RichText html={contactIntro.text} className="mt-5 font-raleway text-[16px] leading-6 text-body [&_p]:mb-4" />
      </section>

      {/* Image + form */}
      <section className="mt-10 mb-20 px-2.5">
        <div className="e-container flex flex-col py-2.5 md:flex-row">
          <div className="m-10 flex flex-col gap-5 pt-[35px] md:w-[calc(52.97%-80px)] md:shrink-0">
            <h2 className="pb-[30px] font-raleway text-[17px] leading-none font-semibold text-[#1e148b] md:text-[35px]">{contactFormBlock.title}</h2>
            <Image
              src={contactFormBlock.image.src}
              alt={contactFormBlock.image.alt}
              width={contactFormBlock.image.width}
              height={contactFormBlock.image.height}
              sizes="(max-width: 767px) 100vw, 625px"
              className="w-full"
            />
          </div>
          <div className="mt-[35px] p-2.5 md:flex-1">
            {/* WPForms widget box on the live page is 656px tall */}
            <div className="flow-root min-h-[656px]">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Headline */}
      <section className="px-[30px] pt-20 pb-[100px] md:px-0 md:py-10">
        <div className="p-2.5">
          <h2 className="text-center font-raleway text-[25px] leading-none font-semibold text-[#1e148b] md:text-[45px]">{contactHeadline}</h2>
        </div>
      </section>

      {/* Contact cards */}
      <section className="px-[15px] pb-[50px] md:px-0 md:pb-0">
        <div className="-mt-[35px] rounded-[5px] px-[15px] pt-2.5 pb-[45px] shadow-[0_0_50px_-10px_rgba(0,0,0,0.13)] md:mt-0 md:p-0">
          <div className="e-container mt-5 flex flex-col gap-[15px] md:mt-[35px] md:mb-10 md:flex-row md:gap-0 md:px-5">
            <div className={card}>
              <span className={cardIcon}>
                <Icon name="phone" />
              </span>
              <RichText html={`<p>${contactCards.phone}</p>`} className="w-full text-center font-raleway text-[16px] leading-6 text-body [&_p]:mb-4" />
            </div>
            <div className={card}>
              <span className={cardIcon}>
                <Icon name="envelope-regular" />
              </span>
              <p className="mb-4 w-full text-center font-raleway text-[16px] leading-6 text-body">
                <a href={`mailto:${contactCards.email}`}>
                  {contactCards.email}
                </a>
              </p>
              <ul className="flex justify-center gap-[7px]">
                {contactCards.social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-[22px] w-[33px] items-center justify-center text-[22px] text-[#1bb0ce]"
                    >
                      <Icon name={s.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${card} md:items-stretch`}>
              <span className={`${cardIcon} self-center`}>
                <Icon name="map-marker-alt" />
              </span>
              <RichText html={contactCards.addressHtml} className="w-full font-raleway text-[16px] leading-6 text-body [&_p]:mb-4" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ (Elementor toggle: closed by default, icon on the right) */}
      <section className="px-[30px] pt-[50px] pb-[60px] md:px-0 md:pt-5 md:pb-0">
        <div className="flex flex-col gap-5 md:pl-[50px]">
          <h2 className="text-center font-raleway text-[38px] leading-none font-semibold text-[#1e148b]">{contactFaq.title}</h2>
          <div className="mt-[9px] pt-[15px] md:mx-5 md:mt-0 md:p-2.5">
            <Accordion
              items={contactFaq.items}
              multiple
              styles={{
                iconPosition: "right",
                closedIcon: "caret-right",
                openIcon: "caret-up",
                title: "mb-[25px] px-[30px] py-[21px] font-raleway text-[16px] leading-none font-bold text-body",
                activeTitle: "mb-0",
                content: "mb-[25px] px-[30px] pb-[21px] font-raleway text-[16px] leading-6 text-body",
              }}
            />
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="md:pb-10">
        <GoogleMap src={contactMap.src} title={contactMap.title} height={430} />
      </section>
    </>
  );
}
