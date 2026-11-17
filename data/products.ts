// Products page content, copied word for word from https://www.renton.org.in/products/ (crawled 2026-11-17).
// NOTE: several blocks on the live page still contain the ElementsKit template's placeholder copy
// ("A small river named Duden...", "Organised Code", "How to Change my Photo..."). Kept verbatim as instructed.

export type EkitBox = {
  id: string;
  title: string;
  text: string;
  href?: string | null;
};

export const productsHero = {
  subtitle: "Amazing Feature For",
  title: "Explore Trusted IT Solutions",
  text: "<p>Browse Renton’s comprehensive catalog of secure IT rental and automated data erasure software. Enhance compliance, reduce risk, and optimize your asset lifecycle with industry-leading security.</p>",
  buttons: [
    { label: "Rent Now", href: "#" },
    { label: "Get a Quote", href: "/contact/" },
  ],
  image: {
    src: "/images/all-in-one-pc.jpg",
    alt: "all in one pc",
    width: 1280,
    height: 761,
  },
};

export const secureSolutions: { heading: { title: string }; boxes: EkitBox[] } =
  {
    heading: { title: "Secure IT Rental & Data Protection Solutions" },
    boxes: [
      {
        id: "5693656e",
        title: "IT Hardware Rental",
        text: "<p>Flexible rental of desktops, laptops, servers, and networking equipment to ensure business continuity and cost-effective scaling.</p>",
        href: "#",
      },
      {
        id: "d0bc199",
        title: "Secure Data Erasure Software",
        text: "<p>Certified software solutions for automated, compliant data destruction and end-of-life device management.</p>",
        href: "#",
      },
      {
        id: "45444d3f",
        title: "IT Asset Management Tools",
        text: "<p>Track, audit, and optimize your IT assets with advanced management tools that enhance security and efficiency.</p>",
        href: "#",
      },
    ],
  };

export const comprehensive = {
  heading: {
    subtitle: null,
    title: "Comprehensive IT Solutions",
    text: "<p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradise</p>",
  },
  image: {
    src: "/images/pexels-photo-1181354-1181354-scaled.jpg",
    alt: "A female engineer using a laptop while monitoring data servers in a modern server room.",
    width: 2560,
    height: 1709,
  },
  boxes: [
    {
      id: "6e259b5c",
      title: "Automated Data Erasure",
      text: "<p>Ensure every device is wiped to the highest standards with fully automated data erasure workflows, minimizing manual intervention and human error.</p>",
      href: "#",
    },
    {
      id: "5ca7a32c",
      title: "Regulatory Compliance Assurance",
      text: "<p>Meet global data protection laws and industry standards with built-in compliance reporting and audit trails for every asset processed.</p>",
      href: "#",
    },
    {
      id: "6276e7a1",
      title: "Secure IT Asset Disposal",
      text: "<p>Safely dispose of outdated devices with secure logistics and environmentally responsible processes, supporting circular economy initiatives.</p>",
      href: "#",
    },
  ],
};

export const specialFeatures = {
  heading: {
    subtitle: null,
    title: "Our Special Features",
    text: "<p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradise</p>",
  },
  boxes: [
    {
      id: "6c38adf2",
      title: "Organised Code",
      text: "<p>A mobile app landing page is the important and essentials amount product.</p>",
      href: "#",
    },
    {
      id: "36dd8b4a",
      title: "Super Performence",
      text: "<p>A mobile app landing page is the important and essentials amount product.</p>",
      href: "#",
    },
    {
      id: "7251b41",
      title: "100% Response Time",
      text: "<p>A mobile app landing page is the important and essentials amount product.</p>",
      href: "#",
    },
    {
      id: "3ecd2cb0",
      title: "Maintaining Milestones",
      text: "<p>A mobile app landing page is the important and essentials amount product.</p>",
      href: "#",
    },
    {
      id: "1f92a167",
      title: "Search Optimization",
      text: "<p>A mobile app landing page is the important and essentials amount product.</p>",
      href: "#",
    },
    {
      id: "2f558f27",
      title: "Customer Support",
      text: "<p>A mobile app landing page is the important and essentials amount product.</p>",
      href: "#",
    },
  ],
};

export const productsFaq = {
  heading: {
    subtitle: null,
    title: "Frequently Asked Questions",
    text: "<p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradise</p>",
  },
  image: { src: "/images/server.jpg", alt: "server", width: 1280, height: 761 },
  items: [
    {
      q: "How to Change my Photo from Admin Dashboard?",
      a: "<p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast</p>",
    },
    {
      q: "How to Change my Password easily?",
      a: "<p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast</p>",
    },
    {
      q: "How to Change my Subscription Plan using PayPal",
      a: "<p>Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast</p>",
    },
  ],
};
