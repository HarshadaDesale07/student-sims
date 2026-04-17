import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, L as Layout, U as UserPlus, B as Button, a as Link } from "./index-DCpvDG-4.js";
import { u as useActor, L as Label, I as Input, c as createActor } from "./label-BDZ5CUFp.js";
import { h as hashPassword } from "./hashPassword-DeKBgw5T.js";
import { C as CircleCheck } from "./circle-check-DTN6pwne.js";
import { C as CircleAlert } from "./circle-alert-DPnmeQEa.js";
import { S as ShieldCheck } from "./shield-check-DilHf_5v.js";
function validateForm(fields) {
  const errors = {};
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
function FieldError({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "p",
    {
      className: "flex items-center gap-1 text-destructive text-xs mt-1",
      role: "alert",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 shrink-0" }),
        message
      ]
    }
  );
}
function RegisterPage() {
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const [fields, setFields] = reactExports.useState({
    prn: "",
    name: "",
    mobile: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const [touched, setTouched] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [submitSuccess, setSubmitSuccess] = reactExports.useState(false);
  function handleChange(field, value) {
    const updated = { ...fields, [field]: value };
    setFields(updated);
    if (touched[field]) {
      const newErrors = validateForm(updated);
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  }
  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm(fields);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError(null);
    setTouched({
      prn: true,
      name: true,
      mobile: true,
      email: true,
      address: true,
      password: true,
      confirmPassword: true
    });
    const validationErrors = validateForm(fields);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    if (!actor) {
      setSubmitError("Backend connection not ready. Please try again.");
      return;
    }
    setIsSubmitting(true);
    try {
      const passwordHash = await hashPassword(fields.password);
      const input = {
        prn: fields.prn.trim(),
        name: fields.name.trim(),
        mobile: fields.mobile.trim(),
        email: fields.email.trim().toLowerCase(),
        address: fields.address.trim(),
        hashedPassword: passwordHash
        // backend field name is hashedPassword
      };
      const result = await actor.registerStudent(input);
      if (result.__kind__ === "ok") {
        setSubmitSuccess(true);
        setTimeout(() => navigate({ to: "/login" }), 2e3);
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-muted/30 min-h-[calc(100vh-8rem)] flex items-center justify-center py-10 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-sm p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-7", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-6 h-6 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Create an Account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Register to access the Student Information System" })
    ] }),
    submitSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary rounded-lg px-4 py-3 mb-5 text-sm",
        role: "alert",
        "data-ocid": "register.success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Registration successful! Redirecting to login…" })
        ]
      }
    ),
    submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 mb-5 text-sm",
        role: "alert",
        "data-ocid": "register.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: submitError })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, noValidate: true, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "prn", className: "text-sm font-medium", children: [
          "PRN Number ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "prn",
            type: "text",
            placeholder: "e.g. 22210001",
            value: fields.prn,
            onChange: (e) => handleChange("prn", e.target.value),
            onBlur: () => handleBlur("prn"),
            "aria-describedby": "prn-error",
            "aria-invalid": !!errors.prn,
            className: "mt-1",
            "data-ocid": "register.prn_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.prn })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "name", className: "text-sm font-medium", children: [
          "Full Name ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "name",
            type: "text",
            placeholder: "e.g. Alex Thompson",
            value: fields.name,
            onChange: (e) => handleChange("name", e.target.value),
            onBlur: () => handleBlur("name"),
            "aria-describedby": "name-error",
            "aria-invalid": !!errors.name,
            className: "mt-1",
            "data-ocid": "register.name_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "mobile", className: "text-sm font-medium", children: [
          "Mobile Number ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "mobile",
            type: "tel",
            placeholder: "10-digit number",
            maxLength: 10,
            value: fields.mobile,
            onChange: (e) => handleChange("mobile", e.target.value.replace(/\D/g, "")),
            onBlur: () => handleBlur("mobile"),
            "aria-describedby": "mobile-error",
            "aria-invalid": !!errors.mobile,
            className: "mt-1",
            "data-ocid": "register.mobile_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.mobile })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "email", className: "text-sm font-medium", children: [
          "Email Address ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            type: "email",
            placeholder: "student@university.edu",
            value: fields.email,
            onChange: (e) => handleChange("email", e.target.value),
            onBlur: () => handleBlur("email"),
            "aria-describedby": "email-error",
            "aria-invalid": !!errors.email,
            className: "mt-1",
            "data-ocid": "register.email_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.email })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "address", className: "text-sm font-medium", children: [
          "Address ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "address",
            type: "text",
            placeholder: "123 College Road, City, State",
            value: fields.address,
            onChange: (e) => handleChange("address", e.target.value),
            onBlur: () => handleBlur("address"),
            "aria-describedby": "address-error",
            "aria-invalid": !!errors.address,
            className: "mt-1",
            "data-ocid": "register.address_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.address })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "password", className: "text-sm font-medium", children: [
          "Password ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "password",
            type: "password",
            placeholder: "Minimum 8 characters",
            value: fields.password,
            onChange: (e) => handleChange("password", e.target.value),
            onBlur: () => handleBlur("password"),
            "aria-describedby": "password-error",
            "aria-invalid": !!errors.password,
            className: "mt-1",
            "data-ocid": "register.password_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.password })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Label,
          {
            htmlFor: "confirmPassword",
            className: "text-sm font-medium",
            children: [
              "Confirm Password ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "confirmPassword",
            type: "password",
            placeholder: "Re-enter your password",
            value: fields.confirmPassword,
            onChange: (e) => handleChange("confirmPassword", e.target.value),
            onBlur: () => handleBlur("confirmPassword"),
            "aria-describedby": "confirmPassword-error",
            "aria-invalid": !!errors.confirmPassword,
            className: "mt-1",
            "data-ocid": "register.confirm_password_input"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.confirmPassword })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-1.5 text-muted-foreground text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" }),
        "Your password is hashed in your browser before being sent — it's never transmitted in plain text."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          className: "w-full btn-primary h-10",
          disabled: isSubmitting || submitSuccess,
          "data-ocid": "register.submit_button",
          children: isSubmitting ? "Registering…" : "Create Account"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-5 border-t border-border space-y-2 text-center text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/login",
            className: "text-primary font-medium hover:underline",
            "data-ocid": "register.login_link",
            children: "Sign in here"
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
            "data-ocid": "register.admin_login_link",
            children: "Admin login"
          }
        )
      ] })
    ] })
  ] }) }) }) });
}
export {
  RegisterPage as default
};
