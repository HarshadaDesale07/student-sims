import { c as createLucideIcon, u as useNavigate, p as useAdminSession, r as reactExports, j as jsxRuntimeExports, B as Button, q as Users, o as Skeleton } from "./index-DCpvDG-4.js";
import { u as useActor, I as Input, L as Label, c as createActor } from "./label-BDZ5CUFp.js";
import { S as ShieldCheck } from "./shield-check-DilHf_5v.js";
import { L as LogOut, X } from "./x-CGfGzXY1.js";
import { C as CircleAlert } from "./circle-alert-DPnmeQEa.js";
import { C as CircleCheck } from "./circle-check-DTN6pwne.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]];
const ChevronRight = createLucideIcon("chevron-right", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode);
const PAGE_SIZE = 10;
function AdminDashboardPage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const { token, clearToken } = useAdminSession();
  const [students, setStudents] = reactExports.useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = reactExports.useState(true);
  const [fetchError, setFetchError] = reactExports.useState(null);
  const [currentPage, setCurrentPage] = reactExports.useState(0);
  const [hasMore, setHasMore] = reactExports.useState(true);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const [editingStudent, setEditingStudent] = reactExports.useState(null);
  const [editForm, setEditForm] = reactExports.useState({
    name: "",
    mobile: "",
    address: ""
  });
  const [isSavingEdit, setIsSavingEdit] = reactExports.useState(false);
  const [editError, setEditError] = reactExports.useState(null);
  const [editSuccess, setEditSuccess] = reactExports.useState(false);
  const [deletingPrn, setDeletingPrn] = reactExports.useState(null);
  const [isDeletingConfirmed, setIsDeletingConfirmed] = reactExports.useState(false);
  const [deleteError, setDeleteError] = reactExports.useState(null);
  const loadStudents = reactExports.useCallback(
    async (page) => {
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
    [actor, token, isFetching]
  );
  reactExports.useEffect(() => {
    if (!searchQuery) {
      loadStudents(currentPage);
    }
  }, [loadStudents, currentPage, searchQuery]);
  reactExports.useEffect(() => {
    if (!searchQuery.trim()) {
      setCurrentPage(0);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      if (!actor || !token) return;
      try {
        const result = await actor.searchStudents(token, searchQuery.trim());
        setStudents(result);
        setHasMore(false);
      } catch (_err) {
        setFetchError("Search failed. Please try again.");
      } finally {
        setIsSearching(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, actor, token]);
  function handleLogout() {
    clearToken();
    navigate({ to: "/admin/login" });
  }
  function openEditModal(student) {
    setEditingStudent(student);
    setEditForm({
      name: student.name,
      mobile: student.mobile,
      address: student.address
    });
    setEditError(null);
    setEditSuccess(false);
  }
  function closeEditModal() {
    setEditingStudent(null);
    setEditError(null);
    setEditSuccess(false);
  }
  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!actor || !token || !editingStudent) return;
    if (!editForm.name.trim() || !editForm.mobile.trim()) {
      setEditError("Name and mobile number are required.");
      return;
    }
    setIsSavingEdit(true);
    setEditError(null);
    try {
      const input = {
        name: editForm.name.trim(),
        mobile: editForm.mobile.trim(),
        address: editForm.address.trim()
      };
      const result = await actor.adminUpdateStudent(
        token,
        editingStudent.prn,
        input
      );
      if (result.__kind__ === "ok") {
        setStudents(
          (prev) => prev.map(
            (s) => s.prn === editingStudent.prn ? {
              ...s,
              name: input.name,
              mobile: input.mobile,
              address: input.address
            } : s
          )
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
  const isLoading = isLoadingStudents || isSearching;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "bg-card border-b border-border shadow-sm sticky top-0 z-30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-lg leading-none truncate block", children: "SIMS" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Admin Panel" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: handleLogout,
          className: "flex items-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5 flex-shrink-0",
          "data-ocid": "admin_dashboard.logout_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Logout" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground", children: "Student Records" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Manage all registered students in the system" })
        ] }),
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium self-start sm:self-center",
            "data-ocid": "admin_dashboard.student_count",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
              students.length,
              " ",
              searchQuery ? "result(s)" : "student(s)"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 relative max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "search",
            placeholder: "Search by PRN or name…",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-9 h-10",
            "data-ocid": "admin_dashboard.search.input"
          }
        )
      ] }),
      fetchError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "mb-4 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm",
          "data-ocid": "admin_dashboard.error_state",
          role: "alert",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 flex-shrink-0" }),
            fetchError
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "table",
          {
            className: "w-full text-sm",
            "data-ocid": "admin_dashboard.students.table",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-muted/40 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "PRN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground", children: "Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground hidden md:table-cell", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground hidden lg:table-cell", children: "Mobile" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right font-semibold text-foreground", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                isLoading && ["s1", "s2", "s3", "s4", "s5"].map((id, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border/60 last:border-0",
                    "data-ocid": `admin_dashboard.loading_state.${i + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-36" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-40" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-20 ml-auto" }) })
                    ]
                  },
                  id
                )),
                !isLoading && students.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "td",
                  {
                    colSpan: 5,
                    className: "px-4 py-14 text-center",
                    "data-ocid": "admin_dashboard.students.empty_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: searchQuery ? "No students match your search." : "No students registered yet." })
                    ]
                  }
                ) }),
                !isLoading && students.map((student, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border/60 last:border-0 hover:bg-muted/20 transition-colors",
                    "data-ocid": `admin_dashboard.students.item.${index + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: student.prn }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-medium text-foreground max-w-[160px] truncate", children: student.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[200px] truncate", children: student.email }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: student.mobile }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            variant: "ghost",
                            size: "sm",
                            onClick: () => openEditModal(student),
                            className: "h-8 px-2.5 text-primary hover:bg-primary/10 hover:text-primary",
                            "data-ocid": `admin_dashboard.edit_button.${index + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 mr-1" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Edit" })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            variant: "ghost",
                            size: "sm",
                            onClick: () => {
                              setDeletingPrn(student.prn);
                              setDeleteError(null);
                            },
                            className: "h-8 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive",
                            "data-ocid": `admin_dashboard.delete_button.${index + 1}`,
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 mr-1" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "Delete" })
                            ]
                          }
                        )
                      ] }) })
                    ]
                  },
                  student.prn
                ))
              ] })
            ]
          }
        ) }),
        !searchQuery && !isLoading && students.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-t border-border flex items-center justify-between bg-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "Page ",
            currentPage + 1
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: currentPage === 0,
                onClick: () => setCurrentPage((p) => p - 1),
                className: "h-8 px-3 gap-1",
                "data-ocid": "admin_dashboard.pagination_prev",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3.5 h-3.5" }),
                  "Prev"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                disabled: !hasMore,
                onClick: () => setCurrentPage((p) => p + 1),
                className: "h-8 px-3 gap-1",
                "data-ocid": "admin_dashboard.pagination_next",
                children: [
                  "Next",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5" })
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }),
    editingStudent && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm",
        "data-ocid": "admin_dashboard.edit.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "dialog",
          {
            className: "bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg open:flex open:flex-col m-0 p-0",
            "aria-labelledby": "edit-modal-title",
            open: true,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      id: "edit-modal-title",
                      className: "font-display font-semibold text-lg text-foreground",
                      children: "Edit Student"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "PRN: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: editingStudent.prn })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: closeEditModal,
                    "aria-label": "Close edit dialog",
                    className: "text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted",
                    "data-ocid": "admin_dashboard.edit.close_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSaveEdit, className: "px-6 py-5 space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "PRN (read-only)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: editingStudent.prn,
                        readOnly: true,
                        disabled: true,
                        className: "bg-muted/40 text-muted-foreground text-sm h-9"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email (read-only)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: editingStudent.email,
                        readOnly: true,
                        disabled: true,
                        className: "bg-muted/40 text-muted-foreground text-sm h-9 truncate"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "edit-name",
                      className: "text-sm font-medium text-foreground",
                      children: [
                        "Full Name ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-name",
                      value: editForm.name,
                      onChange: (e) => setEditForm((f) => ({ ...f, name: e.target.value })),
                      required: true,
                      disabled: isSavingEdit,
                      placeholder: "Enter full name",
                      "data-ocid": "admin_dashboard.edit.name.input",
                      className: "h-10"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Label,
                    {
                      htmlFor: "edit-mobile",
                      className: "text-sm font-medium text-foreground",
                      children: [
                        "Mobile Number ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "edit-mobile",
                      value: editForm.mobile,
                      onChange: (e) => setEditForm((f) => ({ ...f, mobile: e.target.value })),
                      required: true,
                      disabled: isSavingEdit,
                      placeholder: "Enter mobile number",
                      "data-ocid": "admin_dashboard.edit.mobile.input",
                      className: "h-10"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "edit-address",
                      className: "text-sm font-medium text-foreground",
                      children: "Address"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "textarea",
                    {
                      id: "edit-address",
                      value: editForm.address,
                      onChange: (e) => setEditForm((f) => ({ ...f, address: e.target.value })),
                      disabled: isSavingEdit,
                      rows: 2,
                      placeholder: "Enter address",
                      "data-ocid": "admin_dashboard.edit.address.textarea",
                      className: "form-field resize-none text-sm"
                    }
                  )
                ] }),
                editError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg",
                    "data-ocid": "admin_dashboard.edit.error_state",
                    role: "alert",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 flex-shrink-0" }),
                      editError
                    ]
                  }
                ),
                editSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-center gap-2 text-primary text-sm bg-primary/10 border border-primary/20 px-3 py-2 rounded-lg",
                    "data-ocid": "admin_dashboard.edit.success_state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 flex-shrink-0" }),
                      "Student updated successfully!"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      onClick: closeEditModal,
                      disabled: isSavingEdit,
                      className: "flex-1",
                      "data-ocid": "admin_dashboard.edit.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isSavingEdit || !editForm.name.trim() || !editForm.mobile.trim(),
                      className: "flex-1",
                      "data-ocid": "admin_dashboard.edit.save_button",
                      children: isSavingEdit ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "inline-block w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin",
                            "aria-hidden": "true"
                          }
                        ),
                        "Saving…"
                      ] }) : "Save Changes"
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    ),
    deletingPrn && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm",
        "data-ocid": "admin_dashboard.delete.dialog",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "dialog",
          {
            className: "bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm m-0 p-0",
            "aria-labelledby": "delete-dialog-title",
            open: true,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4 mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-5 h-5 text-destructive" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "h3",
                    {
                      id: "delete-dialog-title",
                      className: "font-display font-semibold text-foreground",
                      children: "Delete Student?"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-1", children: [
                    "This will permanently remove the student record for PRN",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: deletingPrn }),
                    ". This action cannot be undone."
                  ] })
                ] })
              ] }),
              deleteError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mb-4 flex items-center gap-2 text-destructive text-sm bg-destructive/10 border border-destructive/20 px-3 py-2 rounded-lg",
                  "data-ocid": "admin_dashboard.delete.error_state",
                  role: "alert",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 flex-shrink-0" }),
                    deleteError
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => {
                      setDeletingPrn(null);
                      setDeleteError(null);
                    },
                    disabled: isDeletingConfirmed,
                    className: "flex-1",
                    "data-ocid": "admin_dashboard.delete.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "destructive",
                    onClick: handleConfirmDelete,
                    disabled: isDeletingConfirmed,
                    className: "flex-1",
                    "data-ocid": "admin_dashboard.delete.confirm_button",
                    children: isDeletingConfirmed ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "inline-block w-3.5 h-3.5 border-2 border-destructive-foreground/40 border-t-destructive-foreground rounded-full animate-spin",
                          "aria-hidden": "true"
                        }
                      ),
                      "Deleting…"
                    ] }) : "Yes, Delete"
                  }
                )
              ] })
            ] })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-muted/40 border-t border-border py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with love using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-primary hover:underline",
          children: "caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  AdminDashboardPage as default
};
