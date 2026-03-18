export type Product = {
  id: string;
  slug: string;
  name: string;
  price: string;
  basePrice: number;
  category: string;
  shortDescription: string;
  longDescription: string;
  specs: { label: string; value: string }[];
  reviews: { author: string; rating: number; text: string }[];
  galleryType: "single" | "double";
  badge?: string;
};

export type TabKey = "description" | "specs" | "reviews";

export type ColourOption = {
  name: string;
  swatch: string;
  frameClass: string;
};

export const products: Product[] = [
  {
    id: "f3",
    slug: "double-door-f3",
    name: "Double Door (F3)",
    price: "£2,250.00 – £2,800.00",
    basePrice: 2250,
    category: "Double doors",
    shortDescription:
      "Slim steel double doors with balanced glazing bars and a minimal-frame look.",
    longDescription:
      "The F3-inspired double door layout is designed for bright internal spaces where you want strong sightlines, a steel-framed aesthetic, and a more architectural feel. This version is built as a shop-ready product page with selectable sizing, colours, tabs, and a responsive ecommerce layout.",
    specs: [
      { label: "Configuration", value: "Double door" },
      { label: "Application", value: "Internal steel-style door" },
      { label: "Glazing style", value: "Slim glazing bars" },
      { label: "Finish", value: "Powder-coated style colour options" },
    ],
    reviews: [
      { author: "A. Turner", rating: 5, text: "Great proportions and a clean industrial look." },
      { author: "L. Shah", rating: 5, text: "Works well as a hero product card on both desktop and mobile." },
    ],
    galleryType: "double",
    badge: "Best seller",
  },
  {
    id: "f4",
    slug: "single-door-f4",
    name: "Single Door (F4)",
    price: "£1,200.00 – £1,550.00",
    basePrice: 1200,
    category: "Single doors",
    shortDescription:
      "A single slim steel-style door concept with clean lines and a contemporary internal look.",
    longDescription:
      "The F4-inspired single door is positioned as a versatile option for interior partitions, home offices, and feature openings. In this React version it sits inside a WooCommerce-style layout with gallery thumbnails, a basic configurator, responsive summary cards, and tabbed product information.",
    specs: [
      { label: "Configuration", value: "Single door" },
      { label: "Application", value: "Internal steel-style door" },
      { label: "Maximum width", value: "Up to 1100 mm per leaf" },
      { label: "Style", value: "Minimal frame with glazing bars" },
    ],
    reviews: [
      { author: "M. Green", rating: 5, text: "Simple, elegant, and easy to compare against the double-door option." },
      { author: "J. Collins", rating: 4, text: "The configurator makes the page feel much more complete." },
    ],
    galleryType: "single",
    badge: "New",
  },
  {
    id: "louvre",
    slug: "steel-louvre-door",
    name: "Steel Louvre Door",
    price: "£630.00",
    basePrice: 630,
    category: "Trade doors",
    shortDescription:
      "A simpler trade-style steel door card for extending the catalogue beyond the hero products.",
    longDescription:
      "This placeholder catalogue item gives the storefront a broader product range and helps the shop page feel more complete. It can later be replaced with live imported data, images, and product specifications.",
    specs: [
      { label: "Configuration", value: "Single trade door" },
      { label: "Style", value: "Louvre panel" },
      { label: "Use case", value: "Utility and service areas" },
      { label: "Availability", value: "Online order" },
    ],
    reviews: [{ author: "D. Moss", rating: 4, text: "Useful extra product type for the storefront layout." }],
    galleryType: "single",
  },
  {
    id: "personnel",
    slug: "steel-personnel-door",
    name: "Steel Personnel Door",
    price: "£355.00",
    basePrice: 355,
    category: "Trade doors",
    shortDescription:
      "An entry-level catalogue item to mirror a broader ecommerce trade-door range.",
    longDescription:
      "This product adds depth to the shop archive and demonstrates how smaller catalogue items can sit alongside higher-end glazed internal steel doors.",
    specs: [
      { label: "Configuration", value: "Single personnel door" },
      { label: "Use case", value: "Back-of-house and service access" },
      { label: "Material style", value: "Steel trade door" },
      { label: "Ordering", value: "Online enquiry or direct purchase" },
    ],
    reviews: [{ author: "R. Fox", rating: 4, text: "Good placeholder item for rounding out the shop page." }],
    galleryType: "single",
  },
];

export const colourOptions: ColourOption[] = [
  { name: "Jet Black", swatch: "#171717", frameClass: "border-zinc-900 bg-zinc-900" },
  { name: "Anthracite", swatch: "#3f3f46", frameClass: "border-zinc-700 bg-zinc-700" },
  { name: "White", swatch: "#f5f5f5", frameClass: "border-zinc-300 bg-zinc-100" },
];

export const featuredProducts = products.slice(0, 2);
export const shopProducts = products;

export function renderStars(rating: number) {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}