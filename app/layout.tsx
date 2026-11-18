import type { Metadata, Viewport } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";
import { fontVariables } from "./fonts";
import { SITE_URL, site } from "@/data/site";

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
      {/* Site chrome lives in app/(site)/layout.tsx; /admin has its own layout. */}
      <body>{children}</body>
    </html>
  );
}
