// The owner's PDF, operational sign-off, logo and contact details have not been supplied.
// No catalogue entry may be advertised until BOTH enabled and confirmed are true.
export type Service = {
  id: string;
  name: string;
  enabled: boolean;
  confirmed: boolean;
  source: "brief-placeholder" | "services-pdf";
};
export type CareCategory = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  detail: string;
  image: string;
  imageAlt: string;
  topics: string[];
  services: Service[];
};
const pending = (id: string, name: string): Service => ({
  id,
  name,
  enabled: false,
  confirmed: false,
  source: "brief-placeholder",
});

export const business = {
  name: "SKY DEMAC AUTOMOTIVE",
  tagline: "Built for the Pressure.",
  supportingLine:
    "Complete Automotive Care. Premium Detailing. Professional Maintenance.",
  logo: "",
  accent: "#2463eb",
  accentHover: "#174fca",
  phone: "",
  whatsapp: "",
  email: "",
  address: "",
  mapUrl: "",
  openingHours: "",
  socialLinks: [] as { label: string; url: string }[],
  catalogueSource: null as string | null,
  launchReady: false,
  processConfirmed: false,
  studioImage: "",
  seo: {
    url: "https://sky-demac-automotive.rwmdesigners.chatgpt.site",
    title: "SKY DEMAC AUTOMOTIVE | Built for the Pressure.",
    description:
      "Meet SKY DEMAC AUTOMOTIVE. Complete automotive care, premium detailing and professional maintenance. Explore our approach and prepare a service enquiry.",
  },
  categories: [
    {
      id: "mechanical",
      title: "Mechanical Services",
      shortTitle: "Mechanical care",
      description: "Confidence, from the inside out.",
      detail:
        "Good maintenance starts with understanding your car. Describe any warning lights, unusual sounds or changes in how it drives so the right next step can be discussed.",
      image: "/images/mechanical.webp",
      imageAlt: "Illustrative close-up of a performance car wheel and brake",
      topics: [
        "Describe the concern",
        "Share your service history",
        "Discuss the next step",
      ],
      services: [
        pending("diagnostics", "Diagnostics"),
        pending("brakes", "Brake service"),
        pending("periodic-maintenance", "Periodic maintenance"),
      ],
    },
    {
      id: "detailing",
      title: "Car Detailing & Ceramic Studio",
      shortTitle: "Detailing studio",
      description: "An exceptional finish. Every detail.",
      detail:
        "Paintwork, trim and interior materials each need a considered approach. Tell us which areas you would like assessed and the finish you have in mind. Specialist treatments require confirmation.",
      image: "/images/detailing.webp",
      imageAlt: "Illustrative studio reflection on polished graphite paintwork",
      topics: [
        "Paintwork condition",
        "Interior materials",
        "Your preferred finish",
      ],
      services: [
        pending("paint-correction", "Paint correction"),
        pending("interior-care", "Interior care"),
        pending("premium-detailing", "Premium detailing"),
        pending("ceramic-coating", "Ceramic coating"),
        pending("specialised-coating", "Specialised coating"),
        pending("ppf", "Paint protection film"),
      ],
    },
    {
      id: "wash",
      title: "Car Wash Services",
      shortTitle: "Wash & exterior care",
      description: "A fresh start for every drive.",
      detail:
        "Everyday dirt and road residue call for care that suits the surface. Share your car’s current condition and any existing paint treatment when asking about exterior care.",
      image: "/images/exterior.webp",
      imageAlt:
        "Illustrative close-up of a clean car headlight and front bodywork",
      topics: [
        "Exterior condition",
        "Existing paint treatments",
        "Care preferences",
      ],
      services: [],
    },
    {
      id: "body-shop",
      title: "Body Shop, Denting & Painting",
      shortTitle: "Body & paint",
      description: "Understanding the surface.",
      detail:
        "The type, location and extent of body damage help determine what to assess. Any body repair or painting facilities must be confirmed before work is arranged.",
      image: "/images/detailing.webp",
      imageAlt: "Illustrative automotive bodywork",
      topics: ["Affected panels", "Damage assessment", "Finish requirements"],
      services: [pending("painting", "Painting facilities")],
    },
    {
      id: "accessories",
      title: "Car Accessories & Upgrades",
      shortTitle: "Accessories & upgrades",
      description: "Make it feel like your car.",
      detail:
        "Compatibility matters. Include your car’s make, model, year and the change you have in mind when discussing an upgrade.",
      image: "/images/hero.webp",
      imageAlt: "Illustrative performance coupe",
      topics: [
        "Vehicle compatibility",
        "Your intended use",
        "Installation requirements",
      ],
      services: [],
    },
    {
      id: "wheels",
      title: "Tyres, Wheels & Alignment",
      shortTitle: "Tyres & wheels",
      description: "Where confidence meets the road.",
      detail:
        "Uneven wear, vibration or a change in steering feel are useful details to share. Wheel alignment equipment and service availability require confirmation.",
      image: "/images/mechanical.webp",
      imageAlt: "Illustrative wheel detail",
      topics: ["Tyre condition", "Steering concerns", "Wheel specifications"],
      services: [pending("wheel-alignment", "Wheel alignment")],
    },
    {
      id: "electrical",
      title: "Electrical & AC Services",
      shortTitle: "Electrical & AC",
      description: "Comfort in every journey.",
      detail:
        "Let us know what is happening, when it started and whether it is intermittent. Include any dashboard messages or changes in cooling performance.",
      image: "/images/exterior.webp",
      imageAlt: "Illustrative vehicle lighting detail",
      topics: ["Dashboard messages", "Electrical concerns", "Cabin comfort"],
      services: [],
    },
    {
      id: "special-care",
      title: "Special Care Services",
      shortTitle: "Special care",
      description: "Considered care for specific needs.",
      detail:
        "Unusual materials and specialist requirements deserve an individual discussion. Availability and suitability of specialised techniques must be confirmed.",
      image: "/images/detailing.webp",
      imageAlt: "Illustrative paint detail",
      topics: ["Material type", "Specific concerns", "Suitability assessment"],
      services: [pending("dry-ice-cleaning", "Dry ice cleaning")],
    },
    {
      id: "additional",
      title: "Additional Services",
      shortTitle: "Additional support",
      description: "The details around your visit.",
      detail:
        "Share any practical requirements with your enquiry. Collection, return and insurance assistance are not currently confirmed services.",
      image: "/images/hero.webp",
      imageAlt: "Illustrative studio car",
      topics: [
        "Visit preferences",
        "Vehicle information",
        "Additional questions",
      ],
      services: [
        pending("pickup-drop", "Pickup & drop"),
        pending("insurance-assistance", "Insurance assistance"),
      ],
    },
  ] satisfies CareCategory[],
  process: [
    { title: "Enquire", text: "Tell us about your car and what it needs." },
    {
      title: "Inspection",
      text: "Understand its condition and the work involved.",
    },
    {
      title: "Estimate approval",
      text: "Review the proposed work before it begins.",
    },
    {
      title: "Service",
      text: "The agreed work, with attention to the details.",
    },
    { title: "Handover", text: "Walk through the work and your next steps." },
  ],
  projects: [] as {
    id: string;
    title: string;
    category: string;
    image: string;
    alt: string;
    genuine: boolean;
  }[],
  comparison: null as {
    before: string;
    after: string;
    alt: string;
    genuine: boolean;
  } | null,
};

export const confirmedServices = business.categories.flatMap((category) =>
  category.services
    .filter((service) => service.confirmed && service.enabled)
    .map((service) => ({ ...service, category: category.title })),
);
export const isServiceActive = (id: string) =>
  confirmedServices.some((service) => service.id === id);
export const whatsappNumber = /^\+?[1-9]\d{7,14}$/.test(business.whatsapp)
  ? business.whatsapp.replace("+", "")
  : "";
