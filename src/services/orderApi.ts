const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:7052/api";

const STORAGE_KEY = "maxiumdoors-auth-session";

function getStoredToken() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { token?: string | null };
    return parsed.token ?? null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

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

export type CustomerDetailsInput = {
  customerName: string;
  companyName?: string;
  email: string;
  phone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postcode: string;
};

export type DoorSelectionsInput = {
  leafType?: string;
  handing?: string;
  structuralHeight?: string;
  structuralWidth?: string;
  doorType?: string;
  lockType?: string;
  colour?: string;
};

export type DoorInput = {
  doorRef: string;
  title: string;
  selections: DoorSelectionsInput;
  unitPrice: number;
  quantity: number;
  technicalNotes: string[];
};

export type CheckoutPayload = {
  quoteRef: string;
  customerDetails: CustomerDetailsInput;
  doors: DoorInput[];
  subtotal: number;
  deliveryDetails: DeliveryDetailsInput;
  payment: CardDetailsInput;
};

export type OrderConfirmation = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  quoteRef: string;
  message: string;
};

export async function submitOrder(payload: CheckoutPayload): Promise<OrderConfirmation> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = getStoredToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to submit order.");
  }

  return response.json();
}
