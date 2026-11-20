import Image from "next/image";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import GoogleMap from "@/components/GoogleMap";
import { footerQuickLinks, footerSocial, site, social } from "@/data/site";

const footerIcon: Record<string, IconName> = {
  instagram: "instagram",
  facebook: "facebook",
  linkedin: "linkedin",
  pinterest: "pinterest",
  twitter: "x-twitter",
};
// The X icon sits on black in the footer (brand colour elsewhere).
const footerBg = (k: string) => (k === "twitter" ? "#000000" : social[k as keyof typeof social].color);

const contact: { icon: IconName; text: string; href?: string }[] = [
  { icon: "phone-alt", text: site.phone, href: site.phoneHref },
  { icon: "envelope", text: site.email, href: `mailto:${site.email}` },
  { icon: "map-marker-alt", text: site.address.full },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[linear-gradient(180deg,#142344_0%,#0b1430_100%)] text-white">
      <div className="e-container grid grid-cols-1 gap-8 px-5 py-14 md:px-6 md:py-16 lg:grid-cols-[1.4fr_1fr_1.3fr_1.3fr]">
        {/* About */}
        <div className="flex flex-col gap-4">
          <Link href="/" aria-label="Renton Technologies" className="inline-block w-fit">
            <Image src={site.footerLogo} alt="logo renton" width={300} height={300} className="size-[70px] object-contain" />
          </Link>
          <p className="max-w-[320px] font-inter text-[14px] leading-6 text-white/70">{site.footerText}</p>
          <div className="mt-1 flex flex-wrap gap-2.5">
            {footerSocial.map((k) => (
              <a
                key={k}
                href={social[k].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={k === "twitter" ? "X-twitter" : social[k].label}
                className="flex size-9 items-center justify-center rounded-full text-white transition-transform duration-300 hover:-translate-y-1 hover:brightness-110"
                style={{ backgroundColor: footerBg(k) }}
              >
                <Icon name={footerIcon[k]} className="text-[14px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-col gap-4">
          <h2 className="font-poppins text-[18px] font-semibold text-footer-heading md:text-[20px]">Quick Links</h2>
          <ul className="flex flex-col gap-3">
            {footerQuickLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-2 font-inter text-[14px] text-white/80 transition-colors hover:text-footer-heading"
                >
                  <span className="h-px w-0 bg-footer-heading transition-all duration-300 group-hover:w-4" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Connection + contact */}
        <div className="flex flex-col gap-4">
          <h2 className="font-poppins text-[18px] font-semibold text-footer-heading md:text-[20px]">Social Connection</h2>
          <ul className="flex flex-col gap-3.5">
            {contact.map((c) => (
              <li key={c.text} className="flex items-start gap-3">
                <Icon name={c.icon} className="mt-0.5 w-[20px]! shrink-0 text-[18px] text-footer-heading" />
                {c.href ? (
                  <a href={c.href} className="font-inter text-[14px] leading-6 text-white/80 transition-colors hover:text-white">
                    {c.text}
                  </a>
                ) : (
                  <span className="font-inter text-[14px] leading-6 text-white/80">{c.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded-card ring-1 ring-white/10">
          <GoogleMap src={site.mapEmbed} title="Renton Technologies LLP, Electronic City, Bengaluru" height={220} small className="h-full min-h-[200px]" />
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="e-container px-5 py-5 md:px-6">
          <p className="text-center font-inter text-[12px] leading-6 tracking-[0.2px] text-white/60 md:text-[14px]">
            © {year}. All Rights Reserved by Renton Technologies. |{" "}
            <Link href="/terms-and-conditions/" className="text-white/80 transition-colors hover:text-white">
              Terms &amp; Conditions
            </Link>
            &nbsp; |&nbsp;{" "}
            <Link href="/privacy-policy/" className="text-white/80 transition-colors hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
