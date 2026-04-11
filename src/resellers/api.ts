import type {
  Reseller,
  ResellerCredentialSummary,
  ResellerFormValues,
  ResellerPricingItem,
} from './types';

const API_BASE_URL =
  import.meta.env.VITE_RESELLER_API_BASE_URL?.replace(/\/$/, '') ??
   "http://localhost:7052/api";

const STORAGE_KEY = 'maxiumdoors-auth-session';

type StoredSession = {
  token: string | null;
};

function getStoredSession(): StoredSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const session = getStoredSession();
  const headers = new Headers(init?.headers);

  if (session?.token) {
    headers.set('Authorization', `Bearer ${session.token}`);
  }

  if (init?.body) {
    headers.set('Content-Type', 'application/json');
  }

  headers.set('Accept', 'application/json');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; Error?: string; message?: string; Message?: string }
      | null;

    throw new Error(
      payload?.error ??
        payload?.Error ??
        payload?.message ??
        payload?.Message ??
        'Request failed.'
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === 'boolean' ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function mapCredentialSummary(input: unknown): ResellerCredentialSummary {
  const source = asRecord(input);
  return {
    loginEnabled: asBoolean(source.loginEnabled ?? source.LoginEnabled, false),
    loginEmail: asString(source.loginEmail ?? source.LoginEmail),
    hasPassword: asBoolean(source.hasPassword ?? source.HasPassword, false),
    passwordLastSetAt: asString(source.passwordLastSetAt ?? source.PasswordLastSetAt) || null,
  };
}

function mapReseller(input: unknown): Reseller {
  const source = asRecord(input);
  return {
    id: asString(source.id ?? source.Id),
    companyName: asString(source.companyName ?? source.CompanyName),
    firstName: asString(source.firstName ?? source.FirstName),
    lastName: asString(source.lastName ?? source.LastName),
    businessAddress: asString(source.businessAddress ?? source.BusinessAddress),
    tel: asString(source.tel ?? source.Tel),
    fax: asString(source.fax ?? source.Fax),
    mobile: asString(source.mobile ?? source.Mobile),
    email: asString(source.email ?? source.Email),
    webAddress: asString(source.webAddress ?? source.WebAddress),
    notes: asString(source.notes ?? source.Notes),
    isActive: asBoolean(source.isActive ?? source.IsActive, true),
    pricingInitialized: asBoolean(source.pricingInitialized ?? source.PricingInitialized, false),
    sourceTemplateId: asString(source.sourceTemplateId ?? source.SourceTemplateId, 'default'),
    credentials: mapCredentialSummary(source.credentials ?? source.Credentials),
    createdAt: asString(source.createdAt ?? source.CreatedAt),
    updatedAt: asString(source.updatedAt ?? source.UpdatedAt),
  };
}

function mapPricingItem(input: unknown): ResellerPricingItem {
  const source = asRecord(input);
  const type = asString(source.type ?? source.Type) === 'matrixRow' ? 'matrixRow' : 'optionRow';

  if (type === 'matrixRow') {
    return {
      id: asString(source.id ?? source.Id),
      resellerId: asString(source.resellerId ?? source.ResellerId),
      type: 'matrixRow',
      sourceTemplateId: asString(source.sourceTemplateId ?? source.SourceTemplateId, 'default'),
      doorCategory: asString(source.doorCategory ?? source.DoorCategory),
      configuration: asString(source.configuration ?? source.Configuration) === 'double' ? 'double' : 'single',
      heightMin: asNumber(source.heightMin ?? source.HeightMin),
      heightMax: asNumber(source.heightMax ?? source.HeightMax),
      widthMin: asNumber(source.widthMin ?? source.WidthMin),
      widthMax: asNumber(source.widthMax ?? source.WidthMax),
      price: asNumber(source.price ?? source.Price),
      currency: 'GBP',
      createdAt: asString(source.createdAt ?? source.CreatedAt),
      updatedAt: asString(source.updatedAt ?? source.UpdatedAt),
    };
  }

  return {
    id: asString(source.id ?? source.Id),
    resellerId: asString(source.resellerId ?? source.ResellerId),
    type: 'optionRow',
    sourceTemplateId: asString(source.sourceTemplateId ?? source.SourceTemplateId, 'default'),
    group: asString(source.group ?? source.Group),
    label: asString(source.label ?? source.Label),
    configuration: (['single', 'double', 'both'].includes(asString(source.configuration ?? source.Configuration))
      ? asString(source.configuration ?? source.Configuration)
      : 'both') as 'single' | 'double' | 'both',
    widthMin: source.widthMin == null && source.WidthMin == null ? undefined : asNumber(source.widthMin ?? source.WidthMin),
    widthMax: source.widthMax == null && source.WidthMax == null ? undefined : asNumber(source.widthMax ?? source.WidthMax),
    price: asNumber(source.price ?? source.Price),
    currency: 'GBP',
    createdAt: asString(source.createdAt ?? source.CreatedAt),
    updatedAt: asString(source.updatedAt ?? source.UpdatedAt),
  };
}

export async function listResellers() {
  const response = await request<unknown[]>('/backoffice/resellers');
  return response.map(mapReseller);
}

export async function fetchReseller(resellerId: string) {
  const response = await request<unknown>(`/backoffice/resellers/${encodeURIComponent(resellerId)}`);
  return mapReseller(response);
}

export async function createReseller(values: ResellerFormValues) {
  const response = await request<unknown>('/backoffice/resellers', {
    method: 'POST',
    body: JSON.stringify(values),
  });
  return mapReseller(response);
}

export async function updateReseller(resellerId: string, values: ResellerFormValues) {
  const response = await request<unknown>(`/backoffice/resellers/${encodeURIComponent(resellerId)}`, {
    method: 'PUT',
    body: JSON.stringify(values),
  });
  return mapReseller(response);
}

export async function deleteReseller(resellerId: string) {
  await request<void>(`/backoffice/resellers/${encodeURIComponent(resellerId)}`, {
    method: 'DELETE',
  });
}

export async function fetchResellerPricing(resellerId: string) {
  const response = await request<unknown[]>(`/backoffice/resellers/${encodeURIComponent(resellerId)}/pricing`);
  return response.map(mapPricingItem);
}

export async function updatePricingItem(resellerId: string, itemId: string, price: number) {
  const response = await request<unknown>(`/backoffice/resellers/${encodeURIComponent(resellerId)}/pricing/${encodeURIComponent(itemId)}`, {
    method: 'PUT',
    body: JSON.stringify({ price }),
  });
  return mapPricingItem(response);
}

export async function fetchResellerCredentialStatus(resellerId: string) {
  const response = await request<unknown>(`/backoffice/resellers/${encodeURIComponent(resellerId)}/credentials`);
  return mapCredentialSummary(response);
}

export async function upsertResellerCredentials(input: {
  resellerId: string;
  loginEnabled: boolean;
  loginEmail: string;
  password?: string;
}) {
  const response = await request<unknown>(`/backoffice/resellers/${encodeURIComponent(input.resellerId)}/credentials`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  return mapCredentialSummary(response);
}
