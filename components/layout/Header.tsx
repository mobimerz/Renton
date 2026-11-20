"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav, site, type NavItem } from "@/data/site";
import Icon from "@/components/Icon";

const isActive = (pathname: string, href: string) => pathname === href;

/** Flattened list for the mobile dropdown (same order as the WordPress mobile menu). */
const mobileNav: NavItem[] = mainNav.flatMap((i) => [{ label: i.label, href: i.href }, ...(i.children ?? [])]);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-slate-200 bg-white/90 shadow-[0_6px_24px_-12px_rgba(10,43,155,0.3)] backdrop-blur-md" : "border-transparent bg-white"
      }`}
    >
      <div className={`e-container flex items-center justify-between px-5 transition-all duration-300 md:px-6 ${scrolled ? "py-1.5" : "py-2.5"}`}>
        {/* Logo */}
        <Link href="/" aria-label="RENTON TECHNOLOGIES" className="inline-flex items-center gap-2.5">
          <Image
            src={site.logo}
            alt=""
            width={312}
            height={265}
            priority
            className={`w-auto object-contain transition-all duration-300 ${scrolled ? "h-9" : "h-11"}`}
          />
          <span className="font-poppins text-[13px] leading-tight font-semibold whitespace-nowrap text-brand-navy">
            RENTON
            <br className="hidden sm:block" /> TECHNOLOGIES
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main menu" className="hidden items-center gap-x-6 lg:flex">
          <ul className="flex items-center gap-x-5">
            {mainNav.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`relative inline-flex items-center gap-1 py-2 font-inter text-[15px] font-medium transition-colors hover:text-brand ${
                    isActive(pathname, item.href) ? "text-brand" : "text-brand-navy"
                  }`}
                >
                  {item.label}
                  {item.children && <Icon name="angle-down" className="text-[11px] transition-transform duration-200 group-hover:rotate-180" />}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded bg-brand transition-transform duration-300 ${
                      isActive(pathname, item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
                {item.children && (
                  <ul className="invisible absolute top-full left-0 z-50 w-[250px] translate-y-1 rounded-xl border border-slate-100 bg-white p-1.5 opacity-0 shadow-[0_18px_40px_-14px_rgba(10,43,155,0.3)] transition-all duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          className={`block rounded-lg px-3.5 py-2.5 font-inter text-[14px] transition-colors hover:bg-brand-50 hover:text-brand ${
                            isActive(pathname, c.href) ? "bg-brand-50 text-brand" : "text-brand-navy"
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/contact/"
            className="inline-flex items-center rounded-xl bg-cta px-5 py-2.5 font-inter text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg"
          >
            Get a Quote
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
          className="group flex size-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span className={`block h-0.5 w-6 bg-brand-navy transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-0.5 w-6 bg-brand-navy transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-6 bg-brand-navy transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <nav
        id="mobile-menu"
        aria-label="Mobile menu"
        className={`overflow-hidden border-t border-slate-100 bg-white transition-[max-height] duration-300 ease-out lg:hidden ${open ? "max-h-[520px]" : "max-h-0"}`}
      >
        <ul className="px-5 py-2">
          {mobileNav.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2.5 font-inter text-[15px] font-medium transition-colors hover:bg-brand-50 hover:text-brand ${
                  isActive(pathname, item.href) ? "text-brand" : "text-brand-navy"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="px-3 py-2.5">
            <Link
              href="/contact/"
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-cta px-5 py-3 text-center font-inter text-[14px] font-semibold text-white"
            >
              Get a Quote
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
