export type DoorMode = "single" | "double";

export type MatrixBand = {
  code: string;
  widthMin: number;
  widthMax: number;
  heightMin?: number;
  heightMax?: number;
  basePrice: number;
};

export type MatrixOptionCategory = "vision" | "louvre" | "hardware" | "accessory";

export type MatrixOption = {
  id: string;
  category: MatrixOptionCategory;
  label: string;
  price: number;
  priceModel?: "each" | "pair" | "leaf";
};

export type ConfigurationDrawing = {
  id: string;
  configurationCode: string;
  imageUrl: string;
  alt: string;
};

export type ProductPricingMatrix = {
  id: string;
  productSlug: string;
  title: string;
  fireRated: boolean;
  latchType: "latched" | "unlatched";
  mode: DoorMode;
  bands: MatrixBand[];
  options: MatrixOption[];
  drawings: ConfigurationDrawing[];
  currency: "GBP";
  vatMode: "ex_vat" | "inc_vat";
};