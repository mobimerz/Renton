import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/** /robots.txt — same rules as WordPress, pointing at the new sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
