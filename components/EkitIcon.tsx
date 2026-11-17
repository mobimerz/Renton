import { ekitIconFor, ekitIcons } from "@/data/ekit-icons";

/** ElementsKit inline SVG icon (fill follows currentColor), looked up by live widget id or icon name. */
export default function EkitIcon({ widgetId, name, className }: { widgetId?: string; name?: string; className?: string }) {
  const icon = ekitIcons[name ?? ekitIconFor[widgetId ?? ""]];
  if (!icon) return null;
  return (
    <svg
      viewBox={icon.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.inner }}
    />
  );
}
