import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { redirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  // WordPress served every URL with a trailing slash (/about -> /about/).
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // Tailwind CSS v4 is compiled by its Turbopack loader (no PostCSS config in this project).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return redirects;
  },
};

// Plugins are passed by name so they work with Turbopack.
const withMDX = createMDX({
  options: {
    remarkPlugins: [["remark-gfm", {}]],
  },
});

export default withMDX(nextConfig);
