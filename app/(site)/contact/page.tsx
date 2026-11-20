import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";
import GoogleMap from "@/components/GoogleMap";
import Icon from "@/components/Icon";
import Accordion from "@/components/ui/Accordion";
import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";
import { pages } from "@/data/pages";
import { contactCards, contactFaq, contactFormBlock, contactHeadline, contactIntro, contactMap } from "@/data/contact";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.contact;
export const metadata: Metadata = pageMetadata(page);

const card =
  "group flex flex-1 flex-col items-center gap-3 rounded-card border border-slate-100 bg-white p-7 text-center shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover";
const cardIcon =
  "flex size-14 items-center justify-center rounded-2xl bg-brand text-[24px] text-white transition-transform duration-300 group-hover:scale-110";

export default function ContactPage() {
  return (
    <>
      <JsonLd data={pageSchema(page, contactFaq.items)} />
      <PageHero title={page.pageTitle} subtitle={contactHeadline} bg="/images/office.jpg" crumbs={crumbsFor(page)} />

      {/* Intro */}
      <section className="bg-white px-5 py-14 md:px-6 md:py-20">
        <Reveal className="reveal-up mx-auto flex max-w-[680px] flex-col items-center gap-3 text-center">
          <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{contactIntro.title}</h2>
          <p className="font-poppins text-[18px] leading-snug font-semibold text-brand md:text-[22px]">{contactIntro.subtitle}</p>
          <RichText html={contactIntro.text} className="font-inter text-[15px] leading-7 text-muted [&_p]:m-0" />
        </Reveal>
      </section>

      {/* Image + form */}
      <section className="bg-brand-50 px-5 py-14 md:px-6 md:py-20">
        <div className="e-container grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14">
          <Reveal className="reveal-up flex flex-col gap-6">
            <h2 className="font-poppins text-[24px] leading-tight font-bold text-brand-navy md:text-[32px]">{contactFormBlock.title}</h2>
            <Image
              src={contactFormBlock.image.src}
              alt={contactFormBlock.image.alt}
              width={contactFormBlock.image.width}
              height={contactFormBlock.image.height}
              sizes="(max-width: 767px) 100vw, 50vw"
              className="w-full rounded-card object-cover shadow-card"
            />
          </Reveal>
          <Reveal className="reveal-up rounded-card border border-slate-100 bg-white p-6 shadow-card md:p-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Headline */}
      <section className="bg-white px-5 pt-14 md:px-6 md:pt-20">
        <h2 className="mx-auto max-w-[800px] text-center font-poppins text-[24px] leading-[1.2] font-bold text-brand-navy md:text-[40px]">{contactHeadline}</h2>
      </section>

      {/* Contact cards */}
      <section className="bg-white px-5 py-14 md:px-6 md:py-16">
        <Reveal className="reveal-stagger e-container grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className={card}>
            <span className={cardIcon}>
              <Icon name="phone" />
            </span>
            <RichText html={`<p>${contactCards.phone}</p>`} className="w-full font-inter text-[15px] leading-6 text-muted [&_p]:m-0" />
          </div>
          <div className={card}>
            <span className={cardIcon}>
              <Icon name="envelope-regular" />
            </span>
            <p className="w-full font-inter text-[15px] leading-6 text-muted">
              <a href={`mailto:${contactCards.email}`} className="transition-colors hover:text-brand">
                {contactCards.email}
              </a>
            </p>
            <ul className="flex justify-center gap-2">
              {contactCards.social.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-[18px] text-brand transition-colors hover:bg-brand hover:text-white"
                  >
                    <Icon name={s.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={card}>
            <span className={cardIcon}>
              <Icon name="map-marker-alt" />
            </span>
            <RichText html={contactCards.addressHtml} className="w-full font-inter text-[15px] leading-6 text-muted [&_p]:m-0" />
          </div>
        </Reveal>
      </section>

      {/* FAQ (toggle: closed by default, icon on the right) */}
      <section className="bg-brand-50 px-5 py-14 md:px-6 md:py-20">
        <h2 className="text-center font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{contactFaq.title}</h2>
        <Reveal className="reveal-up mx-auto mt-10 max-w-[840px]">
          <Accordion
            items={contactFaq.items}
            multiple
            styles={{
              box: "flex flex-col gap-3",
              iconPosition: "right",
              closedIcon: "plus",
              openIcon: "minus",
              title:
                "rounded-card border border-slate-100 bg-white px-6 py-[18px] font-poppins text-[15px] md:text-[16px] font-medium text-brand-navy shadow-card transition-colors hover:text-brand",
              activeTitle: "text-brand! rounded-b-none!",
              content:
                "rounded-b-2xl border border-t-0 border-slate-100 bg-white px-6 pb-5 font-inter text-[14px] leading-6 text-muted",
            }}
          />
        </Reveal>
      </section>

      {/* Map */}
      <section className="bg-brand-50 px-5 pb-16 md:px-6 md:pb-20">
        <div className="e-container overflow-hidden rounded-card shadow-card ring-1 ring-slate-100">
          <GoogleMap src={contactMap.src} title={contactMap.title} height={430} className="w-full" />
        </div>
      </section>
    </>
  );
}
