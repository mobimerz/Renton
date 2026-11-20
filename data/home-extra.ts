// Content for the NEW home-page sections added in the redesign.
// NOTE: the numbers and logo slots below are PLACEHOLDERS — replace with real data.

/** Animated stats strip. TODO: replace with real figures. */
export const homeStats: { value: number; suffix?: string; prefix?: string; label: string }[] = [
  { value: 5000, suffix: "+", label: "Devices rented" }, // TODO: real number
  { value: 300, suffix: "+", label: "Happy clients" }, // TODO: real number
  { value: 8, suffix: "+", label: "Years of experience" }, // TODO: real number
  { value: 15, suffix: "+", label: "Cities served" }, // TODO: real number
];

/** Short one-liners shown on each rental-product card (keyed by the slide caption). */
export const productBlurbs: Record<string, string> = {
  Laptop: "Business & refurbished laptops on flexible rent.",
  "All in One PC": "Space-saving all-in-one desktops for teams.",
  Server: "Enterprise-grade servers & workstations.",
  Monitor: "Full-HD & 4K monitors in any quantity.",
  Office: "Complete office IT setups, ready to work.",
  Printers: "Multi-function printers & scanners.",
};

/** Client-logos section stays hidden until real logos are added. TODO: set true once ready. */
export const showClientLogos = false;

/** Client-logos marquee. TODO: add real client logo files to /public/images and list them here. */
export const clientLogos: { src?: string; name: string }[] = [
  { name: "Client 1" }, // TODO: add logo { src: "/images/clients/...", name: "..." }
  { name: "Client 2" },
  { name: "Client 3" },
  { name: "Client 4" },
  { name: "Client 5" },
  { name: "Client 6" },
];
