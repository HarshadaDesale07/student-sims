/**
 * AdminDashboardPage — Main admin interface for managing students.
 * Shows a searchable, paginated table with edit and delete capabilities.
 * Protected — only reachable via AdminProtectedRoute.
 */

import { createActor } from "@/backend";
import type { Student, UpdateProfileInput } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminSession } from "@/hooks/useAdminSession";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  LogOut,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ── Types ───────────────────────────────────────────────────────

interface EditFormState {
  name: string;
  mobile: string;
  address: string;
}

// ── Constants ───────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ── Main Component ──────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { token, clearToken } = useAdminSession();

  // Student list + pagination
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Edit modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState<EditFormState>({
    name: "",
    mobile: "",
    address: "",
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);

  // Delete confirmation state
  const [deletingPrn, setDeletingPrn] = useState<string | null>(null);
  const [isDeletingConfirmed, setIsDeletingConfirmed] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // ── Data Fetching ─────────────────────────────────────────────

  /** Load a page of students from the backend */
  const loadStudents = useCallback(
    async (page: number) => {
      if (!actor || !token || isFetching) return;
      setIsLoadingStudents(true);
      setFetchError(null);
      try {
        const offset = BigInt(page * PAGE_SIZE);
        const limit = BigInt(PAGE_SIZE);
        const result = await actor.getAllStudents(token, offset, limit);
        setStudents(result);
        setHasMore(result.length === PAGE_SIZE);
      } catch (_err) {
        setFetchError("Failed to load students. Please refresh the page.");
      } finally {
        setIsLoadingStudents(false);
      }
    },
    [actor, token, isFetching],
  );

  // Initial load — re-runs when page changes or search is cleared
  useEffect(() => {
    if (!searchQuery) {
      loadStudents(currentPage);
    }
  }, [loadStudents, currentPage, searchQuery]);

  /** Debounced search — fires 400ms after the user stops typing */
  useEffect(() => {
    if (!searchQuery.trim()) {
      // Clearing the search: reset to page 0 and let the above effect reload
      setCurrentPage(0);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      if (!actor || !token) return;
      try {
        const result = await actor.searchStudents(token, searchQuery.trim());
        setStudents(result);
        setHasMore(false); // search returns all matching records
      } catch (_err) {
        setFetchError("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, actor, token]);

  // ── Logout ────────────────────────────────────────────────────

  function handleLogout() {
    clearToken();
    navigate({ to: "/admin/login" });
  }

  // ── Edit Student ──────────────────────────────────────────────

  function openEditModal(student: Student) {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      mobile: student.mobile,
      address: student.address,
    });
    setEditError(null);
    setEditSuccess(false);
  }

  function closeEditModal() {
    setEditingStudent(null);
    setEditError(null);
    setEditSuccess(false);
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!actor || !token || !editingStudent) return;

    // Basic validation
    if (!editForm.name.trim() || !editForm.mobile.trim()) {
      setEditError("Name and mobile number are required.");
      return;
    }

    setIsSavingEdit(true);
    setEditError(null);
    try {
      const input: UpdateProfileInput = {
        name: editForm.name.trim(),
        mobile: editForm.mobile.trim(),
        address: editForm.address.trim(),
      };
      const result = await actor.adminUpdateStudent(
        token,
        editingStudent.prn,
        input,
      );
      if (result.__kind__ === "ok") {
        // Update local list without refetching
        setStudents((prev) =>
          prev.map((s) =>
            s.prn === editingStudent.prn
              ? {
                  ...s,
                  name: input.name,
                  mobile: input.mobile,
                  address: input.address,
                }
              : s,
          ),
        );
        setEditSuccess(true);
        setTimeout(closeEditModal, 1200);
      } else {
        setEditError(result.err || "Update failed. Please try again.");
      }
    } catch (_err) {
      setEditError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSavingEdit(false);
    }
  }

  // ── Delete Student ────────────────────────────────────────────

  async function handleConfirmDelete() {
    if (!actor || !token || !deletingPrn) return;
    setIsDeletingConfirmed(true);
    setDeleteError(null);
    try {
      const result = await actor.deleteStudent(token, deletingPrn);
      if (result.__kind__ === "ok") {
        setStudents((prev) => prev.filter((s) => s.prn !== deletingPrn));
        setDeletingPrn(null);
      } else {
        setDeleteError(result.err || "Deletion failed. Please try again.");
      }
    } catch (_err) {
      setDeleteError("An unexpected error occurred. Please try again.");
    } finally {
      setIsDeletingConfirmed(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────

  const isLoading = isLoadingStudents || isSearching;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ── Header ── */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-foreground text-lg leading-none truncate block">
                SIMS
              </span>
              <span className="text-xs text-muted-foreground">Admin Panel</span>
            </div>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 flex-shrink-0"
            data-ocid="admin_dashboard.logout_button"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Page title + stats bar */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Student Records
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage all registered students in the system
            </p>
          </div>

          {/* Student count badge */}
          {!isLoading && (
            <div
              className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium self-start sm:self-center"
              data-ocid="admin_dashboard.student_count"
            >
              <Users className="w-4 h-4" />
              {students.length} {searchQuery ? "result(s)" : "student(s)"}
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="mb-5 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by PRN or name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
            data-ocid="admin_dashboard.search.input"
          />
        </div>

        {/* Fetch error */}
        {fetchError && (
          <div
            className="mb-4 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            data-ocid="admin_dashboard.error_state"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {fetchError}
          </div>
        )}

        {/* Table card */}
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          {/* Table */}
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              data-ocid="admin_dashboard.students.table"
            >
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    PRN
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground hidden lg:table-cell">
                    Mobile
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Loading skeleton rows */}
                {isLoading &&
                  (["s1", "s2", "s3", "s4", "s5"] as const).map((id, i) => (
                    <tr
                      key={id}
                      className="border-b border-border/60 last:border-0"
                      data-ocid={`admin_dashboard.loading_state.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-36" />
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="px-4 py-3">
                        <Skeleton className="h-4 w-20 ml-auto" />
                      </td>
                    </tr>
                  ))}

                {/* Empty state */}
                {!isLoading && students.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-14 text-center"
                      data-ocid="admin_dashboard.students.empty_state"
                    >
                      <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">
                        {searchQuery
                          ? "No students match your search."
                          : "No students registered yet."}
                      </p>
                    </td>
                  </tr>
                )}

                {/* Student rows */}
                {!isLoading &&
                  students.map((student, index) => (
                    <tr
                      key={student.prn}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin_dashboard.students.item.${index + 1}`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {student.prn}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground max-w-[160px] truncate">
                        {student.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                        {student.email}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                        {student.mobile}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(student)}
                            className="h-8 px-2.5 text-primary hover:bg-primary/10 hover:text-primary"
                            data-ocid={`admin_dashboard.edit_button.${index + 1}`}
                          >
                            <Edit2 className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeletingPrn(student.prn);
                              setDeleteError(null);
                            }}
                            className="h-8 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            data-ocid={`admin_dashboard.delete_button.${index + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination (only show when not searching and not empty) */}
          {!searchQuery && !isLoading && students.length > 0 && (
            <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Page {currentPage + 1}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="h-8 px-3 gap-1"
                  data-ocid="admin_dashboard.pagination_prev"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="h-8 px-3 gap-1"
                  data-ocid="admin_dashboard.pagination_next"
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Edit Modal ── */}
      {editingStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
          data-ocid="admin_dashboard.edit.dialog"
        >
          <dialog
            className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg open:flex open:flex-col m-0 p-0"
            aria-labelledby="edit-modal-title"
            open
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3
                  id="edit-modal-title"
                  className="font-display font-semibold text-lg text-foreground"
                >
                  Edit Student
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  PRN: <span className="font-mono">{editingStudent.prn}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                aria-label="Close edit dialog"
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
                data-ocid="admin_dashboard.edit.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSaveEdit} className="px-6 py-5 space-y-4">
              {/* Read-only fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    PRN (read-only)
                  </Label>
                  <Input
                    value={editingStudent.prn}
                    readOnly
                    disabled
                    className="bg-muted/40 text-muted-foreground text-sm h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">
                    Email (read-only)
                  </Label>
                  <Input
                    value={editingStudent.email}
                    readOnly
                    disabled
                    className="bg-muted/40 text-muted-foreground text-sm h-9 truncate"
                  />
                </div>
              </div>

              {/* Editable fields */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-name"
                  className="text-sm font-medium text-foreground"
                >
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                  disabled={isSavingEdit}
                  placeholder="Enter full name"
                  data-ocid="admin_dashboard.edit.name.input"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-mobile"
                  className="text-sm font-medium text-foreground"
                >
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-mobile"
                  value={editForm.mobile}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, mobile: e.target.value }))
                  }
                  required
                  disabled={isSavingEdit}
                  placeholder="Enter mobile number"
                  data-ocid="admin_dashboard.edit.mobile.input"
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-address"
                  className="text-sm font-medium text-foreground"
                >
                  Address
                </Label>
                <textarea
                  id="edit-address"
                  value={editForm.address}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, address: e.target.value }))
                  }
                  disabled={isSavingEdit}
                  rows={2}
                  placeholder="Enter address"
                  data-ocid="admin_dashboard.edit.address.textarea"
                  className="form-field resize-none text-sm"
                />
              </div>

              {/* Edit error */}
              {editError && (
                <div
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg"
                  data-ocid="admin_dashboard.edit.error_state"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {editError}
                </div>
              )}

              {/* Edit success */}
              {editSuccess && (
                <div
                  className="flex items-center gap-2 text-primary text-sm bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg"
                  data-ocid="admin_dashboard.edit.success_state"
                >
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  Student updated successfully!
                </div>
              )}

              {/* Modal actions */}
              <div className="flex gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeEditModal}
                  disabled={isSavingEdit}
                  className="flex-1"
                  data-ocid="admin_dashboard.edit.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSavingEdit ||
                    !editForm.name.trim() ||
                    !editForm.mobile.trim()
                  }
                  className="flex-1"
                  data-ocid="admin_dashboard.edit.save_button"
                >
                  {isSavingEdit ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Saving…
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </dialog>
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      {deletingPrn && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm"
          data-ocid="admin_dashboard.delete.dialog"
        >
          <dialog
            className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm m-0 p-0"
            aria-labelledby="delete-dialog-title"
            open
          >
            <div className="px-6 py-5">
              {/* Icon + title */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h3
                    id="delete-dialog-title"
                    className="font-display font-semibold text-foreground"
                  >
                    Delete Student?
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This will permanently remove the student record for PRN{" "}
                    <span className="font-mono text-foreground">
                      {deletingPrn}
                    </span>
                    . This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Delete error */}
              {deleteError && (
                <div
                  className="mb-4 flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg"
                  data-ocid="admin_dashboard.delete.error_state"
                  role="alert"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {deleteError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDeletingPrn(null);
                    setDeleteError(null);
                  }}
                  disabled={isDeletingConfirmed}
                  className="flex-1"
                  data-ocid="admin_dashboard.delete.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleConfirmDelete}
                  disabled={isDeletingConfirmed}
                  className="flex-1"
                  data-ocid="admin_dashboard.delete.confirm_button"
                >
                  {isDeletingConfirmed ? (
                    <span className="flex items-center gap-2">
                      <span
                        className="inline-block w-3.5 h-3.5 border-2 border-destructive-foreground/40 border-t-destructive-foreground rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Deleting…
                    </span>
                  ) : (
                    "Yes, Delete"
                  )}
                </Button>
              </div>
            </div>
          </dialog>
        </div>
      )}

      {/* ── Footer ── */}
      <footer className="bg-muted/40 border-t border-border py-3">
        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
