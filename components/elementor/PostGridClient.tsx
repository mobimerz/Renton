"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostGridProps } from "./PostGrid";

export type GridItem = { slug: string; title: string; date: string; excerpt: string };

/**
 * Same markup/classes as the Royal Elementor Addons grid so /elementor/post-9978.css styles it.
 * Layout: CSS grid (3 / 2 / 1 columns) instead of the plugin's Isotope script.
 * "Load More" reveals the next 12 posts; after the last page it shows "End of Content.".
 */
export default function PostGridClient(props: PostGridProps & { items: GridItem[] }) {
  const { items, perPage, maxPages } = props;
  const [pages, setPages] = useState(1);
  const [filter, setFilter] = useState(0);
  const shown = items.slice(0, pages * perPage);
  const done = pages >= maxPages || shown.length >= items.length;

  return (
    <div className={props.cls}>
      <div className="elementor-widget-container">
        <ul className={props.ulCls}>
          {props.filters.map((f, i) => (
            <li key={f.label} className={f.liCls}>
              {/* Every post is in "Blog", so both filters show the same list (as on WordPress). */}
              <span
                role="button"
                tabIndex={0}
                className={`wpr-grid-filters-item${filter === i ? " wpr-active-filter" : ""}`}
                onClick={() => setFilter(i)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setFilter(i)}
              >
                {f.label}
              </span>
              <em className="wpr-grid-filters-sep" />
            </li>
          ))}
        </ul>
        <section
          className="wpr-grid elementor-clearfix grid grid-cols-1 gap-x-(--gh) md:grid-cols-2 md:gap-x-(--gh-t) lg:grid-cols-3 lg:gap-x-(--gh-d)"
          style={
            {
              "--gh": `${props.gutterHMobile}px`,
              "--gh-t": `${props.gutterHTablet}px`,
              "--gh-d": `${props.gutterH}px`,
              rowGap: props.gutterV,
            } as React.CSSProperties
          }
        >
          {shown.map((it) => (
            <article key={it.slug} className="wpr-grid-item elementor-clearfix type-post hentry category-blog">
              <div className="wpr-grid-item-inner">
                <div className="wpr-grid-item-below-content elementor-clearfix">
                  <h2 className={props.titleCls}>
                    <div className="inner-block">
                      <Link href={`/${it.slug}/`}>{it.title}</Link>
                    </div>
                  </h2>
                  <div className={props.dateCls}>
                    <div className="inner-block">
                      <span>
                        {it.date}
                        {props.dateSep && <span className="wpr-grid-extra-text-right">{props.dateSep}</span>}
                      </span>
                    </div>
                  </div>
                  <div className={props.commentsCls}>
                    <div className="inner-block">
                      <Link href={`/${it.slug}/`}>
                        <span>No Comments</span>
                      </Link>
                    </div>
                  </div>
                  <div className={props.excerptCls}>
                    <div className="inner-block">
                      <p>{it.excerpt}</p>
                    </div>
                  </div>
                  <div className={props.readMoreCls}>
                    <div className="inner-block">
                      <Link className={props.readMoreBtnCls} href={`/${it.slug}/`}>
                        <span>Read More</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
        <div className="wpr-grid-pagination elementor-clearfix wpr-grid-pagination-load-more">
          {!done && (
            <a
              className="wpr-load-more-btn"
              href={`/blog/page/${pages + 1}/`}
              onClick={(e) => {
                e.preventDefault();
                setPages((p) => p + 1);
              }}
            >
              Load More
            </a>
          )}
          {done && pages > 1 && <p className="wpr-pagination-finish" style={{ display: "block" }}>End of Content.</p>}
        </div>
      </div>
    </div>
  );
}
