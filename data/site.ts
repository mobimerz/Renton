export const SITE_URL = "https://www.renton.org.in";

export const site = {
  name: "Renton Technologies",
  legalName: "Renton Technologies LLP",
  url: SITE_URL,
  logo: "/images/Renton_Logo.png",
  footerLogo: "/images/Logo_Renton-1.png",
  ogDefaultImage: "/images/cropped-Renton_Logo.png",
  locale: "en_US",
  phone: "+91 805028-1515",
  phoneHref: "tel:+918050281515",
  email: "contact@renton.org.in",
  whatsappNumber: "918050281515",
  whatsappUrl: "https://wa.me/918050281515",
  topBarAddress: "Electronic City, Bangalore - 560100",
  address: {
    full: "No. 6/2, First Floor, Lava Kusha Building, Beratena Agrahara, Electronic City, Bengaluru – 560100",
    street: "No. 6/2, First Floor, Lava Kusha Building, Beratena Agrahara",
    locality: "Electronic City, Bengaluru",
    region: "Karnataka",
    postalCode: "560100",
    country: "IN",
  },
  /** From the live Rank Math LocalBusiness settings */
  openingHours: ["Mo,Tu,We,Th,Fr,Sa,Su 09:00-17:00"],
  logoSchema: { url: "/images/cropped-Renton_Logo.png", width: 312, height: 265 },
  mapEmbed:
    "https://maps.google.com/maps?q=Renton%20Technologies%20LLP%2C%20First%20Floor%2C%20Lava%20Kusha%20Building%2C%20No.%206%2F2%2C%20Beratena%20Agrahara%2C%20Electronic%20City%2C%20Bengaluru%2C%20Karnataka%20560100&t=m&z=12&output=embed&iwloc=near",
  googleTagId: "GT-T5RTHBQZ",
  footerText:
    "Renton provides premium rental products with professional IT assistance for asset management , secure data erasure & compliance. Contact us for Quotes.",
} as const;

export type SocialKey = "facebook" | "linkedin" | "instagram" | "pinterest" | "twitter" | "whatsapp";

export const social: Record<SocialKey, { label: string; href: string; color: string }> = {
  facebook: { label: "Facebook", href: "https://www.facebook.com/rentontechnologies", color: "#3B5998" },
  linkedin: { label: "Linkedin", href: "https://www.linkedin.com/in/renton-technologies/", color: "#0077B5" },
  instagram: { label: "Instagram", href: "https://www.instagram.com/renton_technologies/", color: "#262626" },
  pinterest: { label: "Pinterest", href: "https://www.pinterest.com/in/renton_technologies/", color: "#BD081C" },
  twitter: { label: "X", href: "https://x.com/RentonT35572", color: "#000000" },
  whatsapp: { label: "Whatsapp", href: "https://wa.me/918050281515", color: "#25D366" },
};

/** Order in the header top bar */
export const topBarSocial: SocialKey[] = ["facebook", "linkedin", "instagram", "pinterest", "twitter", "whatsapp"];
/** Order in the footer ("Social Connection"); X icon there has a black background */
export const footerSocial: SocialKey[] = ["instagram", "facebook", "linkedin", "pinterest", "twitter"];

export type NavItem = { label: string; href: string; children?: NavItem[] };

/** Desktop menu: "Other Services" has a dropdown */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Products", href: "/products/" },
  {
    label: "Other Services",
    href: "/services/",
    children: [
      { label: "Laptop Rental Services", href: "/laptop-rental-services/" },
      { label: "Laptop Rental in Electronic City", href: "/laptop-rental-in-electronic-city/" },
      { label: "Annual Maintenance Contract Services", href: "/annual-maintenance-contract-services/" },
    ],
  },
  { label: "Blog", href: "/blog/" },
  { label: "Careers", href: "/careers/" },
  { label: "Contact", href: "/contact/" },
];

export const footerQuickLinks: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Who Are We", href: "/about/" },
  { label: "Products", href: "/products/" },
  { label: "Other Services", href: "/services/" },
  { label: "Careers", href: "/careers/" },
  { label: "Students Internship", href: "/careers/" },
];

/** Live WP WhatsApp (NinjaTeam) widget settings */
export const whatsappWidget = {
  number: "918050281515",
  chatUrl: "https://api.whatsapp.com/send?phone=918050281515",
  buttonLabel: { text: "Need Help?", strong: "Chat with us" },
  title: "Start a Conversation",
  description: { before: "Welcome to ", strong: "Renton Technologies!", after: " How can our experts help you today?" },
  account: { name: "Renton", title: "For Enquery" },
  color: "#2DB742",
  right: 30,
  bottom: 60,
} as const;
