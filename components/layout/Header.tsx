"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mainNav, site, type NavItem } from "@/data/site";
import Icon from "@/components/Icon";

const isActive = (pathname: string, href: string) => pathname === href;

/** Flattened list for the mobile dropdown (same order as the WordPress mobile menu). */
const mobileNav: NavItem[] = mainNav.flatMap((i) => [{ label: i.label, href: i.href }, ...(i.children ?? [])]);

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-navbar px-5 pt-2.5 pb-0.5 md:py-0">
      <div className="e-container flex items-center">
        {/* Logo column */}
        <div className="w-1/2 p-2.5 md:w-[30%]">
          <Link href="/" aria-label="RENTON TECHNOLOGIES" className="inline-flex w-[120px] md:h-[59px] flex-col items-center">
            <Image
              src={site.logo}
              alt="" /* link already named; visible text beside it */
              width={312}
              height={265}
              priority
              className="h-[55px] w-[65px] object-contain md:h-[42px] md:w-[50px]"
            />
            <span className="font-raleway text-[10px] leading-[15px] font-semibold whitespace-nowrap text-black">RENTON TECHNOLOGIES</span>
          </Link>
        </div>

        {/* Menu column */}
        <div className="w-1/2 p-2.5 md:w-[70%]">
          <nav aria-label="Main menu" className="hidden md:block">
            <ul className="flex flex-wrap items-center justify-center gap-x-[22px]">
              {mainNav.map((item) => (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={`relative inline-block px-2 font-poppins text-[16px] leading-[26px] font-medium transition-colors duration-[600ms] after:absolute after:right-2 after:bottom-0 after:left-2 after:h-px after:bg-gold after:opacity-0 after:transition-opacity after:duration-[600ms] hover:text-gold hover:after:opacity-100 ${
                      item.children ? "pr-[22px]" : ""
                    } ${isActive(pathname, item.href) ? "text-gold after:opacity-100" : "text-black"}`}
                  >
                    {item.label}
                    {item.children && (
                      <Icon name="angle-down" className="absolute top-1/2 right-2 -translate-y-1/2 text-[12px]" />
                    )}
                  </Link>
                  {item.children && (
                    // Intentional fix: the live dropdown was transparent with white text (unreadable).
                    // Now solid white with dark text; size, border, font and violet hover are unchanged.
                    <ul className="invisible absolute top-full left-0 z-50 w-[180px] border border-[#e8e8e8] bg-white opacity-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      {item.children.map((c) => (
                        <li key={c.href} className="border-b border-[#e8e8e8] last:border-b-0">
                          <Link
                            href={c.href}
                            className={`block px-[15px] py-[13px] font-raleway text-[14px] hover:bg-violet hover:text-white ${
                              isActive(pathname, c.href) ? "bg-violet text-white" : "text-[#222]"
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
          </nav>

          {/* Mobile hamburger */}
          <div className="text-center md:hidden">
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="group inline-block w-[42px] p-[7px]"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="mb-1 block h-0.5 bg-black last:mb-0 group-hover:bg-gold" />
              ))}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <nav
        id="mobile-menu"
        aria-label="Mobile menu"
        className={`absolute top-full right-0 left-0 z-50 bg-white md:hidden ${open ? "block" : "hidden"}`}
      >
        <ul>
          {mobileNav.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-2.5 py-[7px] text-right font-poppins text-[16px] leading-[26px] font-medium hover:bg-gold hover:text-white ${
                  isActive(pathname, item.href) ? "bg-gold text-white" : "text-black"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
