import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PageTitleBar from "@/components/layout/PageTitleBar";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import ElementorBody from "@/components/elementor/ElementorBody";
import { allPosts } from "@/lib/content";
import { buildMetadata, absUrl } from "@/lib/seo";
import { breadcrumb, graph, organization, website } from "@/lib/schema";
import { imageSize } from "@/lib/image-size";

/**
 * /category/blog/ — the WordPress category archive. Like the live Phlox archive it lists every post
 * (37, no pagination) with its image, title, meta line, full content and a "Read More" button.
 */
const path = "/category/blog/";
const title = "Blog Archives - Renton Technologies";

export const metadata: Metadata = buildMetadata({ path, title, ogType: "article" });

export default function CategoryBlogPage() {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path },
  ];
  return (
    <>
      <JsonLd
        data={graph(
          organization(),
          website(),
          {
            "@type": "CollectionPage",
            "@id": `${absUrl(path)}#webpage`,
            url: absUrl(path),
            name: title,
            isPartOf: { "@id": `${absUrl("/")}#website` },
            breadcrumb: { "@id": `${absUrl(path)}#breadcrumb` },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: allPosts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absUrl(`/${p.meta.slug}/`) })),
            },
          },
          breadcrumb(path, crumbs),
        )}
      />
      <PageTitleBar title="Posts in category: Blog" crumbs={crumbs} />
      <div className="aux-archive">
        <BoxedContent>
          {allPosts.map(({ meta, Content }) => {
            const href = `/${meta.slug}/`;
            const dim = meta.image ? imageSize(meta.image) : undefined;
            return (
              <article key={meta.slug} className="hentry type-post">
                {meta.image && dim && (
                  <div className="entry-media">
                    <div className="aux-media-frame aux-media-image aux-image-mask">
                      <Link href={href}>
                        <Image src={meta.image} alt={meta.imageAlt ?? meta.wpTitle} width={dim.width} height={dim.height} sizes="(max-width: 1351px) 100vw, 1281px" />
                      </Link>
                    </div>
                  </div>
                )}
                <div className="entry-main">
                  <header className="entry-header">
                    <h3 className="entry-title">
                      <Link href={href}>{meta.wpTitle}</Link>
                    </h3>
                  </header>
                  <div className="entry-info">
                    <div className="entry-date">
                      <Link href={href}>
                        <time dateTime={meta.date}>{meta.dateText}</time>
                      </Link>
                    </div>
                    <span className="entry-meta-sep meta-sep meta-author">by</span>
                    <span className="author vcard meta-author">{meta.author}</span>
                    <span className="meta-sep">with</span>
                    <Link className="meta-comment" href={href}>
                      No Comment
                    </Link>
                    <span className="entry-tax">
                      <Link href={path} rel="category">
                        Blog
                      </Link>
                    </span>
                  </div>
                  <div className="entry-content">
                    <ElementorBody elementorId={meta.elementorId}>
                      <Content />
                    </ElementorBody>
                  </div>
                  <footer className="entry-meta">
                    <div className="readmore">
                      <Link href={href} className="aux-read-more aux-outline aux-large">
                        <span className="aux-read-more-text">Read More</span>
                      </Link>
                    </div>
                  </footer>
                </div>
              </article>
            );
          })}
        </BoxedContent>
      </div>
    </>
  );
}
