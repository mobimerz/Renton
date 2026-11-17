import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PageTitleBar from "@/components/layout/PageTitleBar";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import EkitIcon from "@/components/EkitIcon";
import EkitAccordion from "@/components/ui/EkitAccordion";
import RichText from "@/components/ui/RichText";
import { pages } from "@/data/pages";
import { comprehensive, productsFaq, productsHero, secureSolutions, specialFeatures, type EkitBox } from "@/data/products";
import { crumbsFor, pageMetadata, pageSchema } from "@/lib/page";

const page = pages.products;
export const metadata: Metadata = pageMetadata(page);

const sectionTitle = "font-raleway text-[36px] leading-[54px] font-bold text-black";
const sectionText = "font-open-sans text-[16px] leading-[26px] text-[#565656]";
const boxTitle = "mb-[12.6px] font-raleway text-[21px] leading-[25px]";
const boxText = "font-open-sans text-[15px] leading-[25px] text-[#565656] [&_p]:mb-7";

function SectionHeading({ title, text, textMb }: { title: string; text?: string | null; textMb: string }) {
  return (
    <div className="mx-auto max-w-[540px] px-[15px] text-center">
      <h2 className={`mb-2 ${sectionTitle}`}>{title}</h2>
      {text && <RichText html={text} className={`${sectionText} ${textMb}`} />}
    </div>
  );
}

/** Icon-left ElementsKit info box (sections 3 and 4). */
function SideBox({ box, variant }: { box: EkitBox; variant: "pink" | "plain" }) {
  return (
    <div className={`flex items-start rounded-[5px] pt-5 ${variant === "pink" ? "pl-2" : "min-h-[211px] pl-[15px] md:min-h-0"}`}>
      {variant === "pink" ? (
        <span className="mt-[5px] mr-5 flex size-[75px] shrink-0 items-center justify-center rounded-[50px] border-[1.6px] border-[#fa346e] bg-white text-[#fa346e]">
          <EkitIcon widgetId={box.id} className="size-[45px]" />
        </span>
      ) : (
        <span className="mr-5 flex size-20 shrink-0 items-center justify-center rounded-[50px] bg-white text-[#111633] shadow-[-1px_7px_15px_rgba(0,0,0,0.07)]">
          <EkitIcon widgetId={box.id} className="size-[35px]" />
        </span>
      )}
      <div>
        <h3 className={`${boxTitle} font-bold ${variant === "pink" ? "text-[#111633]" : "text-black"}`}>{box.title}</h3>
        <RichText html={box.text} className={boxText} />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      <JsonLd data={pageSchema(page)} />
      <PageTitleBar title={page.pageTitle} crumbs={crumbsFor(page)} />
      <BoxedContent>
        {/* Hero */}
        <section className="flex flex-col gap-2.5 bg-white pt-[100px] pb-[90px] md:flex-row md:gap-0 md:py-[60px]">
          <div className="flex flex-col p-[15px] md:w-[53.55%]">
            <div className="md:my-[25px]">
              <h3 className="mt-[3.6px] mb-[10.8px] font-open-sans text-[18px] leading-[25px] font-bold text-[#111633]">{productsHero.subtitle}</h3>
              <h2 className="mb-2.5 font-raleway text-[44px] leading-[70px] font-bold text-[#111633]">{productsHero.title}</h2>
              <RichText html={productsHero.text} className={`max-w-[530px] ${sectionText} [&_p]:mb-0`} />
            </div>
            <div className="flex flex-wrap gap-x-[60px]">
              {productsHero.buttons.map((b) => (
                <Link
                  key={b.label}
                  href={b.href}
                  className="inline-flex h-[45px] items-center justify-center rounded-[5px] bg-[#2575fc] px-[30px] font-raleway text-[15px] leading-none text-white hover:bg-[#1a63de]"
                >
                  {b.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center px-2.5 pt-[60px] md:flex-1 md:p-2.5">
            <Image
              src={productsHero.image.src}
              alt={productsHero.image.alt}
              width={productsHero.image.width}
              height={productsHero.image.height}
              sizes="(max-width: 767px) 100vw, 45vw"
              priority
              className="w-full"
            />
          </div>
        </section>

        {/* Secure IT Rental & Data Protection Solutions */}
        <section className="bg-[#f7f9fb] pt-[50px] md:pt-[60px] md:pb-[41px]">
          <SectionHeading title={secureSolutions.heading.title} textMb="" />
          <div className="flex flex-col gap-[30px] p-[15px] md:flex-row">
            {secureSolutions.boxes.map((b) => (
              <div key={b.id} className="flex-1 self-start border-[0.8px] border-[#f5f5f5] bg-white px-10 py-[45px] text-center">
                <span className="mx-auto mb-[13px] flex size-[100px] items-center justify-center rounded-full border-[9.6px] border-white bg-[#fa346e] text-white shadow-[0_0_1px_#fa346e]">
                  <EkitIcon widgetId={b.id} className="size-[45px]" />
                </span>
                <h3 className={`${boxTitle} font-semibold text-black`}>{b.title}</h3>
                <RichText html={b.text} className={boxText} />
              </div>
            ))}
          </div>
        </section>

        {/* Comprehensive IT Solutions */}
        <section className="bg-white pt-[103px] pb-[83px] md:pt-[106px] md:pb-[74px]">
          <SectionHeading title={comprehensive.heading.title!} text={comprehensive.heading.text} textMb="[&_p]:mb-[46px]" />
          <div className="flex flex-col gap-2.5 p-2.5 md:flex-row">
            <div className="flex flex-col justify-center p-[15px] md:w-[47.8%]">
              <Image
                src={comprehensive.image.src}
                alt={comprehensive.image.alt}
                width={comprehensive.image.width}
                height={comprehensive.image.height}
                sizes="(max-width: 767px) 100vw, 60vw"
                className="w-full md:-mx-[100px] md:w-[calc(100%+200px)] md:max-w-none"
              />
            </div>
            <div className="flex flex-col justify-center gap-3 p-[15px] md:flex-1 md:pt-[28px] md:pl-[100px]">
              {comprehensive.boxes.map((b) => (
                <SideBox key={b.id} box={b} variant="pink" />
              ))}
            </div>
          </div>
        </section>

        {/* Our Special Features */}
        <section className="bg-[#f7f9fb] pt-[87px] pb-[69px] md:pb-[71px]">
          <SectionHeading title={specialFeatures.heading.title!} text={specialFeatures.heading.text} textMb="[&_p]:mb-[23px]" />
          <div className="grid grid-cols-1 gap-x-2.5 gap-y-[5px] p-2.5 md:grid-cols-3">
            {specialFeatures.boxes.map((b) => (
              <SideBox key={b.id} box={b} variant="plain" />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-[15px] pt-[107px] pb-[107px] md:pb-[108px]">
          <SectionHeading title={productsFaq.heading.title!} text={productsFaq.heading.text} textMb="[&_p]:mb-[46px]" />
          <div className="flex flex-col gap-2.5 p-2.5 md:flex-row">
            <div className="p-[15px] md:w-1/2">
              <Image
                src={productsFaq.image.src}
                alt={productsFaq.image.alt}
                width={productsFaq.image.width}
                height={productsFaq.image.height}
                sizes="(max-width: 767px) 100vw, 45vw"
                className="m-2.5 w-[calc(100%-20px)]"
              />
            </div>
            <div className="p-[15px] md:w-1/2">
              <EkitAccordion items={productsFaq.items} />
            </div>
          </div>
        </section>
      </BoxedContent>
    </>
  );
}
