export const WHATSAPP_NUMBER = "919988719133";
export const WHATSAPP_DISPLAY = "+91 99887 19133";
export const COMPANY_NAME = "Sri Durga Ji Food Industries";
export const COMPANY_TAGLINE = "Premium Flour Mill • Trusted Since Generations";
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
  { label: "Founder", href: "#founder" },
  { label: "Contact", href: "#contact" },
];

export const HERO_SLIDES = [
  {
    eyebrow: "Signature Range",
    title: "Premium Maida",
    desc: "Silken-fine, double-sifted refined flour milled for bakers, hotels and fine kitchens.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Stone-Ground Goodness",
    title: "Quality Suji",
    desc: "Golden, evenly-granulated semolina — the foundation of every authentic upma, halwa and pasta.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1600&q=80",
  },
  {
    eyebrow: "Pure Fibre",
    title: "Wheat Bran & Atta",
    desc: "Nutrient-rich bran and chakki-fresh atta from hand-picked Punjab wheat.",
    image:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80",
  },
];

export const PRODUCTS = [
  {
    name: "Premium Maida",
    rate: "₹38 / kg",
    image:
      "https://images.unsplash.com/photo-1612257999691-c5680bdfc1b8?auto=format&fit=crop&w=900&q=80",
    usps: ["Double-sifted", "Bakery grade", "Uniform texture"],
    ingredients: ["100% Refined Wheat", "No bleaching agents", "Zero additives"],
  },
  {
    name: "Golden Suji",
    rate: "₹42 / kg",
    image:
      "https://images.unsplash.com/photo-1568717264143-3673f3f8d6c0?auto=format&fit=crop&w=900&q=80",
    usps: ["Even granulation", "Rich aroma", "High yield"],
    ingredients: ["Durum wheat semolina", "Stone-ground", "Sun-dried"],
  },
  {
    name: "Wheat Bran",
    rate: "₹28 / kg",
    image:
      "https://images.unsplash.com/photo-1565525112322-6e69b9b0eae8?auto=format&fit=crop&w=900&q=80",
    usps: ["High fibre", "Cattle & bakery use", "Cold-milled"],
    ingredients: ["Outer wheat bran", "Naturally separated", "No preservatives"],
  },
  {
    name: "Chakki Fresh Atta",
    rate: "₹46 / kg",
    image:
      "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=900&q=80",
    usps: ["Soft rotis", "Whole wheat", "Chakki-fresh"],
    ingredients: ["100% whole wheat", "Bran retained", "Stone-milled"],
  },
];

export const OFFERS = [
  { title: "Bulk Order Discount", desc: "Save up to 12% on orders above 500 kg.", tag: "Wholesale" },
  { title: "Dealer Pricing", desc: "Special MOQ-based pricing for registered dealers.", tag: "Partner" },
  { title: "Festival Combo", desc: "Maida + Suji + Atta combo at celebration rates.", tag: "Seasonal" },
  { title: "Free Logistics", desc: "Door delivery within 200km on confirmed bulk orders.", tag: "Delivery" },
];

export const SERVICES = [
  { icon: "Factory", title: "Flour Manufacturing", desc: "State-of-the-art roller mills producing 200+ MT daily." },
  { icon: "Truck", title: "Bulk Supply", desc: "Pan-India bulk despatch in sealed food-grade packaging." },
  { icon: "Store", title: "Wholesale Distribution", desc: "Dealer & distributor network across 12 states." },
  { icon: "Package", title: "Custom Packaging", desc: "Private label & co-pack from 1kg pouches to 50kg sacks." },
  { icon: "FlaskConical", title: "Quality Testing", desc: "In-house lab — moisture, gluten, ash content checked per batch." },
  { icon: "MapPin", title: "Logistics Support", desc: "Tracked dispatch with same-day loading slots." },
];

export const PRESIDENTS = [
  {
    name: "Sh. Rajesh Kumar",
    role: "Working President",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80",
    desc: "Twenty-five years of milling expertise. Leads operations, sourcing and quality across all plants.",
  },
  {
    name: "Sh. Anil Sharma",
    role: "Working President",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    desc: "Heads distribution and dealer relationships. Built the brand's pan-India wholesale footprint.",
  },
];

export const TESTIMONIALS = [
  { name: "Harpreet Singh", role: "Owner, Royal Bakers", review: "The maida quality is unmatched. Every batch is identical — our croissants finally have the texture we wanted.", img: "https://i.pravatar.cc/120?img=12" },
  { name: "Meera Iyer", role: "Chef, Spice Route Hotel", review: "Suji from Sri Durga Ji is our go-to for fine-dining halwa. Aroma and granulation are exceptional.", img: "https://i.pravatar.cc/120?img=47" },
  { name: "Vinod Aggarwal", role: "Distributor, Delhi NCR", review: "Reliable supply, transparent pricing, on-time dispatch. Best mill partner in 18 years of trade.", img: "https://i.pravatar.cc/120?img=33" },
  { name: "Sunita Devi", role: "Home Baker", review: "I switched to their chakki atta and my rotis stay soft for hours. Truly chakki-fresh.", img: "https://i.pravatar.cc/120?img=49" },
  { name: "Rakesh Mehta", role: "Owner, Mehta Sweets", review: "Their wheat bran is perfectly cold-milled. We use it for laddoos and the response has been brilliant.", img: "https://i.pravatar.cc/120?img=15" },
];

export const SOCIAL = [
  { name: "Facebook", url: "https://facebook.com/sridurgajifoods", icon: "Facebook" },
  { name: "Instagram", url: "https://instagram.com/sridurgajifoods", icon: "Instagram" },
  { name: "YouTube", url: "https://youtube.com/@sridurgajifoods", icon: "Youtube" },
  { name: "LinkedIn", url: "https://linkedin.com/company/sridurgajifoods", icon: "Linkedin" },
  { name: "WhatsApp", url: `https://wa.me/${WHATSAPP_NUMBER}`, icon: "MessageCircle" },
];

export const WHY_US = [
  { icon: "Wheat", title: "Premium Raw Material", desc: "Hand-picked Punjab wheat sourced from trusted farms." },
  { icon: "Cog", title: "Advanced Machinery", desc: "Swiss roller mills and automated sifters." },
  { icon: "Sparkles", title: "Hygienic Processing", desc: "FSSAI-certified plant with zero human contact." },
  { icon: "Clock", title: "Timely Delivery", desc: "98% on-time despatch record across India." },
  { icon: "BadgePercent", title: "Competitive Pricing", desc: "Mill-direct rates with transparent quotes." },
  { icon: "ShieldCheck", title: "Trusted Brand", desc: "Three decades of consistent quality." },
];
