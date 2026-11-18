import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Renton Admin" },
  robots: { index: false, follow: false },
};

/** Shell for everything under /admin: no public header/footer, its own font and background. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-50 font-inter text-[15px] text-slate-800 antialiased">
      {children}
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}
