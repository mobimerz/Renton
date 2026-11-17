import MapFacade from "@/components/MapFacade";
import snapshots from "@/data/map-snapshots.json";

const maps = snapshots.maps as Record<string, string>;

/**
 * Google Maps embed as a click-to-load facade (see MapFacade). `small` uses the 480x260 centre crop,
 * for maps that never get wider than that (the footer). A URL without a snapshot falls back to a
 * plain lazy iframe; run `node scripts/capture-maps.mjs` after adding a new map.
 */
export default function GoogleMap({
  src,
  title,
  height = 150,
  small = false,
  className = "",
}: {
  src: string;
  title: string;
  /** px; 150 is the browser's default iframe height, which Elementor maps without a height use */
  height?: number;
  small?: boolean;
  className?: string;
}) {
  const id = maps[src];
  if (!id)
    return (
      <iframe
        src={src}
        title={title}
        aria-label={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`block w-full border-0 ${className}`}
        style={{ height }}
      />
    );
  const base = `/images/maps/${id}${small ? "-sm" : ""}`;
  return <MapFacade src={src} title={title} height={height} className={className} snapshot={{ src: `${base}.webp`, src2x: `${base}@2x.webp` }} />;
}
