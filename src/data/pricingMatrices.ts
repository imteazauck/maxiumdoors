import type { ProductPricingMatrix } from "./pricingTypes";

export const pricingMatrices: ProductPricingMatrix[] = [
  {
    id: "single-door-f4-unlatched",
    productSlug: "single-door-f4",
    title: "Non Fire-rated Doors (Unlatched)",
    fireRated: false,
    latchType: "unlatched",
    mode: "single",
    currency: "GBP",
    vatMode: "ex_vat",
    bands: [
      { code: "900-1000", widthMin: 900, widthMax: 1000, basePrice: 647.7 },
      { code: "1001-1100", widthMin: 1001, widthMax: 1100, basePrice: 653.63 },
      { code: "1101-1200", widthMin: 1101, widthMax: 1200, basePrice: 756.14 },
    ],
    options: [
      { id: "vision-406", category: "vision", label: "Vision Panel 406x406", price: 127.56, priceModel: "each" },
      { id: "vision-203x711", category: "vision", label: "Vision Panel 203x711", price: 132.65, priceModel: "each" },
      { id: "vision-203x1168", category: "vision", label: "Vision Panel 203x1168", price: 197.4, priceModel: "each" },
      { id: "vision-203x508", category: "vision", label: "Vision Panel 203x508", price: 125.14, priceModel: "each" },
      { id: "louvre-half", category: "louvre", label: "Louvre Panel Half", price: 236.3, priceModel: "each" },
      { id: "louvre-full", category: "louvre", label: "Louvre Panel Full", price: 388.32, priceModel: "each" },
      { id: "panic-290", category: "hardware", label: "Exidor 290 Panic Hardware", price: 77.26, priceModel: "each" },
      { id: "panic-294", category: "hardware", label: "Exidor 294 Panic Hardware", price: 116.65, priceModel: "each" },
      { id: "keypad-lock", category: "hardware", label: "Digital lock with keypad", price: 423.93, priceModel: "each" },
      { id: "closer-ts4000", category: "accessory", label: "Closer (TS4000)", price: 100.0, priceModel: "each" },
      { id: "selector", category: "accessory", label: "Selector", price: 103.04, priceModel: "each" },
      { id: "door-stay", category: "accessory", label: "Door stay (150 per leaf)", price: 36.89, priceModel: "leaf" },
      { id: "kickplate", category: "accessory", label: "Kickplates (200mm)", price: 27.19, priceModel: "each" },
    ],
    drawings: [
      {
        id: "single-door-f4-900-1000",
        configurationCode: "single-900-1000",
        imageUrl: "/drawings/single-door-f4-900-1000.png",
        alt: "Single door drawing for width band 900 to 1000mm",
      },
      {
        id: "single-door-f4-1001-1100",
        configurationCode: "single-1001-1100",
        imageUrl: "/drawings/single-door-f4-1001-1100.png",
        alt: "Single door drawing for width band 1001 to 1100mm",
      },
    ],
  },
  {
    id: "double-door-f3-unlatched",
    productSlug: "double-door-f3",
    title: "Non Fire-rated Doors (Unlatched)",
    fireRated: false,
    latchType: "unlatched",
    mode: "double",
    currency: "GBP",
    vatMode: "ex_vat",
    bands: [
      { code: "1000-1400", widthMin: 1000, widthMax: 1400, basePrice: 1401.18 },
      { code: "1401-1800", widthMin: 1401, widthMax: 1800, basePrice: 1801.22 },
      { code: "1801-2200", widthMin: 1801, widthMax: 2200, basePrice: 2338.07 },
    ],
    options: [
      { id: "double-vision-406", category: "vision", label: "Vision Panel 406x406", price: 127.56, priceModel: "each" },
      { id: "double-louvre-half", category: "louvre", label: "Louvre Panel Half", price: 236.3, priceModel: "each" },
      { id: "double-panic-290", category: "hardware", label: "Exidor 290 Panic Hardware", price: 77.26, priceModel: "each" },
      { id: "double-closer-ts4000", category: "accessory", label: "Closer (TS4000)", price: 100.0, priceModel: "each" },
    ],
    drawings: [
      {
        id: "double-door-f3-1000-1400",
        configurationCode: "double-1000-1400",
        imageUrl: "/drawings/double-door-f3-1000-1400.png",
        alt: "Double door drawing for width band 1000 to 1400mm",
      },
    ],
  },
];