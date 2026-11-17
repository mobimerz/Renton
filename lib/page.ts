import type { Metadata } from "next";
import type { PageEntry } from "@/data/pages";
import { buildMetadata } from "./seo";
import { breadcrumb, faqPage, graph, organization, webPage, website, type Crumb, type Faq } from "./schema";

/** Home › Page crumbs for a top-level page. */
export const crumbsFor = (p: PageEntry): Crumb[] => [
  { name: "Home", path: "/" },
  { name: p.pageTitle, path: p.path },
];

export const pageMetadata = (p: PageEntry): Metadata => buildMetadata(p);

/** JSON-LD graph for a regular page: Organization, WebSite, <schemaType>, BreadcrumbList (+ FAQPage). */
export function pageSchema(p: PageEntry, faqs?: Faq[]) {
  const nodes = [
    organization(),
    website(),
    webPage({ type: p.schemaType, path: p.path, name: p.title, description: p.description, image: p.ogImage?.url }),
    breadcrumb(p.path, crumbsFor(p)),
  ];
  if (faqs?.length) nodes.push(faqPage(p.path, faqs));
  return graph(...nodes);
}
