/** Google Maps embed. loading="lazy" so the iframe only loads near the viewport. */
export default function GoogleMap({
  src,
  title,
  height,
  className = "",
}: {
  src: string;
  title: string;
  /** px; omit to let page CSS size it (Elementor maps) */
  height?: number;
  className?: string;
}) {
  return (
    <iframe
      src={src}
      title={title}
      aria-label={title}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={`block w-full border-0 ${className}`}
      style={height ? { height } : undefined}
    />
  );
}
