/**
 * Layout — main app shell with header and footer.
 * Used by all public-facing and student pages.
 * Admin pages use their own layout.
 */

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useRouterState } from "@tanstack/react-router";
import { GraduationCap, LayoutDashboard, LogIn, UserPlus } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, signOut } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand / Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-primary font-display font-bold text-xl hover:opacity-80 transition-smooth"
            data-ocid="header.logo_link"
          >
            <GraduationCap className="w-6 h-6" />
            <span>SIMS</span>
            <span className="hidden sm:inline text-muted-foreground font-normal text-sm ml-1">
              Student Information
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2" aria-label="Main navigation">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  data-ocid="header.dashboard_link"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                    currentPath === "/dashboard"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  data-ocid="header.logout_button"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  data-ocid="header.login_link"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-smooth ${
                    currentPath === "/login"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link to="/register" data-ocid="header.register_link">
                  <Button size="sm" className="btn-primary">
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* ── Main Content ─────────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="bg-muted/40 border-t border-border py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
