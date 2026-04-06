export type AdminLoginResponse = {
  token: string;
  username: string;
  expiresAt: string;
};

export type AdminSession = AdminLoginResponse;

export type OrderSummary = {
  id: string;
  orderNumber: string;
  quoteRef: string;
  orderStatus: string;
  paymentStatus: string;
  subtotal: number;
  customerName: string;
  companyName: string;
  customerEmail: string;
  doorCount: number;
  createdAt: string;
  updatedAt: string;
};

export type DoorItem = {
  DoorRef: string;
  Title: string;
  Selections?: Record<string, string> | null;
  UnitPrice: number;
  Quantity: number;
  TechnicalNotes?: string[] | null;
};

export type AdminOrder = {
  id: string;
  partitionKey: string;
  orderNumber: string;
  type: string;
  quoteRef: string;
  customerDetails?: Record<string, string> | null;
  doors: DoorItem[];
  subtotal: number;
  deliveryDetails?: Record<string, string | boolean> | null;
  payment?: {
    cardholderName?: string;
    cardNumber?: string;
    expiry?: string;
    last4?: string;
  } | null;
  orderStatus: string;
  paymentStatus?: string;
  paymentMethod?: string;
  paymentReference?: string;
  amountPaid?: number;
  paidAt?: string;
  completedAt?: string;
  adminNotes?: string;
  lastUpdatedBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type TakePaymentPayload = {
  paymentMethod: string;
  paymentReference: string;
  amountPaid?: number;
  notes: string;
  completeOrder: boolean;
};