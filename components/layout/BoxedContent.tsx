/**
 * Phlox "boxed" page body used by most inner pages: 35px side padding and
 * 70px space above (under the title bar) and below (before the footer).
 */
export default function BoxedContent({ children }: { children: React.ReactNode }) {
  return <div className="px-[35px] py-[70px]">{children}</div>;
}
