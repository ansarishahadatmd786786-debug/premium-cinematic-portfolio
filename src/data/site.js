/**
 * Central site configuration.
 *
 * Update contact details / identity HERE once —
 * every component reads from this file.
 */

const site = {
  name: "SHAHADAT",
  firstName: "Shahadat",
  role: "Web Developer",
  roleDisplay: "WEB DEVELOPER",
  tagline: "Modern websites for businesses and growing brands.",

  // ---- Contact (temporary email — replace in ONE place) ----
  email: "ansarish8880@gmail.com",
  phone: "7217658640",
  phoneDisplay: "72176 58640",

  location: "Working worldwide",
  availability: "Available for new projects",
  year: "2026",

  // Placeholder canonical — swap with the real domain after deploy
  canonical: "https://shahadat.vercel.app/",

  // Social links — only rendered when a real url is provided.
  socials: [
    // { label: "GitHub", url: "" },
    // { label: "LinkedIn", url: "" },
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
