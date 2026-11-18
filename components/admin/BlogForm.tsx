"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUpload from "./ImageUpload";
import RichTextEditor from "./RichTextEditor";
import TagInput from "./TagInput";
import { Badge, Button, Card, Field, Input, LinkButton, Textarea } from "./ui";
import { DEFAULT_AUTHOR, blogInputSchema, fieldErrors, slugify, type BlogFormValues } from "@/lib/blog/schema";

type Props = {
  initial: BlogFormValues;
  /** Slugs of the 37 legacy MDX posts (to show "Overrides legacy post"). */
  legacySlugs: string[];
  /** Slugs a post may never use (pages, system URLs). */
  reservedSlugs: string[];
  /** Set when the form was opened with "Recreate in admin". */
  recreatedFrom?: string;
  siteUrl: string;
};

const toLocalInput = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
};
const fromLocalInput = (v: string) => (v ? new Date(v).toISOString() : null);
const omit = (o: Record<string, string>, keys: string[]) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));

export default function BlogForm({ initial, legacySlugs, reservedSlugs, recreatedFrom, siteUrl }: Props) {
  const router = useRouter();
  const isNew = !initial.id;
  const [v, setV] = useState<BlogFormValues>(initial);
  const [slugTouched, setSlugTouched] = useState(!isNew || Boolean(initial.slug));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savingAs, setSavingAs] = useState<BlogFormValues["status"] | null>(null);
  const [busy, setBusy] = useState(0); // running uploads
  const [savedSnapshot, setSavedSnapshot] = useState(() => JSON.stringify(initial));
  const dirty = JSON.stringify(v) !== savedSnapshot;

  const set = <K extends keyof BlogFormValues>(key: K, value: BlogFormValues[K]) => {
    setV((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors((prev) => omit(prev, [key as string]));
  };

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const reserved = useMemo(() => new Set(reservedSlugs), [reservedSlugs]);
  const overridesLegacy = legacySlugs.includes(v.slug);
  const slugReserved = reserved.has(v.slug) || /^\d{4}$/.test(v.slug);

  function onTitle(title: string) {
    setV((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));
    setErrors((prev) => omit(prev, ["title", "slug"]));
  }

  const onBusy = (b: boolean) => setBusy((n) => Math.max(0, n + (b ? 1 : -1)));

  async function save(status: BlogFormValues["status"]) {
    const payload = { ...v, status };
    const parsed = blogInputSchema.safeParse(payload);
    const clientErrors = parsed.success ? {} : fieldErrors(parsed.error);
    if (slugReserved) clientErrors.slug = `"${v.slug}" is used by an existing page or system URL. Choose a different slug.`;
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSaving(true);
    setSavingAs(status);
    try {
      const res = await fetch(isNew ? "/api/admin/blogs/" : `/api/admin/blogs/${initial.id}/`, {
        method: isNew ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: string; error?: string; errors?: Record<string, string> };
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        toast.error(data.error ?? "Could not save the post.");
        return;
      }
      setV(payload);
      setSavedSnapshot(JSON.stringify(payload));
      toast.success(status === "published" ? "Post published. The website updates within a few seconds." : "Draft saved.");
      if (isNew && data.id) router.replace(`/admin/blogs/${data.id}/edit/`);
      else router.refresh();
    } catch {
      toast.error("Network error. Your changes are not saved yet.");
    } finally {
      setSaving(false);
      setSavingAs(null);
    }
  }

  const publicUrl = `${siteUrl}/${v.slug || "your-slug"}/`;
  const seoTitle = v.metaTitle || v.title || "Post title";
  const seoDesc = v.metaDescription || v.excerpt || "Add a meta description so Google shows a good summary of this post.";
  const disabled = saving || busy > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void save(v.status);
      }}
      className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
      noValidate
    >
      <div className="space-y-6">
        {recreatedFrom && (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Prefilled from the legacy post <strong>/{recreatedFrom}/</strong>. Rewrite the content below. When you publish, this post replaces the legacy one at
            the same URL.
          </p>
        )}

        <Card>
          <div className="space-y-4">
            <Field label="Title" htmlFor="title" error={errors.title}>
              <Input id="title" value={v.title} onChange={(e) => onTitle(e.target.value)} placeholder="e.g. Laptop Rental in Bangalore: A Complete Guide" aria-invalid={!!errors.title} />
            </Field>
            <Field
              label="Slug (URL)"
              htmlFor="slug"
              error={errors.slug ?? (slugReserved ? `"${v.slug}" is used by an existing page or system URL. Choose a different slug.` : undefined)}
              hint={
                <>
                  {publicUrl} {overridesLegacy && <Badge tone="amber">Overrides legacy post</Badge>}
                </>
              }
            >
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={v.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  aria-invalid={!!errors.slug || slugReserved}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSlugTouched(false);
                    set("slug", slugify(v.title));
                  }}
                  title="Generate the slug from the title"
                >
                  From title
                </Button>
              </div>
            </Field>
            <Field label="Excerpt" htmlFor="excerpt" error={errors.excerpt} hint={`Short summary for the blog grid and RSS feed. ${v.excerpt.length}/600`}>
              <Textarea id="excerpt" value={v.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={3} maxLength={600} />
            </Field>
          </div>
        </Card>

        <div className="space-y-1.5">
          <span className="block text-sm font-medium text-slate-700">Content</span>
          <RichTextEditor value={v.content} onChange={(html) => set("content", html)} onBusyChange={onBusy} invalid={!!errors.content} />
          {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
        </div>

        <Card title="SEO">
          <div className="space-y-4">
            <Field label="Meta title" htmlFor="metaTitle" error={errors.metaTitle} hint={`Defaults to the post title. ${v.metaTitle.length}/60 recommended`}>
              <Input id="metaTitle" value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} maxLength={120} placeholder={v.title} />
            </Field>
            <Field
              label="Meta description"
              htmlFor="metaDescription"
              error={errors.metaDescription}
              hint={`Defaults to the excerpt. ${v.metaDescription.length}/160 recommended`}
            >
              <Textarea id="metaDescription" value={v.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={3} maxLength={320} />
            </Field>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4" aria-label="Google preview">
              <p className="text-xs text-slate-500">Google preview</p>
              <p className="mt-1 truncate text-xs text-emerald-800">{publicUrl}</p>
              <p className="truncate text-lg text-[#1a0dab]">{seoTitle}</p>
              <p className="line-clamp-2 text-sm text-slate-600">{seoDesc}</p>
            </div>
          </div>
        </Card>
      </div>

      <aside className="space-y-6">
        <Card title="Publish">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Status</span>
              <Badge tone={v.status === "published" ? "green" : "slate"}>{v.status === "published" ? "Published" : "Draft"}</Badge>
            </div>
            <Field label="Publish date" htmlFor="publishedAt" error={errors.publishedAt} hint="Empty = set automatically when first published. Used to sort posts.">
              <Input id="publishedAt" type="datetime-local" value={toLocalInput(v.publishedAt)} onChange={(e) => set("publishedAt", fromLocalInput(e.target.value))} />
            </Field>
            <Field label="Author" htmlFor="author" error={errors.author}>
              <Input id="author" value={v.author} onChange={(e) => set("author", e.target.value)} placeholder={DEFAULT_AUTHOR} />
            </Field>
            <div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
              <Button type="button" variant="secondary" onClick={() => void save("draft")} loading={savingAs === "draft"} disabled={disabled}>
                {v.status === "published" ? "Unpublish" : "Save draft"}
              </Button>
              <Button type="button" onClick={() => void save("published")} loading={savingAs === "published"} disabled={disabled}>
                {v.status === "published" ? "Update" : "Publish"}
              </Button>
            </div>
            {busy > 0 && <p className="text-xs text-slate-500">Waiting for the image upload to finish…</p>}
            {dirty && !saving && <p className="text-xs text-amber-700">You have unsaved changes.</p>}
            {!isNew && v.status === "published" && !dirty && (
              <LinkButton href={`/${v.slug}/`} target="_blank" variant="ghost" className="px-0">
                View on website ↗
              </LinkButton>
            )}
          </div>
        </Card>

        <Card title="Featured image">
          <div className="space-y-3">
            <ImageUpload
              folder="blog"
              value={v.featuredImage ? { url: v.featuredImage.url, width: v.featuredImage.width, height: v.featuredImage.height } : null}
              onChange={(img) => set("featuredImage", img ? { ...img, alt: v.featuredImage?.alt ?? "" } : null)}
              onBusyChange={onBusy}
              hint="Shown on the post and used as the social share (og:image) picture. 1200×630 works best."
            />
            {v.featuredImage && (
              <Field label="Image alt text" htmlFor="imgAlt" hint="Describe the image for Google and screen readers.">
                <Input
                  id="imgAlt"
                  value={v.featuredImage.alt}
                  onChange={(e) => set("featuredImage", v.featuredImage ? { ...v.featuredImage, alt: e.target.value } : null)}
                  maxLength={200}
                />
              </Field>
            )}
            {errors.featuredImage && <p className="text-sm text-red-600">{errors.featuredImage}</p>}
          </div>
        </Card>

        <Card title="Tags">
          <TagInput id="tags" value={v.tags} onChange={(tags) => set("tags", tags)} />
          {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags}</p>}
        </Card>
      </aside>
    </form>
  );
}
