/**
 * Elementor-compatible building blocks used by the imported MDX (content/pages, content/blog).
 * Each component outputs the same class names/markup Elementor 4.4 produced on WordPress, so the
 * page's original Elementor CSS (public/elementor/post-<id>.css) applies unchanged.
 */
import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon, { faSvg, iconFromFa } from "@/components/Icon";
import GoogleMap from "@/components/GoogleMap";

type Base = { id?: string; cls: string; children?: React.ReactNode };

const isInternal = (href?: string) => !!href && href.startsWith("/");

export function SmartLink({
  href,
  children,
  className,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  if (isInternal(href) && !href.startsWith("/images/"))
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

export function Section({
  cls,
  containerCls,
  overlay,
  children,
}: Base & { containerCls: string; overlay?: boolean }) {
  return (
    <section className={cls}>
      {overlay && <div className="elementor-background-overlay" />}
      <div className={containerCls}>{children}</div>
    </section>
  );
}

export function Column({
  cls,
  wrapCls,
  children,
}: Base & { wrapCls?: string }) {
  return (
    <div className={cls}>
      <div className={wrapCls ?? "elementor-widget-wrap"}>{children}</div>
    </div>
  );
}

export function Container({
  cls,
  boxed,
  children,
}: Base & { boxed?: boolean }) {
  return (
    <div className={cls}>
      {boxed ? <div className="e-con-inner">{children}</div> : children}
    </div>
  );
}

function W({ cls, children }: Base) {
  return (
    <div className={cls}>
      <div className="elementor-widget-container">{children}</div>
    </div>
  );
}

export function Heading({
  cls,
  tag = "h2",
  titleCls,
  href,
  children,
}: Base & { tag?: string; titleCls?: string; href?: string }) {
  const Tag = tag as "h2";
  return (
    <W cls={cls}>
      <Tag
        className={titleCls ?? "elementor-heading-title elementor-size-default"}
      >
        {href ? <SmartLink href={href}>{children}</SmartLink> : children}
      </Tag>
    </W>
  );
}

export function Text({ cls, children }: Base) {
  return <W cls={cls}>{children}</W>;
}

export function ElImage({
  cls,
  src,
  alt,
  width,
  height,
  href,
  caption,
}: Base & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  href?: string;
  caption?: string;
}) {
  const img = (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1024}
      height={height ?? 683}
      sizes="(max-width: 767px) 100vw, (max-width: 1600px) 60vw, 1024px"
    />
  );
  const linked = href ? <SmartLink href={href}>{img}</SmartLink> : img;
  return (
    <W cls={cls}>
      {caption ? (
        <figure className="wp-caption">
          {linked}
          <figcaption className="widget-image-caption wp-caption-text">
            {caption}
          </figcaption>
        </figure>
      ) : (
        linked
      )}
    </W>
  );
}

export function Button({
  cls,
  text,
  href,
  btnCls,
  icon,
  iconAlign,
}: Base & {
  text: string;
  href?: string;
  btnCls?: string;
  icon?: string;
  iconAlign?: "left" | "right";
}) {
  const name = iconFromFa(icon);
  const inner = (
    <span className="elementor-button-content-wrapper">
      {name && (
        <span
          className={`elementor-button-icon elementor-align-icon-${iconAlign ?? "left"}`}
        >
          <Icon name={name} />
        </span>
      )}
      <span className="elementor-button-text">{text}</span>
    </span>
  );
  const c = btnCls || "elementor-button elementor-size-sm";
  return (
    <W cls={cls}>
      <div className="elementor-button-wrapper">
        {href ? (
          <SmartLink href={href} className={c}>
            {inner}
          </SmartLink>
        ) : (
          <span className={c}>{inner}</span>
        )}
      </div>
    </W>
  );
}

export function ImageBox({
  cls,
  src,
  alt,
  width,
  height,
  title,
  titleTag = "h3",
  href,
  children,
}: Base & {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  title: string;
  titleTag?: string;
  href?: string;
}) {
  const T = titleTag as "h3";
  return (
    <W cls={cls}>
      <div className="elementor-image-box-wrapper">
        {src && (
          <figure className="elementor-image-box-img">
            <Image
              src={src}
              alt={alt ?? ""}
              width={width ?? 300}
              height={height ?? 200}
            />
          </figure>
        )}
        <div className="elementor-image-box-content">
          {title && (
            <T className="elementor-image-box-title">
              {href ? <SmartLink href={href}>{title}</SmartLink> : title}
            </T>
          )}
          {children && (
            <p className="elementor-image-box-description">{children}</p>
          )}
        </div>
      </div>
    </W>
  );
}

export function SocialIcons({
  cls,
  items,
}: Base & {
  items: {
    href: string;
    label?: string;
    icon?: string;
    svg?: string;
    cls: string;
  }[];
}) {
  return (
    <W cls={cls}>
      <div
        className="elementor-social-icons-wrapper elementor-grid"
        role="list"
      >
        {items.map((it, i) => {
          const name = iconFromFa(it.icon);
          if (it.svg)
            return (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className="elementor-grid-item" role="listitem">
                  <a
                    className={it.cls}
                    href={it.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={it.label || "Social link"}
                    dangerouslySetInnerHTML={{ __html: it.svg }}
                  />
                </span>
              </Fragment>
            );
          return (
            <Fragment key={i}>
              {/* whitespace between items: Elementor spaces them with word-spacing */}
              {i > 0 && " "}
              <span className="elementor-grid-item" role="listitem">
                <a
                  className={it.cls}
                  href={it.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="elementor-screen-only">{it.label}</span>
                  {name && <Icon name={name} />}
                </a>
              </span>
            </Fragment>
          );
        })}
      </div>
    </W>
  );
}

export function IconList({
  cls,
  ulCls,
  items,
}: Base & {
  ulCls?: string;
  items: { text: string; href?: string; icon?: string }[];
}) {
  return (
    <W cls={cls}>
      <ul className={ulCls || "elementor-icon-list-items"}>
        {items.map((it, i) => {
          const name = iconFromFa(it.icon);
          const body = (
            <>
              {name && (
                <span className="elementor-icon-list-icon">
                  <Icon name={name} />
                </span>
              )}
              <span className="elementor-icon-list-text">{it.text}</span>
            </>
          );
          return (
            <li key={i} className="elementor-icon-list-item">
              {it.href ? <SmartLink href={it.href}>{body}</SmartLink> : body}
            </li>
          );
        })}
      </ul>
    </W>
  );
}

export function ElMap({
  cls,
  src,
  title,
}: Base & { src: string; title?: string }) {
  return (
    <W cls={cls}>
      <div className="elementor-custom-embed">
        <GoogleMap src={src} title={title ?? "Map"} />
      </div>
    </W>
  );
}

/**
 * Generic widget (divider, spacer, and rare third-party widgets such as hfe-infocard / eael-cta-box)
 * whose markup was kept from WordPress. Font Awesome <i> tags were turned into <span data-fa>.
 */
export function Widget({ cls, html }: Base & { type: string; html?: string }) {
  return (
    <div className={cls}>
      <div
        className="elementor-widget-container"
        dangerouslySetInnerHTML={{
          __html: (html ?? "").replace(
            /<span data-fa="([^"]+)"><\/span>/g,
            (_m, ref: string) => faSvg(ref),
          ),
        }}
      />
    </div>
  );
}

export function Emoji({ char }: { char: string }) {
  const code = [...char]
    .map((c) => c.codePointAt(0)!.toString(16))
    .filter((h) => h !== "fe0f")
    .join("-");
  return (
    // 1em inline SVG emoji (like WordPress); next/image adds nothing for these tiny static files
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="emoji"
      alt={char}
      role="img"
      draggable={false}
      src={`/images/emoji/${code}.svg`}
    />
  );
}

export function InlineImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}) {
  if (width && height)
    return <Image src={src} alt={alt} width={width} height={height} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" />;
}
