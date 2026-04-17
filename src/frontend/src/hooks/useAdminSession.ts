/**
 * useAdminSession hook — manages admin authentication state.
 * Admin sessions are stored in localStorage using a session token
 * that is issued by the backend after successful admin login.
 */

import type { SessionToken } from "@/types";
import { useCallback, useState } from "react";

const ADMIN_TOKEN_KEY = "sims_admin_token";

export function useAdminSession() {
  // Initialize state from localStorage so it survives page refreshes
  const [token, setToken] = useState<SessionToken | null>(() => {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  });

  /** Whether an admin is currently logged in */
  const isAdminAuthenticated = token !== null && token.length > 0;

  /**
   * Save a session token after successful admin login.
   * Persists to localStorage so the session survives page refresh.
   */
  const saveToken = useCallback((newToken: SessionToken) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, newToken);
    setToken(newToken);
  }, []);

  /**
   * Clear the admin session — used when logging out.
   */
  const clearToken = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
  }, []);

  return {
    token,
    isAdminAuthenticated,
    saveToken,
    clearToken,
  };
}
