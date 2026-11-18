import Link from "next/link";
import PostShare from "@/components/blog/PostShare";
import BoxedContent from "@/components/layout/BoxedContent";
import { absUrl } from "@/lib/seo";
import type { ListedPost } from "@/lib/blog/posts";

/**
 * The Phlox single-post template (title, meta line, content, tags, share, prev/next).
 * Shared by legacy MDX posts and admin (MongoDB) posts so both look identical.
 */
export default function PostArticle({
  slug,
  heading,
  date,
  dateText,
  author,
  tags,
  categories = [{ name: "Blog", slug: "blog" }],
  shareTitle,
  prev,
  next,
  children,
}: {
  slug: string;
  /** h1; "" hides the header (some WordPress posts had no visible title) */
  heading: string;
  date: string;
  dateText: string;
  author: string;
  tags: string[];
  categories?: { name: string; slug: string }[];
  shareTitle: string;
  prev?: Pick<ListedPost, "slug" | "title">;
  next?: Pick<ListedPost, "slug" | "title">;
  children: React.ReactNode;
}) {
  const path = `/${slug}/`;
  return (
    <div className="single-post">
      <BoxedContent>
        <article className="hentry type-post">
          <div className="entry-main">
            {heading && (
              <header className="entry-header">
                <h1 className="entry-title">{heading}</h1>
              </header>
            )}
            {heading && (
              <div className="entry-info">
                <div className="entry-date">
                  <time dateTime={date}>{dateText}</time>
                </div>
                <div className="entry-author">
                  <span className="meta-sep">by</span> <span className="author vcard">{author}</span>
                </div>
                <div className="entry-comments">
                  <span className="meta-sep">with</span> <span className="meta-comment">no comment</span>
                </div>
                <div className="entry-tax">
                  {categories.map((c) => (
                    <Link key={c.slug} href={`/category/${c.slug}/`} rel="category">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <div className="entry-content">{children}</div>
            <footer className="entry-meta">
              {tags.length > 0 && (
                <div className="entry-tax">
                  <span>Tags: </span>
                  {tags.map((t, i) => (
                    <span key={t}>
                      {i > 0 && <i>, </i>}
                      {/* WordPress tag archives redirect to /blog/ */}
                      <Link href="/blog/" rel="tag">
                        {t}
                      </Link>
                    </span>
                  ))}
                </div>
              )}
              <PostShare url={absUrl(path)} title={shareTitle} />
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
                  <h4 className="np-title">{prev.title}</h4>
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
                  <h4 className="np-title">{next.title}</h4>
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
