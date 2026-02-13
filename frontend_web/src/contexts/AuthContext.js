import React, { createContext, useContext, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "../api/client";

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides auth token and helpers to login/logout across the app. */
  const [token, setTokenState] = useState(getToken());

  const value = useMemo(() => {
    return {
      token,
      isAuthenticated: Boolean(token),
      loginWithToken: (newToken) => {
        setToken(newToken);
        setTokenState(newToken);
      },
      logout: () => {
        clearToken();
        setTokenState(null);
      },
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access auth context. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
