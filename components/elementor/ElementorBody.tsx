import "@/styles/elementor.css";
import "@/styles/wp-theme.css";

/**
 * Wraps imported MDX in Elementor's root element and loads that page's own Elementor CSS
 * (copied from WordPress to /public/elementor/post-<id>.css by scripts/import-wordpress.mjs).
 */
export default function ElementorBody({ elementorId, children }: { elementorId: string; children: React.ReactNode }) {
  return (
    <>
      {/* Rendered in place (not hoisted) so it loads after Elementor's base CSS and wins ties, as on WordPress */}
      <link rel="stylesheet" href={`/elementor/post-${elementorId}.css`} />
      <div className="wp-content">
        <div className={`elementor elementor-${elementorId}`}>{children}</div>
      </div>
    </>
  );
}
