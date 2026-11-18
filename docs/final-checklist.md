# Final checklist: renton.org.in → Next.js (2026-11-18)

## Pages: found vs built

| Live site (audit §2: 50 URLs) | Rebuilt | How |
|---|---|---|
| Home, About, Contact, Products, Other Services (`/services/`) | 5/5 | Hand-built React pages (`app/…/page.tsx`, copy in `data/`) |
| Laptop Rental Services, Laptop Rental in Electronic City, AMC Services, Careers, Privacy Policy, Terms and Conditions, Blog | 7/7 | Imported Elementor pages → `content/pages/*.mdx`, served by `app/[slug]/page.tsx` |
| Blog posts | 37/37 | `content/blog/*.mdx` (full content, featured image, dates, categories, tags; all inline images local) |
| `/category/blog/` | 1/1 | `app/category/blog/page.tsx` |
| **Total** | **50/50** | plus `/feed/` (RSS, 37 posts), `/sitemap.xml` (50 URLs), `/robots.txt` |

Unknown URLs return a real 404 (`dynamicParams = false`).

## Build and checks

- `npm run build`: 56 routes, 0 errors, 0 warnings; `tsc --noEmit` and `eslint` clean.
- **Visual comparison** against the saved live HTML (the live site became unreachable from this machine mid-project):
  - Desktop: all pages match within about 4px.
  - Phone (375px): matches except the small differences in `site-audit.md` §11. These come from Raleway being used everywhere.
- **Links and images:** 819 URLs checked, 0 broken. The one internal redirect is Load More's no-JavaScript fallback.
- **Lighthouse** (mobile = simulated slow 4G and a slow CPU; Lighthouse and the server were on the same laptop, so scores vary ±10 between runs):

| Page | Performance (mobile / desktop) | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Home | 64–90 / 99–100 | 89 | 100 | 100 |
| Contact | 81–82 / 99–100 | 97 | 100 | 100 |
| About | 84–90 / 99–100 | 95 | 100 | 100 |
| Blog | 80–85 / 99–100 | 93 | 100 | 92 |
| Post (dell-latitude-5410) | 85–89 / 100 | 93 | 100 | 100 |

  What keeps mobile Performance under 90:
  - The Google tag script (180 KB) and the Google Maps embed on Contact and Blog.
  - On Home, the rotating headline: each word swap registers as a new "largest paint". Real visitors' LCP stops at their first tap or scroll.

  What keeps Home Accessibility at 89 (all three are the live design, kept on purpose):
  - Contrast on the outline "Contact" button.
  - Footer links that are only distinguished by colour.
  - 5px slider dots.

  Changing any of these is a visual change; say if you want them fixed. Blog SEO 92 is because of the "Read More" link text on the grid cards.

## Forms

- `/api/contact/` (Contact page and Products enquiry):
  - Server-side validation (zod), honeypot field and a minimum fill time.
  - Tested: an empty or invalid payload returns 400 with field errors; the honeypot and too-fast submissions are dropped silently.
- **Not tested:** a real email delivery. That needs the keys from `.env.example` (`MAIL_PROVIDER=brevo` with `BREVO_API_KEY`, `resend` with `RESEND_API_KEY`, or `smtp` with `SMTP_*`). Send one test from the deployed site after adding them.

## Redirects (all 301)

| From | To |
|---|---|
| `/?p=<id>`, `/?page_id=<id>` (all 49 WordPress IDs) | the page/post slug, query removed (`proxy.ts`) |
| `/feed/` variants: `/comments/feed/`, `/category/blog/feed/`, `/<slug>/feed/` | `/feed/` or the post |
| `/page/N/`, `/blog/page/N/`, `/category/blog/page/N/` | `/blog/` or `/category/blog/` |
| `/category/<other>/`, `/author/*`, `/tag/*`, `/<year>/*` | `/blog/` |
| `/wp-content/uploads/YYYY/MM/<file>` | `/images/<file>` |
| `/wp-admin`, `/wp-login.php`, `/xmlrpc.php`, `/wp-json/*`, `/elementor-hf/*` | `/` |
| `wp-sitemap.xml`, `sitemap_index.xml`, `post-sitemap.xml`, … | `/sitemap.xml` |

Spot-checked on the production build: `/?p=14306`, `/?page_id=19`, `/category/blog/feed/`, `/tag/laptop/` and `/wp-content/uploads/…` all return 301 to the right place.

## Deploy to Vercel

1. Commit and push the repo to GitHub, then **Add New → Project** in Vercel and import it. Vercel detects Next.js; keep the defaults (build `next build`, output `.next`). The project's Node version setting should be 20 or newer.
2. **Environment variables** (Production and Preview):
   - `MAIL_PROVIDER`, `MAIL_FROM`, `CONTACT_TO`.
   - Then `BREVO_API_KEY` (plus optional `BREVO_LIST_ID`), or `RESEND_API_KEY`, or `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`.
   - Verify the `MAIL_FROM` sender/domain in Brevo (or Resend) first.
3. Deploy, then check the preview URL: a few pages, the contact form (one real test email), `/sitemap.xml`, `/feed/`.
4. **Domains:** add `www.renton.org.in` as the primary domain and `renton.org.in` set to *redirect to www (301)*. Point DNS at Vercel: the apex A record to `76.76.21.21`, and `www` CNAME to `cname.vercel-dns.com` (use the exact values Vercel shows). HTTPS and the http→https redirect are automatic.
5. **After go-live:**
   - In Google Search Console, submit `https://www.renton.org.in/sitemap.xml` and use URL Inspection on Home and a couple of posts.
   - Confirm the Google tag (GT-T5RTHBQZ) is receiving hits.
   - Keep the WordPress hosting for a week or two in case anything was missed, then cancel it.

## Still open

- Client content: `docs/content-needed-from-client.md` (placeholders on Products, `#` buttons, typos, missing "Why Choose" icon files, new meta descriptions to approve).
