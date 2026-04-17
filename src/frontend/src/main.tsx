/**
 * main.tsx — Application entry point.
 * Sets up React root with all global providers:
 * - QueryClientProvider: React Query for data fetching
 * - InternetIdentityProvider: Internet Computer authentication
 */

import { InternetIdentityProvider } from "@caffeineai/core-infrastructure";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Allow BigInt values to be serialized to JSON (required for IC calls)
BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Configure React Query with sensible defaults for IC canister calls
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Canister data doesn't go stale as quickly as REST APIs
      staleTime: 30_000,
      // Retry once on failure (IC can have transient network issues)
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);
