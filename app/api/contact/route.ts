import { contactSchema } from "@/lib/contact-schema";
import { sendMail } from "@/lib/mail";
import { upsertBrevoContact } from "@/lib/brevo";

const MIN_FILL_MS = 3000;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

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

  const rows: [string, string][] = [
    ["Name", d.name],
    ["Email", d.email],
    ["Mob Numbers", d.phone],
    ["Products", d.product],
    ["Leave Your Requirements", d.requirements || "—"],
    ["Terms of Service", "I agree to the Terms & Conditions."],
  ];

  // Save the lead in Brevo Contacts (only when BREVO_LIST_ID is set). Never blocks the email.
  const contactSync = upsertBrevoContact(d).catch((err) => console.error("[contact] Brevo contact sync failed:", err));

  try {
    await sendMail({
      to: (process.env.CONTACT_TO ?? "contact@renton.org.in").split(",").map((s) => s.trim()),
      replyTo: d.email,
      subject: `New Entry: Contact form – ${d.name}`,
      text: rows.map(([k, v]) => `${k}:\n${v}`).join("\n\n"),
      html: `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">${rows
        .map(([k, v]) => `<tr><td style="font-weight:bold;vertical-align:top">${esc(k)}</td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}</table>`,
    });
  } catch (err) {
    console.error("[contact] mail send failed:", err);
    await contactSync;
    return Response.json({ ok: false, error: "Sorry, your message could not be sent. Please call or WhatsApp us." }, { status: 502 });
  }

  await contactSync;
  return Response.json({ ok: true });
}
