import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import RichText from "@/components/ui/RichText";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import CTABand from "@/components/ui/CTABand";
import Hero from "@/components/home/Hero";
import WhyChoose from "@/components/home/WhyChoose";
import StatsStrip from "@/components/home/StatsStrip";
import ProductsGrid from "@/components/home/ProductsGrid";
import HowItWorks from "@/components/home/HowItWorks";
import WhoWeServe from "@/components/home/WhoWeServe";
import TestimonialsCarousel from "@/components/home/TestimonialsCarousel";
import LogosMarquee from "@/components/home/LogosMarquee";
import FaqSection from "@/components/home/FaqSection";
import LocationMap from "@/components/home/LocationMap";
import { buildMetadata } from "@/lib/seo";
import { breadcrumb, faqPage, graph, localBusiness, webPage, website } from "@/lib/schema";
import { homeSeo } from "@/data/home";
import { site } from "@/data/site";
import { showClientLogos } from "@/data/home-extra";
import { getHomepageContent } from "@/lib/homepage/content";

export const metadata: Metadata = buildMetadata(homeSeo);
/** Content comes from the admin (MongoDB) with data/home.ts as fallback; saves revalidate this page. */
export const revalidate = 3600;

export default async function HomePage() {
  const { content } = await getHomepageContent();
  const { hero, rentalProducts, whyChoose, testimonials, homeFaq } = content;
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

      <Hero hero={hero} />

      <StatsStrip />

      {/* Rental Products (existing content) */}
      <section className="bg-white">
        <div className="e-container px-5 py-14 md:px-6 md:py-20">
          <Reveal className="reveal-up mx-auto flex max-w-[720px] flex-col items-center gap-3 text-center">
            <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{rentalProducts.title}</h2>
            <RichText html={rentalProducts.text} className="font-inter text-[15px] leading-7 text-muted md:text-[17px] [&_p]:m-0" />
          </Reveal>
          <ProductsGrid slides={rentalProducts.slides} />
        </div>
      </section>

      {/* Why Choose Renton (existing content) */}
      <WhyChoose title={whyChoose.title} text={whyChoose.text} boxes={whyChoose.boxes} />

      <HowItWorks />

      <WhoWeServe />

      {/* Testimonials (existing content) */}
      <section className="bg-white">
        <div className="e-container px-5 py-14 md:px-6 md:py-20">
          <Reveal className="reveal-up mx-auto flex max-w-[720px] flex-col items-center gap-3 text-center">
            <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[40px]">{testimonials.title}</h2>
          </Reveal>
          <TestimonialsCarousel items={testimonials.items} />
        </div>
      </section>

      {showClientLogos && <LogosMarquee />}

      <FaqSection title={homeFaq.title} intro={homeFaq.intro} items={allFaqs} />

      {/* Final CTA band */}
      <section className="bg-white">
        <div className="e-container px-5 pb-16 md:px-6 md:pb-20">
          <Reveal className="reveal-up">
            <CTABand
              title="Ready to power your business with the right IT infrastructure?"
              subtitle="Flexible rentals, fast delivery and 24/7 support — get a tailored quote today."
            >
              <Button href="/contact/" variant="white" size="lg">
                Get a Quote
              </Button>
              <Button href={site.phoneHref} variant="accent" size="lg">
                Call us
              </Button>
            </CTABand>
          </Reveal>
        </div>
      </section>

      <LocationMap />
    </>
  );
}
