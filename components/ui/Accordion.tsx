"use client";

import { useId, useState } from "react";
import Icon, { type IconName } from "@/components/Icon";
import { wpEmoji } from "@/lib/emoji";

export type AccordionItem = { q: string; a: string };

export type AccordionStyle = {
  /** card wrapper classes (bg, radius, shadow...) */
  box?: string;
  title?: string;
  activeTitle?: string;
  content?: string;
  iconPosition?: "left" | "right";
  /** Elementor accordion: caret-down/up; toggle widget on /contact/: caret-right/up */
  closedIcon?: IconName;
  openIcon?: IconName;
};

/**
 * Elementor accordion (one item open at a time, first open by default) or
 * toggle (`multiple`: items open independently, all closed by default).
 */
export default function Accordion({
  items,
  multiple = false,
  styles = {},
}: {
  items: AccordionItem[];
  multiple?: boolean;
  styles?: AccordionStyle;
}) {
  const base = useId();
  const [open, setOpen] = useState<number[]>(multiple ? [] : [0]);
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]));
  const iconLeft = (styles.iconPosition ?? "left") === "left";

  return (
    <div className={styles.box}>
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        const id = `${base}-${i}`;
        return (
          <div key={i}>
            <div>
              <button
                type="button"
                id={`${id}-t`}
                aria-expanded={isOpen}
                aria-controls={`${id}-c`}
                onClick={() => toggle(i)}
                className={`block w-full text-left ${styles.title ?? ""} ${isOpen ? styles.activeTitle ?? "" : ""}`}
              >
                {/* Elementor floats the icon, so wrapped lines run under it */}
                <span className={`${iconLeft ? "float-left" : "float-right text-right"} inline-block w-[19px] md:w-6`}>
                  <Icon name={isOpen ? styles.openIcon ?? "caret-up" : styles.closedIcon ?? "caret-down"} />
                </span>
                {it.q}
              </button>
            </div>
            <div
              id={`${id}-c`}
              role="region"
              aria-labelledby={`${id}-t`}
              hidden={!isOpen}
              className={`rich ${styles.content ?? ""}`}
              dangerouslySetInnerHTML={{ __html: wpEmoji(it.a) }}
            />
          </div>
        );
      })}
    </div>
  );
}
