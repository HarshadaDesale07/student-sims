/**
 * RegisterPage — Student Registration form.
 * Collects PRN, name, mobile, email, address, password.
 * Validates all fields client-side, hashes password, then calls registerStudent.
 */

import { createActor } from "@/backend";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hashPassword } from "@/utils/hashPassword";
import { useActor } from "@caffeineai/core-infrastructure";
import { Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle2, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
// Note: we import from backend.d.ts indirectly via actor.registerStudent
// The backend's RegisterInput uses `hashedPassword`, not `passwordHash`

// ── Types ─────────────────────────────────────────────────────────

/** All form fields */
interface FormFields {
  prn: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  password: string;
  confirmPassword: string;
}

/** Per-field validation error messages */
type FormErrors = Partial<Record<keyof FormFields, string>>;

// ── Validation ────────────────────────────────────────────────────

/**
 * Validates the registration form.
 * Returns an object with field-level error messages (empty if all valid).
 */
function validateForm(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.prn.trim()) {
    errors.prn = "PRN number is required.";
  }

  if (!fields.name.trim()) {
    errors.name = "Full name is required.";
  }

  if (!/^\d{10}$/.test(fields.mobile.trim())) {
    errors.mobile = "Mobile number must be exactly 10 digits.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!fields.address.trim()) {
    errors.address = "Address is required.";
  }

  if (fields.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (fields.confirmPassword !== fields.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

// ── Sub-components ────────────────────────────────────────────────

/** Inline error message shown below a form field */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="flex items-center gap-1 text-destructive text-xs mt-1"
      role="alert"
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}

// ── Page Component ────────────────────────────────────────────────

export default function RegisterPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);

  // Form field values
  const [fields, setFields] = useState<FormFields>({
    prn: "",
    name: "",
    mobile: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  // Per-field validation errors (shown after blur or submit attempt)
  const [errors, setErrors] = useState<FormErrors>({});

  // Track which fields the user has touched (blurred)
  const [touched, setTouched] = useState<
    Partial<Record<keyof FormFields, boolean>>
  >({});

  // Global submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /** Update a single field and clear its error if corrected */
  function handleChange(field: keyof FormFields, value: string) {
    const updated = { ...fields, [field]: value };
    setFields(updated);

    // Re-validate the changed field if it was already touched
    if (touched[field]) {
      const newErrors = validateForm(updated);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  }

  /** Mark a field as touched on blur and validate it */
  function handleBlur(field: keyof FormFields) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(fields);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  }

  /** Handle form submission */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    // Mark all fields as touched so all errors become visible
    setTouched({
      prn: true,
      name: true,
      mobile: true,
      email: true,
      address: true,
      password: true,
      confirmPassword: true,
    });

    // Validate all fields
    const validationErrors = validateForm(fields);
    setErrors(validationErrors);

    // Stop if there are any errors
    if (Object.keys(validationErrors).length > 0) return;

    if (!actor) {
      setSubmitError("Backend connection not ready. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Hash the password client-side before sending to backend
      const passwordHash = await hashPassword(fields.password);

      // Build the input object matching backend's RegisterInput shape
      const input = {
        prn: fields.prn.trim(),
        name: fields.name.trim(),
        mobile: fields.mobile.trim(),
        email: fields.email.trim().toLowerCase(),
        address: fields.address.trim(),
        hashedPassword: passwordHash, // backend field name is hashedPassword
      };

      const result = await actor.registerStudent(input);

      if (result.__kind__ === "ok") {
        // Registration successful — show success, then redirect to login
        setSubmitSuccess(true);
        setTimeout(() => navigate({ to: "/login" }), 2000);
      } else {
        setSubmitError(result.err);
      }
    } catch (err) {
      setSubmitError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <section className="bg-muted/30 min-h-[calc(100vh-8rem)] flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-xl">
          {/* ── Card ─────────────────────────────────────────────── */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-8">
            {/* Header */}
            <div className="text-center mb-7">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                Create an Account
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Register to access the Student Information System
              </p>
            </div>

            {/* ── Success Banner ──────────────────────────────────── */}
            {submitSuccess && (
              <div
                className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary rounded-lg px-4 py-3 mb-5 text-sm"
                role="alert"
                data-ocid="register.success_state"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Registration successful! Redirecting to login…</span>
              </div>
            )}

            {/* ── Global Error Banner ─────────────────────────────── */}
            {submitError && (
              <div
                className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-5 text-sm"
                role="alert"
                data-ocid="register.error_state"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* ── Registration Form ───────────────────────────────── */}
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* PRN Number */}
              <div>
                <Label htmlFor="prn" className="text-sm font-medium">
                  PRN Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="prn"
                  type="text"
                  placeholder="e.g. 22210001"
                  value={fields.prn}
                  onChange={(e) => handleChange("prn", e.target.value)}
                  onBlur={() => handleBlur("prn")}
                  aria-describedby="prn-error"
                  aria-invalid={!!errors.prn}
                  className="mt-1"
                  data-ocid="register.prn_input"
                />
                <FieldError message={errors.prn} />
              </div>

              {/* Full Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. Alex Thompson"
                  value={fields.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-describedby="name-error"
                  aria-invalid={!!errors.name}
                  className="mt-1"
                  data-ocid="register.name_input"
                />
                <FieldError message={errors.name} />
              </div>

              {/* Mobile Number */}
              <div>
                <Label htmlFor="mobile" className="text-sm font-medium">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="10-digit number"
                  maxLength={10}
                  value={fields.mobile}
                  onChange={(e) =>
                    handleChange("mobile", e.target.value.replace(/\D/g, ""))
                  }
                  onBlur={() => handleBlur("mobile")}
                  aria-describedby="mobile-error"
                  aria-invalid={!!errors.mobile}
                  className="mt-1"
                  data-ocid="register.mobile_input"
                />
                <FieldError message={errors.mobile} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={fields.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  aria-describedby="email-error"
                  aria-invalid={!!errors.email}
                  className="mt-1"
                  data-ocid="register.email_input"
                />
                <FieldError message={errors.email} />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="123 College Road, City, State"
                  value={fields.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  aria-describedby="address-error"
                  aria-invalid={!!errors.address}
                  className="mt-1"
                  data-ocid="register.address_input"
                />
                <FieldError message={errors.address} />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="text-sm font-medium">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={fields.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  aria-describedby="password-error"
                  aria-invalid={!!errors.password}
                  className="mt-1"
                  data-ocid="register.password_input"
                />
                <FieldError message={errors.password} />
              </div>

              {/* Confirm Password */}
              <div>
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={fields.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  aria-describedby="confirmPassword-error"
                  aria-invalid={!!errors.confirmPassword}
                  className="mt-1"
                  data-ocid="register.confirm_password_input"
                />
                <FieldError message={errors.confirmPassword} />
              </div>

              {/* Security note */}
              <p className="flex items-start gap-1.5 text-muted-foreground text-xs">
                <ShieldCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
                Your password is hashed in your browser before being sent — it's
                never transmitted in plain text.
              </p>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-primary h-10"
                disabled={isSubmitting || submitSuccess}
                data-ocid="register.submit_button"
              >
                {isSubmitting ? "Registering…" : "Create Account"}
              </Button>
            </form>

            {/* ── Footer Links ────────────────────────────────────── */}
            <div className="mt-6 pt-5 border-t border-border space-y-2 text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary font-medium hover:underline"
                  data-ocid="register.login_link"
                >
                  Sign in here
                </Link>
              </p>
              <p className="text-muted-foreground">
                Are you an admin?{" "}
                <Link
                  to="/admin/login"
                  className="text-primary font-medium hover:underline"
                  data-ocid="register.admin_login_link"
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
