import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import ElementorBody from "@/components/elementor/ElementorBody";
import { getAllPosts } from "@/lib/blog/posts";
import { FeaturedImage } from "@/components/blog/DbPostBody";
import RichText from "@/components/ui/RichText";
import { buildMetadata, absUrl } from "@/lib/seo";
import { breadcrumb, graph, organization, website } from "@/lib/schema";

/**
 * /category/blog/ — the WordPress category archive. Like the live Phlox archive it lists every post
 * (no pagination) with its image, title, meta line, full content and a "Read More" button.
 * Legacy MDX posts and published admin posts, newest first.
 */
const path = "/category/blog/";
const title = "Blog Archives - Renton Technologies";

export const metadata: Metadata = buildMetadata({ path, title, ogType: "article" });
export const revalidate = 3600;

export default async function CategoryBlogPage() {
  const allPosts = await getAllPosts();
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
              itemListElement: allPosts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: absUrl(`/${p.slug}/`) })),
            },
          },
          breadcrumb(path, crumbs),
        )}
      />
      <PageHero title="Posts in category: Blog" crumbs={crumbs} />
      <div className="aux-archive">
        <BoxedContent>
          {allPosts.map((p) => {
            const href = `/${p.slug}/`;
            return (
              <article key={p.slug} className="hentry type-post">
                {p.image && p.image.width > 0 && <FeaturedImage image={p.image} href={href} />}
                <div className="entry-main">
                  <header className="entry-header">
                    <h3 className="entry-title">
                      <Link href={href}>{p.title}</Link>
                    </h3>
                  </header>
                  <div className="entry-info">
                    <div className="entry-date">
                      <Link href={href}>
                        <time dateTime={p.date}>{p.dateText}</time>
                      </Link>
                    </div>
                    <span className="entry-meta-sep meta-sep meta-author">by</span>
                    <span className="author vcard meta-author">{p.author}</span>
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
                    {p.mdx ? (
                      <ElementorBody elementorId={p.mdx.meta.elementorId}>
                        <p.mdx.Content />
                      </ElementorBody>
                    ) : (
                      <div className="wp-content">
                        <RichText html={p.html ?? ""} className="db-post-body" />
                      </div>
                    )}
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
