// Home page content, copied word for word from https://www.renton.org.in/ (crawled 2026-11-17).
import type { AccordionItem } from "@/components/ui/Accordion";
import type { Slide } from "@/components/ui/ImageCarousel";

export const homeSeo = {
  path: "/",
  title: "Laptop Desktop and Server Rental in Bangalore | Renton Technologies",
  description:
    "Renton Technologies offers Laptop Desktop and Server Rental in Bangalore. Smart IT rental solutions and hardware sales for offices or events. Get a quote now!",
  ogType: "website" as const,
  pageTitle: "Home",
};

export const hero = {
  kicker: "Laptop Desktop and Server Rental in Bangalore",
  headline: "Making Computing Affordable for All!",
  rotating: ["Laptops & Desktops", "Workstations & Servers", "Printers & Scanners"],
  text: "<p>We provide smart, scalable, and sustainable IT rental solutions tailored to your business. From flexible plans for offices and events to high-quality refurbished hardware sales, we power your growth with reliable tech.</p>",
  primary: { label: "Get a Quote", href: "/contact/" },
  secondary: { label: "Contact", href: "https://wa.me/918050281515" },
  image: { src: "/images/IT-HArdware_image.png", alt: "Laptop Desktop and Server Rental in Bangalore", width: 1024, height: 683 },
};

export const rentalProducts: { title: string; text: string; slides: Slide[] } = {
  title: "Rental Products",
  text: "<p>Acquire enterprise-grade tech without the ownership burden, keeping your capital free for innovation and talent. From custom configurations to rapid replacements, we ensure your technical workflow remains uninterrupted and future-proof.</p>",
  slides: [{"src": "/images/laptop.jpg", "alt": "Refurbished Laptop Sales in Bangalore", "caption": "Laptop"}, {"src": "/images/all-in-one-pc.jpg", "alt": "all in one pc", "caption": "All in One PC"}, {"src": "/images/server.jpg", "alt": "server", "caption": "Server"}, {"src": "/images/monitor.jpg", "alt": "Desktop and Server Sales", "caption": "Monitor"}, {"src": "/images/office.jpg", "alt": "Corporate IT Rentals", "caption": "Office"}, {"src": "/images/printers.jpg", "alt": "printers", "caption": "Printers"}],
};

import type { WhyChooseIconKey } from "@/components/home/WhyChooseIcon";

export type InfoBox = { title: string; text: string; icon: WhyChooseIconKey; iconColor: string; bg: string; iconAlt: string };

export const whyChoose: { title: string; text: string; boxes: InfoBox[] } = {
  title: "Why Choose Renton?",
  text: "<p>India’s most trusted corporate laptop rental in Bangalore</p>",
  boxes: [
    { title: "Expresss Delivery", text: "<p>Get your laptops delivered within 24 working hours in metro cities.</p>", icon: "delivery", iconColor: "#F3C203", bg: "rgba(243,194,3,0.05)", iconAlt: "Express delivery icon" },
    { title: "Secure Payment", text: "<p>Multiple secure payment options for corporate billing.</p>", icon: "payment", iconColor: "#886CFF", bg: "#F6F5FC", iconAlt: "Secure payment icon" },
    { title: "Flexible Duration", text: "<p>Rent from 1 month to 3 years based on your project needs.</p>", icon: "duration", iconColor: "#0081F5", bg: "#F2F9FE", iconAlt: "Flexible duration icon" },
    { title: "Quality Checked", text: "<p>Every device undergoes rigorous quality inspection.</p>", icon: "quality", iconColor: "#F55498", bg: "#FEF6FA", iconAlt: "Quality checked icon" },
    { title: "Easy Replacement", text: "<p>Hassle-free device replacement with minimal downtime.</p>", icon: "replacement", iconColor: "#00D362", bg: "#F2FDF7", iconAlt: "Easy replacement icon" },
    { title: "Dedicated Support", text: "<p>24/7 corporate support for all your technical needs.</p>", icon: "support", iconColor: "#FF3F00", bg: "#FFF5F2", iconAlt: "Dedicated support icon" },
  ],
};

export type Testimonial = { content: string; name: string; job: string; img?: { src: string; alt: string } };

export const testimonials: { title: string; items: Testimonial[] } = {
  title: "Our Happy Clients!",
  items: [
    { content: "Such genuine kindness is truly rare. Renton Technologies went beyond business and showed real humanity by helping me at a crucial moment without expecting anything in return. This thoughtful gesture reflects values that inspire trust and gratitude. Thank you Renton — I will always be grateful.", name: "Abdul Basit", job: "Civil Engineer", img: { src: "/images/Client_abdul.jpeg", alt: "Abdul Basit, Civil Engineer" } },
    { content: "I am Anirud.I am a student of class 10.I am currently using lenovo's thinkpad for my studies from Renton Technologies in February.It gives a good battery power and very useful for my studies.For past 6 months it doesn't give me any trouble", name: "Anirud", job: "Student" },
    { content: "I am Srivant, studying Standard 8 using the Lenovo laptop since six months from Renton Technologies. The laptop is good and the complementary from Renton is amazing. It has no lag, it has good battery backup.", name: "Srivant", job: "Student" },
  ],
};

export const homeFaq: { title: string; intro: string; columns: AccordionItem[][] } = {
  title: "Frequently Asked Questions (FAQ) – Renton Technologies",
  intro: "<p><b>Fast answers for your IT rental needs.</b></p>",
  columns: [
    [{"q": "Where is Renton Technologies LLP located in Electronic City, and how do I find the office?", "a": "<ul><li><strong>Renton Technologies LLP</strong> is situated on the <strong>First Floor of the Lava Kusha Building (No. 6/2)</strong> in <strong>Beratena Agrahara, Electronic City, Bengaluru, Karnataka 560100</strong>. </li><li>Our office is conveniently located along <strong>Hosur Road</strong>, directly opposite the local <strong>Metro Station</strong> and right next to the <strong>Damro</strong> <strong>Furniture,</strong>  <strong>Nexa and MG Car Showrooms</strong>. For hassle-free navigation and real-time transit routes, you can locate our precise pin drop via the official Google Maps Profile for Renton Technologies LLP</li></ul>"}, {"q": "What IT equipment can I rent from Renton Technologies in Bangalore?", "a": "<p>Renton Technologies offers a comprehensive range of IT hardware for rent, including <b>high-performance laptops, professional desktop PCs, enterprise-grade servers, workstations, and multi-function printers/scanners</b>. We cater to corporate offices, startups, and events across Bangalore and India with scalable rental solutions.</p>"}, {"q": "Do you provide laptop rentals for individuals or only for businesses?", "a": "<p>We primarily specialize in <b>B2B corporate laptop rental in Bangalore</b> and bulk requirements for offices, training programs, and events. However, we do offer flexible plans for long-term individual professional requirements. Contact our team at <b>+91 805028-1515</b> to discuss your specific needs.</p>"}, {"q": "What happens if a rented laptop or printer stops working?", "a": "<p>We pride ourselves on reliability. Renton Technologies provides <b>rapid replacement and on-site technical support</b> in Bangalore. If a device malfunctions, our engineers will troubleshoot it or provide a replacement within 72 hours to ensure zero downtime for your business.</p>"}, {"q": "Is maintenance included in the monthly rental cost?", "a": "<p>Absolutely. All our rental plans include 1 year <b>free maintenance and servicing</b>. This allows you to acquire enterprise-grade tech without the burden of ownership or hidden repair costs.</p>"}],
    [{"q": "Can I customize the configuration of the rented laptops or servers?", "a": "<p>Yes. We understand that every business has unique needs. Whether you need <b>increased RAM for data science</b>, <b>high-end GPUs for rendering</b>, or <b>specific storage capacities for servers</b>, we provide custom-configured hardware to match your technical workflow.</p>"}, {"q": "Are the rental laptops and desktops pre-loaded with software?", "a": "<p>Our devices come with a clean OS installation. Upon request, we can pre-configure machines with specific software stacks or security protocols to ensure your team is “ready-to-work” the moment the hardware arrives.</p>"}, {"q": "Where is Renton Technologies located, and which areas do you serve?", "a": "<p>Our head office is located in <b>Electronic City, Bangalore (Beratena Agrahara)</b>. While we are the leading provider for the Bangalore tech hub, we also support corporate IT requirements across India with seamless delivery and setup services like desktop rental in Bangalore.</p>"}, {"q": "Why should I choose renting over buying IT hardware for my startup?", "a": "<p>Renting from Renton Technologies helps you <b>conserve capital and improve cash flow</b>. Instead of a massive upfront investment in depreciating assets, you get access to the latest technology with tax-deductible monthly expenses and the flexibility to scale your fleet as your team grows.</p>"}],
  ],
};
