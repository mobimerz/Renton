import type { Metadata } from "next";
import SiteChrome from "@/components/layout/SiteChrome";
import PageTitleBar from "@/components/layout/PageTitleBar";
import Button from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found - Renton Technologies", robots: { index: false } };

/**
 * 404 for every notFound() and unmatched URL. Lives at the app root (outside the (site) group),
 * so it brings its own site chrome.
 */
export default function NotFound() {
  return (
    <SiteChrome>
      <PageTitleBar title="Page not found" />
      <section className="e-container px-[35px] py-[60px] text-center">
        <p className="mb-6 text-[18px] text-body">Sorry, the page you are looking for does not exist or has been moved.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button href="/">Go to Home</Button>
          <Button href="/blog/" variant="outline">
            Read our Blog
          </Button>
        </div>
      </section>
    </SiteChrome>
  );
}
