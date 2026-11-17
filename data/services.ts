// "Other Services" page content, copied word for word from https://www.renton.org.in/services/ (crawled 2026-11-17).
// The h1 and intro end with a zero-width space (U+200B) on WordPress; kept as-is.

export const servicesHero = {
  title: "Comprehensive IT Solutions For You​.",
  text: "Explore our wide array of IT lifecycle services designed to optimize your technology and enhance your business performance.​",
  button: { label: "Book Appointment", href: "#" },
  image: {"src": "/images/Comprehensive-IT-Solutions-for-You.jpeg", "alt": "comprehensive it solutions for you", "width": 1184, "height": 511},
  /** Decorative layer (alt was the filename on WordPress) */
  layer: {"src": "/images/865db8ad-sl-hero-layer-2.png", "alt": "Decorative shape", "width": 230, "height": 190},
};

export const serviceRows = [
  { title: "Server Rentals", html: "<p>Intelligent Renting offers a seamless way to access the latest technology without the upfront costs. Our AI-driven platform guarantees competitive quotes and a high fill rate, ensuring you get the equipment when and where you need it.</p>", image: {"src": "/images/Server-Rentals.jpeg", "alt": "server rentals", "width": 1024, "height": 448}, imageFirst: false },
  { title: "Laptop & Workstation Rentals", html: "<p>Proactive Services keep your systems running smoothly with 24/7/365 support. Our predictive maintenance solutions identify and resolve potential issues before they lead to downtime, ensuring your operations are uninterrupted.</p>", image: {"src": "/images/Laptop-Workstation-Rentals.jpeg", "alt": "laptop & workstation rentals", "width": 1024, "height": 535}, imageFirst: true },
];
