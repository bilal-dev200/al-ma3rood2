const serviceCategories = [
  {
    id: "home-garden",
    label: "Home & Garden",
    description: "Cleaning, landscaping, repairs, and in-home support.",
    subcategories: [
      "Cleaning Services",
      "Gardening & Landscaping",
      "Handyman & Repairs",
      "Pest Control",
      "Plumbing",
      "Electrical",
    ],
  },
  {
    id: "events-entertainment",
    label: "Events & Entertainment",
    description: "Event planning, catering, photography, and more.",
    subcategories: [
      "Event Planning",
      "Catering",
      "Photography & Video",
      "Music & DJs",
      "Party Hire",
      "Florists",
    ],
  },
  {
    id: "health-wellbeing",
    label: "Health & Wellbeing",
    description: "Fitness, beauty, and personal care professionals.",
    subcategories: [
      "Personal Training",
      "Beauty & Nails",
      "Massage Therapy",
      "Hairdressing",
      "Nutrition",
      "Mental Health",
    ],
  },
  {
    id: "digital-creative",
    label: "Digital & Creative",
    description: "Design, development, marketing, and creative support.",
    subcategories: [
      "Web Development",
      "Graphic Design",
      "Marketing & SEO",
      "Copywriting",
      "App Development",
      "Photography Editing",
    ],
  },
  {
    id: "business-services",
    label: "Business Services",
    description: "Professional services to help run and grow businesses.",
    subcategories: [
      "Accounting & Finance",
      "Legal",
      "Consulting",
      "Recruitment",
      "Virtual Assistants",
      "IT Support",
    ],
  },
  {
    id: "education-tutoring",
    label: "Education & Tutoring",
    description: "Tutors, coaches, and educational specialists.",
    subcategories: [
      "Academic Tutoring",
      "Test Preparation",
      "Language Lessons",
      "Music Lessons",
      "STEM Coaching",
      "Early Childhood",
    ],
  },
  {
    id: "automotive-services",
    label: "Automotive",
    description: "Mobile mechanics, detailing, and automotive specialists.",
    subcategories: [
      "Mobile Mechanics",
      "Auto Detailing",
      "Tyres & Wheels",
      "Panel Beating",
      "Car Grooming",
      "Glass & Windscreens",
    ],
  },
];

const serviceRegions = [
  {
    id: "auckland",
    label: "Auckland",
    areas: ["CBD", "North Shore", "South Auckland", "West Auckland"],
  },
  {
    id: "wellington",
    label: "Wellington",
    areas: ["Central", "Lower Hutt", "Porirua", "Kapiti Coast"],
  },
  {
    id: "christchurch",
    label: "Christchurch",
    areas: ["Central", "Burnside", "Riccarton", "Sumner"],
  },
  {
    id: "hamilton",
    label: "Hamilton",
    areas: ["CBD", "Rototuna", "Flagstaff", "Frankton"],
  },
  {
    id: "tauranga",
    label: "Tauranga",
    areas: ["Mount Maunganui", "Papamoa", "Bethlehem", "Greerton"],
  },
];

const serviceListingSeed = [
  {
    slug: "premium-home-cleaning-organisation",
    title: "Premium Home Cleaning & Organisation",
    subtitle:
      "Weekly and one-off deep cleans with eco-friendly supplies and optional laundry service.",
    description:
      "Our award-winning mobile team delivers spotless homes across Auckland. Choose weekly upkeep or a one-off deep clean that tackles ovens, skirting boards, and inside cupboards. Optional laundry and wardrobe organising add-ons keep your space photo-ready after every visit.",
    category: "home-garden",
    subcategory: "Cleaning Services",
    region: "auckland",
    area: "North Shore",
    price: 98,
    priceUnit: "per visit",
    rating: 4.9,
    reviews: 182,
    responseTime: "Usually responds in 1 hour",
    nextAvailability: "Available this Friday",
    isVerified: true,
    badges: ["Top Rated", "Background Checked"],
    experience: "8 years experience",
    photo: {
      url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 480,
      alt: "Professional cleaners tidying a modern living room",
    },
    tags: ["Eco products", "Pet friendly", "Move-out cleans"],
  },
  {
    slug: "wedding-event-photography-studio",
    title: "Wedding & Event Photography Studio",
    subtitle:
      "Story-driven photography packages with drone coverage and same-day previews.",
    description:
      "From intimate ceremonies to large-scale productions, our studio captures every detail with cinematic flair. Each booking includes timeline planning, drone coverage, and a private online gallery delivered within 72 hours.",
    category: "events-entertainment",
    subcategory: "Photography & Video",
    region: "wellington",
    area: "Central",
    price: 2400,
    priceUnit: "per full day",
    rating: 4.8,
    reviews: 96,
    responseTime: "Usually responds within 3 hours",
    nextAvailability: "Booking for March 2026",
    isVerified: true,
    badges: ["Pro Verified"],
    experience: "12 years experience",
    photo: {
      url: "https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 427,
      alt: "Photographer capturing a wedding couple at sunset",
    },
    tags: ["Drone", "Same-day edits", "Destination weddings"],
  },
  {
    slug: "mobile-personal-training-nutrition",
    title: "Mobile Personal Training & Nutrition Coaching",
    subtitle:
      "Holistic fitness programs tailored to busy professionals, with weekly check-ins.",
    description:
      "Transform your routine with mobile sessions delivered to your home, office, or local park. We pair customised strength programming with personalised nutrition check-ins so you see measurable progress every week.",
    category: "health-wellbeing",
    subcategory: "Personal Training",
    region: "auckland",
    area: "CBD",
    price: 85,
    priceUnit: "per session",
    rating: 5,
    reviews: 64,
    responseTime: "Usually responds in 30 minutes",
    nextAvailability: "Available tomorrow",
    isVerified: true,
    badges: ["Top Rated"],
    experience: "REPS registered",
    photo: {
      url: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 427,
      alt: "Personal trainer guiding a client with dumbbells",
    },
    tags: ["Mobile service", "Nutrition plans", "Strength training"],
  },
  {
    slug: "ux-product-design-sprint-facilitator",
    title: "UX & Product Design Sprint Facilitator",
    subtitle:
      "Remote-first design sprints, user research, and prototyping for SaaS teams.",
    description:
      "Accelerate your roadmap with facilitated design sprints, user interviews, and validated prototypes. We plug into your team remotely, guide decision-making workshops, and deliver investment-ready product artefacts in five days.",
    category: "digital-creative",
    subcategory: "UX & Product Design",
    region: "tauranga",
    area: "Mount Maunganui",
    price: 1800,
    priceUnit: "per week",
    rating: 4.7,
    reviews: 41,
    responseTime: "Usually responds within 12 hours",
    nextAvailability: "Slots open from January",
    isVerified: false,
    badges: ["New this month"],
    experience: "Ex-Atlassian design lead",
    photo: {
      url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 427,
      alt: "Design team collaborating at a whiteboard",
    },
    tags: ["Design sprints", "User research", "Remote"],
  },
  {
    slug: "licensed-electrician-smart-home",
    title: "Licensed Electrician & Smart Home Specialist",
    subtitle:
      "Residential and commercial electrical work with smart home integrations.",
    description:
      "Future-proof your property with certified electricians specialising in EV chargers, switchboard upgrades, and whole-home smart lighting. Every job includes compliance documentation and post-installation support.",
    category: "home-garden",
    subcategory: "Electrical",
    region: "christchurch",
    area: "Riccarton",
    price: 120,
    priceUnit: "per hour",
    rating: 4.9,
    reviews: 128,
    responseTime: "Usually responds in 2 hours",
    nextAvailability: "Available this week",
    isVerified: true,
    badges: ["Pro Verified"],
    experience: "Master Electricians member",
    photo: {
      url: "https://images.unsplash.com/photo-1581092918973-65f6fabb2b58?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 427,
      alt: "Electrician installing smart home equipment",
    },
    tags: ["Smart home", "EV chargers", "Emergency call-outs"],
  },
  {
    slug: "boutique-catering-grazing-tables",
    title: "Boutique Catering & Grazing Tables",
    subtitle:
      "Seasonal menus, wedding canapés, and styled grazing tables for 40-200 guests.",
    description:
      "Celebrate in style with bespoke grazing tables, cocktail canapés, and plated dining experiences that showcase seasonal, locally sourced produce. Our team handles menu design, staffing, and styling right down to glassware.",
    category: "events-entertainment",
    subcategory: "Catering",
    region: "hamilton",
    area: "Flagstaff",
    price: 35,
    priceUnit: "per person",
    rating: 4.8,
    reviews: 73,
    responseTime: "Usually responds in 6 hours",
    nextAvailability: "Limited December availability",
    isVerified: true,
    badges: ["Top Rated"],
    experience: "Chef-owned business",
    photo: {
      url: "https://images.unsplash.com/photo-1543353071-10c8ba85a904?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 426,
      alt: "Grazing table with assorted fresh food",
    },
    tags: ["Weddings", "Corporate", "Dietary options"],
  },
  {
    slug: "on-demand-mobile-mechanics",
    title: "On-Demand Mobile Mechanics",
    subtitle:
      "Diagnostics, servicing, and repairs at your home or office with upfront pricing.",
    description:
      "Skip the workshop queue with dealer-trained technicians who come to you. We cover servicing, diagnostics, pre-purchase checks, and emergency repairs with upfront quotes and digital inspection reports.",
    category: "automotive-services",
    subcategory: "Mobile Mechanics",
    region: "auckland",
    area: "West Auckland",
    price: 165,
    priceUnit: "call-out",
    rating: 4.6,
    reviews: 54,
    responseTime: "Usually responds within 2 hours",
    nextAvailability: "Same-day slots available",
    isVerified: true,
    badges: ["Background Checked"],
    experience: "MTA assured",
    photo: {
      url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 426,
      alt: "Mechanic fixing a car engine at a driveway",
    },
    tags: ["Fleet servicing", "EV friendly", "After hours"],
  },
  {
    slug: "stem-tutoring-ncea-ib",
    title: "STEM Tutoring for NCEA & IB Students",
    subtitle:
      "Experienced tutors covering maths, physics, and chemistry with progress tracking.",
    description:
      "Boost grades with curriculum-aligned tutoring delivered online or in-person. Each enrolment includes diagnostic assessments, weekly progress reports, and exam strategy sessions tailored to NCEA or IB requirements.",
    category: "education-tutoring",
    subcategory: "Academic Tutoring",
    region: "wellington",
    area: "Lower Hutt",
    price: 65,
    priceUnit: "per hour",
    rating: 5,
    reviews: 38,
    responseTime: "Usually responds in 1 hour",
    nextAvailability: "Evening sessions available",
    isVerified: true,
    badges: ["Top Rated"],
    experience: "MOE registered teachers",
    photo: {
      url: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?auto=format&fit=crop&w=640&q=80",
      width: 640,
      height: 427,
      alt: "Tutor teaching a student with laptop and notes",
    },
    tags: ["Online lessons", "Group sessions", "Scholarship prep"],
  },
];

let serviceListings = [...serviceListingSeed];

const featuredProviders = [
  {
    id: "featured-01",
    title: "Book a vetted tradie now",
    description:
      "Same-day callouts for electrical, plumbing, and urgent repairs. Track quotes in your dashboard.",
    ctaLabel: "See tradies near me",
    href: "/services?category=home-garden",
    image: {
      url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=960&q=80",
      width: 960,
      height: 640,
      alt: "Electrician installing ceiling lights",
    },
  },
  {
    id: "featured-02",
    title: "Plan your summer events",
    description:
      "Compare photographers, caterers, and stylists. Hold dates while you decide.",
    ctaLabel: "Explore event pros",
    href: "/services?category=events-entertainment",
    image: {
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
      width: 960,
      height: 640,
      alt: "Outdoor evening event with lights and tables",
    },
  },
  {
    id: "featured-03",
    title: "Grow your business online",
    description:
      "Hire designers, marketers, and developers with proven results and verified reviews.",
    ctaLabel: "Browse digital experts",
    href: "/services?category=digital-creative",
    image: {
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=960&q=80",
      width: 960,
      height: 640,
      alt: "Creative team working on laptops in a studio",
    },
  },
];

function normalise(text) {
  return text ? text.toLowerCase() : "";
}

function sortListings(listings, sortBy) {
  if (sortBy === "price-low-high") {
    return [...listings].sort((a, b) => a.price - b.price);
  }
  if (sortBy === "price-high-low") {
    return [...listings].sort((a, b) => b.price - a.price);
  }
  if (sortBy === "rating") {
    return [...listings].sort((a, b) => b.rating - a.rating);
  }
  return listings;
}

export async function getServiceCategories() {
  return serviceCategories;
}

export async function getServiceRegions() {
  return serviceRegions;
}

export async function getServiceListings(filters = {}) {
  const {
    query = "",
    category = "",
    subcategory = "",
    region = "",
    area = "",
    sortBy = "featured",
    priceMin = 0,
    priceMax = Number.POSITIVE_INFINITY,
  } = filters;

  const filtered = serviceListings.filter((listing) => {
    const matchesQuery =
      !query ||
      normalise(listing.title).includes(normalise(query)) ||
      normalise(listing.subtitle).includes(normalise(query));

    const matchesCategory = !category || listing.category === category;
    const matchesSubcategory =
      !subcategory || listing.subcategory === subcategory;
    const matchesRegion = !region || listing.region === region;
    const matchesArea = !area || listing.area === area;
    const matchesPrice =
      listing.price >= priceMin && listing.price <= priceMax;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesSubcategory &&
      matchesRegion &&
      matchesArea &&
      matchesPrice
    );
  });

  return sortListings(filtered, sortBy);
}

export async function getFeaturedProviders() {
  return featuredProviders;
}

export async function getServiceBySlug(serviceSlug) {
  console.log("aaaaa Check Service by Slug:", serviceSlug);
  console.log("aaaaa Check Service List:", serviceListings);
  return serviceListings.find((item) => item.slug === serviceSlug) || null;
}

export async function getRelatedServiceListings({
  slug,
  category,
  limit = 4,
} = {}) {
  const related = serviceListings.filter((item) => {
    if (slug && item.slug === slug) {
      return false;
    }
    return category ? item.category === category : true;
  });

  return related.slice(0, limit);
}

export function derivePriceRangeOptions() {
  const prices = serviceListings.map((item) => item.price);
  if (prices.length === 0) {
    return [0, 0];
  }
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return [Math.floor(min / 5) * 5, Math.ceil(max / 5) * 5];
}

export function getPopularTags(limit = 12) {
  const allTags = serviceListings.flatMap((item) => item.tags || []);
  const frequency = allTags.reduce((acc, tag) => {
    const key = normalise(tag);
    if (!key) return acc;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([tag]) => tag);
}

export const SERVICES_MODULE_METADATA = {
  title: "Compare Trusted Services Across New Zealand | Ma3rood Services",
  description:
    "Book trusted tradies, event pros, tutors, and wellness experts. Browse verified reviews, compare quotes, and manage service requests in one place.",
};
