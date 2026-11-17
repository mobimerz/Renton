import type { Metadata } from "next";
import { SITE_URL, site } from "@/data/site";

export type PageSeo = {
  /** path with leading + trailing slash, e.g. "/about/" ("/" for home) */
  path: string;
  title: string;
  description?: string;
  ogType?: "website" | "article";
  ogImage?: { url: string; width?: number; height?: number; alt?: string };
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
};

export const absUrl = (p: string) => (p.startsWith("http") ? p : `${SITE_URL}${p}`);

const defaultOgImage = { url: site.ogDefaultImage, width: 312, height: 265, alt: "renton logo" };

/** Builds the same meta set Rank Math produced on WordPress. */
export function buildMetadata(seo: PageSeo): Metadata {
  const img = seo.ogImage ?? defaultOgImage;
  const url = absUrl(seo.path);
  return {
    // absolute: WordPress titles already include the brand suffix where it had one
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-video-preview": -1, "max-image-preview": "large" },
    },
    openGraph: {
      locale: site.locale,
      type: seo.ogType ?? "article",
      title: seo.title,
      description: seo.description,
      url,
      siteName: site.name,
      images: [{ url: absUrl(img.url), width: img.width, height: img.height, alt: img.alt }],
      ...(seo.ogType === "website"
        ? {}
        : { publishedTime: seo.publishedTime, modifiedTime: seo.modifiedTime, section: seo.section }),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [absUrl(img.url)],
    },
  };
}
