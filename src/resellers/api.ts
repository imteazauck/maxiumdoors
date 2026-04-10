const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:7052/api";

const STORAGE_KEY = "maxiumdoors-auth-session";

type StoredSession = {
  token: string | null;
};

export type ResellerCredentialStatus = {
  resellerId: string;
  loginEnabled: boolean;
  loginEmail: string;
  hasPassword: boolean;
  passwordLastSetAt: string | null;
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
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  if (init?.body) {
    headers.set("Content-Type", "application/json");
  }

  headers.set("Accept", "application/json");

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
        "Request failed."
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export async function fetchResellerCredentialStatus(resellerId: string) {
  const response = await request<unknown>(`/backoffice/resellers/${encodeURIComponent(resellerId)}/credentials`);
  const source = asRecord(response);

  return {
    resellerId,
    loginEnabled: asBoolean(source.loginEnabled ?? source.LoginEnabled, false),
    loginEmail: asString(source.loginEmail ?? source.LoginEmail),
    hasPassword: asBoolean(source.hasPassword ?? source.HasPassword, false),
    passwordLastSetAt: asString(source.passwordLastSetAt ?? source.PasswordLastSetAt) || null,
  } satisfies ResellerCredentialStatus;
}

export async function upsertResellerCredentials(input: {
  resellerId: string;
  loginEnabled: boolean;
  loginEmail: string;
  password?: string;
}) {
  const response = await request<unknown>(`/backoffice/resellers/${encodeURIComponent(input.resellerId)}/credentials`, {
    method: "POST",
    body: JSON.stringify({
      resellerId: input.resellerId,
      loginEnabled: input.loginEnabled,
      loginEmail: input.loginEmail,
      password: input.password,
    }),
  });

  const source = asRecord(response);

  return {
    resellerId: input.resellerId,
    loginEnabled: asBoolean(source.loginEnabled ?? source.LoginEnabled, input.loginEnabled),
    loginEmail: asString(source.loginEmail ?? source.LoginEmail, input.loginEmail),
    hasPassword: asBoolean(source.hasPassword ?? source.HasPassword, Boolean(input.password)),
    passwordLastSetAt: asString(source.passwordLastSetAt ?? source.PasswordLastSetAt) || null,
  } satisfies ResellerCredentialStatus;
}
