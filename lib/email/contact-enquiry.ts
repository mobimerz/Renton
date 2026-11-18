import { SITE_URL, site } from "@/data/site";
import type { ContactData } from "@/lib/contact-schema";

/**
 * The enquiry notification sent to CONTACT_TO when someone submits the contact form.
 * Email clients (Gmail, Outlook) ignore <style> blocks and modern CSS, so this is
 * table layout with inline styles only. Keep it that way when editing.
 */

const BRAND = "#0a2b9b";
const BRAND_LIGHT = "#eef1fb";
const INK = "#111111";
const BODY = "#444444";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const PAGE_BG = "#f3f4f6";
const WHATSAPP = "#25D366";
const FONT = "Arial, Helvetica, sans-serif";

/** Path of the email logo inside /public. */
export const EMAIL_LOGO_PATH = "/images/email-logo.png";
/**
 * Served from the public GitHub repo so the logo shows even before www.renton.org.in
 * points at this site. If the repo is made private, set EMAIL_LOGO_URL to
 * `${SITE_URL}${EMAIL_LOGO_PATH}` instead.
 */
const DEFAULT_LOGO_URL = `https://raw.githubusercontent.com/mobimerz/Renton/main/public${EMAIL_LOGO_PATH}`;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Digits for wa.me / tel: links. A bare 10-digit Indian mobile gets the 91 country code. */
function phoneDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function receivedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function button(href: string, label: string, bg: string): string {
  return `<td style="padding:4px 6px 4px 0">
  <a href="${esc(href)}" style="display:inline-block;background:${bg};color:#ffffff;font-family:${FONT};font-size:14px;font-weight:bold;line-height:20px;text-decoration:none;white-space:nowrap;padding:10px 16px;border-radius:6px">${label}</a>
</td>`;
}

function row(label: string, valueHtml: string, last = false): string {
  return `<tr>
  <td style="padding:12px 0;${last ? "" : `border-bottom:1px solid ${BORDER};`}font-family:${FONT};font-size:13px;color:${MUTED};width:130px;vertical-align:top">${label}</td>
  <td style="padding:12px 0;${last ? "" : `border-bottom:1px solid ${BORDER};`}font-family:${FONT};font-size:15px;color:${INK};vertical-align:top">${valueHtml}</td>
</tr>`;
}

export type EnquiryEmail = { subject: string; html: string; text: string };

export function contactEnquiryEmail(
  d: Pick<ContactData, "name" | "email" | "phone" | "product" | "requirements">,
  opts: { logoUrl?: string; now?: Date } = {},
): EnquiryEmail {
  // Emails need an absolute, public logo URL. EMAIL_LOGO_URL overrides the default.
  const logoUrl = opts.logoUrl ?? process.env.EMAIL_LOGO_URL ?? DEFAULT_LOGO_URL;
  const when = receivedAt(opts.now ?? new Date());
  const wa = phoneDigits(d.phone);
  const replySubject = `Re: Your enquiry about ${d.product} – ${site.name}`;
  const mailto = `mailto:${d.email}?subject=${encodeURIComponent(replySubject)}`;
  const requirements = d.requirements?.trim() || "";

  const subject = `New Enquiry: ${d.product} – ${d.name}`;

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAGE_BG};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${PAGE_BG}">${esc(d.name)} is asking about ${esc(d.product)}. Phone ${esc(d.phone)}.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAGE_BG}">
<tr><td align="center" style="padding:24px 12px">

  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;border:1px solid ${BORDER}">

    <!-- Header: logo + company name -->
    <tr><td style="padding:20px 28px;border-bottom:4px solid ${BRAND}">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="vertical-align:middle;padding-right:12px">
          <img src="${esc(logoUrl)}" width="52" height="44" alt="Renton" style="display:block;border:0;width:52px;height:44px">
        </td>
        <td style="vertical-align:middle;font-family:${FONT}">
          <div style="font-size:20px;font-weight:bold;color:${BRAND};line-height:24px">${esc(site.name)}</div>
          <div style="font-size:12px;color:${MUTED};line-height:16px">IT Rentals · Repair &amp; AMC · Electronic City, Bengaluru</div>
        </td>
      </tr></table>
    </td></tr>

    <!-- Title -->
    <tr><td style="padding:28px 28px 8px;font-family:${FONT}">
      <div style="display:inline-block;background:${BRAND_LIGHT};color:${BRAND};font-size:12px;font-weight:bold;letter-spacing:.5px;text-transform:uppercase;padding:5px 10px;border-radius:999px">New website enquiry</div>
      <h1 style="margin:14px 0 4px;font-size:22px;line-height:28px;color:${INK};font-weight:bold">${esc(d.name)} is interested in ${esc(d.product)}</h1>
      <p style="margin:0;font-size:13px;color:${MUTED}">Received ${esc(when)} IST via the contact form on renton.org.in</p>
    </td></tr>

    <!-- Quick actions -->
    <tr><td style="padding:16px 28px 4px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        ${button(mailto, "Reply", BRAND)}
        ${button(`tel:+${wa}`, "Call", "#111827")}
        ${button(`https://wa.me/${wa}`, "WhatsApp", WHATSAPP)}
      </tr></table>
    </td></tr>

    <!-- Details -->
    <tr><td style="padding:16px 28px 8px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${row("Name", `<strong>${esc(d.name)}</strong>`)}
        ${row("Email", `<a href="mailto:${esc(d.email)}" style="color:${BRAND};text-decoration:none">${esc(d.email)}</a>`)}
        ${row("Mobile", `<a href="tel:+${wa}" style="color:${BRAND};text-decoration:none">${esc(d.phone)}</a>`)}
        ${row("Product", esc(d.product), true)}
      </table>
    </td></tr>

    <!-- Requirements -->
    <tr><td style="padding:8px 28px 28px">
      <div style="font-family:${FONT};font-size:13px;color:${MUTED};margin:0 0 8px">Requirements</div>
      <div style="font-family:${FONT};font-size:15px;line-height:22px;color:${BODY};background:#f9fafb;border-left:4px solid ${BRAND};border-radius:4px;padding:14px 16px">${
        requirements ? esc(requirements).replace(/\n/g, "<br>") : `<span style="color:${MUTED}">No requirements were entered.</span>`
      }</div>
      <p style="margin:14px 0 0;font-family:${FONT};font-size:12px;color:${MUTED}">✓ The customer agreed to the Terms &amp; Conditions.</p>
    </td></tr>

    <!-- Footer -->
    <tr><td style="background:${BRAND};padding:18px 28px;font-family:${FONT};font-size:12px;line-height:18px;color:#dbe3ff">
      <strong style="color:#ffffff">${esc(site.legalName)}</strong><br>
      ${esc(site.address.full)}<br>
      <a href="${site.phoneHref}" style="color:#ffffff;text-decoration:none">${esc(site.phone)}</a> ·
      <a href="mailto:${site.email}" style="color:#ffffff;text-decoration:none">${site.email}</a> ·
      <a href="${SITE_URL}" style="color:#ffffff;text-decoration:none">renton.org.in</a>
    </td></tr>

  </table>

  <p style="margin:14px 0 0;font-family:${FONT};font-size:11px;color:${MUTED}">Hitting Reply in your inbox answers ${esc(d.email)} directly.</p>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    `New website enquiry – ${site.name}`,
    `Received ${when} IST`,
    "",
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Mobile: ${d.phone}`,
    `Product: ${d.product}`,
    "",
    "Requirements:",
    requirements || "—",
    "",
    "The customer agreed to the Terms & Conditions.",
    `WhatsApp: https://wa.me/${wa}`,
  ].join("\n");

  return { subject, html, text };
}
