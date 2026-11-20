"use client";

import { useState } from "react";
import EkitIcon from "@/components/EkitIcon";
import { wpEmoji } from "@/lib/emoji";
import type { AccordionItem } from "./Accordion";

/** ElementsKit accordion (pink bars, arrow on the right, first item open, one at a time). */
export default function EkitAccordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={`shadow-[0_10px_20px_rgba(0,0,0,0.1)] ${i < items.length - 1 ? "mb-2.5" : ""}`}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`ekit-acc-${i}`}
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="relative block w-full border-[0.8px] border-transparent bg-[#fa346e] px-[30px] py-[14px] text-left text-[18px] leading-6 font-semibold text-white"
            >
              {/* ElementsKit title block keeps ~11px clear of the arrow */}
              <span className="block pr-[11px]">{it.q}</span>
              <EkitIcon name={isOpen ? "icon-up-arrow" : "icon-down-arrow1"} className="absolute top-1/2 right-[30px] size-4 -translate-y-1/2" />
            </button>
            <div
              id={`ekit-acc-${i}`}
              hidden={!isOpen}
              className="rich px-[60px] pt-[35px] pb-[25px] [&_p]:mb-0 text-[15px] leading-[25px] text-body"
              dangerouslySetInnerHTML={{ __html: wpEmoji(it.a) }}
            />
          </div>
        );
      })}
    </div>
  );
}
