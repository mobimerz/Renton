import { z } from "zod";

/** Same options, same order as the live WPForms "Products" dropdown (form #9362). */
export const PRODUCT_OPTIONS = [
  "Server Rental",
  "Printers",
  "Laptop / Workstation Rental",
  "IT Repair & AMC Services",
  "Sales of New/Used Equipments",
] as const;

export const TERMS_VALUE = "I agree to the Terms & Conditions.";

/** Shared by the form (client-side checks) and /api/contact (authoritative server-side checks). */
export const contactSchema = z.object({
  name: z.string().trim().min(1, "This field is required.").max(100, "Please enter fewer than 100 characters."),
  email: z.string().trim().min(1, "This field is required.").max(200).email("Please enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(1, "This field is required.")
    // digits only, optional leading +, 7–15 digits (E.164 length)
    .regex(/^\+?\d{7,15}$/, "Please enter a valid phone number."),
  product: z.enum(PRODUCT_OPTIONS),
  requirements: z.string().trim().max(5000, "Please enter fewer than 5000 characters.").optional().default(""),
  terms: z.literal(true, { error: "This field is required." }),
  /** Honeypot: hidden from people, bots fill it in. Must stay empty. */
  website: z.string().max(0).optional().default(""),
  /** ms timestamp when the form was rendered; submissions faster than 3s are treated as bots. */
  startedAt: z.number().int().positive(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;
