import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import DbNotice from "@/components/admin/DbNotice";
import { LinkButton, PageHeader } from "@/components/admin/ui";
import { SITE_URL } from "@/data/site";
import { connectDB } from "@/lib/mongodb";
import { Blog } from "@/lib/models/Blog";
import { isDbConfigured, getLegacyPosts } from "@/lib/blog/posts";
import { getReservedSlugs } from "@/lib/blog/reserved";
import { isObjectId, toFormValues } from "@/lib/blog/save";
import type { BlogFormValues } from "@/lib/blog/schema";

export const metadata: Metadata = { title: "Edit post" };

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  if (!isObjectId(id)) notFound();

  const header = (
    <PageHeader
      title="Edit post"
      actions={
        <LinkButton href="/admin/blogs/" variant="secondary">
          ← All posts
        </LinkButton>
      }
    />
  );
  if (!isDbConfigured()) return <>{header}<DbNotice /></>;

  let initial: BlogFormValues | null = null;
  try {
    await connectDB();
    const doc = await Blog.findById(id).lean();
    initial = doc ? toFormValues(doc) : null;
  } catch (err) {
    console.error("[admin/blogs] edit load failed:", err);
    return <>{header}<DbNotice error /></>;
  }
  if (!initial) notFound();

  return (
    <>
      {header}
      {/* key: remount the form when navigating between posts */}
      <BlogForm key={id} initial={initial} legacySlugs={getLegacyPosts().map((p) => p.slug)} reservedSlugs={[...getReservedSlugs()]} siteUrl={SITE_URL} />
    </>
  );
}
