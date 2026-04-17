/**
 * App.tsx — Router configuration and provider setup for SIMS.
 * All routes are defined here. Pages are lazy-loaded for performance.
 */

import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// Page imports
import HomePage from "./pages/HomePage";

import { Skeleton } from "@/components/ui/skeleton";
// Lazy-loaded pages (will be created by subsequent agents)
import { Suspense, lazy } from "react";

const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));

import { AdminProtectedRoute } from "./components/AdminProtectedRoute";
// Protected route wrappers
import { ProtectedRoute } from "./components/ProtectedRoute";

/** Full-screen loading fallback for lazy-loaded pages */
function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="space-y-3 w-64">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-3/5" />
      </div>
    </div>
  );
}

// ── Route Definitions ──────────────────────────────────────────

/** Root route — wraps all pages with Suspense */
const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

/** Public home page — redirects authenticated students to /dashboard */
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

/** Student registration page */
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <RegisterPage />
    </Suspense>
  ),
});

/** Student login page (Internet Identity) */
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <LoginPage />
    </Suspense>
  ),
});

/** Student dashboard — protected, requires Internet Identity login */
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <DashboardPage />
      </Suspense>
    </ProtectedRoute>
  ),
});

/** Admin login page — separate from student login */
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminLoginPage />
    </Suspense>
  ),
});

/** Admin dashboard — protected, requires valid session token */
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: () => (
    <AdminProtectedRoute>
      <Suspense fallback={<PageLoader />}>
        <AdminDashboardPage />
      </Suspense>
    </AdminProtectedRoute>
  ),
});

// ── Router ─────────────────────────────────────────────────────

const routeTree = rootRoute.addChildren([
  homeRoute,
  registerRoute,
  loginRoute,
  dashboardRoute,
  adminLoginRoute,
  adminDashboardRoute,
]);

const router = createRouter({ routeTree });

// Required for TypeScript type safety with TanStack Router
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ── Root App Component ──────────────────────────────────────────

export default function App() {
  return <RouterProvider router={router} />;
}
