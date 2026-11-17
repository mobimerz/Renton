import type { Metadata, Viewport } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { fontVariables } from "./fonts";
import { SITE_URL, site } from "@/data/site";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/layout/WhatsAppWidget";
import BackToTop from "@/components/layout/BackToTop";
import GoogleTag from "@/components/GoogleTag";

config.autoAddCss = false;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/images/cropped-Renton-Logo-32x32.jpg", sizes: "32x32" },
      { url: "/images/cropped-Renton-Logo-192x192.jpg", sizes: "192x192" },
    ],
    apple: "/images/cropped-Renton-Logo-180x180.jpg",
  },
  alternates: {
    types: { "application/rss+xml": [{ url: "/feed/", title: "Renton Technologies » Feed" }] },
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-US" className={fontVariables}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[10000] focus:bg-white focus:p-2">
          Skip to content
        </a>
        <header id="masthead">
          <TopBar />
          <Header />
        </header>
        <main id="main" className="overflow-x-clip">
          {children}
        </main>
        <Footer />
        <WhatsAppWidget />
        <BackToTop />
        <GoogleTag />
      </body>
    </html>
  );
}
