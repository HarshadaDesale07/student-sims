/**
 * useAuth hook — wraps Internet Identity for student authentication.
 * Provides login, logout, and current identity state.
 */

import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  /** Whether the user is currently logged in */
  const isAuthenticated = loginStatus === "success" && identity !== null;

  /** Whether authentication is being checked/loading */
  const isLoading =
    loginStatus === "initializing" || loginStatus === "logging-in";

  /** Trigger Internet Identity login flow */
  const signIn = () => login();

  /** Log out the current user */
  const signOut = () => clear();

  return {
    isAuthenticated,
    isLoading,
    identity,
    loginStatus,
    signIn,
    signOut,
  };
}
