import { c as createLucideIcon, u as useNavigate, p as useAdminSession, r as reactExports, j as jsxRuntimeExports, B as Button } from "./index-DCpvDG-4.js";
import { u as useActor, L as Label, I as Input, c as createActor } from "./label-BDZ5CUFp.js";
import { h as hashPassword } from "./hashPassword-DeKBgw5T.js";
import { S as ShieldCheck } from "./shield-check-DilHf_5v.js";
import { C as CircleAlert } from "./circle-alert-DPnmeQEa.js";
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
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
];
const Lock = createLucideIcon("lock", __iconNode);
function AdminLoginPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const { saveToken } = useAdminSession();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [showPassword, setShowPassword] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!actor) {
      setError("Backend is not ready. Please try again.");
      return;
    }
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const hashedPassword = await hashPassword(password);
      const result = await actor.adminLogin(email.trim(), hashedPassword);
      if (result.__kind__ === "ok") {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "absolute inset-0 pointer-events-none overflow-hidden",
        "aria-hidden": "true",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary/5" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-lg p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center mb-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-7 h-7 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Admin Portal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 text-center", children: "Sign in to manage the student information system" })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "admin_login.error_state",
            className: "mb-5 flex items-start gap-2.5 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm",
            role: "alert",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 mt-0.5 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "admin-email",
                className: "text-sm font-medium text-foreground",
                children: "Email address"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "admin-email",
                type: "email",
                autoComplete: "email",
                placeholder: "admin@sims.local",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                disabled: isLoading,
                required: true,
                "data-ocid": "admin_login.email.input",
                className: "h-11"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "admin-password",
                className: "text-sm font-medium text-foreground",
                children: "Password"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "admin-password",
                  type: showPassword ? "text" : "password",
                  autoComplete: "current-password",
                  placeholder: "Enter your password",
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  disabled: isLoading,
                  required: true,
                  "data-ocid": "admin_login.password.input",
                  className: "h-11 pr-11"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword((v) => !v),
                  "aria-label": showPassword ? "Hide password" : "Show password",
                  className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                  children: showPassword ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: isLoading || !email || !password,
              className: "w-full h-11 text-base font-medium",
              "data-ocid": "admin_login.submit_button",
              children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "inline-block w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin",
                    "aria-hidden": "true"
                  }
                ),
                "Signing in…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4" }),
                "Sign In"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-xs text-muted-foreground", children: [
          "Default:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground/70", children: "admin@sims.local" }),
          " ",
          "/ ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground/70", children: "Admin@1234" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "text-primary hover:underline transition-colors",
          "data-ocid": "admin_login.home.link",
          children: "← Back to student portal"
        }
      ) })
    ] })
  ] });
}
export {
  AdminLoginPage as default
};
