"use client";

import { useState, useSyncExternalStore } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";

const ROLES = [
  { value: "Administrator", label: "Administrator" },
  { value: "Receptionist", label: "Receptionist" },
  { value: "Medical Technologist", label: "Medical Technologist" },
  { value: "Pathologist", label: "Physician" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MIN_USERNAME = 3;

const errText = "mt-1.5 text-sm text-rd-danger";

function field(hasError) {
  return `rd-input ${hasError ? "rd-input--error" : ""}`;
}

// One shared interval for every mounted clock, so the tick doesn't multiply.
const tickers = new Set();
let timer = null;

function subscribeSecond(onTick) {
  tickers.add(onTick);
  if (!timer) {
    timer = setInterval(() => {
      for (const fn of tickers) fn();
    }, 1000);
  }
  return () => {
    tickers.delete(onTick);
    if (tickers.size === 0) {
      clearInterval(timer);
      timer = null;
    }
  };
}

const getSecond = () => Math.floor(Date.now() / 1000);

// 0 means "not on the client yet". Rendering a real clock during SSR would
// hydrate against a different second and mismatch.
const getServerSecond = () => 0;

function LiveTimestamp() {
  const tick = useSyncExternalStore(subscribeSecond, getSecond, getServerSecond);
  return (
    <input
      id="createdAt"
      type="text"
      value={tick === 0 ? "" : new Date(tick * 1000).toLocaleString()}
      readOnly
      tabIndex={-1}
      aria-describedby="createdAt-hint"
      className="rd-input cursor-default tabular-nums text-rd-muted"
    />
  );
}

export default function AddUsers() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    // Clear a field's error as soon as it's touched — leaving it up while the
    // user fixes it reads as though the fix didn't register.
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate() {
    const found = {};

    if (!user.username.trim()) found.username = "Username is required.";
    else if (user.username.trim().length < MIN_USERNAME)
      found.username = `Username must be at least ${MIN_USERNAME} characters.`;

    if (!user.password) found.password = "Password is required.";
    else if (user.password.length < MIN_PASSWORD)
      found.password = `Password must be at least ${MIN_PASSWORD} characters.`;
    else if (!/[a-z]/.test(user.password))
      found.password = "Password must include at least one lowercase letter.";
    else if (!/[A-Z]/.test(user.password))
      found.password = "Password must include at least one uppercase letter.";
    else if (!/\d/.test(user.password))
      found.password = "Password must include at least one number.";
    else if (!/[^A-Za-z0-9]/.test(user.password))
      found.password = "Password must include at least one symbol.";

    if (!user.email.trim()) found.email = "Email is required.";
    else if (!EMAIL.test(user.email)) found.email = "Enter a valid email address.";

    if (!user.role) found.role = "Please select a role.";

    setErrors(found);
    return Object.keys(found).length === 0;
  }

  /* Validation runs before the dialog, not after: asking "are you sure?" about a
     form that's about to fail its own checks wastes a click. */
  function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setStatus(null);
    if (!validate()) return;

    setConfirmOpen(true);
  }

  async function addUser() {
    setConfirmOpen(false);
    setSubmitting(true);

    try {
      const response = await fetch("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus({ tone: "error", text: result.message || result.error || "Could not add user." });
        return;
      }

      setStatus({ tone: "success", text: `User “${user.username}” added successfully.` });
      setUser({ username: "", password: "", email: "", role: "" });
      setErrors({});
    } catch {
      setStatus({ tone: "error", text: "Unable to reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  /* "Pathologist" is stored but shown as "Physician", so the dialog has to echo
     the label the user actually picked. */
  const roleLabel = ROLES.find((entry) => entry.value === user.role)?.label ?? user.role;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Admin</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">Add User</h1>
        <p className="mt-2 text-sm text-rd-muted">
          Create an account and assign the role that matches their department.
        </p>
      </header>

      <section className="rd-panel p-6">
        {/* noValidate because the checks below replace the browser's — without
            them the required attributes would do nothing at all. */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="username" className="rd-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              autoComplete="off"
              value={user.username}
              onChange={handleChange}
              aria-invalid={errors.username ? true : undefined}
              aria-describedby={errors.username ? "username-error" : undefined}
              className={field(errors.username)}
            />
            {errors.username && (
              <p id="username-error" className={errText}>
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="rd-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={user.password}
              onChange={handleChange}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={field(errors.password)}
            />
            {errors.password && (
              <p id="password-error" className={errText}>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="rd-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="off"
              value={user.email}
              onChange={handleChange}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={field(errors.email)}
            />
            {errors.email && (
              <p id="email-error" className={errText}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="rd-label">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
              data-empty={user.role === ""}
              aria-invalid={errors.role ? true : undefined}
              aria-describedby={errors.role ? "role-error" : undefined}
              className={field(errors.role)}
            >
              <option value="">Select Role</option>
              {ROLES.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p id="role-error" className={errText}>
                {errors.role}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="createdAt" className="rd-label">
              Created At
            </label>
            <LiveTimestamp />
            <p id="createdAt-hint" className="mt-1.5 text-sm text-rd-muted">
              Recorded automatically when the account is saved.
            </p>
          </div>

          {status && (
            <p
              role={status.tone === "error" ? "alert" : "status"}
              className={`rd-status rd-status--${status.tone}`}
            >
              {status.text}
            </p>
          )}

          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="rd-btn rd-press rd-focus">
              {submitting ? "Adding…" : "Add User"}
            </button>
          </div>
        </form>
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Add this user?"
        description={`“${user.username}” will be created with the ${roleLabel} role and can sign in immediately.`}
        confirmLabel="Add user"
        onConfirm={addUser}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
