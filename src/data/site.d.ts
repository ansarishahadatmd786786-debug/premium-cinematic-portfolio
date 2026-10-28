type SocialLink = {
  label: string;
  url: string;
};

declare const site: {
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
};

export const navLinks: { id: string; label: string }[];
export default site;
