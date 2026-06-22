export const WHATSAPP_NUMBER = "919988719133";
export const WHATSAPP_DISPLAY = "+91 99887 19133";
export const COMPANY_NAME = "Sri Durga Ji Food Industries";
export const COMPANY_TAGLINE = "Industrial Flour Manufacturer • Maida, Suji, Atta & Wheat Bran";
export const COMPANY_EMAIL = "info@sridurgajifoods.com";
export const COMPANY_ADDRESS =
  "Industrial Area, Phase II, Ludhiana, Punjab 141003, India";

export const waLink = (text?: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "Leadership", href: "#founder" },
  { label: "Contact", href: "#contact" },
];

// Industrial / manufacturing photography only
export const HERO_SLIDES = [
  {
    eyebrow: "Flour Manufacturing Plant",
    title: "Industrial-Scale Milling",
    desc: "A modern roller-flour mill in Ludhiana producing Maida, Suji, Atta and Wheat Bran for distributors, wholesalers and large-volume buyers across India.",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Wheat Sourcing",
    title: "Direct from Punjab Farms",
    desc: "Hand-picked wheat sourced from verified Punjab growers — cleaned, tempered and milled under strict food-safety controls.",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Packaging & Despatch",
    title: "Bulk Supply, Sealed Quality",
    desc: "Automated packaging lines fill, weigh and seal food-grade bags — from 1 kg consumer packs to 50 kg HDPE sacks.",
    image:
      "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1600&q=80",
  },
];

export const PRODUCTS = [
  {
    name: "Maida (Refined Flour)",
    rate: "₹38 / kg",
    image:
      "https://images.unsplash.com/photo-1612257999691-c5680bdfc1b8?auto=format&fit=crop&w=900&q=80",
    usps: ["Double-sifted", "Bakery & B2B grade", "Uniform granulation"],
    ingredients: ["100% refined wheat", "No bleaching agents", "Mill-direct dispatch"],
  },
  {
    name: "Suji (Semolina)",
    rate: "₹42 / kg",
    image:
      "https://images.unsplash.com/photo-1568717264143-3673f3f8d6c0?auto=format&fit=crop&w=900&q=80",
    usps: ["Even granulation", "High yield", "Bulk packs"],
    ingredients: ["Durum / hard wheat semolina", "Clean separation", "Sun-conditioned"],
  },
  {
    name: "Wheat Bran",
    rate: "₹28 / kg",
    image:
      "https://images.unsplash.com/photo-1535912559178-bc1c8d2ef8ec?auto=format&fit=crop&w=900&q=80",
    usps: ["High fibre", "Feed & food grade", "Cold-milled"],
    ingredients: ["Outer wheat bran", "Naturally separated", "No preservatives"],
  },
  {
    name: "Atta (Whole Wheat)",
    rate: "₹46 / kg",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
    usps: ["Chakki-fresh", "Whole wheat", "Soft rotis"],
    ingredients: ["100% whole wheat", "Bran retained", "Stone-milled"],
  },
];

export const OFFERS = [
  { title: "Bulk Order Discount", desc: "Save up to 12% on confirmed orders above 500 kg.", tag: "Wholesale" },
  { title: "Dealer Pricing", desc: "Slab-based MOQ pricing for registered distributors.", tag: "Partner" },
  { title: "Annual Contracts", desc: "Locked-rate annual supply contracts for HoReCa & FMCG buyers.", tag: "B2B" },
  { title: "Pan-India Logistics", desc: "Door delivery and FOR-destination quotes on demand.", tag: "Delivery" },
];

export const SERVICES = [
  { icon: "Factory", title: "Flour Manufacturing", desc: "Automated roller-mill plant producing 200+ MT daily across multiple SKUs." },
  { icon: "Truck", title: "Bulk Distribution", desc: "FTL & part-load dispatch across 12+ states in food-grade packaging." },
  { icon: "Warehouse", title: "Warehousing", desc: "Climate-controlled warehouses and silo storage for finished goods." },
  { icon: "Package", title: "Contract Packaging", desc: "Private label and co-pack from 1 kg pouches to 50 kg HDPE sacks." },
  { icon: "FlaskConical", title: "Quality Laboratory", desc: "In-house lab — moisture, gluten, ash, granulation per batch." },
  { icon: "ClipboardCheck", title: "Compliance & Audits", desc: "FSSAI certified plant; ready for buyer audits and FMCG vendor onboarding." },
];

export const PRESIDENTS = [
  {
    name: "Sh. Rajesh Kumar",
    role: "Working President — Operations",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80",
    desc: "25+ years in flour milling. Heads plant operations, wheat procurement and quality assurance.",
  },
  {
    name: "Sh. Anil Sharma",
    role: "Working President — Sales & Distribution",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    desc: "Built the company's pan-India dealer and wholesale network across 12 states.",
  },
];

export const TESTIMONIALS = [
  { name: "Harpreet Singh", role: "Wholesale Distributor, Amritsar", review: "Consistent batch quality and on-time despatch — we've moved over 8,000 MT through their plant in the last three years.", img: "https://i.pravatar.cc/120?img=12" },
  { name: "Meera Iyer", role: "Procurement, Spice Route Hotels", review: "Their Suji and Maida specs match every audit we run. A reliable B2B supplier for our central kitchens.", img: "https://i.pravatar.cc/120?img=47" },
  { name: "Vinod Aggarwal", role: "Super Stockist, Delhi NCR", review: "Transparent mill-direct pricing and clean documentation. Easiest manufacturer to work with in 18 years of trade.", img: "https://i.pravatar.cc/120?img=33" },
  { name: "Rakesh Mehta", role: "Retail Chain Buyer, Jaipur", review: "Their wheat bran and atta packaging hold up perfectly in transit. Zero quality complaints from our outlets.", img: "https://i.pravatar.cc/120?img=15" },
  { name: "Sunita Devi", role: "FMCG Co-pack Client", review: "We co-pack our private-label atta here — the plant runs to spec, every run.", img: "https://i.pravatar.cc/120?img=49" },
];

export const SOCIAL = [
  { name: "Facebook", url: "https://facebook.com/sridurgajifoods", icon: "Facebook" },
  { name: "Instagram", url: "https://instagram.com/sridurgajifoods", icon: "Instagram" },
  { name: "LinkedIn", url: "https://linkedin.com/company/sridurgajifoods", icon: "Linkedin" },
  { name: "WhatsApp", url: `https://wa.me/${WHATSAPP_NUMBER}`, icon: "MessageCircle" },
];

export const WHY_US = [
  { icon: "Wheat", title: "Premium Raw Material", desc: "Hand-picked Punjab wheat from trusted farms." },
  { icon: "Cog", title: "Advanced Machinery", desc: "Modern roller mills, automated sifters and pneumatic conveyance." },
  { icon: "Sparkles", title: "Hygienic Processing", desc: "FSSAI-certified plant with zero human contact on the line." },
  { icon: "Clock", title: "Timely Despatch", desc: "98% on-time despatch record across India." },
  { icon: "BadgePercent", title: "Mill-Direct Pricing", desc: "Transparent quotes with no intermediary margins." },
  { icon: "ShieldCheck", title: "Trusted Manufacturer", desc: "30+ years of consistent industrial flour supply." },
];

export const STATS = [
  { k: "30+", v: "Years Experience" },
  { k: "5000+", v: "Tons Annual Production" },
  { k: "1000+", v: "Dealers Served" },
  { k: "50+", v: "Cities Covered" },
];

export const TRUST_BADGES = [
  "ISO Certified",
  "FSSAI Licensed",
  "Hygienic Processing",
  "Trusted Manufacturer",
];
