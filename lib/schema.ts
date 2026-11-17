import { SITE_URL, site } from "@/data/site";
import { absUrl } from "./seo";

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: site.address.street,
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
};

const logo = {
  "@type": "ImageObject",
  "@id": `${SITE_URL}/#logo`,
  url: absUrl(site.logoSchema.url),
  contentUrl: absUrl(site.logoSchema.url),
  caption: site.name,
  width: site.logoSchema.width,
  height: site.logoSchema.height,
};

const sameAs = [
  "https://www.facebook.com/rentontechnologies",
  "https://www.linkedin.com/in/renton-technologies/",
  "https://www.instagram.com/renton_technologies/",
  "https://www.pinterest.com/in/renton_technologies/",
  "https://x.com/RentonT35572",
];

/** Full LocalBusiness node, used on the home page. */
export function localBusiness(): Json {
  return {
    "@type": ["LocalBusiness", "ComputerStore"],
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: SITE_URL,
    logo,
    image: { "@id": `${SITE_URL}/#logo` },
    telephone: "+91-8050281515",
    email: site.email,
    address: postalAddress,
    areaServed: { "@type": "City", name: "Bangalore" },
    openingHours: site.openingHours,
    sameAs,
  };
}

/** Lightweight Organization reference node, used on every other page. */
export function organization(): Json {
  return { "@type": "Organization", "@id": ORG_ID, name: site.name, url: SITE_URL, logo, sameAs };
}

export function website(): Json {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: site.name,
    alternateName: "Renton",
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumb(path: string, crumbs: Crumb[]): Json {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absUrl(path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absUrl(c.path),
    })),
  };
}

export type PageType = "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";

export function webPage(opts: { type: PageType; path: string; name: string; description?: string; image?: string }): Json {
  const url = absUrl(opts.path);
  return {
    "@type": opts.type,
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORG_ID },
    breadcrumb: opts.path === "/" ? undefined : { "@id": `${url}#breadcrumb` },
    primaryImageOfPage: opts.image ? { "@type": "ImageObject", url: absUrl(opts.image) } : undefined,
    inLanguage: "en-US",
  };
}

export function blogPosting(opts: {
  path: string;
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified: string;
  section?: string;
}): Json {
  const url = absUrl(opts.path);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#blogposting`,
    headline: opts.headline,
    description: opts.description,
    image: opts.image ? absUrl(opts.image) : undefined,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    articleSection: opts.section,
    author: { "@type": "Organization", "@id": ORG_ID, name: site.name },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: { "@id": `${url}#webpage` },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
  };
}

export type Faq = { q: string; a: string };

const stripHtml = (h: string) =>
  h
    .replace(/<\/(p|li|h\d)>/g, "$& ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

export function faqPage(path: string, faqs: Faq[]): Json {
  return {
    "@type": "FAQPage",
    "@id": `${absUrl(path)}#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: stripHtml(f.a) },
    })),
  };
}

/** Removes undefined keys so the emitted JSON stays clean. */
export function graph(...nodes: Json[]): Json {
  return JSON.parse(JSON.stringify({ "@context": "https://schema.org", "@graph": nodes }));
}
