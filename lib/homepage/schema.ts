import { z } from "zod";

/**
 * Editable homepage content (one document). Mirrors data/home.ts, which stays the fallback
 * when the database is empty. Rich-text fields hold small HTML snippets (sanitised on save).
 */
export const WHY_CHOOSE_ICONS = ["delivery", "payment", "duration", "quality", "replacement", "support"] as const;

const text = (label: string, max = 200) => z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long (max ${max}).`);
const optText = (max = 200) => z.string().trim().max(max).optional().default("");
const html = (label: string, max = 5000) => z.string().trim().min(1, `${label} is required.`).max(max, `${label} is too long.`);

/** Internal path, https URL, tel: or mailto: */
const href = z
  .string()
  .trim()
  .min(1, "Link is required.")
  .max(500)
  .regex(/^(\/|https?:\/\/|tel:|mailto:)/i, "Links must start with /, https://, tel: or mailto:.");

const imageSrc = z.string().trim().min(1, "Image is required.").max(2000);
const dim = z.number().int().min(0).max(20000);
const color = z.string().trim().regex(/^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\))$/i, "Use a colour like #F3C203 or rgba(243,194,3,0.05).");

export const homepageSchema = z.object({
  hero: z.object({
    kicker: text("Kicker"),
    headline: text("Heading"),
    rotating: z.array(text("Rotating word", 60)).min(1, "Add at least one rotating word.").max(8),
    text: html("Subheading"),
    primary: z.object({ label: text("Button text", 40), href }),
    secondary: z.object({ label: text("Button text", 40), href }),
    image: z.object({ src: imageSrc, alt: optText(200), width: dim, height: dim }),
  }),
  rentalProducts: z.object({
    title: text("Title"),
    text: html("Text"),
    slides: z
      .array(z.object({ src: imageSrc, alt: optText(200), caption: optText(80), width: dim.optional(), height: dim.optional() }))
      .min(1, "Add at least one slide.")
      .max(20),
  }),
  whyChoose: z.object({
    title: text("Title"),
    text: html("Text"),
    boxes: z
      .array(
        z.object({
          title: text("Box title", 80),
          text: html("Box text", 1000),
          icon: z.enum(WHY_CHOOSE_ICONS),
          iconColor: color,
          bg: color,
          iconAlt: optText(120),
        }),
      )
      .min(1, "Add at least one box.")
      .max(12),
  }),
  testimonials: z.object({
    title: text("Title"),
    items: z
      .array(
        z.object({
          content: text("Testimonial", 1500),
          name: text("Name", 80),
          job: optText(80),
          img: z.object({ src: imageSrc, alt: optText(200) }).nullable().optional().default(null),
        }),
      )
      .max(30),
  }),
  homeFaq: z.object({
    title: text("Title"),
    intro: z.string().trim().max(1000).optional().default(""),
    columns: z
      .array(z.array(z.object({ q: text("Question", 300), a: html("Answer", 5000) })).max(30))
      .length(2),
  }),
});

export type HomepageInput = z.input<typeof homepageSchema>;
export type HomepageContent = z.output<typeof homepageSchema>;

/** "hero.primary.href" style paths -> message, for the admin form. */
export function homepageErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const i of error.issues) out[i.path.join(".")] ??= i.message;
  return out;
}
