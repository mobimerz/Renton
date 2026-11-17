// Contact page content, copied word for word from https://www.renton.org.in/contact/ (crawled 2026-11-17).
import type { AccordionItem } from "@/components/ui/Accordion";

export const contactIntro = {
  title: "Connect with Expert Sales Team",
  subtitle: "Contact for Premium Business Services",
  text: "<p>Reach out for quotes, consultations, or support on secure data erasure, IT asset management, and compliance. Our team is ready to provide prompt, professional assistance for all your technology needs.</p>",
};

export const contactFormBlock = {
  title: "We'd Love to Hear from You",
  image: { src: "/images/pexels-photo-8112160.jpeg", alt: "pexels photo 8112160.jpeg", width: 1024, height: 684 },
};

export const contactHeadline = "Connect Renton for tailored IT Solutions";

export const contactCards = {
  phone: "+91 8050281515",
  email: "contact@renton.org.in",
  /** Social links shown under the email on this page (note: Instagram handle and YouTube differ from the footer) */
  social: [
    { label: "Facebook", href: "https://www.facebook.com/rentontechnologies", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/renton.technologies/", icon: "instagram" },
    { label: "Twitter", href: "https://x.com/RentonT35572", icon: "twitter" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/renton-technologies/", icon: "linkedin" },
    { label: "YouTube", href: "https://www.youtube.com/@RentonTechnologies", icon: "youtube" },
  ] as const,
  addressHtml:
    "<p><strong>Renton Technologies LLP</strong></p><p>No. 6/2, First Floor, Lava Kusha Building, Beratena Agrahara, Electronic City, Bengaluru – 560100</p>",
};

export const contactFaq: { title: string; items: AccordionItem[] } = {
  title: "Frequently Asked Question!",
  items: [
    {
      q: "Take the Next Step Toward Secure Data Management",
      a: "<p>Partner with Renton to safeguard your data, ensure compliance, and streamline IT asset management. Our experts are ready to provide tailored solutions for your unique needs. Connect with us today to experience secure, automated data erasure and IT services you can trust.</p>",
    },
  ],
};

export const contactMap = {
  src: "https://maps.google.com/maps?q=Renton%20Technologies%20LLP%2C%20First%20Floor%2C%20Lava%20Kusha%20Building%2C%20No.%206%2F2%2C%20Beratena%20Agrahara%2C%20Electronic%20City%2C%20Bengaluru%2C%20Karnataka%20560100&t=m&z=20&output=embed&iwloc=near",
  title: "Renton Technologies LLP, First Floor, Lava Kusha Building, No. 6/2, Beratena Agrahara, Electronic City, Bengaluru, Karnataka 560100",
};
