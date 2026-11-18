import type { Metadata } from "next";
import { redirect } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import DbNotice from "@/components/admin/DbNotice";
import { LinkButton, PageHeader } from "@/components/admin/ui";
import { SITE_URL } from "@/data/site";
import { dbSlugMap } from "@/lib/blog/admin";
import { getLegacyPost, isDbConfigured, legacyImageSize, getLegacyPosts } from "@/lib/blog/posts";
import { getReservedSlugs } from "@/lib/blog/reserved";
import { DEFAULT_AUTHOR, type BlogFormValues } from "@/lib/blog/schema";

export const metadata: Metadata = { title: "New post" };

type Props = { searchParams: Promise<{ from?: string }> };

const empty: BlogFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: null,
  metaTitle: "",
  metaDescription: "",
  author: DEFAULT_AUTHOR,
  tags: [],
  status: "draft",
  publishedAt: null,
};

export default async function NewBlogPage({ searchParams }: Props) {
  const { from } = await searchParams;
  const legacy = from ? getLegacyPost(from) : undefined;

  // "Recreate in admin" for a post that already has an admin version: edit that one instead.
  if (legacy && isDbConfigured()) {
    const existing = (await dbSlugMap().catch(() => new Map())).get(legacy.slug);
    if (existing) redirect(`/admin/blogs/${existing.id}/edit/`);
  }

  let initial = empty;
  if (legacy?.mdx) {
    const m = legacy.mdx.meta;
    const og = m.ogImage ?? m.image;
    const dim = og ? (m.ogImageWidth ? { width: m.ogImageWidth, height: m.ogImageHeight ?? 0 } : legacyImageSize(og)) : undefined;
    initial = {
      ...empty,
      title: m.wpTitle,
      slug: m.slug,
      excerpt: "",
      metaTitle: m.title,
      metaDescription: m.description ?? "",
      featuredImage: og ? { url: og, width: dim?.width ?? 0, height: dim?.height ?? 0, alt: m.ogImageAlt ?? m.imageAlt ?? "" } : null,
      tags: m.tags.map((t) => t.name),
      author: m.author || DEFAULT_AUTHOR,
      publishedAt: m.date ? new Date(m.date).toISOString() : null,
    };
  }

  return (
    <>
      <PageHeader
        title={legacy ? "Recreate legacy post" : "New post"}
        actions={
          <LinkButton href="/admin/blogs/" variant="secondary">
            ← All posts
          </LinkButton>
        }
      />
      {!isDbConfigured() && (
        <div className="mb-5">
          <DbNotice />
        </div>
      )}
      <BlogForm
        initial={initial}
        legacySlugs={getLegacyPosts().map((p) => p.slug)}
        reservedSlugs={[...getReservedSlugs()]}
        recreatedFrom={legacy?.slug}
        siteUrl={SITE_URL}
      />
    </>
  );
}
