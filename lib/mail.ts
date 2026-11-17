import "server-only";

/**
 * Provider-agnostic mail sending. Pick the provider with MAIL_PROVIDER=resend|smtp.
 * See .env.example for every variable.
 */
export type Mail = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}

async function sendWithResend(mail: Mail) {
  const { Resend } = await import("resend");
  const resend = new Resend(required("RESEND_API_KEY"));
  const { error } = await resend.emails.send({
    from: required("MAIL_FROM"),
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: mail.replyTo,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

async function sendWithSmtp(mail: Mail) {
  const nodemailer = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT ?? 587);
  const transport = nodemailer.createTransport({
    host: required("SMTP_HOST"),
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: { user: required("SMTP_USER"), pass: required("SMTP_PASS") },
  });
  await transport.sendMail({
    from: required("MAIL_FROM"),
    to: mail.to,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
    replyTo: mail.replyTo,
  });
}

export async function sendMail(mail: Mail): Promise<void> {
  const provider = (process.env.MAIL_PROVIDER ?? "resend").toLowerCase();
  if (provider === "resend") return sendWithResend(mail);
  if (provider === "smtp") return sendWithSmtp(mail);
  throw new Error(`Unknown MAIL_PROVIDER "${provider}" (use "resend" or "smtp")`);
}
