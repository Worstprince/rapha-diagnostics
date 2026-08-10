"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ConfirmDialog from "@/components/ConfirmDialog";

import Toast from "../_toast";
import { Badge, PageHeader, roleLabel } from "../_ui";

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

  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "",
    archivestatus: false,
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

    setUsers(
      Array.isArray(data)
        ? data
        : (data?.rows ?? [])
    );
  }

  async function loadUser(id) {
    setSelectedUser(id);
    setStatus(null);
    setErrors({});

    if (!id) {
      setUser({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        role: "",
        archivestatus: false,
      });
      return;
    }

    const response = await fetch(`/api/users/${id}`);
    const result = await response.json();

    if (!response.ok) {
      setStatus({
        tone: "error",
        text: result.message || "Could not load that user.",
      });
      return;
    }

    setUser({
      username: result.data.username,
      password: "",
      confirmPassword: "",
      email: result.data.email,
      role: result.data.role ?? "",
      archivestatus: Boolean(result.data.archivestatus),
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

    if (!user.username.trim()) {
      found.username = "Username is required.";
    } else if (user.username.trim().length < MIN_USERNAME) {
      found.username =
        `Username must be at least ${MIN_USERNAME} characters.`;
    }

    if (!user.email.trim()) {
      found.email = "Email is required.";
    } else if (!EMAIL.test(user.email)) {
      found.email = "Enter a valid email address.";
    }

    if (!user.role) {
      found.role = "Please select a role.";
    }

    /*
     * Blank password means:
     * "Keep the existing password."
     *
     * If a new password is entered, validate it and require
     * the confirmation password.
     */
    if (user.password) {
      if (user.password.length < MIN_PASSWORD) {
        found.password =
          `Password must be at least ${MIN_PASSWORD} characters.`;
      } else if (!/[a-z]/.test(user.password)) {
        found.password =
          "Password must include at least one lowercase letter.";
      } else if (!/[A-Z]/.test(user.password)) {
        found.password =
          "Password must include at least one uppercase letter.";
      } else if (!/\d/.test(user.password)) {
        found.password =
          "Password must include at least one number.";
      } else if (!/[^A-Za-z0-9]/.test(user.password)) {
        found.password =
          "Password must include at least one symbol.";
      }

      if (!user.confirmPassword) {
        found.confirmPassword =
          "Please confirm the new password.";
      } else if (user.password !== user.confirmPassword) {
        found.confirmPassword =
          "Passwords do not match.";
      }
    }

    setErrors(found);

    return Object.keys(found).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (submitting) return;

    setStatus(null);

    if (!validate()) return;

    setConfirmOpen(true);
  }

  async function saveChanges() {
    setConfirmOpen(false);
    setSubmitting(true);

    try {
      /*
       * confirmPassword is only used by the frontend for validation.
       * Do NOT send it to the API.
       */
      const { confirmPassword, ...userData } = user;

      const response = await fetch(
        `/api/users/${selectedUser}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const result = await response.json();

      setStatus({
        tone: response.ok ? "success" : "error",
        text:
          result.message ||
          (response.ok
            ? "Changes saved."
            : "Could not save changes."),
      });

      if (response.ok) {
        setUser((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));

        fetchUsers();
      }
    } catch {
      setStatus({
        tone: "error",
        text: "Unable to reach the server. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const locked = !selectedUser;

  const confirmDescription = user.password
    ? `Changes to “${user.username}” will be saved, including a new password.`
    : `Changes to “${user.username}” will be saved. Their password stays the same.`;

  return (
    <>
      <section className="rd-panel p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >
          <div>
            <label
              htmlFor="selectUser"
              className="rd-label"
            >
              Select User
            </label>

            <select
              id="selectUser"
              value={selectedUser}
              onChange={(e) => loadUser(e.target.value)}
              data-empty={selectedUser === ""}
              className="rd-input"
            >
              <option value="" disabled hidden>
                Select User
              </option>

              {users.map((entry) => (
                <option
                  key={entry.id}
                  value={entry.id}
                >
                  {entry.username}
                </option>
              ))}
            </select>
          </div>

          <fieldset
            disabled={locked}
            className="space-y-5 disabled:opacity-60"
          >
            <legend className="sr-only">
              User details
            </legend>

            <div>
              <label
                htmlFor="editUsername"
                className="rd-label"
              >
                Username
              </label>

              <input
                id="editUsername"
                name="username"
                value={user.username}
                onChange={handleChange}
                aria-invalid={
                  errors.username
                    ? true
                    : undefined
                }
                aria-describedby={
                  errors.username
                    ? "editUsername-error"
                    : undefined
                }
                className={field(errors.username)}
              />

              {errors.username && (
                <p
                  id="editUsername-error"
                  className={errText}
                >
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="editEmail"
                className="rd-label"
              >
                Email
              </label>

              <input
                id="editEmail"
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                aria-invalid={
                  errors.email
                    ? true
                    : undefined
                }
                aria-describedby={
                  errors.email
                    ? "editEmail-error"
                    : undefined
                }
                className={field(errors.email)}
              />

              {errors.email && (
                <p
                  id="editEmail-error"
                  className={errText}
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="editRole"
                className="rd-label"
              >
                Role
              </label>

              <select
                id="editRole"
                name="role"
                value={user.role ?? ""}
                onChange={handleChange}
                data-empty={user.role === ""}
                aria-invalid={
                  errors.role
                    ? true
                    : undefined
                }
                aria-describedby={
                  errors.role
                    ? "editRole-error"
                    : undefined
                }
                className={field(errors.role)}
              >
                <option value="" disabled hidden>
                  Select Role
                </option>

                {ROLES.map((role) => (
                  <option
                    key={role}
                    value={role}
                  >
                    {roleLabel(role)}
                  </option>
                ))}
              </select>

              {errors.role && (
                <p
                  id="editRole-error"
                  className={errText}
                >
                  {errors.role}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="editPassword"
                className="rd-label"
              >
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
                aria-invalid={
                  errors.password
                    ? true
                    : undefined
                }
                aria-describedby={
                  errors.password
                    ? "editPassword-error"
                    : undefined
                }
                className={field(errors.password)}
              />

              {errors.password && (
                <p
                  id="editPassword-error"
                  className={errText}
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="editConfirmPassword"
                className="rd-label"
              >
                Confirm New Password
              </label>

              <input
                id="editConfirmPassword"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                value={user.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter the new password"
                aria-invalid={
                  errors.confirmPassword
                    ? true
                    : undefined
                }
                aria-describedby={
                  errors.confirmPassword
                    ? "editConfirmPassword-error"
                    : undefined
                }
                className={field(errors.confirmPassword)}
              />

              {errors.confirmPassword && (
                <p
                  id="editConfirmPassword-error"
                  className={errText}
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {locked ? (
              <p className="text-sm text-rd-muted">
                Select a user to begin.
              </p>
            ) : (
              <Badge
                tone={
                  user.archivestatus
                    ? "neutral"
                    : "emerald"
                }
              >
                {user.archivestatus
                  ? "Archived"
                  : "Active"}
              </Badge>
            )}

            <div className="ml-auto flex flex-wrap items-center gap-3">
              {!locked && (
                <button
                  type="button"
                  onClick={() =>
                    setArchiveConfirmOpen(true)
                  }
                  className={`rd-btn-ghost rd-press rd-focus min-h-11 py-0 ${
                    user.archivestatus
                      ? "hover:border-emerald-500/50 hover:text-rd-title"
                      : "text-rd-danger hover:border-rd-danger-edge hover:bg-rd-danger-bg"
                  }`}
                >
                  {user.archivestatus
                    ? "Restore User"
                    : "Archive User"}
                </button>
              )}

              <Link
                href="/dashboard/admin/viewUsers"
                className="rd-btn-ghost rd-press rd-focus min-h-11 py-0"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={
                  locked || submitting
                }
                className="rd-btn rd-press rd-focus"
              >
                {submitting
                  ? "Saving…"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <Toast
        status={status}
        onDismiss={() => setStatus(null)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Save changes?"
        description={confirmDescription}
        confirmLabel="Save changes"
        onConfirm={saveChanges}
        onCancel={() =>
          setConfirmOpen(false)
        }
      />

      <ConfirmDialog
        open={archiveConfirmOpen}
        tone={
          user.archivestatus
            ? "default"
            : "danger"
        }
        title={
          user.archivestatus
            ? "Restore this user?"
            : "Archive this user?"
        }
        description={
          user.archivestatus
            ? `“${user.username}” will be treated as an active user again once you save.`
            : `“${user.username}” will no longer be treated as an active user once you save.`
        }
        confirmLabel={
          user.archivestatus
            ? "Restore user"
            : "Archive user"
        }
        onConfirm={() => {
          setArchiveConfirmOpen(false);

          const archiving =
            !user.archivestatus;

          setUser((prev) => ({
            ...prev,
            archivestatus: archiving,
          }));

          setStatus({
            tone: "success",
            text: archiving
              ? `“${user.username}” is marked as archived. Choose Save Changes to apply it.`
              : `“${user.username}” is marked as active. Choose Save Changes to apply it.`,
          });
        }}
        onCancel={() =>
          setArchiveConfirmOpen(false)
        }
      />
    </>
  );
}

export default function EditUserPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title="Edit User"
        description="Pick an account to edit. Leave the password blank to keep the current one."
      />

      <Suspense
        fallback={
          <section className="rd-panel p-6">
            <p className="py-10 text-center text-sm text-rd-muted">
              Loading…
            </p>
          </section>
        }
      >
        <EditUserForm />
      </Suspense>
    </div>
  );
}