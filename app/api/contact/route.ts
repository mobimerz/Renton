import { contactSchema } from "@/lib/contact-schema";
import { sendMail } from "@/lib/mail";
import { upsertBrevoContact } from "@/lib/brevo";
import { contactEnquiryEmail } from "@/lib/email/contact-enquiry";

const MIN_FILL_MS = 3000;
const DEFAULT_TO = "contact@renton.org.in";

/**
 * CONTACT_TO, comma-separated. Forgiving about how it was pasted into the host's env UI:
 * strips quotes, "KEY=" prefixes, "Name <email>" wrappers and blanks.
 */
function recipients(): string[] {
  const raw = (process.env.CONTACT_TO ?? "").replace(/^\s*CONTACT_TO\s*=/, "");
  const list = raw
    .split(/[,;]/)
    .map((s) => s.trim().replace(/^["']+|["']+$/g, "").trim())
    .map((s) => s.match(/<([^>]+)>/)?.[1].trim() ?? s)
    .filter((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s));
  if (list.length === 0) {
    if (raw.trim()) console.error(`[contact] CONTACT_TO has no valid address (${JSON.stringify(raw)}), using ${DEFAULT_TO}`);
    return [DEFAULT_TO];
  }
  return list;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // Honeypot or timing trap tripped: pretend success so bots learn nothing.
    const issues = parsed.error.issues;
    if (issues.some((i) => i.path[0] === "website")) return Response.json({ ok: true });
    return Response.json(
      { ok: false, errors: Object.fromEntries(issues.map((i) => [String(i.path[0]), i.message])) },
      { status: 422 },
    );
  }

  const d = parsed.data;
  if (Date.now() - d.startedAt < MIN_FILL_MS) return Response.json({ ok: true });

  // Save the lead in Brevo Contacts (only when BREVO_LIST_ID is set). Never blocks the email.
  const contactSync = upsertBrevoContact(d).catch((err) => console.error("[contact] Brevo contact sync failed:", err));

  try {
    const { subject, html, text } = contactEnquiryEmail(d);
    await sendMail({
      to: recipients(),
      replyTo: d.email,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] mail send failed:", err);
    await contactSync;
    return Response.json({ ok: false, error: "Sorry, your message could not be sent. Please call or WhatsApp us." }, { status: 502 });
  }

  await contactSync;
  return Response.json({ ok: true });
}
