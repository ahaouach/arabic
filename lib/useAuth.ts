"use client";

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  // undefined = still loading, null = not logged in, AuthUser = logged in
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  const refresh = useCallback(() => {
    fetch("/api/auth/me", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });
    setUser(null);
    window.location.href = "/";
  }, []);

  return { user, loading: user === undefined, refresh, logout };
}
