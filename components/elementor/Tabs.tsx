"use client";

import { Children, isValidElement, useId, useState } from "react";
import Icon, { iconFromFa } from "@/components/Icon";

/**
 * Elementor Accordion and Toggle widgets (same markup/classes as Elementor 4.4).
 * Accordion: one item open at a time, first item open on load (Elementor default).
 * Toggle: items open independently, all closed on load.
 */
type ItemProps = { title: string; children?: React.ReactNode };

/** Marker component: its props are read by Accordion/Toggle. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Item(_props: ItemProps) {
  return null;
}

type Props = {
  id?: string;
  cls: string;
  titleTag?: string;
  closedIcon?: string;
  openedIcon?: string;
  iconAlign?: "left" | "right";
  children?: React.ReactNode;
};

function useItems(children: React.ReactNode) {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((c) => c.props as ItemProps);
}

function Tabs({ kind, cls, titleTag = "div", closedIcon, openedIcon, iconAlign = "left", children }: Props & { kind: "accordion" | "toggle" }) {
  const items = useItems(children);
  const base = useId().replace(/:/g, "");
  const [open, setOpen] = useState<number[]>(kind === "accordion" && items.length ? [0] : []);
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : kind === "accordion" ? [i] : [...o, i]));
  const closed = iconFromFa(closedIcon);
  const opened = iconFromFa(openedIcon);
  const T = titleTag as "div";
  const p = kind === "accordion" ? "accordion" : "toggle";

  return (
    <div className={cls}>
      <div className="elementor-widget-container">
        <div className={`elementor-${p}`}>
          {items.map((it, i) => {
            const isOpen = open.includes(i);
            return (
              <div key={i} className={`elementor-${p}-item`}>
                <T
                  id={`${base}-t${i}`}
                  className={`elementor-tab-title${isOpen ? " elementor-active" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`${base}-c${i}`}
                  onClick={() => toggle(i)}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(i);
                    }
                  }}
                >
                  {(closed || opened) && (
                    <span className={`elementor-${p}-icon elementor-${p}-icon-${iconAlign}`} aria-hidden="true">
                      <span className={`elementor-${p}-icon-closed`}>{closed && <Icon name={closed} />}</span>
                      <span className={`elementor-${p}-icon-opened`}>{opened && <Icon name={opened} />}</span>
                    </span>
                  )}
                  <span className={`elementor-${p}-title`}>{it.title}</span>
                </T>
                <div
                  id={`${base}-c${i}`}
                  className={`elementor-tab-content elementor-clearfix${isOpen ? " elementor-active" : ""}`}
                  role="region"
                  aria-labelledby={`${base}-t${i}`}
                  style={{ display: isOpen ? "block" : "none" }}
                >
                  {it.children}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function Accordion(props: Props) {
  return <Tabs kind="accordion" {...props} />;
}
export function Toggle(props: Props) {
  return <Tabs kind="toggle" {...props} />;
}
