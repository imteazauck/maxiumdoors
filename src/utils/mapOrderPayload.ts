import type { CartItem } from "../context/CartContext";
import type { CreateOrderRequestDto, QuoteItemDto } from "../types/orderDtos";

export type CheckoutFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  notes?: string;
};

function mapCartItemsToQuoteItems(items: CartItem[]): QuoteItemDto[] {
  return items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quoteRef: item.quoteRef,
    doorRef: item.doorRef,
    name: item.name,
    colour: item.colour,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    lineTotal: item.unitPrice * item.quantity,
    details: item.details ?? [],
  }));
}

export function buildCreateOrderPayload(params: {
  form: CheckoutFormValues;
  cartItems: CartItem[];
  subtotal: number;
  deliveryCharge?: number;
  vat?: number;
  payment?: Partial<CreateOrderRequestDto["payment"]>;
}): CreateOrderRequestDto {
  const deliveryCharge = params.deliveryCharge ?? 0;
  const vat = params.vat ?? 0;
  const total = params.subtotal + deliveryCharge + vat;

  return {
    customer: {
      firstName: params.form.firstName,
      lastName: params.form.lastName,
      email: params.form.email,
      phone: params.form.phone,
    },
    billingAddress: {
      line1: params.form.address1,
      line2: params.form.address2,
      city: params.form.city,
      county: params.form.county,
      postcode: params.form.postcode,
      country: params.form.country,
    },
    items: mapCartItemsToQuoteItems(params.cartItems),
    subtotal: params.subtotal,
    deliveryCharge,
    vat,
    total,
    notes: params.form.notes,
    payment: {
      provider: params.payment?.provider ?? "manual",
      paymentIntentId: params.payment?.paymentIntentId,
      transactionId: params.payment?.transactionId,
      status: params.payment?.status ?? "pending",
      amount: total,
      currency: params.payment?.currency ?? "GBP",
      cardLast4: params.payment?.cardLast4,
      cardBrand: params.payment?.cardBrand,
    },
  };
}
