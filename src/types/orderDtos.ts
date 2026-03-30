export type CustomerDetailsDto = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
};

export type BillingAddressDto = {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
};

export type QuoteItemDto = {
  id: string;
  productId?: string;
  quoteRef?: string;
  doorRef?: string;
  name: string;
  colour?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  details: string[];
};

export type PaymentDto = {
  provider: "stripe" | "worldpay" | "opayo" | "manual" | "unknown";
  paymentIntentId?: string;
  transactionId?: string;
  status: "pending" | "authorised" | "paid" | "failed";
  amount: number;
  currency: string;
  cardLast4?: string;
  cardBrand?: string;
};

export type CreateOrderRequestDto = {
  customer: CustomerDetailsDto;
  billingAddress: BillingAddressDto;
  items: QuoteItemDto[];
  subtotal: number;
  deliveryCharge: number;
  vat: number;
  total: number;
  notes?: string;
  payment: PaymentDto;
};

export type CreateOrderResponseDto = {
  id: string;
  orderNumber: string;
  status: "pending" | "confirmed" | "failed";
  createdAt: string;
};
