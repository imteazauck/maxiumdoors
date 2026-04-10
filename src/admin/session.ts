export type UserRole = "admin" | "reseller";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  displayName?: string;
  resellerId?: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

const STORAGE_KEY = "maxiumdoors-auth-session";

export function getAuthSession(): AuthSession | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  localStorage.removeItem(STORAGE_KEY);
}