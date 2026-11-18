import { contactEnquiryEmail } from "@/lib/email/contact-enquiry";

/**
 * Dev-only preview of the enquiry email: http://localhost:3000/api/contact/preview
 * Sends nothing. Returns 404 in production.
 */
export function GET(request: Request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });

  const { html } = contactEnquiryEmail(
    {
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "9876543210",
      product: "Laptop / Workstation Rental",
      requirements: "Need 25 laptops (i5, 16GB RAM) for a 3-month training batch starting next week.\nDelivery to Electronic City Phase 1.",
    },
    // Local logo so the preview works before the site is deployed.
    { logoUrl: new URL("/images/Renton_Logo.png", request.url).toString() },
  );
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
