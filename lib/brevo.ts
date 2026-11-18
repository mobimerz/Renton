import "server-only";

/**
 * Brevo (ex-Sendinblue) REST API helpers. Plain fetch, no SDK.
 * Docs: https://developers.brevo.com/reference/sendtransacemail
 *       https://developers.brevo.com/reference/createcontact
 */
const API = "https://api.brevo.com/v3";

type Address = { email: string; name?: string };

/** "Renton Website <no-reply@renton.org.in>" → { name, email }; a bare address works too. */
export function parseAddress(value: string): Address {
  const m = value.match(/^\s*"?([^"<]*?)"?\s*<([^>]+)>\s*$/);
  if (m) return m[1] ? { name: m[1].trim(), email: m[2].trim() } : { email: m[2].trim() };
  return { email: value.trim() };
}

async function brevo(path: string, apiKey: string, body: unknown): Promise<void> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "api-key": apiKey, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo ${path} ${res.status}: ${detail.slice(0, 300)}`);
  }
}

export async function sendBrevoEmail(
  apiKey: string,
  mail: { from: string; to: string[]; subject: string; text: string; html: string; replyTo?: string },
): Promise<void> {
  await brevo("/smtp/email", apiKey, {
    sender: parseAddress(mail.from),
    to: mail.to.map((email) => ({ email })),
    ...(mail.replyTo ? { replyTo: { email: mail.replyTo } } : {}),
    subject: mail.subject,
    htmlContent: mail.html,
    textContent: mail.text,
  });
}

/**
 * Create or update a contact and add it to the list in BREVO_LIST_ID.
 * Does nothing when BREVO_API_KEY or BREVO_LIST_ID is unset.
 */
export async function upsertBrevoContact(contact: {
  email: string;
  name: string;
  phone: string;
  product: string;
  requirements: string;
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) return;

  await brevo("/contacts", apiKey, {
    email: contact.email,
    updateEnabled: true,
    listIds: [listId],
    attributes: {
      FIRSTNAME: contact.name,
      // Custom text attributes: create PHONE, PRODUCT and REQUIREMENTS in Brevo
      // (Contacts → Settings → Contact attributes) or Brevo rejects the request.
      PHONE: contact.phone,
      PRODUCT: contact.product,
      REQUIREMENTS: contact.requirements,
    },
  });
}
