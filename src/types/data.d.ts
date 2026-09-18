/** Type declarations for the plain-JS data modules. */

declare module "*/data/site" {
  export interface SocialLink {
    label: string;
    url: string;
  }
  export interface SiteConfig {
    name: string;
    firstName: string;
    role: string;
    roleDisplay: string;
    tagline: string;
    email: string;
    phone: string;
    phoneDisplay: string;
    location: string;
    availability: string;
    year: string;
    canonical: string;
    socials: SocialLink[];
  }
  export const navLinks: { id: string; label: string }[];
  const site: SiteConfig;
  export default site;
}

declare module "*/data/projects" {
  export interface Project {
    id: string;
    num: string;
    name: string;
    category: string;
    url: string;
    description: string;
    focus: string[];
    tech: string[];
    type: string;
    initials: string;
    hue: number;
    image: string | null;
  }
  const projects: Project[];
  export default projects;
}
