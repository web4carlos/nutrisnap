/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import * as AuthApi from "../api/auth";
import type { RegisterRequest, User } from "../api/auth";
import { clearSession, getAccessToken, getRefreshToken, saveSession } from "../api/session";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: RegisterRequest, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string, remember = false): Promise<void> {
    const response = await AuthApi.login({ email: email.trim().toLowerCase(), password });
    saveSession(response.access_token, response.refresh_token, remember);
    setUser(response.user);
  }

  async function register(data: RegisterRequest, remember = true): Promise<void> {
    const normalized = { ...data, email: data.email.trim().toLowerCase() };
    await AuthApi.register(normalized);
    await login(normalized.email, normalized.password, remember);
  }

  async function logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await AuthApi.logout(refreshToken);
    } catch {
      // Local logout still succeeds if the API is unavailable.
    } finally {
      clearSession();
      setUser(null);
    }
  }

  useEffect(() => {
    function expireSession(): void {
      clearSession();
      setUser(null);
      setLoading(false);
    }
    window.addEventListener("auth:session-expired", expireSession);

    async function restoreSession(): Promise<void> {
      if (!getAccessToken() && !getRefreshToken()) {
        setLoading(false);
        return;
      }
      try {
        setUser(await AuthApi.me());
      } catch {
        expireSession();
      } finally {
        setLoading(false);
      }
    }
    void restoreSession();
    return () => window.removeEventListener("auth:session-expired", expireSession);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: user !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
