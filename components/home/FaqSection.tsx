import Accordion, { type AccordionItem } from "@/components/ui/Accordion";
import Reveal from "@/components/ui/Reveal";
import RichText from "@/components/ui/RichText";
import { site } from "@/data/site";

const faqStyles = {
  box: "divide-y divide-slate-100 overflow-hidden rounded-card bg-white shadow-card ring-1 ring-slate-100",
  iconPosition: "right" as const,
  closedIcon: "plus" as const,
  openIcon: "minus" as const,
  title:
    "px-6 py-[22px] font-poppins text-[14px] leading-[22px] md:text-[16px] md:leading-[24px] font-medium text-brand-navy transition-colors duration-200 hover:bg-brand-50 hover:text-brand",
  activeTitle: "bg-brand-50! text-brand!",
  content:
    "bg-brand-50 px-6 pb-5 font-inter text-[13px] leading-[21px] text-[#4a5a6a] md:text-[14px] md:leading-[22px] [&_p]:mb-[13px] [&_ul]:my-[13px] [&_ul]:pl-0 [&_ul]:list-inside [&_li]:mb-[13px] [&_strong]:text-brand-navy",
};

/** Two-column FAQ: heading + WhatsApp help card on the left, accordion on the right. */
export default function FaqSection({ title, intro, items }: { title: string; intro: string; items: AccordionItem[] }) {
  return (
    <section className="bg-brand-50/50">
      <div className="e-container grid grid-cols-1 gap-10 px-5 py-14 md:px-6 md:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <Reveal className="reveal-up flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-[12px] font-semibold tracking-wide text-brand-700 uppercase">
            FAQ
          </span>
          <h2 className="font-poppins text-[28px] leading-[1.15] font-bold text-brand-navy md:text-[36px]">{title}</h2>
          <RichText html={intro} className="font-inter text-[15px] leading-7 text-muted [&_p]:m-0" />
          <div className="mt-2 rounded-card bg-[linear-gradient(120deg,#0a2b9b_0%,#142344_100%)] p-6 text-white shadow-card">
            <h3 className="font-poppins text-[18px] font-semibold text-white">Still have questions?</h3>
            <p className="mt-1.5 font-inter text-[14px] leading-6 text-white/80">Chat with our team on WhatsApp for a quick answer.</p>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 font-inter text-[14px] font-semibold text-[#063e24] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm5.9 14.2c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.1-.8-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.4-.3.6-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.4.6-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.2.1.4.1.5-.1l.7-.9c.2-.3.4-.2.6-.1l1.9.9c.2.1.4.2.5.3.1.2.1.6-.1 1.1z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal className="reveal-up">
          <Accordion items={items} styles={faqStyles} />
        </Reveal>
      </div>
    </section>
  );
}
