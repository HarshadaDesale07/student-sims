/**
 * HomePage (/) — Landing page for SIMS.
 * - If student is already logged in, redirects to /dashboard.
 * - Otherwise shows welcome content with links to Register and Login.
 */

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Link, Navigate } from "@tanstack/react-router";
import {
  BookOpen,
  GraduationCap,
  LogIn,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";

/** Feature highlight cards shown on the landing page */
const FEATURES = [
  {
    icon: UserPlus,
    title: "Easy Registration",
    description:
      "Register with your PRN number, contact details, and a secure password. Your data is safely stored.",
  },
  {
    icon: BookOpen,
    title: "Student Dashboard",
    description:
      "View and manage your personal information, update your profile, and track your academic details.",
  },
  {
    icon: Users,
    title: "Admin Management",
    description:
      "Administrators can search, view, update, and manage all student records from one secure panel.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "All passwords are hashed before storage. Internet Identity ensures only you can access your account.",
  },
];

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show skeleton while checking auth state
  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-6xl mx-auto px-4 py-24 space-y-4">
          <Skeleton className="h-12 w-80 mx-auto" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
      </Layout>
    );
  }

  // Redirect authenticated students directly to their dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout>
      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="bg-card border-b border-border py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Icon + Title */}
          <div className="flex justify-center">
            <div className="bg-primary/10 rounded-2xl p-4">
              <GraduationCap className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground leading-tight">
            Student Information
            <span className="text-primary block">Management System</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A secure, centralized platform for managing student records.
            Register, access your profile, and stay organized — all in one
            place.
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to="/register" data-ocid="home.register_button">
              <Button
                size="lg"
                className="btn-primary w-full sm:w-auto text-base px-8"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Register as Student
              </Button>
            </Link>
            <Link to="/login" data-ocid="home.login_button">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-base px-8 border-primary/40 text-primary hover:bg-primary/5"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Student Login
              </Button>
            </Link>
          </div>

          {/* Admin link — subtle, not a primary CTA */}
          <p className="text-sm text-muted-foreground pt-2">
            Are you an administrator?{" "}
            <Link
              to="/admin/login"
              className="text-primary hover:underline font-medium"
              data-ocid="home.admin_login_link"
            >
              Admin Login →
            </Link>
          </p>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────── */}
      <section
        className="bg-background py-16 px-4"
        data-ocid="home.features_section"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-2xl text-center text-foreground mb-10">
            Everything you need in one system
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((feature) => (
              <Card
                key={feature.title}
                className="card-bordered card-elevated hover:shadow-md transition-smooth"
              >
                <CardContent className="flex gap-4 p-5">
                  <div className="flex-shrink-0 bg-primary/10 rounded-lg p-2.5 h-fit">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="bg-muted/40 border-t border-border py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="font-display font-semibold text-xl text-foreground">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground text-sm">
            Create your account in minutes. Your academic information is always
            accessible and secure.
          </p>
          <Link to="/register" data-ocid="home.cta_register_button">
            <Button className="btn-primary mt-2">Create Your Account</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
