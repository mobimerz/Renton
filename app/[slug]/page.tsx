import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTitleBar from "@/components/layout/PageTitleBar";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import ElementorBody from "@/components/elementor/ElementorBody";
import PostShare from "@/components/blog/PostShare";
import { allPosts, getElementorPage, getPost, neighbours } from "@/lib/content";
import { elementorPages } from "@/content/pages";
import { absUrl, buildMetadata } from "@/lib/seo";
import { blogPosting, breadcrumb, faqPage, graph, organization, webPage, website } from "@/lib/schema";
import type { BaseMeta } from "@/lib/posts-types";

/**
 * Root-level WordPress URLs that were built with Elementor:
 *  - 6 pages (laptop rental pages, AMC, careers, privacy, terms) -> content/pages/*.mdx
 *  - 37 blog posts (WordPress used /%postname%/ permalinks)    -> content/blog/*.mdx
 * Fixed routes such as /about/ or /contact/ always win over this dynamic segment.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(elementorPages).map((slug) => ({ slug })), ...allPosts.map((p) => ({ slug: p.meta.slug }))];
}

type Params = { params: Promise<{ slug: string }> };

const seoOf = (m: BaseMeta, ogType: "article", section?: string) =>
  buildMetadata({
    path: `/${m.slug}/`,
    title: m.title,
    description: m.description,
    ogType,
    ogImage: m.ogImage ? { url: m.ogImage, width: m.ogImageWidth, height: m.ogImageHeight, alt: m.ogImageAlt } : undefined,
    publishedTime: m.publishedTime,
    modifiedTime: m.modifiedTime,
    section,
  });

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getElementorPage(slug);
  if (page) return seoOf(page.meta, "article");
  const post = getPost(slug);
  if (post) return seoOf(post.meta, "article", post.meta.categories[0]?.name);
  return {};
}

export default async function Page({ params }: Params) {
  const { slug } = await params;

  /* ------------------------------------------------------------ pages */
  const page = getElementorPage(slug);
  if (page) {
    const { meta, Content } = page;
    const path = `/${slug}/`;
    const crumbs = [
      { name: "Home", path: "/" },
      { name: meta.pageTitle, path },
    ];
    const nodes = [
      organization(),
      website(),
      webPage({ type: "WebPage", path, name: meta.title, description: meta.description, image: meta.ogImage }),
      breadcrumb(path, crumbs),
    ];
    if (meta.faqs?.length) nodes.push(faqPage(path, meta.faqs));
    return (
      <>
        <JsonLd data={graph(...nodes)} />
        <PageTitleBar title={meta.pageTitle} crumbs={crumbs} />
        <BoxedContent>
          <article className="hentry type-page">
            <div className="entry-content">
              <ElementorBody elementorId={meta.elementorId}>
                <Content />
              </ElementorBody>
            </div>
          </article>
        </BoxedContent>
      </>
    );
  }

  /* ------------------------------------------------------------ posts */
  const post = getPost(slug);
  if (!post) notFound();
  const { meta, Content } = post;
  const path = `/${slug}/`;
  const { prev, next } = neighbours(slug);
  const nodes = [
    organization(),
    website(),
    webPage({ type: "WebPage", path, name: meta.title, description: meta.description, image: meta.image }),
    breadcrumb(path, [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog/" },
      { name: meta.wpTitle, path },
    ]),
    blogPosting({
      path,
      headline: meta.wpTitle,
      description: meta.description,
      image: meta.image,
      datePublished: meta.date,
      dateModified: meta.modifiedTime ?? meta.modified ?? meta.date,
      section: meta.categories[0]?.name,
    }),
  ];
  if (meta.faqs?.length) nodes.push(faqPage(path, meta.faqs));

  // WordPress "Elementor Full Width" template: just the Elementor content, edge to edge
  if (meta.template === "full-width")
    return (
      <>
        <JsonLd data={graph(...nodes)} />
        <ElementorBody elementorId={meta.elementorId}>
          <Content />
        </ElementorBody>
      </>
    );

  return (
    <div className="single-post">
      <JsonLd data={graph(...nodes)} />
      <BoxedContent>
        <article className="hentry type-post">
          <div className="entry-main">
            {meta.postTitle && (
              <header className="entry-header">
                <h1 className="entry-title">{meta.postTitle}</h1>
              </header>
            )}
            {meta.postTitle && (
              <div className="entry-info">
                <div className="entry-date">
                  <time dateTime={meta.date}>{meta.dateText}</time>
                </div>
                <div className="entry-author">
                  <span className="meta-sep">by</span>{" "}
                  <span className="author vcard">{meta.author}</span>
                </div>
                <div className="entry-comments">
                  <span className="meta-sep">with</span> <span className="meta-comment">no comment</span>
                </div>
                <div className="entry-tax">
                  {meta.categories.map((c) => (
                    <Link key={c.slug} href={`/category/${c.slug}/`} rel="category">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="entry-content">
              <ElementorBody elementorId={meta.elementorId}>
                <Content />
              </ElementorBody>
            </div>
            <footer className="entry-meta">
              {meta.tags.length > 0 && (
                <div className="entry-tax">
                  <span>Tags: </span>
                  {meta.tags.map((t, i) => (
                    <span key={t.slug}>
                      {i > 0 && <i>, </i>}
                      {/* WordPress tag archives redirect to /blog/ */}
                      <Link href="/blog/" rel="tag">
                        {t.name}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
              <PostShare url={absUrl(path)} title={meta.wpTitle} />
            </footer>
          </div>
          <nav className="aux-next-prev-posts nav-skin-minimal" aria-label="Post navigation">
            {prev && (
              <section className="np-prev-section">
                <Link href={`/${prev.slug}/`}>
                  <div className="np-arrow">
                    <span className="flex size-10 items-center justify-center rounded-full border border-[#ddd]" aria-hidden="true">
                      ←
                    </span>
                  </div>
                  <p className="np-nav-text">Previous Post</p>
                  <h4 className="np-title">{prev.wpTitle}</h4>
                </Link>
              </section>
            )}
            {next && (
              <section className="np-next-section">
                <Link href={`/${next.slug}/`}>
                  <div className="np-arrow">
                    <span className="flex size-10 items-center justify-center rounded-full border border-[#ddd]" aria-hidden="true">
                      →
                    </span>
                  </div>
                  <p className="np-nav-text">Next Post</p>
                  <h4 className="np-title">{next.wpTitle}</h4>
                </Link>
              </section>
            )}
          </nav>
          <p className="nocomments">Comments are closed.</p>
        </article>
      </BoxedContent>
    </div>
  );
}
