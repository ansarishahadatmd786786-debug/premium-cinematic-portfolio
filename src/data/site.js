/**
 * Central site configuration.
 *
 * Update contact details and identity here once.
 * every component reads from this file.
 */

const site = {
  name: "SHAHADAT",
  firstName: "Shahadat",
  role: "Web Developer",
  roleDisplay: "WEB DEVELOPER",
  tagline: "Modern websites for businesses and growing brands.",

  email: "ansarishahadatmd786786@gmail.com",
  phone: "7217658640",
  whatsapp: "917217658640",
  phoneDisplay: "72176 58640",

  location: "[TODO: city / location]",
  availability: "Available for new projects",
  year: "2026",

  canonical: "https://premium-cinematic-portfolio.vercel.app",

  caseStudy: {
    client: "[TODO: client]",
    problem: "[TODO: problem]",
    built: "[TODO: what was built]",
    result: "[TODO: measurable result]",
  },

  packages: [
    { name: "Landing page", price: "[TODO: price]", delivery: "[TODO: delivery time]" },
    { name: "Business website", price: "[TODO: price]", delivery: "[TODO: delivery time]" },
    { name: "Custom experience", price: "[TODO: price]", delivery: "[TODO: delivery time]" },
  ],

  socials: [
    // [TODO: Add the GitHub profile URL]
    { label: "GitHub", url: "" },
    // [TODO: Add the LinkedIn profile URL]
    { label: "LinkedIn", url: "" },
  ],
};

export const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export default site;
