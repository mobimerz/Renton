import SiteChrome from "@/components/layout/SiteChrome";

/** Public pages: same chrome as before the admin panel existed. URLs are unchanged ((site) is a route group). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
