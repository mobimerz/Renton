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
    <footer>
      <div className="bg-footer px-5 pb-0 md:px-0 md:pt-[50px] md:pb-[25px]">
        <div className="e-container flex flex-wrap">
          {/* About */}
          <div className="w-full p-5 md:w-[28%]">
            <div className="p-2.5">
              <Link href="/" aria-label="Renton Technologies" className="block h-[93px] p-2.5 md:h-[103px]">
                <Image src={site.footerLogo} alt="logo renton" width={300} height={300} className="size-[65px] md:size-[75px]" />
              </Link>
            </div>
            <p className="m-2.5 mb-[13px] font-open-sans md:mb-[14px] text-[13px] leading-[19.5px] text-white md:text-[14px] md:leading-[21px]">{site.footerText}</p>
          </div>

          {/* Quick links */}
          <div className="w-1/2 p-5 md:w-[15%]">
            <h2 className="mb-[17px] font-poppins text-[16px] leading-4 font-medium text-footer-heading md:text-[20px] md:leading-5">Quick Links</h2>
            <ul className="space-y-[17px]">
              {footerQuickLinks.map((l) => (
                <li key={l.label} className="leading-[14px]">
                  <Link href={l.href} className="font-open-sans text-[14px] leading-[14px] text-white hover:text-footer-heading">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Map */}
          <div className="w-1/2 p-5 md:w-[30%]">
            <GoogleMap src={site.mapEmbed} title="Renton Technologies LLP, Electronic City, Bengaluru" height={250} />
          </div>

          {/* Social + contact */}
          <div className="w-full p-5 pb-[29px] md:w-[27%] md:pb-5">
            <h2 className="mb-0.5 font-poppins text-[16px] leading-4 font-medium text-footer-heading md:mb-[11px] md:text-[20px] md:leading-5">Social Connection</h2>
            <div className="mb-[11px] flex gap-2">
              {footerSocial.map((k) => (
                <a
                  key={k}
                  href={social[k].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={k === "twitter" ? "X-twitter" : social[k].label}
                  className="flex size-9 items-center justify-center rounded-[30px] text-white hover:opacity-90"
                  style={{ backgroundColor: footerBg(k) }}
                >
                  <Icon name={footerIcon[k]} className="text-[14px]" />
                </a>
              ))}
            </div>
            <ul>
              {contact.map((c, i) => (
                <li key={c.text} className={`flex items-center ${i > 0 ? "mt-1.5" : ""} ${i < contact.length - 1 ? "pb-1.5" : ""}`}>
                  <Icon name={c.icon} className="w-[25px]! shrink-0 text-[20px] text-footer-heading" />
                  {c.href ? (
                    <a href={c.href} className="font-poppins text-[14px] leading-[21px] text-white">
                      {c.text}
                    </a>
                  ) : (
                    <span className="font-poppins text-[14px] leading-[21px] text-white">{c.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="bg-copyright">
        <div className="e-container p-2.5">
          <p className="mb-[11px] text-center font-poppins text-[11px] leading-[16.5px] tracking-[0.3px] text-copyright-text md:mb-4 md:text-[16px] md:leading-6">
            © {year}. All Rights Reserved by Renton Technologies. |{" "}
            <Link href="/terms-and-conditions/" className="text-white">
              Terms &amp; Conditions
            </Link>
            &nbsp; |&nbsp;{" "}
            <Link href="/privacy-policy/" className="text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
