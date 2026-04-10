export type ResellerCredentialSummary = {
  loginEnabled: boolean;
  loginEmail: string;
  hasPassword: boolean;
  passwordLastSetAt: string | null;
};

export type Reseller = {
  id: string;
  companyName: string;
  firstName: string;
  lastName: string;
  businessAddress: string;
  tel: string;
  fax: string;
  mobile: string;
  email: string;
  webAddress: string;
  notes: string;
  isActive: boolean;
  pricingInitialized: boolean;
  sourceTemplateId: string;
  credentials: ResellerCredentialSummary;
  createdAt: string;
  updatedAt: string;
};

export type PricingConfiguration = "single" | "double" | "both";

export type ResellerPricingItem = MatrixPricingRow | OptionPricingRow;

export type MatrixPricingRow = {
  id: string;
  resellerId: string;
  type: "matrixRow";
  sourceTemplateId: string;
  doorCategory: string;
  configuration: Exclude<PricingConfiguration, "both">;
  heightMin: number;
  heightMax: number;
  widthMin: number;
  widthMax: number;
  price: number;
  currency: "GBP";
  createdAt: string;
  updatedAt: string;
};

export type OptionPricingRow = {
  id: string;
  resellerId: string;
  type: "optionRow";
  sourceTemplateId: string;
  group: string;
  label: string;
  configuration: PricingConfiguration;
  widthMin?: number;
  widthMax?: number;
  price: number;
  currency: "GBP";
  createdAt: string;
  updatedAt: string;
};

export type ResellerFormValues = Omit<
  Reseller,
  "id" | "isActive" | "pricingInitialized" | "sourceTemplateId" | "createdAt" | "updatedAt" | "credentials"
>;

export type PricingTemplateRow =
  | Omit<MatrixPricingRow, "id" | "resellerId" | "createdAt" | "updatedAt">
  | Omit<OptionPricingRow, "id" | "resellerId" | "createdAt" | "updatedAt">;
