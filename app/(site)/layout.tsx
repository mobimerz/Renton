import SiteChrome from "@/components/layout/SiteChrome";

/** Public pages: same chrome as before the admin panel existed. URLs are unchanged ((site) is a route group). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Without JS the scroll-reveal animations never run, so keep that content fully visible. */}
      <noscript>
        <style>{`.reveal-up,.reveal-stagger>*{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <SiteChrome>{children}</SiteChrome>
    </>
  );
}
