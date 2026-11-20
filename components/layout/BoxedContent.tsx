/**
 * Phlox "boxed" page body used by most inner pages: 35px side padding and
 * 70px space above (under the title bar) and below (before the footer).
 */
export default function BoxedContent({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-[1440px] px-5 py-12 md:px-8 md:py-16">{children}</div>;
}
