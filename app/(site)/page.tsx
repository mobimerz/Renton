import Image from "next/image";
import type { Metadata } from "next";
import PageTitleBar from "@/components/layout/PageTitleBar";
import JsonLd from "@/components/JsonLd";
import Button from "@/components/ui/Button";
import RichText from "@/components/ui/RichText";
import RotatingText from "@/components/ui/RotatingText";
import ImageCarousel from "@/components/ui/ImageCarousel";
import Accordion from "@/components/ui/Accordion";
import Icon from "@/components/Icon";
import WhyChooseIcon from "@/components/home/WhyChooseIcon";
import { buildMetadata } from "@/lib/seo";
import { breadcrumb, faqPage, graph, localBusiness, webPage, website } from "@/lib/schema";
import { homeSeo } from "@/data/home";
import { getHomepageContent } from "@/lib/homepage/content";

export const metadata: Metadata = buildMetadata(homeSeo);
/** Content comes from the admin (MongoDB) with data/home.ts as fallback; saves revalidate this page. */
export const revalidate = 3600;

const faqStyles = {
  box: "mt-5 overflow-hidden rounded-[10px] bg-white shadow-[0_0_18px_rgba(209,204,204,0.36)]",
  title: "px-[30px] py-[25px] font-poppins text-[14px] leading-[16.33px] md:text-[16px] md:leading-4 font-normal text-[#4f4f4f]",
  activeTitle: "text-[#362aff]!",
  content:
    "px-[30px] font-lato text-[13px] leading-[19.5px] tracking-[0.2px] text-[#575656] md:text-[14px] md:leading-[21px] [&_p]:mb-[13px] md:[&_p]:mb-[14px] [&_ul]:my-[13px] md:[&_ul]:my-[14px] [&_ul]:pl-0 [&_ul]:list-inside [&_li]:mb-[13px] md:[&_li]:mb-[14px]",
};

export default async function HomePage() {
  const { content } = await getHomepageContent();
  const { hero, rentalProducts, whyChoose, testimonials, homeFaq } = content;
  // next/image needs a size; uploads store it, this covers images with an unknown size.
  const heroW = hero.image.width || 1024;
  const heroH = hero.image.height || 683;
  const allFaqs = homeFaq.columns.flat();
  return (
    <>
      <JsonLd
        data={graph(
          localBusiness(),
          website(),
          webPage({ type: "WebPage", path: "/", name: homeSeo.title, description: homeSeo.description, image: hero.image.src }),
          breadcrumb("/", [{ name: "Home", path: "/" }]),
          faqPage("/", allFaqs),
        )}
      />
      <PageTitleBar title={homeSeo.pageTitle} />

      {/* Hero */}
      <section className="mb-2.5 bg-hero py-[60px] md:mb-0">
        <div className="e-container flex flex-col md:flex-row">
          <div className="flex flex-col justify-end p-2.5 md:w-[54.4%]">
            <h2 className="mb-5 font-raleway text-[15px] leading-none font-semibold text-white md:text-[17.5px]">{hero.kicker}</h2>
            <h3 className="mb-5 text-left font-michroma text-white">
              <span className="text-[46px] leading-[60px] font-bold">{hero.headline}</span>{" "}
              <RotatingText words={hero.rotating} className="text-[20px] leading-[60px] font-normal text-accent-green md:text-[37px]" />
            </h3>
            <RichText
              html={hero.text}
              className="w-[86.5%] py-0 font-raleway text-[14px] leading-[21px] text-[#f0f0f0] md:py-[30px] [&_p]:mb-6 md:[&_p]:mb-[14px]"
            />
            <div className="flex flex-wrap gap-2.5 md:gap-[30px]">
              <Button href={hero.primary.href}>{hero.primary.label}</Button>
              <Button href={hero.secondary.href} variant="outline">
                {hero.secondary.label}
              </Button>
            </div>
          </div>
          <div className="p-2.5 md:w-[45.6%]">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              width={heroW}
              height={heroH}
              loading="eager"
              sizes="(max-width: 767px) 100vw, 45vw"
              className="mt-[70px] mb-0 w-full rounded-[150px_0] md:mb-[22px]"
            />
          </div>
        </div>
      </section>

      {/* Rental Products */}
      <section className="px-[30px] pt-[60px] pb-[30px] md:px-0 md:pt-20 md:pb-[60px]">
        <div className="mx-auto flex max-w-[733px] flex-col gap-5 text-center">
          <h2 className="font-poppins text-[28px] leading-none font-bold text-body md:text-[45px]">{rentalProducts.title}</h2>
          <RichText html={rentalProducts.text} className="font-raleway text-[16px] leading-6 text-body [&_p]:mb-4" />
        </div>
        <ImageCarousel slides={rentalProducts.slides} />
      </section>

      {/* Why Choose Renton? */}
      <section className="pt-10 pb-20 md:pt-0 md:pb-10">
        <div className="e-container p-2.5">
          <div className="px-2.5 pt-3 pb-[31px] md:mx-auto md:w-[79.35%] md:p-2.5">
            <h2 className="mb-[5px] text-center font-poppins text-[28px] leading-[30px] font-semibold text-navy md:text-[45px] md:leading-[60px]">
              {whyChoose.title}
            </h2>
            <RichText
              html={whyChoose.text}
              className="pt-5 text-center font-poppins text-[14px] leading-[26px] font-medium text-muted md:text-[16px] md:leading-[30px] [&_p]:mb-[14px] md:[&_p]:mb-4"
            />
          </div>
          <div className="grid grid-cols-1 gap-5 px-2.5 pt-2.5 pb-[9px] md:grid-flow-col md:grid-cols-3 md:grid-rows-2 md:gap-x-0 md:gap-y-[30px] md:px-0 md:pt-2.5 md:pb-[60px]">
            {whyChoose.boxes.map((b, i) => (
              <div
                key={`${i}-${b.title}`}
                className="flex items-center rounded-[15px] shadow-[0_0_20px_rgba(0,0,0,0.1)] md:mx-2.5"
                style={{ backgroundColor: b.bg }}
              >
                <WhyChooseIcon icon={b.icon} color={b.iconColor} label={b.iconAlt} />
                <div className="pl-[15px]">
                  <h2 className="mb-2.5 font-poppins text-[20px] leading-8 font-medium text-navy capitalize md:leading-[30px]">{b.title}</h2>
                  <RichText
                    html={b.text}
                    className={`mb-[15px] font-poppins text-[14px] font-medium text-muted md:text-[16px] md:leading-[30px] ${i === 0 ? "leading-6" : "leading-7"}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Happy Clients! */}
      <section className="bg-white py-[50px] md:pt-[60px] md:pb-20">
        <div className="e-container p-2.5">
          <h2 className="mb-5 text-center font-raleway text-[38px] leading-none font-semibold text-[#2d2d2d]">{testimonials.title}</h2>
          <div className="py-[15px]" role="separator">
            <span className="mx-auto block w-[100px] border-t-[0.8px] border-[#2d2d2d]" />
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3">
            {testimonials.items.map((t, i) => (
              <div key={`${i}-${t.name}`} className="p-5">
                <figure className="relative m-0 flex h-full flex-col rounded-[10px_10px_10px_65px] md:min-h-[319px] bg-card-dark p-[30px] pb-[37px] shadow-[0_0_30px_#121212]">
                  <blockquote className="mb-5 font-raleway text-[16px] leading-6 text-white">{t.content}</blockquote>
                  <figcaption className="flex items-center">
                    {t.img && (
                      <Image
                        src={t.img.src}
                        alt={t.img.alt}
                        width={65}
                        height={65}
                        className="mr-[15px] size-[65px] rounded-full border-[5.6px] border-[#54595f] object-cover"
                      />
                    )}
                    <span>
                      <cite className="block font-raleway text-[16px] leading-6 text-white not-italic">{t.name}</cite>
                      <span className="block font-raleway text-[13.6px] leading-none text-[#bdbdbd]">{t.job}</span>
                    </span>
                  </figcaption>
                  <Icon name="quote-right" className="absolute right-0 bottom-1.5 text-[16px] text-white" />
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[url('/images/background-4.png')] bg-cover bg-center">
        <div className="e-container p-[30px]">
          <h2 className="mb-5 text-center font-poppins text-[25px] leading-none font-medium text-black md:text-[30px]">{homeFaq.title}</h2>
          <RichText
            html={homeFaq.intro}
            className="mb-5 h-[35px] text-center font-lato text-[16px] leading-[15px] tracking-[0.2px] text-black md:text-[20px] [&_p]:m-0"
          />
          <div className="grid grid-cols-1 md:grid-cols-2">
            {homeFaq.columns.map((items, i) => (
              <div key={i} className="p-2.5">
                <Accordion items={items} styles={faqStyles} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
