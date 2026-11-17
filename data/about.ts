// About page content, copied word for word from https://www.renton.org.in/about/ (crawled 2026-11-17).
// Advantage image alts were filenames on WordPress; descriptive alts written for the rebuild.

export const aboutHero = {
  title: "About Us",
  subtitle: "Discover the Renton Commitment to Excellence",
  text: "<p>Discover how Renton is transforming data security, compliance, and the circular economy through innovative IT asset services.</p>",
};

export const aboutCards = [
  { title: "Our Vision", html: "<p>To become a trusted partner for businesses seeking technology-driven growth and transformation</p>" },
  { title: "Our Mission", html: "<p>To empower organizations by delivering reliable, efficient, and innovative technology solutions that improve operational efficiency and maximize ROI.</p>" },
  { title: "What We Do", list: ["Rental", "Data Erasing", "Sales", "Service", "Digital Marketing", "Training & Internship"] },
] as const;

export const sixD = {
  title: "Our 6-D Process",
  steps: [
    { title: "01. Discover", html: "<p>✅  Identify market needs, customer pain points, and target industries</p><p>✅  Research competitors, technology trends, and pricing benchmarks</p><p>✅  Gather customer requirements (performance, security, scalability, cost)</p><p>✅  Validate demand through surveys, pilots, or proof-of-concept ideas</p>" },
    { title: "02. Define", html: "<p>✅ Define product vision, value proposition, and success criteria</p><p>✅ Finalize technical specifications and compliance requirements</p><p>✅ Select target customer segments and use cases</p><p>✅ Create a business model (pricing, sourcing, support strategy)</p>" },
    { title: "03. Design", html: "<p>✅ Design hardware architecture, system layouts, and user interfaces</p><p>✅ Select components, vendors, and manufacturing partners</p><p>✅ Design software/firmware integration (drivers, OS compatibility)</p><p>✅ Ensure cybersecurity, data protection, and regulatory compliance</p>" },
    { title: "04. Develop", html: "<p>✅ Build prototypes and minimum viable products (MVPs)</p><p>✅ Develop firmware, software tools, and configuration utilities</p><p>✅ Perform functional, performance, and stress testing</p><p>✅ Iterate designs based on testing and user feedback</p>" },
    { title: "05. Deploy", html: "<p>✅ Prepare manufacturing, assembly, and quality control processes</p><p>✅ Package, document, and certify products for market release</p><p>✅ Deploy products to customers or distribution partners</p><p>✅ Train internal teams and customers on installation and usage.</p>" },
    { title: "06. Deliver", html: "<p>✅ Provide customer support, warranty, and maintenance services</p><p>✅ Monitor product performance and customer satisfaction</p><p>✅ Collect feedback for upgrades and next product versions</p><p>✅ Scale production, expand markets, and optimize costs</p>" },
  ],
};

export const whyUs = {
  image: {"src": "/images/printers.jpg", "alt": "printers", "width": 1024, "height": 609},
  title: "Why Choose Us?",
  html: "<p>Renton Technologies is a technology-driven company focused on providing cutting-edge solutions in IT infrastructure, data security, digital automation, and business consulting. With a team of passionate technologists and domain experts, we help clients stay ahead of the curve in a rapidly changing digital world.<br/>Founded with a vision to streamline IT processes, Renton began as a local provider focused on revolutionizing technology management in the Puget Sound area.</p><p>We have proudly served a diverse clientele, including startups, educational institutions, and large enterprises, helping them navigate the complexities of IT lifecycle management.</p>",
};

export const advantages = {
  kicker: "Our Core Advantages",
  title: "Why Leading Organizations Choose Renton?",
  items: [
    { image: {"src": "/images/1364371014.jpg", "alt": "Hand turning a risk dial down from high to low", "width": 2560, "height": 1440}, title: "Risk Reduction", html: "<p>Mitigate data breaches and minimize liability with certified data erasure and secure asset handling at every stage of the IT lifecycle.</p>" },
    { image: {"src": "/images/1788265199.jpg", "alt": "Woman completing two-factor authentication on a laptop and phone", "width": 2121, "height": 1414}, title: "Compliance Support​", html: "<p>Stay ahead of regulatory requirements with audit-ready reporting and proven processes aligned to global data protection standards.</p>" },
    { image: {"src": "/images/2185337504.jpg", "alt": "Hand touching a digital network of automation gears", "width": 2210, "height": 1357}, title: "Automated Processes", html: "<p>Streamline IT asset management with seamless, automated workflows for data erasure, tracking, and reporting—saving time and resources.</p>" },
    { image: {"src": "/images/1413601858.jpg", "alt": "Hands holding a glowing circular economy recycling symbol", "width": 2560, "height": 1440}, title: "Circular Economy Enablement", html: "<p>Support environmental responsibility by securely refurbishing and redeploying assets, promoting reuse and reducing electronic waste.</p>" },
  ],
};

export const aboutCta = {
  title: "Ready to power your business with the right IT infrastructure?",
  html: "<p>Let’s start your project with our smart, scalable IT rental solutions.</p>",
  button: { label: "Get a Quote", href: "/contact/" },
};
