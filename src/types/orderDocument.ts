import type {
  BillingAddressDto,
  CustomerDetailsDto,
  PaymentDto,
  QuoteItemDto,
} from "./orderDtos";

export type OrderDocument = {
  id: string;
  partitionKey: string;
  orderNumber: string;
  type: "order";
  customer: CustomerDetailsDto;
  billingAddress: BillingAddressDto;
  items: QuoteItemDto[];
  subtotal: number;
  deliveryCharge: number;
  vat: number;
  total: number;
  currency: string;
  notes?: string;
  payment: PaymentDto;
  orderStatus: "pending" | "confirmed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};
