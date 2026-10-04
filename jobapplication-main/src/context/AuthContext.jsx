import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../api/auth";
import { tokens } from "../api/client";

const AuthContext = createContext(null);

/** Holds "who is logged in" for the whole app. Wrap the app in it once (see App.jsx). */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // If tokens are saved from a previous visit, ask the backend who they belong to before
  // deciding whether the visitor is logged in.
  const [initializing, setInitializing] = useState(() => Boolean(tokens.access || tokens.refresh));

  useEffect(() => {
    if (!initializing) return undefined;
    let cancelled = false;
    authApi
      .getMe()
      .then((me) => !cancelled && setUser(me))
      .catch(() => {})
      .finally(() => !cancelled && setInitializing(false));
    return () => {
      cancelled = true;
    };
  }, [initializing]);

  // The API client fires this if a refresh token turns out to be expired/revoked.
  useEffect(() => {
    const onExpired = () => setUser(null);
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const login = useCallback(async (credentials) => {
    const me = await authApi.login(credentials);
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (details) => {
    const me = await authApi.register(details);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await authApi.logout();
  }, []);

  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing, login, register, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
