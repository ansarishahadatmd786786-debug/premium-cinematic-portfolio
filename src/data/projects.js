/**
 * Project data — kept separate from UI components.
 *
 * SCREENSHOTS: to show the real site capture for a project,
 * drop a file into  public/images/projects/<slug>/cover.jpg
 * and set  image: "/images/projects/<slug>/cover.jpg"  below.
 * Until then the built-in art-directed cover system is rendered
 * (no fake screenshots).
 */

const projects = [
  {
    id: "smilecraft",
    num: "01",
    name: "Smilecraft Dental",
    category: "Dental Clinic Website",
    url: "https://premium-dental-clinic-website-psi.vercel.app/",
    description:
      "Premium dental clinic website concept designed to build patient trust, showcase services and doctors, and make appointment enquiries simple and accessible.",
    focus: ["Trust", "Lead generation", "Responsive experience"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "SD",
    hue: 190,
    image: "/images/projects/smilecraft/cover.png",

  },
  {
    id: "velacare",
    num: "02",
    name: "Velacare Health",
    category: "Healthcare Website",
    url: "https://hospital-demo-coral.vercel.app/",
    description:
      "Modern healthcare website concept focused on clear information, approachable presentation, and responsive user experience.",
    focus: ["Information architecture", "Responsive experience"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "VH",
    hue: 158,
   image: "/images/projects/velacare/cover.png",

  },
  {
    id: "ember-spice",
    num: "03",
    name: "Ember & Spice",
    category: "Restaurant Website",
    url: "https://restaurant-cafe-demo1.vercel.app/",
    description:
      "Premium restaurant website concept designed to create a strong visual identity and make the dining experience feel memorable online.",
    focus: ["Visual identity", "Conversion"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "ES",
    hue: 22,
    image: "/images/projects/ember-spice/cover.png",
  },
  {
    id: "lumea",
    num: "04",
    name: "Luméa",
    category: "Beauty & Wellness Website",
    url: "https://salon-beauty-demo-rho.vercel.app/",
    description:
      "Elegant beauty and wellness website concept with a refined visual style, clear service presentation, and responsive layout.",
    focus: ["Visual identity", "Responsive experience"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "LU",
    hue: 330,
    image: "/images/projects/lumea/cover.png",
  },
  {
    id: "ironvault",
    num: "05",
    name: "Ironvault Fitness",
    category: "Fitness Website",
    url: "https://ironvault-fitness-coral.vercel.app/",
    description:
      "Bold fitness website concept built around strong visual presentation, clear service information, and a motivating digital experience.",
    focus: ["Visual identity", "Lead generation"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "IF",
    hue: 6,
    image: "/images/projects/ironvault/cover.png",
  },
  {
    id: "nexora",
    num: "06",
    name: "Nexora Academy",
    category: "Education Website",
    url: "https://nexora-academy-swart.vercel.app/",
    description:
      "Modern coaching and education website concept designed to present courses, faculty, results, schedules, and enquiries clearly.",
    focus: ["Information architecture", "Lead generation"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "NA",
    hue: 222,
    image: "/images/projects/nexora/cover.png",
  },
  {
    id: "aurelia-estates",
    num: "07",
    name: "Aurelia Estates",
    category: "Real Estate Website",
    url: "https://aurelia-estates-azure-three.vercel.app/",
    description:
      "Premium real estate website concept designed to showcase luxury properties, locations, services, and enquiries through a polished and immersive digital experience.",
    focus: ["Immersive presentation", "Lead generation"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "AE",
    hue: 42,
    image: "/images/projects/aurelia-estates/cover.png",

  },
  {
    id: "veritas",
    num: "08",
    name: "Veritas Legal",
    category: "Law Firm Website",
    url: "https://veritas-legal-two.vercel.app/",
    description:
      "Sophisticated law firm website concept designed to communicate trust, clarity, and professionalism through practice areas, attorneys, insights, and consultation-focused experiences.",
    focus: ["Trust", "Information architecture"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "VL",
    hue: 46,
    image: "/images/projects/veritas/cover.png",
  },
  {
    id: "aurora-threads",
    num: "09",
    name: "Aurora Threads",
    category: "Fashion & E-commerce Website",
    url: "https://aurora-threads-orcin.vercel.app/",
    description:
      "Premium fashion e-commerce website concept designed to showcase curated collections, products, fabrics, and a refined shopping experience across desktop and mobile.",
    focus: ["E-commerce", "Visual identity"],
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "AT",
    hue: 275,
   image: "/images/projects/aurora-threads/cover.png",
  },
  {
    id: "aurelia-resort",
    num: "10",
    name: "Aurelia Grand Resort",
    category: "Luxury Resort Website",
    url: "https://aurelia-grand-resort-six.vercel.app/",
    description:
      "Immersive luxury resort website concept featuring a cinematic 3D hero experience, premium rooms and villas, experiences, dining, wellness, gallery, and responsive booking-focused journeys.",
    focus: ["Immersive presentation", "Conversion"],
    tech: ["React", "Three.js", "GSAP", "Vercel"],
    type: "Concept Project",
    initials: "AG",
    hue: 196,
    image: "/images/projects/aurelia-resort/cover.png",

  },
  {
    id: "lumiere",
    num: "11",
    name: "Lumière Photography",
    category: "Photography Website",
    url: "https://premium-3d-photography-website.vercel.app/",
    description:
      "Premium photography studio website concept featuring immersive 3D visuals, service discovery, booking flows, gallery experiences, and a complete demo shopping journey.",
    focus: ["Immersive presentation", "E-commerce"],
    tech: ["React", "Three.js", "GSAP", "Vercel"],
    type: "Concept Project",
    initials: "LP",
    hue: 34,
    image: "/images/projects/lumiere/cover.png",
  },
  {
    id: "pee-kay",
    num: "12",
    name: "Pee Kay Furnishings",
    category: "Furniture & E-commerce Website",
    url: "https://premium-3d-furniture-demo.vercel.app/",
    description:
      "Premium furniture showroom and e-commerce website concept designed to showcase collections, support custom furniture enquiries, and provide a polished shopping experience across desktop and mobile.",
    focus: ["E-commerce", "Lead generation"],
    tech: ["React", "Three.js", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "PK",
    hue: 28,
    image: "/images/projects/pee-kay/cover.png",
  },
  {
    id: "premium-jewellery-showroom",
    num: "13",
    name: "Premium Jewellery Showroom",
    category: "Jewellery Showroom Website",
    url: "https://premium-jewellery-showroom.vercel.app/",
    description:
      "Premium jewellery showroom website concept designed as a digital catalogue, featuring curated collections, product detail experiences, bridal jewellery, showroom information, and direct WhatsApp enquiry journeys.",
    focus: ["Luxury presentation", "Product catalogue", "Lead generation"],
    tech: ["React", "TypeScript", "CSS", "Vercel"],
    type: "Concept Project",
    initials: "PJ",
    hue: 42,
    image: "/images/projects/premium-jewellery-showroom/cover.png",
  },
];

export default projects;
