import Image from "next/image";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import Button from "@/components/ui/Button";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import EkitIcon from "@/components/EkitIcon";
import EkitAccordion from "@/components/ui/EkitAccordion";
import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";
import { pages } from "@/data/pages";
import { comprehensive, productsFaq, productsHero, secureSolutions, specialFeatures, type EkitBox } from "@/data/products";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.products;
export const metadata: Metadata = pageMetadata(page);

const sectionTitle = "font-poppins text-[28px] leading-[1.2] font-bold text-brand-navy md:text-[36px]";
const sectionText = "font-inter text-[15px] leading-7 text-muted md:text-[17px]";
const boxTitle = "mb-2 font-poppins text-[19px] leading-[1.3]";
const boxText = "font-inter text-[14px] leading-[25px] text-muted [&_p]:mb-3";

function SectionHeading({ title, text, textMb = "" }: { title: string; text?: string | null; textMb?: string }) {
  return (
    <div className="mx-auto max-w-[620px] px-4 text-center">
      <h2 className={sectionTitle}>{title}</h2>
      {text && <RichText html={text} className={`mt-3 ${sectionText} ${textMb}`} />}
    </div>
  );
}

/** Icon-left info box (comprehensive + special-features sections). */
function SideBox({ box }: { box: EkitBox }) {
  return (
    <div className="group flex items-start gap-4 rounded-card border border-slate-100 bg-white p-5 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
        <EkitIcon widgetId={box.id} className="size-7" />
      </span>
      <div>
        <h3 className={`${boxTitle} font-bold text-brand-navy`}>{box.title}</h3>
        <RichText html={box.text} className={boxText} />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={pageSchema(page)} />
      <PageHero
        eyebrow={productsHero.subtitle}
        title={productsHero.title}
        descriptionHtml={productsHero.text}
        bg="/images/IT-hardware.jpeg"
        crumbs={crumbsFor(page)}
        actions={productsHero.buttons.map((b) => (
          <Button key={b.label} href={b.href} variant={b.href.startsWith("/") ? "white" : "accent"} size="lg">
            {b.label}
          </Button>
        ))}
      />
      <BoxedContent>
        {/* Secure IT Rental & Data Protection Solutions */}
        <section className="bg-brand-50 px-5 py-14 md:px-6 md:py-20">
          <SectionHeading title={secureSolutions.heading.title} />
          <Reveal className="reveal-stagger mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {secureSolutions.boxes.map((b) => (
              <article
                key={b.id}
                className="group flex flex-col items-center gap-3 rounded-card border border-slate-100 bg-white p-8 text-center shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-card-hover"
              >
                <span className="flex size-20 items-center justify-center rounded-full bg-brand text-white shadow-[0_10px_24px_-8px_rgba(10,43,155,0.5)] transition-transform duration-300 group-hover:scale-110">
                  <EkitIcon widgetId={b.id} className="size-10" />
                </span>
                <h3 className={`${boxTitle} font-semibold text-brand-navy`}>{b.title}</h3>
                <RichText html={b.text} className={boxText} />
              </article>
            ))}
          </Reveal>
        </section>

        {/* Comprehensive IT Solutions */}
        <section className="bg-white px-5 py-14 md:px-6 md:py-20">
          <SectionHeading title={comprehensive.heading.title!} text={comprehensive.heading.text} />
          <div className="mt-10 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
            <Reveal className="reveal-up">
              <Image
                src={comprehensive.image.src}
                alt={comprehensive.image.alt}
                width={comprehensive.image.width}
                height={comprehensive.image.height}
                sizes="(max-width: 767px) 100vw, 50vw"
                className="w-full rounded-card object-cover shadow-card"
              />
            </Reveal>
            <Reveal className="reveal-stagger flex flex-col gap-4">
              {comprehensive.boxes.map((b) => (
                <SideBox key={b.id} box={b} />
              ))}
            </Reveal>
          </div>
        </section>

        {/* Our Special Features */}
        <section className="bg-brand-50 px-5 py-14 md:px-6 md:py-20">
          <SectionHeading title={specialFeatures.heading.title!} text={specialFeatures.heading.text} />
          <Reveal className="reveal-stagger mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {specialFeatures.boxes.map((b) => (
              <SideBox key={b.id} box={b} />
            ))}
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="bg-white px-5 py-14 md:px-6 md:py-20">
          <SectionHeading title={productsFaq.heading.title!} text={productsFaq.heading.text} />
          <div className="mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-2 md:gap-14">
            <Reveal className="reveal-up">
              <Image
                src={productsFaq.image.src}
                alt={productsFaq.image.alt}
                width={productsFaq.image.width}
                height={productsFaq.image.height}
                sizes="(max-width: 767px) 100vw, 45vw"
                className="w-full rounded-card object-cover shadow-card"
              />
            </Reveal>
            <Reveal className="reveal-up">
              <EkitAccordion items={productsFaq.items} />
            </Reveal>
          </div>
        </section>
      </BoxedContent>
    </>
  );
}
