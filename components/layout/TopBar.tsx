import Icon, { type IconName } from "@/components/Icon";
import { site, social, topBarSocial } from "@/data/site";

const items: { icon: IconName; text: string; href?: string }[] = [
  { icon: "map-pin", text: site.topBarAddress },
  { icon: "envelope", text: site.email, href: `mailto:${site.email}` },
  { icon: "phone-alt", text: site.phone, href: site.phoneHref },
];

const brandIcon: Record<string, IconName> = {
  facebook: "facebook",
  linkedin: "linkedin-in",
  instagram: "instagram",
  pinterest: "pinterest",
  twitter: "x-twitter",
  whatsapp: "whatsapp",
};

/** Slim contact strip above the header. Hidden on phones. */
export default function TopBar() {
  return (
    <div className="hidden bg-brand text-white md:block">
      <div className="e-container flex items-center justify-between gap-4 px-6 py-2">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {items.map((it) => (
            <div key={it.text} className="flex items-center gap-2 font-inter text-[12.5px] text-white/90">
              <Icon name={it.icon} className="w-4! text-[13px] text-accent" />
              {it.href ? (
                <a href={it.href} className="transition-colors hover:text-white">
                  {it.text}
                </a>
              ) : (
                <span>{it.text}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          {topBarSocial.map((k) => (
            <a
              key={k}
              href={social[k].href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social[k].label}
              className="flex size-6 items-center justify-center rounded-full text-white/80 transition-all duration-200 hover:bg-white/15 hover:text-white"
            >
              <Icon name={brandIcon[k]} className="text-[13px]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
