import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTitleBar from "@/components/layout/PageTitleBar";
import BoxedContent from "@/components/layout/BoxedContent";
import JsonLd from "@/components/JsonLd";
import ElementorBody from "@/components/elementor/ElementorBody";
import PostArticle from "@/components/blog/PostArticle";
import DbPostBody from "@/components/blog/DbPostBody";
import { getElementorPage } from "@/lib/content";
import { elementorPages } from "@/content/pages";
import { getAllPosts, getLegacyPost, getPublishedDbPost, getLegacyPosts, neighboursIn, type ListedPost } from "@/lib/blog/posts";
import { isReservedSlug } from "@/lib/blog/reserved";
import { buildMetadata } from "@/lib/seo";
import { blogPosting, breadcrumb, faqPage, graph, organization, webPage, website } from "@/lib/schema";
import type { BaseMeta } from "@/lib/posts-types";

/**
 * Root-level URLs /<slug>/:
 *  1. the 6 Elementor pages (laptop rental pages, AMC, careers, privacy, terms) -> content/pages/*.mdx
 *  2. published admin posts from MongoDB (they replace a legacy post with the same slug)
 *  3. the 37 legacy blog posts (WordPress /%postname%/ permalinks) -> content/blog/*.mdx
 *  4. anything else (incl. drafts) -> 404
 * Fixed routes such as /about/ or /contact/ always win over this dynamic segment.
 */
export const dynamicParams = true; // admin posts are rendered on first visit, then cached (ISR)
export const revalidate = 3600; // safety net; saves in the admin revalidate immediately

export function generateStaticParams() {
  return [...Object.keys(elementorPages).map((slug) => ({ slug })), ...getLegacyPosts().map((p) => ({ slug: p.slug }))];
}

type Params = { params: Promise<{ slug: string }> };

const seoOf = (m: BaseMeta, section?: string) =>
  buildMetadata({
    path: `/${m.slug}/`,
    title: m.title,
    description: m.description,
    ogType: "article",
    ogImage: m.ogImage ? { url: m.ogImage, width: m.ogImageWidth, height: m.ogImageHeight, alt: m.ogImageAlt } : undefined,
    publishedTime: m.publishedTime,
    modifiedTime: m.modifiedTime,
    section,
  });

/** The post for a slug: a published DB post wins over the legacy MDX post. Pages/reserved slugs never resolve to a post. */
async function findPost(slug: string): Promise<ListedPost | undefined> {
  if (isReservedSlug(slug)) return undefined;
  return (await getPublishedDbPost(slug)) ?? getLegacyPost(slug);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = getElementorPage(slug);
  if (page) return seoOf(page.meta);
  const post = await findPost(slug);
  if (!post) return {};
  if (post.source === "mdx" && post.mdx) return seoOf(post.mdx.meta, post.mdx.meta.categories[0]?.name);
  return buildMetadata({
    path: `/${slug}/`,
    title: post.metaTitle || `${post.title} - Renton Technologies`,
    description: post.metaDescription || post.excerpt || undefined,
    ogType: "article",
    ogImage: post.image ? { url: post.image.url, width: post.image.width || undefined, height: post.image.height || undefined, alt: post.image.alt } : undefined,
    publishedTime: post.date,
    modifiedTime: post.modified,
    section: "Blog",
  });
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
  const post = await findPost(slug);
  if (!post) notFound();

  const path = `/${slug}/`;
  const { prev, next } = neighboursIn(await getAllPosts(), slug);
  const mdxMeta = post.mdx?.meta;
  const nodes = [
    organization(),
    website(),
    webPage({ type: "WebPage", path, name: mdxMeta?.title ?? post.metaTitle ?? post.title, description: mdxMeta?.description ?? post.metaDescription, image: post.image?.url }),
    breadcrumb(path, [
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog/" },
      { name: post.title, path },
    ]),
    blogPosting({
      path,
      headline: post.title,
      description: mdxMeta?.description ?? (post.metaDescription || post.excerpt),
      image: post.image?.url,
      datePublished: post.date,
      dateModified: post.modified,
      section: mdxMeta ? mdxMeta.categories[0]?.name : "Blog",
    }),
  ];
  if (mdxMeta?.faqs?.length) nodes.push(faqPage(path, mdxMeta.faqs));

  /* legacy MDX post */
  if (post.source === "mdx" && post.mdx) {
    const { meta, Content } = post.mdx;
    const body = (
      <ElementorBody elementorId={meta.elementorId}>
        <Content />
      </ElementorBody>
    );
    // WordPress "Elementor Full Width" template: just the Elementor content, edge to edge
    if (meta.template === "full-width")
      return (
        <>
          <JsonLd data={graph(...nodes)} />
          {body}
        </>
      );
    return (
      <>
        <JsonLd data={graph(...nodes)} />
        <PostArticle
          slug={slug}
          heading={meta.postTitle}
          date={meta.date}
          dateText={meta.dateText}
          author={meta.author}
          tags={meta.tags.map((t) => t.name)}
          categories={meta.categories}
          shareTitle={meta.wpTitle}
          prev={prev}
          next={next}
        >
          {body}
        </PostArticle>
      </>
    );
  }

  /* admin (MongoDB) post */
  return (
    <>
      <JsonLd data={graph(...nodes)} />
      <PostArticle
        slug={slug}
        heading={post.title}
        date={post.date}
        dateText={post.dateText}
        author={post.author}
        tags={post.tags}
        shareTitle={post.title}
        prev={prev}
        next={next}
      >
        <DbPostBody html={post.html ?? ""} image={post.image} />
      </PostArticle>
    </>
  );
}
