"use client";

import { useState, useSyncExternalStore } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import { useCurrentUser } from "@/lib/session";

import Toast from "../_toast";
import { PageHeader, roleLabel } from "../_ui";

const ROLES = [
  "Administrator",
  "Receptionist",
  "Medical Technologist",
  "Pathologist",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MIN_USERNAME = 3;

const errText = "mt-1.5 text-sm text-rd-danger";

function field(hasError) {
  return `rd-input ${hasError ? "rd-input--error" : ""}`;
}

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

const getServerSecond = () => 0;

function LiveTimestamp() {
  const tick = useSyncExternalStore(
    subscribeSecond,
    getSecond,
    getServerSecond
  );

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
  const currentUser = useCurrentUser();

  const [user, setUser] = useState({
    username: "",
    fname: "",
    mname: "",
    lname: "",
    password: "",
    confirmPassword: "",
    email: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      found.username = `Username must be at least ${MIN_USERNAME} characters.`;
    }

    if (!user.fname.trim()) {
      found.fname = "First name is required.";
    }

    if (!user.lname.trim()) {
      found.lname = "Last name is required.";
    }

    if (!user.password) {
      found.password = "Password is required.";
    } else if (user.password.length < MIN_PASSWORD) {
      found.password = `Password must be at least ${MIN_PASSWORD} characters.`;
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
      found.confirmPassword = "Please confirm the password.";
    } else if (user.password !== user.confirmPassword) {
      found.confirmPassword = "Passwords do not match.";
    }

    if (!user.email.trim()) {
      found.email = "Email is required.";
    } else if (!EMAIL.test(user.email)) {
      found.email = "Enter a valid email address.";
    }

    if (!user.role) {
      found.role = "Please select a role.";
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

  async function addUser() {
    setConfirmOpen(false);
    setSubmitting(true);

    try {
      const { confirmPassword, ...userData } = user;

      const response = await fetch("/api/users/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, userId: currentUser?.id })
      });

      const result = await response.json();

      if (!response.ok) {
        setStatus({
          tone: "error",
          text:
            result.message ||
            result.error ||
            "Could not add user.",
        });

        return;
      }

      setStatus({
        tone: "success",
        text: `User “${user.username}” added successfully.`,
      });

      setUser({
        username: "",
        fname: "",
        mname: "",
        lname: "",
        password: "",
        confirmPassword: "",
        email: "",
        role: "",
      });

      setErrors({});
    } catch {
      setStatus({
        tone: "error",
        text: "Unable to reach the server. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedRoleLabel = roleLabel(user.role);

  return (
    <div className="mx-auto max-w-6xl space-y-5">

      <PageHeader
        title="Add User"
        description="Create an account and assign the role that matches their department."
      />

      <section className="rd-panel p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          noValidate
        >

          <div>
            <label
              htmlFor="username"
              className="rd-label"
            >
              Username
            </label>

            <input
              id="username"
              type="text"
              name="username"
              autoComplete="off"
              value={user.username}
              onChange={handleChange}
              aria-invalid={
                errors.username ? true : undefined
              }
              aria-describedby={
                errors.username
                  ? "username-error"
                  : undefined
              }
              className={field(errors.username)}
            />

            {errors.username && (
              <p
                id="username-error"
                className={errText}
              >
                {errors.username}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="fname"
              className="rd-label"
            >
              First Name
            </label>

            <input
              id="fname"
              type="text"
              name="fname"
              autoComplete="given-name"
              value={user.fname}
              onChange={handleChange}
              aria-invalid={
                errors.fname ? true : undefined
              }
              aria-describedby={
                errors.fname
                  ? "fname-error"
                  : undefined
              }
              className={field(errors.fname)}
            />

            {errors.fname && (
              <p
                id="fname-error"
                className={errText}
              >
                {errors.fname}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="mname"
              className="rd-label"
            >
              Middle Name
            </label>

            <input
              id="mname"
              type="text"
              name="mname"
              autoComplete="additional-name"
              value={user.mname}
              onChange={handleChange}
              className="rd-input"
            />
          </div>


          <div>
            <label
              htmlFor="lname"
              className="rd-label"
            >
              Last Name
            </label>

            <input
              id="lname"
              type="text"
              name="lname"
              autoComplete="family-name"
              value={user.lname}
              onChange={handleChange}
              aria-invalid={
                errors.lname ? true : undefined
              }
              aria-describedby={
                errors.lname
                  ? "lname-error"
                  : undefined
              }
              className={field(errors.lname)}
            />

            {errors.lname && (
              <p
                id="lname-error"
                className={errText}
              >
                {errors.lname}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="password"
              className="rd-label"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              autoComplete="new-password"
              value={user.password}
              onChange={handleChange}
              aria-invalid={
                errors.password ? true : undefined
              }
              aria-describedby={
                errors.password
                  ? "password-error"
                  : undefined
              }
              className={field(errors.password)}
            />

            {errors.password && (
              <p
                id="password-error"
                className={errText}
              >
                {errors.password}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="confirmPassword"
              className="rd-label"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              value={user.confirmPassword}
              onChange={handleChange}
              aria-invalid={
                errors.confirmPassword
                  ? true
                  : undefined
              }
              aria-describedby={
                errors.confirmPassword
                  ? "confirmPassword-error"
                  : undefined
              }
              className={field(errors.confirmPassword)}
            />

            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className={errText}
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="email"
              className="rd-label"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              autoComplete="off"
              value={user.email}
              onChange={handleChange}
              aria-invalid={
                errors.email ? true : undefined
              }
              aria-describedby={
                errors.email
                  ? "email-error"
                  : undefined
              }
              className={field(errors.email)}
            />

            {errors.email && (
              <p
                id="email-error"
                className={errText}
              >
                {errors.email}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="role"
              className="rd-label"
            >
              Role
            </label>

            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
              data-empty={user.role === ""}
              aria-invalid={
                errors.role ? true : undefined
              }
              aria-describedby={
                errors.role
                  ? "role-error"
                  : undefined
              }
              className={field(errors.role)}
            >
              <option
                value=""
                disabled
                hidden
              >
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
                id="role-error"
                className={errText}
              >
                {errors.role}
              </p>
            )}
          </div>


          <div>
            <label
              htmlFor="createdAt"
              className="rd-label"
            >
              Created At
            </label>

            <LiveTimestamp />

            <p
              id="createdAt-hint"
              className="mt-1.5 text-sm text-rd-muted"
            >
              Recorded automatically when the account is saved.
            </p>
          </div>


          <div className="flex justify-end">

            <button
              type="submit"
              disabled={submitting}
              className="rd-btn rd-press rd-focus"
            >
              {submitting
                ? "Adding…"
                : "Add User"}
            </button>

          </div>

        </form>

      </section>


      <Toast
        status={status}
        onDismiss={() => setStatus(null)}
      />


      <ConfirmDialog
        open={confirmOpen}
        title="Add this user?"
        description={`“${user.username}” will be created with the ${selectedRoleLabel} role and can sign in immediately.`}
        confirmLabel="Add user"
        onConfirm={addUser}
        onCancel={() => setConfirmOpen(false)}
      />

    </div>
  );
}