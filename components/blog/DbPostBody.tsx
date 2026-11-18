import "@/styles/wp-theme.css";
import Image from "next/image";
import Link from "next/link";
import RichText from "@/components/ui/RichText";
import type { PostImage } from "@/lib/blog/posts";

/**
 * Body of an admin (MongoDB) post inside .entry-content, so it picks up the theme's
 * typography (headings, lists, images) like the WordPress posts. HTML is sanitised on save.
 */
export default function DbPostBody({ html, image }: { html: string; image?: PostImage }) {
  return (
    <div className="wp-content">
      {image && <FeaturedImage image={image} />}
      <RichText html={html} className="db-post-body" />
    </div>
  );
}

export function FeaturedImage({ image, sizes = "(max-width: 1351px) 100vw, 1281px", href }: { image: PostImage; sizes?: string; href?: string }) {
  const known = image.width > 0 && image.height > 0;
  const svg = /\.svg(\?|$)/i.test(image.url);
  const img = known ? (
    <Image src={image.url} alt={image.alt} width={image.width} height={image.height} sizes={sizes} unoptimized={svg} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- size unknown (e.g. SVG without dimensions)
    <img src={image.url} alt={image.alt} loading="lazy" />
  );
  return (
    <div className="entry-media">
      <div className="aux-media-frame aux-media-image aux-image-mask">{href ? <Link href={href}>{img}</Link> : img}</div>
    </div>
  );
}
