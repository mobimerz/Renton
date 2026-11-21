import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import Icon from "@/components/Icon";
import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { pages } from "@/data/pages";
import { aboutCards, aboutCta, aboutHero, advantages, sixD, whyUs } from "@/data/about";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.about;
export const metadata: Metadata = pageMetadata(page);

const body = "font-inter text-[15px] leading-7 text-muted [&_p]:mb-4";

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
        <section className="px-5 py-14 md:px-6 md:py-20">
          <Reveal className="reveal-stagger grid-auto-3 gap-6">
            {aboutCards.map((c) => (
              <article
                key={c.title}
                className="group flex flex-1 flex-col gap-5 rounded-card border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover md:p-8"
              >
                <span className="block h-1.5 w-12 rounded-full bg-brand transition-all duration-300 group-hover:w-20" role="separator" />
                <h3 className="font-poppins text-[22px] font-semibold text-brand-navy">{c.title}</h3>
                {"html" in c ? (
                  <RichText html={c.html} className={body} />
                ) : (
                  <ul className="flex flex-col gap-2.5">
                    {c.list.map((li) => (
                      <li key={li} className="flex items-center gap-2 font-inter text-[15px] leading-[28px] text-muted">
                        <Icon name="caret-right" className="w-[16px]! shrink-0 text-[13px] text-brand" />
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Reveal>
        </section>

        {/* Our 6-D Process */}
        <section className="bg-brand-50 px-5 py-14 md:px-6 md:py-20">
          <SectionHeader title={sixD.title} />
          <Reveal className="reveal-stagger grid-auto-3 mt-10 gap-6">
            {sixD.steps.map((s, i) => (
              <article
                key={s.title}
                className="group relative flex flex-col gap-4 rounded-card border border-slate-100 bg-white p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <span className="font-poppins text-[40px] leading-none font-bold text-brand-100 transition-colors duration-300 group-hover:text-brand-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="font-poppins text-[20px] font-semibold text-brand-navy">{s.title}</h4>
                <RichText html={s.html} className={body} />
              </article>
            ))}
          </Reveal>
        </section>

        {/* Why Choose Us? */}
        <section className="px-5 py-14 md:px-6 md:py-20">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
            <Reveal className="reveal-up">
              <Image
                src={whyUs.image.src}
                alt={whyUs.image.alt}
                width={whyUs.image.width}
                height={whyUs.image.height}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full rounded-card object-cover shadow-card"
              />
            </Reveal>
            <Reveal className="reveal-up flex flex-col gap-4">
              <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{whyUs.title}</h2>
              <RichText html={whyUs.html} className={body} />
            </Reveal>
          </div>
        </section>

        {/* Our Core Advantages */}
        <section className="bg-brand-50 px-5 py-14 md:px-6 md:py-20">
          <SectionHeader eyebrow={advantages.kicker} title={advantages.title} />
          <Reveal className="reveal-stagger grid-auto-3 mt-10 gap-6">
            {advantages.items.map((a) => (
              <article
                key={a.title}
                className="group flex flex-col overflow-hidden rounded-card border border-slate-100 bg-white shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
                  <Image
                    src={a.image.src}
                    alt={a.image.alt}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="font-poppins text-[18px] font-semibold text-brand-navy">{a.title}</h3>
                  <RichText html={a.html} className={body} />
                </div>
              </article>
            ))}
          </Reveal>
        </section>

        {/* CTA */}
        <section className="px-5 pb-16 md:px-6 md:pb-20">
          <Reveal className="reveal-up">
            <div className="relative overflow-hidden rounded-card bg-[linear-gradient(120deg,#0a2b9b_0%,#142344_100%)] px-6 py-10 md:px-12 md:py-14">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,#ffffff_1px,transparent_1px)] [background-size:22px_22px]"
              />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-3 md:max-w-[66%]">
                  <h3 className="font-poppins text-[24px] leading-tight font-bold text-white md:text-[30px]">{aboutCta.title}</h3>
                  <RichText html={aboutCta.html} className="font-inter text-[15px] leading-7 text-white/85 [&_p]:m-0" />
                </div>
                <Button href={aboutCta.button.href} variant="white" size="lg" className="shrink-0">
                  {aboutCta.button.label}
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </BoxedContent>
    </>
  );
}
