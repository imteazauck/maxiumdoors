import type { ConfiguredDoor, CustomerDetails } from "../context/QuoteContext";

export type CardDetailsInput = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export type DeliveryDetailsInput = {
  addressLine1: string;
  addressLine2: string;
  city: string;
  county: string;
  country: string;
  useParentsPostCode: boolean;
  postCode: string;
  confirmAddress: boolean;
  contactEmail: string;
  contactPhone: string;
  siteContactName: string;
  siteContactPhone: string;
  amDelivery: boolean;
  pre10amDelivery: boolean;
  offloadingAvailable: boolean;
  deliveryMethod: string;
  estimatedDeliveryDate: string;
};

export type CheckoutPayload = {
  quoteRef: string;
  customerDetails: CustomerDetails;
  doors: ConfiguredDoor[];
  subtotal: number;
  deliveryDetails: DeliveryDetailsInput;
  payment: CardDetailsInput;
};

export type OrderConfirmation = {
  orderId: string;
  quoteRef: string;
  createdAt: string;
  customerName: string;
  email: string;
  subtotal: number;
  doorCount: number;
  paymentLast4: string;
};

export async function submitOrder(payload: CheckoutPayload): Promise<OrderConfirmation> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to submit order.");
  }

  return response.json();
}