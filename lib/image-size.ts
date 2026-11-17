import "server-only";
import fs from "node:fs";
import path from "node:path";
import { imageSize as probe } from "image-size";

/** Intrinsic size of an image in /public (build time only). */
export function imageSize(publicSrc: string): { width: number; height: number } | undefined {
  try {
    const { width, height } = probe(fs.readFileSync(path.join(process.cwd(), "public", decodeURIComponent(publicSrc))));
    return width && height ? { width, height } : undefined;
  } catch {
    return undefined;
  }
}
