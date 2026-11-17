// Imported MDX files (content/**) export a `meta` object; see lib/posts-types.ts for its shape.
declare module "*.mdx" {
  export const meta: unknown;
}
