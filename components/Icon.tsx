import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faCaretRight,
  faPhone,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faMapMarkerAlt,
  faMapPin,
  faPhoneAlt,
  faQuoteRight,
  faAngleUp,
  faAngleDown,
  faCheck,
  faPlus,
  faMinus,
  faCirclePlus,
  faCircleMinus,
  faAngleRight,
  faLink,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faFacebookF,
  faInstagram,
  faLinkedin,
  faLinkedinIn,
  faPinterest,
  faTwitter,
  faWhatsapp,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope as faEnvelopeRegular } from "@fortawesome/free-regular-svg-icons";
import { icon as faIcon, type IconDefinition } from "@fortawesome/fontawesome-svg-core";

// The same Font Awesome 5/6 icons Elementor rendered, as inline SVG (no icon font download).
const icons = {
  "caret-down": faCaretDown,
  "caret-up": faCaretUp,
  "caret-right": faCaretRight,
  phone: faPhone,
  "envelope-regular": faEnvelopeRegular,
  youtube: faYoutube,
  "chevron-left": faChevronLeft,
  "chevron-right": faChevronRight,
  envelope: faEnvelope,
  "map-marker-alt": faMapMarkerAlt,
  "map-pin": faMapPin,
  "phone-alt": faPhoneAlt,
  "quote-right": faQuoteRight,
  "angle-up": faAngleUp,
  "angle-down": faAngleDown,
  check: faCheck,
  plus: faPlus,
  minus: faMinus,
  "plus-circle": faCirclePlus,
  "minus-circle": faCircleMinus,
  "angle-right": faAngleRight,
  link: faLink,
  "arrow-right": faArrowRight,
  facebook: faFacebook,
  "facebook-f": faFacebookF,
  instagram: faInstagram,
  linkedin: faLinkedin,
  "linkedin-in": faLinkedinIn,
  pinterest: faPinterest,
  twitter: faTwitter,
  "x-twitter": faXTwitter,
  whatsapp: faWhatsapp,
} satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof icons;

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  return <FontAwesomeIcon icon={icons[name]} className={className} aria-hidden="true" />;
}

/** Resolve an Elementor/Font Awesome reference like "solid:plus-circle" or "brands:youtube". */
export function iconFromFa(ref?: string): IconName | undefined {
  if (!ref) return undefined;
  const name = ref.split(":").pop()!;
  const alias: Record<string, IconName> = { "envelope-regular": "envelope-regular" };
  const key = (alias[name] ?? name) as IconName;
  return key in icons ? key : undefined;
}

/** Inline SVG markup for an "style:name" Font Awesome reference (used in kept WordPress markup). */
export function faSvg(ref: string): string {
  const name = iconFromFa(ref);
  return name ? faIcon(icons[name]).html.join("") : "";
}
