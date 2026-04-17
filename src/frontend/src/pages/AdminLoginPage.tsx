/**
 * AdminLoginPage — Admin authentication form.
 * Hashes password client-side before sending to backend.
 * On success, stores the session token and redirects to dashboard.
 */

import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "@/hooks/useAdminSession";
import { hashPassword } from "@/utils/hashPassword";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { saveToken } = useAdminSession();

  // Form field state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // UI feedback state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Handle form submission: hash password → call backend → store token */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!actor) {
      setError("Backend is not ready. Please try again.");
      return;
    }

    // Basic validation before sending to backend
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      // Hash the password client-side before sending
      const hashedPassword = await hashPassword(password);

      const result = await actor.adminLogin(email.trim(), hashedPassword);

      if (result.__kind__ === "ok") {
        // Store the returned session token and go to admin dashboard
        saveToken(result.ok);
        navigate({ to: "/admin/dashboard" });
      } else {
        setError(result.err || "Invalid email or password. Please try again.");
      }
    } catch (_err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary/5" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Admin Portal
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Sign in to manage the student information system
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              data-ocid="admin_login.error_state"
              className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-email"
                className="text-sm font-medium text-foreground"
              >
                Email address
              </Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="admin@sims.local"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                data-ocid="admin_login.email.input"
                className="h-11"
              />
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-password"
                className="text-sm font-medium text-foreground"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  data-ocid="admin_login.password.input"
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full h-11 text-base font-medium"
              data-ocid="admin_login.submit_button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Hint for default credentials */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Default:{" "}
            <span className="font-mono text-foreground/70">
              admin@sims.local
            </span>{" "}
            / <span className="font-mono text-foreground/70">Admin@1234</span>
          </p>
        </div>

        {/* Back to home link */}
        <p className="mt-5 text-center text-sm text-muted-foreground">
          <a
            href="/"
            className="text-primary hover:underline transition-colors"
            data-ocid="admin_login.home.link"
          >
            ← Back to student portal
          </a>
        </p>
      </div>
    </div>
  );
}
