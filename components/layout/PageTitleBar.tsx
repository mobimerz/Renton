import Link from "next/link";
import Icon from "@/components/Icon";

export type Crumb = { name: string; path: string };

/**
 * Phlox theme title bar shown under the header on every page.
 * Inner pages show a breadcrumb ("Home › Contact") above the title; the title is the theme's <h1>,
 * kept so each page's heading structure matches WordPress.
 */
export default function PageTitleBar({ title, crumbs }: { title: string; crumbs?: Crumb[] }) {
  return (
    <header className="border-b border-[#eaeaea]">
      <div className="px-[35px] pt-[50px] pb-[55px]">
        {crumbs && crumbs.length > 1 && (
          <nav aria-label="Breadcrumb" className="mb-[31px]">
            <ol className="flex flex-wrap items-center font-raleway text-[12px] leading-[18px] font-semibold text-ink">
              {crumbs.map((c, i) => (
                <li key={c.path} className="flex items-center">
                  {i > 0 && <Icon name="chevron-right" className="mx-[5px] w-3! text-[9px]" />}
                  {i < crumbs.length - 1 ? (
                    <Link href={c.path} className={i === 0 ? "pl-2.5" : ""}>
                      {c.name}
                    </Link>
                  ) : (
                    // Phlox shortens the current page to 30 characters + "..."
                    <span aria-current="page">{c.name.length > 30 ? c.name.slice(0, 30) + "..." : c.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="m-0 font-raleway text-[38.4px] leading-none font-semibold text-ink">{title}</h1>
      </div>
    </header>
  );
}
