import type { OrderConfirmation } from "../services/orderApi";

export type CheckoutPayload = {
  quoteRef: string;
  customerDetails: {
    customerName: string;
    companyName?: string;
    email: string;
    phone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postcode: string;
  };
  doors: Array<{
    doorRef: string;
    title: string;
    unitPrice: number;
    quantity: number;
    technicalNotes?: string[];
    selections?: Record<string, string>;
  }>;
  subtotal: number;
  deliveryDetails: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    county?: string;
    country: string;
    postCode: string;
    estimatedDeliveryDate?: string;
    deliveryMethod?: string;
    contactEmail?: string;
    contactPhone?: string;
    siteContactName?: string;
    siteContactPhone?: string;
  };
};

export type OrderConfirmationEmailPayload = {
  to: string;
  subject: string;
  customerName: string;
  orderNumber: string;
  quoteRef: string;
  createdAt: string;
  status: string;
  subtotal: number;
  deliveryAddress: string[];
  items: Array<{
    doorRef: string;
    title: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export function mapOrderConfirmationEmailPayload(
  checkout: CheckoutPayload,
  confirmation: OrderConfirmation
): OrderConfirmationEmailPayload {
  return {
    to: checkout.customerDetails.email,
    subject: `Order Confirmation - ${confirmation.orderNumber}`,
    customerName: checkout.customerDetails.customerName,
    orderNumber: confirmation.orderNumber,
    quoteRef: confirmation.quoteRef,
    createdAt: confirmation.createdAt,
    status: confirmation.status,
    subtotal: checkout.subtotal,
    deliveryAddress: [
      checkout.deliveryDetails.addressLine1,
      checkout.deliveryDetails.addressLine2,
      checkout.deliveryDetails.city,
      checkout.deliveryDetails.county,
      checkout.deliveryDetails.postCode,
      checkout.deliveryDetails.country,
    ].filter(Boolean) as string[],
    items: checkout.doors.map((door) => ({
      doorRef: door.doorRef,
      title: door.title,
      quantity: door.quantity,
      unitPrice: door.unitPrice,
      lineTotal: door.quantity * door.unitPrice,
    })),
  };
}