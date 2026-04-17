/**
 * DashboardPage — Student profile view after Internet Identity login.
 *
 * Features:
 *  - Shows student profile: PRN, name, email, mobile, address, joined date
 *  - Inline edit form — name, mobile, address editable; PRN + email read-only
 *  - Calls actor.updateMyProfile; shows success / error feedback
 *  - Logout clears Internet Identity session and lets router redirect home
 *  - Loading skeleton while fetching; "no profile" state for unregistered users
 *
 * Types come from the generated backend (src/backend.ts), not local types/index.ts,
 * so they match the real Motoko schema exactly.
 */

import { createActor } from "@/backend";
import type { Student, UpdateProfileInput, UpdateResult } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  IdCard,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

// ── Helper: format a Motoko Timestamp (nanoseconds bigint) to a readable date ──
function formatDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ── Feedback state type ────────────────────────────────────────────────────────
interface Feedback {
  type: "success" | "error";
  message: string;
}

export default function DashboardPage() {
  const { signOut } = useAuth();
  const { actor, isFetching: actorLoading } = useActor(createActor);
  const queryClient = useQueryClient();

  // ── Edit mode state ────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState<UpdateProfileInput>({
    name: "",
    mobile: "",
    address: "",
  });

  // Feedback banner shown after update attempt
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // ── Fetch student profile ──────────────────────────────────────
  const {
    data: profile,
    isLoading: profileLoading,
    isError,
  } = useQuery<Student | null>({
    queryKey: ["myProfile"],
    queryFn: async () => {
      if (!actor) return null;
      // Returns Student or null (no profile registered yet)
      return actor.getMyProfile();
    },
    enabled: !!actor && !actorLoading,
  });

  // ── Update mutation ────────────────────────────────────────────
  const updateMutation = useMutation<UpdateResult, Error, UpdateProfileInput>({
    mutationFn: async (input: UpdateProfileInput) => {
      if (!actor) throw new Error("Not connected to backend.");
      return actor.updateMyProfile(input);
    },
    onSuccess: (result: UpdateResult) => {
      if (result.__kind__ === "ok") {
        // Refresh the cached profile so displayed values update immediately
        queryClient.invalidateQueries({ queryKey: ["myProfile"] });
        setFeedback({
          type: "success",
          message: "Profile updated successfully!",
        });
        setIsEditing(false);
      } else {
        setFeedback({ type: "error", message: result.err });
      }
    },
    onError: (err: Error) => {
      setFeedback({ type: "error", message: err.message });
    },
  });

  // ── Handlers ──────────────────────────────────────────────────

  /** Open the edit form pre-filled with current profile values */
  function openEdit() {
    if (!profile) return;
    setFormValues({
      name: profile.name,
      mobile: profile.mobile,
      address: profile.address,
    });
    setFeedback(null);
    setIsEditing(true);
  }

  /** Cancel edit without saving */
  function cancelEdit() {
    setIsEditing(false);
    setFeedback(null);
  }

  /** Submit the update to the backend */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    updateMutation.mutate(formValues);
  }

  /** Update a single field in the edit form */
  function handleChange(field: keyof UpdateProfileInput, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  }

  /** Sign out via Internet Identity; ProtectedRoute / header will redirect */
  function handleLogout() {
    signOut();
  }

  // ── Derived loading flag ───────────────────────────────────────
  const isLoading = actorLoading || profileLoading;

  return (
    <Layout>
      <div className="min-h-[calc(100vh-9rem)] bg-background py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* ── Page heading ───────────────────────────────── */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-foreground">
              Student Dashboard
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Manage your academic profile and personal information.
            </p>
          </div>

          {/* ── Loading skeleton ───────────────────────────── */}
          {isLoading && (
            <div
              className="bg-card rounded-xl border border-border p-6 space-y-5"
              data-ocid="dashboard.loading_state"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              {(["a", "b", "c", "d"] as const).map((k) => (
                <Skeleton key={k} className="h-4 w-full" />
              ))}
            </div>
          )}

          {/* ── Error state ────────────────────────────────── */}
          {!isLoading && isError && (
            <div
              className="bg-card rounded-xl border border-destructive/30 p-8 text-center"
              data-ocid="dashboard.error_state"
            >
              <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
              <p className="text-foreground font-medium">
                Failed to load your profile. Please refresh and try again.
              </p>
            </div>
          )}

          {/* ── No profile found ───────────────────────────── */}
          {!isLoading && !isError && profile === null && (
            <div
              className="bg-card rounded-xl border border-border p-10 text-center"
              data-ocid="dashboard.empty_state"
            >
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">
                No profile found
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                We couldn't find a profile linked to your identity. Please
                register first.
              </p>
              <Link to="/register" data-ocid="dashboard.register_link">
                <Button className="btn-primary">Go to Registration</Button>
              </Link>
            </div>
          )}

          {/* ── Profile card ───────────────────────────────── */}
          {!isLoading && !isError && profile && (
            <div className="space-y-6">
              {/* Welcome banner */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl px-6 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display font-semibold text-foreground truncate">
                    Welcome back, {profile.name}!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PRN: {profile.prn}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="ml-auto bg-primary/15 text-primary border-primary/20 shrink-0"
                >
                  Active
                </Badge>
              </div>

              {/* ── Profile details card ─────────────────── */}
              <div
                className="bg-card rounded-xl border border-border card-elevated overflow-hidden"
                data-ocid="dashboard.profile_card"
              >
                {/* Card header row */}
                <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                  <h2 className="font-display font-semibold text-foreground">
                    Profile Information
                  </h2>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openEdit}
                      data-ocid="dashboard.edit_button"
                      className="gap-1.5"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {/* ── View mode ─────────────────────────── */}
                {!isEditing && (
                  <div className="divide-y divide-border">
                    <ProfileRow
                      icon={<IdCard className="w-4 h-4" />}
                      label="PRN Number"
                      value={profile.prn}
                      readOnly
                    />
                    <ProfileRow
                      icon={<User className="w-4 h-4" />}
                      label="Full Name"
                      value={profile.name}
                    />
                    <ProfileRow
                      icon={<Mail className="w-4 h-4" />}
                      label="Email Address"
                      value={profile.email}
                      readOnly
                    />
                    <ProfileRow
                      icon={<Phone className="w-4 h-4" />}
                      label="Mobile Number"
                      value={profile.mobile}
                    />
                    <ProfileRow
                      icon={<MapPin className="w-4 h-4" />}
                      label="Address"
                      value={profile.address}
                    />
                    <ProfileRow
                      icon={<Calendar className="w-4 h-4" />}
                      label="Joined Date"
                      value={formatDate(profile.createdAt)}
                      readOnly
                    />
                  </div>
                )}

                {/* ── Edit mode ─────────────────────────── */}
                {isEditing && (
                  <form
                    onSubmit={handleSubmit}
                    className="px-6 py-5 space-y-5"
                    data-ocid="dashboard.edit_form"
                  >
                    {/* Read-only fields shown for context */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                          PRN Number (read-only)
                        </Label>
                        <Input
                          value={profile.prn}
                          readOnly
                          disabled
                          className="bg-muted/40 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                          Email (read-only)
                        </Label>
                        <Input
                          value={profile.email}
                          readOnly
                          disabled
                          className="bg-muted/40 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Editable: Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edit-name"
                        className="text-sm font-medium text-foreground"
                      >
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-name"
                        data-ocid="dashboard.name_input"
                        value={formValues.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Enter your full name"
                        required
                        minLength={2}
                      />
                    </div>

                    {/* Editable: Mobile */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edit-mobile"
                        className="text-sm font-medium text-foreground"
                      >
                        Mobile Number{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-mobile"
                        data-ocid="dashboard.mobile_input"
                        type="tel"
                        value={formValues.mobile}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        placeholder="e.g. +91 9876543210"
                        required
                      />
                    </div>

                    {/* Editable: Address */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edit-address"
                        className="text-sm font-medium text-foreground"
                      >
                        Address <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="edit-address"
                        data-ocid="dashboard.address_input"
                        value={formValues.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                        placeholder="Enter your address"
                        required
                      />
                    </div>

                    {/* Inline feedback inside form */}
                    {feedback && (
                      <div
                        className={`flex items-start gap-2.5 p-3 rounded-lg text-sm ${
                          feedback.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-destructive/10 border border-destructive/20 text-destructive"
                        }`}
                        data-ocid={
                          feedback.type === "success"
                            ? "dashboard.success_state"
                            : "dashboard.error_state"
                        }
                      >
                        {feedback.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <span>{feedback.message}</span>
                      </div>
                    )}

                    {/* Form action buttons */}
                    <div className="flex items-center gap-3 pt-1">
                      <Button
                        type="submit"
                        data-ocid="dashboard.save_button"
                        disabled={updateMutation.isPending}
                        className="btn-primary"
                      >
                        {updateMutation.isPending ? "Saving…" : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEdit}
                        data-ocid="dashboard.cancel_button"
                        className="gap-1.5"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>

              {/* Success toast shown after closing the edit form */}
              {!isEditing && feedback?.type === "success" && (
                <div
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm"
                  data-ocid="dashboard.success_state"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  {feedback.message}
                </div>
              )}

              {/* ── Logout section ────────────────────────── */}
              <div className="bg-card rounded-xl border border-border card-elevated px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Log out of SIMS
                  </p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    This will end your Internet Identity session.
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  data-ocid="dashboard.logout_button"
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ── Shared profile row component ───────────────────────────────────────────────

interface ProfileRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  readOnly?: boolean;
}

/**
 * Renders a single labelled row in the profile view.
 * Read-only fields get a visual badge so users know they can't be edited.
 */
function ProfileRow({ icon, label, value, readOnly = false }: ProfileRowProps) {
  return (
    <div className="flex items-start gap-3 px-6 py-4">
      {/* Field icon */}
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>

      {/* Label and value */}
      <div className="flex-1 min-w-0 sm:flex sm:items-center sm:justify-between gap-4">
        <span className="text-sm text-muted-foreground w-36 shrink-0 block sm:inline">
          {label}
        </span>
        <span className="text-sm font-medium text-foreground break-words">
          {value || (
            <span className="text-muted-foreground italic">Not set</span>
          )}
        </span>
      </div>

      {/* Read-only badge */}
      {readOnly && (
        <Badge
          variant="secondary"
          className="text-xs shrink-0 self-center opacity-70"
        >
          read-only
        </Badge>
      )}
    </div>
  );
}
