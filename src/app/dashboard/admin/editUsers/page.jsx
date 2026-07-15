"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ROLES = [
  "Administrator",
  "Receptionist",
  "Medical Technologist",
  "Pathologist",
  "Cashier",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MIN_USERNAME = 3;

const errText = "mt-1.5 text-sm text-rd-danger";

function field(hasError) {
  return `rd-input ${hasError ? "rd-input--error" : ""}`;
}

function EditUserForm() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (userId) {
      loadUser(userId);
    }
  }, [userId]);

  async function fetchUsers() {
    const response = await fetch("/api/users/display");
    const data = await response.json();
    setUsers(Array.isArray(data) ? data : (data?.rows ?? []));
  }

  async function loadUser(id) {
    setSelectedUser(id);
    setStatus(null);
    setErrors({});

    if (!id) {
      setUser({ username: "", password: "", email: "", role: "" });
      return;
    }

    const response = await fetch(`/api/users/${id}`);
    const result = await response.json();

    if (!response.ok) {
      setStatus({ tone: "error", text: result.message || "Could not load that user." });
      return;
    }

    setUser({
      username: result.data.username,
      password: "",
      email: result.data.email,
      role: result.data.role ?? "",
    });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));

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

    if (!user.email.trim()) found.email = "Email is required.";
    else if (!EMAIL.test(user.email)) found.email = "Enter a valid email address.";

    if (!user.role) found.role = "Please select a role.";

    // Blank means "keep the current one", so it's only checked when filled in.
    if (user.password) {
      if (user.password.length < MIN_PASSWORD)
        found.password = `Password must be at least ${MIN_PASSWORD} characters.`;
      else if (!/[a-z]/.test(user.password))
        found.password = "Password must include at least one lowercase letter.";
      else if (!/[A-Z]/.test(user.password))
        found.password = "Password must include at least one uppercase letter.";
      else if (!/\d/.test(user.password))
        found.password = "Password must include at least one number.";
      else if (!/[^A-Za-z0-9]/.test(user.password))
        found.password = "Password must include at least one symbol.";
    }

    setErrors(found);
    return Object.keys(found).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    setStatus(null);
    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch(`/api/users/${selectedUser}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const result = await response.json();

      setStatus({
        tone: response.ok ? "success" : "error",
        text: result.message || (response.ok ? "Changes saved." : "Could not save changes."),
      });

      if (response.ok) {
        setUser((prev) => ({ ...prev, password: "" }));
        fetchUsers();
      }
    } catch {
      setStatus({ tone: "error", text: "Unable to reach the server. Please try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const locked = !selectedUser;

  return (
    <section className="rd-panel p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label htmlFor="selectUser" className="rd-label">
              Select User
            </label>
            <select
              id="selectUser"
              value={selectedUser}
              onChange={(e) => loadUser(e.target.value)}
              data-empty={selectedUser === ""}
              className="rd-input"
            >
              <option value="">Select User</option>
              {users.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.username}
                </option>
              ))}
            </select>
          </div>

          {/* Disabling the fieldset rather than each field keeps the locked state
              in one place, and lets a legend explain why they're inert. */}
          <fieldset disabled={locked} className="space-y-5 disabled:opacity-60">
            <legend className="sr-only">User details</legend>

            <div>
              <label htmlFor="editUsername" className="rd-label">
                Username
              </label>
              <input
                id="editUsername"
                name="username"
                value={user.username}
                onChange={handleChange}
                aria-invalid={errors.username ? true : undefined}
                aria-describedby={errors.username ? "editUsername-error" : undefined}
                className={field(errors.username)}
              />
              {errors.username && (
                <p id="editUsername-error" className={errText}>
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="editEmail" className="rd-label">
                Email
              </label>
              <input
                id="editEmail"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "editEmail-error" : undefined}
                className={field(errors.email)}
              />
              {errors.email && (
                <p id="editEmail-error" className={errText}>
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="editRole" className="rd-label">
                Role
              </label>
              {/* An empty option is required: without one, a controlled select
                  holding "" has nothing to match and browsers fall back to
                  showing the first role as though it were already chosen. */}
              <select
                id="editRole"
                name="role"
                value={user.role ?? ""}
                onChange={handleChange}
                data-empty={user.role === ""}
                aria-invalid={errors.role ? true : undefined}
                aria-describedby={errors.role ? "editRole-error" : undefined}
                className={field(errors.role)}
              >
                <option value="">Select Role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p id="editRole-error" className={errText}>
                  {errors.role}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="editPassword" className="rd-label">
                New Password
              </label>
              <input
                id="editPassword"
                type="password"
                name="password"
                autoComplete="new-password"
                value={user.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? "editPassword-error" : undefined}
                className={field(errors.password)}
              />
              {errors.password && (
                <p id="editPassword-error" className={errText}>
                  {errors.password}
                </p>
              )}
            </div>
          </fieldset>

          {status && (
            <p
              role={status.tone === "error" ? "alert" : "status"}
              className={`rd-status rd-status--${status.tone}`}
            >
              {status.text}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-rd-muted">
              {locked ? "Select a user to begin." : null}
            </p>
            <button
              type="submit"
              disabled={locked || submitting}
              className="rd-btn rd-press rd-focus"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
    </section>
  );
}

// useSearchParams opts the subtree into client-side rendering, so it needs a
// Suspense boundary above it or the route fails to prerender at build time.
export default function EditUserPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <header className="rd-panel p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">Admin</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">Edit User</h1>
        <p className="mt-2 text-sm text-rd-muted">
          Pick an account to edit. Leave the password blank to keep the current one.
        </p>
      </header>

      <Suspense
        fallback={
          <section className="rd-panel p-6">
            <p className="py-10 text-center text-sm text-rd-muted">Loading…</p>
          </section>
        }
      >
        <EditUserForm />
      </Suspense>
    </div>
  );
}
