/**
 * LoginPage — Student login using Internet Identity.
 * Students authenticate with Internet Identity (decentralized login).
 * After login, they are redirected to /dashboard.
 */

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Fingerprint,
  GraduationCap,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";

// ── Feature highlights shown on the login page ───────────────────

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your identity is secured using Internet Identity — no passwords needed.",
  },
  {
    icon: GraduationCap,
    title: "Student Dashboard",
    desc: "Access your profile, enrollment details, and academic info.",
  },
  {
    icon: Fingerprint,
    title: "One-Click Login",
    desc: "Use biometrics or your device PIN for instant, secure sign-in.",
  },
];

// ── Page Component ────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, loginStatus, signIn } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);

  // Determine if we are mid-login flow
  const isLoggingIn = loginStatus === "logging-in";

  // Show error only when login was explicitly attempted and failed
  // "loginError" is the only status that indicates a failed attempt
  const hasLoginError = loginStatus === "loginError";

  return (
    <Layout>
      <section className="bg-muted/30 min-h-[calc(100vh-8rem)] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          {/* ── Left — Info Panel ─────────────────────────────────── */}
          <div className="hidden md:block space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                Student Portal
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
                Welcome back to
                <br />
                <span className="text-primary">SIMS</span>
              </h1>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                Sign in to your student account to view your profile, manage
                your details, and access the student dashboard.
              </p>
            </div>

            {/* Feature list */}
            <div className="space-y-4">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {feature.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right — Login Card ────────────────────────────────── */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-8">
            {/* Card Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <LogIn className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground">
                Student Login
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Use Internet Identity to sign in securely
              </p>
            </div>

            {/* ── Error Banner ────────────────────────────────────── */}
            {hasLoginError && (
              <div
                className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-5 text-sm"
                role="alert"
                data-ocid="login.error_state"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Login failed. Please try again.</span>
              </div>
            )}

            {/* ── Loading indicator while initializing ─────────────── */}
            {isLoading && !isLoggingIn && (
              <div
                className="flex items-center justify-center gap-2 py-3 mb-4 text-muted-foreground text-sm"
                data-ocid="login.loading_state"
              >
                <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Checking login status…
              </div>
            )}

            {/* ── Internet Identity Login Button ───────────────────── */}
            <Button
              onClick={signIn}
              disabled={isLoggingIn || isLoading}
              className="w-full h-11 btn-primary flex items-center justify-center gap-2"
              data-ocid="login.submit_button"
            >
              {isLoggingIn ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Connecting to Internet Identity…
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  Sign In with Internet Identity
                </>
              )}
            </Button>

            {/* What is Internet Identity */}
            <p className="text-muted-foreground text-xs text-center mt-3 leading-relaxed">
              Internet Identity is a secure, passwordless authentication system.
              You'll be redirected to verify your identity using biometrics or a
              PIN.
            </p>

            {/* ── Divider ──────────────────────────────────────────── */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-muted-foreground text-xs">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* ── Footer Links ────────────────────────────────────── */}
            <div className="space-y-2 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary font-medium hover:underline"
                  data-ocid="login.register_link"
                >
                  Register here
                </Link>
              </p>
              <p className="text-muted-foreground">
                Are you an admin?{" "}
                <Link
                  to="/admin/login"
                  className="text-primary font-medium hover:underline"
                  data-ocid="login.admin_login_link"
                >
                  Admin login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
