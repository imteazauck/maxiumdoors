import { clearAdminSession, getAdminSession } from "./session";
import type {
  AdminLoginResponse,
  AdminOrder,
  DoorItem,
  TakePaymentPayload,
} from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:7052/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const session = getAdminSession();

  const headers = new Headers(init?.headers);

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  if (init?.body) {
    headers.set("Content-Type", "application/json");
  }
 console.log(`${API_BASE_URL}${path}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    clearAdminSession();
    throw new Error("Your admin session has expired. Please sign in again.");
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(payload?.error ?? "Request failed.");
  }

  return (await response.json()) as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function mapDoorItem(item: unknown): DoorItem {
  const source = asRecord(item);
  const selections = asRecord(source.Selections ?? source.selections);
  const technicalNotesSource = source.TechnicalNotes ?? source.technicalNotes;

  return {
    DoorRef: asString(source.DoorRef ?? source.doorRef, "—"),
    Title: asString(source.Title ?? source.title, "Untitled door"),
    Selections: Object.fromEntries(
      Object.entries(selections)
        .filter(([key]) => Boolean(key))
        .map(([key, value]) => [key, value == null ? "" : String(value)])
    ),
    UnitPrice: asNumber(source.UnitPrice ?? source.unitPrice),
    Quantity: asNumber(source.Quantity ?? source.quantity, 1),
    TechnicalNotes: Array.isArray(technicalNotesSource)
      ? technicalNotesSource.filter((note): note is string => typeof note === "string")
      : [],
  };
}

function mapAdminOrder(item: unknown): AdminOrder {
  const source = asRecord(item);
  const doorsSource = source.doors ?? source.Doors;

  return {
    id: asString(source.id ?? source.Id),
    partitionKey: asString(source.partitionKey ?? source.PartitionKey),
    orderNumber: asString(source.orderNumber ?? source.OrderNumber),
    type: asString(source.type ?? source.Type),
    quoteRef: asString(source.quoteRef ?? source.QuoteRef),
    customerDetails: asRecord(source.customerDetails ?? source.CustomerDetails) as Record<string, string>,
    doors: Array.isArray(doorsSource) ? doorsSource.map(mapDoorItem) : [],
    subtotal: asNumber(source.subtotal ?? source.Subtotal),
    deliveryDetails: asRecord(source.deliveryDetails ?? source.DeliveryDetails) as Record<string, string | boolean>,
    payment: asRecord(source.payment ?? source.Payment) as AdminOrder["payment"],
    orderStatus: asString(source.orderStatus ?? source.OrderStatus, "pending"),
    paymentStatus: asString(source.paymentStatus ?? source.PaymentStatus, "unpaid"),
    paymentMethod: asString(source.paymentMethod ?? source.PaymentMethod),
    paymentReference: asString(source.paymentReference ?? source.PaymentReference),
    amountPaid: asNumber(source.amountPaid ?? source.AmountPaid),
    paidAt: asString(source.paidAt ?? source.PaidAt),
    completedAt: asString(source.completedAt ?? source.CompletedAt),
    adminNotes: asString(source.adminNotes ?? source.AdminNotes),
    lastUpdatedBy: asString(source.lastUpdatedBy ?? source.LastUpdatedBy),
    createdAt: asString(source.createdAt ?? source.CreatedAt),
    updatedAt: asString(source.updatedAt ?? source.UpdatedAt),
  };
}

export async function loginAdmin(username: string, password: string) {
  return request<AdminLoginResponse>("/backoffice/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchOrders(filters: {
  status?: string;
  paymentStatus?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  if (filters.status) params.set("status", filters.status);
  if (filters.paymentStatus) params.set("paymentStatus", filters.paymentStatus);
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();

  const response = await request<any[]>(
    `/backoffice/orders${query ? `?${query}` : ""}`
  );

  return response.map((item) => ({
    id: item.Id ?? item.id ?? "",
    orderNumber: item.OrderNumber ?? item.orderNumber ?? "",
    quoteRef: item.QuoteRef ?? item.quoteRef ?? "",
    orderStatus: item.OrderStatus ?? item.orderStatus ?? "pending",
    paymentStatus: item.PaymentStatus ?? item.paymentStatus ?? "unpaid",
    subtotal: item.Subtotal ?? item.subtotal ?? 0,
    customerName: item.CustomerName ?? item.customerName ?? "",
    companyName: item.CompanyName ?? item.companyName ?? "",
    customerEmail: item.CustomerEmail ?? item.customerEmail ?? "",
    doorCount: item.DoorCount ?? item.doorCount ?? 0,
    createdAt: item.CreatedAt ?? item.createdAt ?? "",
    updatedAt: item.UpdatedAt ?? item.updatedAt ?? "",
  }));
}

export async function fetchOrder(orderNumber: string) {
  const response = await request<unknown>(`/backoffice/orders/${encodeURIComponent(orderNumber)}`);
  return mapAdminOrder(response);
}

export async function takePayment(orderNumber: string, payload: TakePaymentPayload) {
  const response = await request<unknown>(
    `/backoffice/orders/${encodeURIComponent(orderNumber)}/take-payment`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return mapAdminOrder(response);
}
