import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type UserRole = "admin" | "reseller";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  resellerId?: string | null;
  displayName: string;
};

type LoginResponse =
  | {
      token: string;
      user: AuthUser;
    }
  | {
      Token: string;
      User: {
        Id: string;
        Email: string;
        Role: UserRole;
        ResellerId?: string | null;
        DisplayName: string;
      };
    };

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const STORAGE_KEY = "maxiumdoors-auth-session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:7052/api";

function normaliseLoginResponse(data: LoginResponse): { token: string; user: AuthUser } | null {
  if ("token" in data && "user" in data) {
    return {
      token: data.token,
      user: data.user,
    };
  }

  if ("Token" in data && "User" in data) {
    return {
      token: data.Token,
      user: {
        id: data.User.Id,
        email: data.User.Email,
        role: data.User.Role,
        resellerId: data.User.ResellerId ?? null,
        displayName: data.User.DisplayName,
      },
    };
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { token: string | null; user: AuthUser | null };
      setToken(parsed.token ?? null);
      setUser(parsed.user ?? null);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  async function login(email: string, password: string): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok) {
      let message = "Login failed.";

      if (contentType.includes("application/json")) {
        const data = await response.json().catch(() => null);
        message =
          data?.error ??
          data?.Error ??
          data?.message ??
          data?.Message ??
          message;
      } else {
        const text = await response.text().catch(() => "");
        if (text) {
          message = text.slice(0, 200);
        }
      }

      throw new Error(message);
    }

    if (!contentType.includes("application/json")) {
      throw new Error("Login response was not JSON.");
    }

    const data = (await response.json()) as LoginResponse;
    const normalised = normaliseLoginResponse(data);

    if (!normalised) {
      throw new Error("Login response format was not recognised.");
    }

    setToken(normalised.token);
    setUser(normalised.user);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: normalised.token,
        user: normalised.user,
      })
    );

    return normalised.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}