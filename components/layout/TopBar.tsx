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
  twitter: "twitter",
  whatsapp: "whatsapp",
};

/** Blue contact strip above the menu. Hidden on phones (elementor-hidden-mobile). */
export default function TopBar() {
  return (
    <div className="hidden bg-topbar md:block">
      <div className="e-container grid grid-cols-4">
        {items.map((it) => (
          <div key={it.text} className="p-2.5">
            <div className="flex h-5 items-center font-poppins text-[13px] text-white">
              <Icon name={it.icon} className="w-5! text-[16px] text-gold" />
              {it.href ? <a href={it.href}>{it.text}</a> : <span>{it.text}</span>}
            </div>
          </div>
        ))}
        <div className="p-2.5">
          <div className="flex h-5 gap-5">
            {topBarSocial.map((k) => (
              <a
                key={k}
                href={social[k].href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social[k].label}
                className="flex size-5 items-center justify-center rounded text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: social[k].color }}
              >
                <Icon name={brandIcon[k]} className="text-[14px]" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
