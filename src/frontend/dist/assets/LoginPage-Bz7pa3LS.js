import { c as createLucideIcon, u as useNavigate, b as useAuth, r as reactExports, j as jsxRuntimeExports, L as Layout, G as GraduationCap, d as LogIn, B as Button, a as Link } from "./index-DCpvDG-4.js";
import { S as ShieldCheck } from "./shield-check-DilHf_5v.js";
import { C as CircleAlert } from "./circle-alert-DPnmeQEa.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4", key: "1nerag" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88", key: "o46ks0" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02", key: "ptglia" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6", key: "ydlgp0" }],
  ["path", { d: "M2 16h.01", key: "1gqxmh" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6", key: "drycrb" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2", key: "1tidbn" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2", key: "13wd9y" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2", key: "1fr1j5" }]
];
const Fingerprint = createLucideIcon("fingerprint", __iconNode);
const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    desc: "Your identity is secured using Internet Identity — no passwords needed."
  },
  {
    icon: GraduationCap,
    title: "Student Dashboard",
    desc: "Access your profile, enrollment details, and academic info."
  },
  {
    icon: Fingerprint,
    title: "One-Click Login",
    desc: "Use biometrics or your device PIN for instant, secure sign-in."
  }
];
function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, loginStatus, signIn } = useAuth();
  reactExports.useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, navigate]);
  const isLoggingIn = loginStatus === "logging-in";
  const hasLoginError = loginStatus === "loginError";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 min-h-[calc(100vh-8rem)] flex items-center justify-center py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:block space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "w-3.5 h-3.5" }),
          "Student Portal"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-bold text-foreground leading-tight", children: [
          "Welcome back to",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "SIMS" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-3 text-sm leading-relaxed", children: "Sign in to your student account to view your profile, manage your details, and access the student dashboard." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: FEATURES.map((feature) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(feature.icon, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: feature.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: feature.desc })
        ] })
      ] }, feature.title)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-sm p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "w-6 h-6 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Student Login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Use Internet Identity to sign in securely" })
      ] }),
      hasLoginError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-5 text-sm",
          role: "alert",
          "data-ocid": "login.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Login failed. Please try again." })
          ]
        }
      ),
      isLoading && !isLoggingIn && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-center gap-2 py-3 mb-4 text-muted-foreground text-sm",
          "data-ocid": "login.loading_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" }),
            "Checking login status…"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: signIn,
          disabled: isLoggingIn || isLoading,
          className: "w-full h-11 btn-primary flex items-center justify-center gap-2",
          "data-ocid": "login.submit_button",
          children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" }),
            "Connecting to Internet Identity…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Fingerprint, { className: "w-4 h-4" }),
            "Sign In with Internet Identity"
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs text-center mt-3 leading-relaxed", children: "Internet Identity is a secure, passwordless authentication system. You'll be redirected to verify your identity using biometrics or a PIN." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "my-5 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "or" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-border" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-center text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/register",
              className: "text-primary font-medium hover:underline",
              "data-ocid": "login.register_link",
              children: "Register here"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
          "Are you an admin?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/admin/login",
              className: "text-primary font-medium hover:underline",
              "data-ocid": "login.admin_login_link",
              children: "Admin login"
            }
          )
        ] })
      ] })
    ] })
  ] }) }) });
}
export {
  LoginPage as default
};
