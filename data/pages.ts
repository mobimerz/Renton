import type { PageSeo } from "@/lib/seo";
import type { PageType } from "@/lib/schema";

/**
 * SEO for every regular page. Titles and descriptions are copied exactly from the live
 * Rank Math output. Entries marked `newDescription` had no meta description on WordPress;
 * those descriptions were written for the rebuild (approved 2026-11-17).
 */
export type PageEntry = PageSeo & {
  /** Theme title-bar heading (the WordPress page title) */
  pageTitle: string;
  schemaType: PageType;
  newDescription?: true;
};

export const pages = {
  services: {
    path: "/services/",
    title: "Other Services - Renton Technologies",
    description:
      "Other IT services from Renton Technologies: server rentals, laptop and workstation rentals and IT lifecycle support for businesses in Electronic City.",
    newDescription: true,
    pageTitle: "Other Services",
    schemaType: "WebPage",
    ogImage: { url: "/images/cropped-Renton_Logo.png", width: 312, height: 265, alt: "renton logo" },
    publishedTime: "2025-12-06T06:08:34+05:30",
    modifiedTime: "2026-01-03T05:27:08+05:30",
  },
  products: {
    path: "/products/",
    title: "Products - Renton Technologies",
    description:
      "Explore Renton Technologies products in Bangalore: IT hardware rental, secure data erasure software and IT asset management tools for compliant businesses.",
    newDescription: true,
    pageTitle: "Products",
    schemaType: "WebPage",
    ogImage: { url: "/images/all-in-one-pc.jpg", width: 1280, height: 761, alt: "all in one pc" },
    publishedTime: "2025-12-06T11:26:04+05:30",
    modifiedTime: "2025-12-31T07:27:28+05:30",
  },
  about: {
    path: "/about/",
    title: "About - Renton Technologies",
    description:
      "Learn about Renton Technologies in Electronic City, Bangalore: IT rental, secure data erasure, sales and service, our 6-D process and core advantages.",
    newDescription: true,
    pageTitle: "About",
    schemaType: "AboutPage",
    ogImage: { url: "/images/printers.jpg", width: 1280, height: 761, alt: "printers" },
    publishedTime: "2025-12-06T06:08:34+05:30",
    modifiedTime: "2026-01-02T11:29:50+05:30",
  },
  contact: {
    path: "/contact/",
    title: "Contact - Renton Technologies",
    description:
      "Contact Renton Technologies in Electronic City, Bangalore for laptop, desktop, server and printer rentals, IT AMC and secure data erasure. Call +91 8050281515.",
    newDescription: true,
    pageTitle: "Contact",
    schemaType: "ContactPage",
    ogImage: { url: "/images/pexels-photo-8112160.jpeg", width: 1024, height: 684, alt: "Contact" },
    publishedTime: "2025-12-06T06:08:36+05:30",
    modifiedTime: "2026-10-28T17:47:17+05:30",
  },
} satisfies Record<string, PageEntry>;
