import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/layout/WhatsAppWidget";
import BackToTop from "@/components/layout/BackToTop";
import GoogleTag from "@/components/GoogleTag";

/** Header, footer and widgets of the public site. Used by app/(site)/layout.tsx and app/not-found.tsx (not by /admin). */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[10000] focus:bg-white focus:p-2">
        Skip to content
      </a>
      <header id="masthead">
        <TopBar />
      </header>
      <Header />
      <main id="main" className="overflow-x-clip">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
      <BackToTop />
      <GoogleTag />
    </>
  );
}
