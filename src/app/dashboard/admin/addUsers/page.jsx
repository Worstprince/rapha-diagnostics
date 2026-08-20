"use client";

import { useState, useSyncExternalStore } from "react";

import ConfirmDialog from "@/components/ConfirmDialog";
import { useCurrentUser } from "@/lib/session";

import Toast from "../_toast";
import { Avatar, CheckIcon, PageHeader, Spinner, roleLabel } from "../_ui";

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

/* One definition of the blank account, used by both the initial state and the
   post-submit reset so the two can't drift apart. */
const EMPTY_USER = {
  username: "",
  fname: "",
  mname: "",
  lname: "",
  password: "",
  confirmPassword: "",
  email: "",
  role: "",
};

/* Drives the progress meter in the preview panel. confirmPassword is in the
   list on purpose: leaving it out let a mismatched pair still read as complete,
   which is the same lie in a different place. With every rule counted, a full
   bar means exactly one thing -- submit will go through. */
const REQUIRED_FIELDS = [
  "fname",
  "lname",
  "username",
  "email",
  "role",
  "password",
  "confirmPassword",
];

const PASSWORD_RULES = [
  { key: "length", label: `At least ${MIN_PASSWORD} characters` },
  { key: "lower", label: "One lowercase letter" },
  { key: "upper", label: "One uppercase letter" },
  { key: "digit", label: "One number" },
  { key: "symbol", label: "One symbol" },
];

/* What the preview says about the password. Never the password itself: this
   panel sits open on a shared admin workstation, and the value is the one thing
   on the form that must not be readable from across the desk.

   It reports only what the preview is good at answering -- is one set, and do
   the two entries agree. Which rules are still outstanding is the checklist's
   job, directly under the field where it can be acted on. */
function passwordSummary(user) {
  if (!user.password) return "";
  if (!user.confirmPassword) return "Needs confirming";
  if (user.password !== user.confirmPassword) return "Does not match";

  return "Set and confirmed";
}

function passwordChecks(value) {
  return {
    length: value.length >= MIN_PASSWORD,
    lower: /[a-z]/.test(value),
    upper: /[A-Z]/.test(value),
    digit: /\d/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };
}

function SectionHeader({ title, description }) {
  return (
    <div className="border-b border-rd-hair p-4">
      <h2 className="text-lg font-semibold text-rd-title">{title}</h2>
      <p className="mt-0.5 text-sm text-rd-muted">{description}</p>
    </div>
  );
}

function Field({ id, label, error, required = false, className = "", children }) {
  return (
    <div className={`min-w-0 ${className}`.trim()}>

      <label htmlFor={id} className="rd-label">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-1 text-rd-danger">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p id={`${id}-error`} role="alert" className={errText}>
          {error}
        </p>
      )}

    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <dt className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-sm font-medium text-rd-text">
        {value || <span className="text-rd-placeholder">Not set</span>}
      </dd>
    </div>
  );
}

/* Met state is carried by the icon as well as the colour, so the list still
   reads for anyone who can't separate the green from the grey. */
function Requirement({ met, label }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      <span
        aria-hidden="true"
        className={`grid size-4 flex-none place-items-center rounded-full ${
          met ? "bg-emerald-500/15 text-emerald-500" : "bg-rd-raised text-rd-muted"
        }`}
      >
        {met ? <CheckIcon size={11} /> : <span className="size-1 rounded-full bg-current" />}
      </span>
      <span className={met ? "text-rd-label" : "text-rd-muted"}>{label}</span>
      <span className="sr-only">{met ? " — met" : " — not met"}</span>
    </li>
  );
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

/* Every rule the form enforces, in one place. validate() reports them to the
   user; the preview meter counts them. One source means the meter cannot show
   a form as ready that submit would then turn around and reject — which it did:
   it counted any non-empty value, so “sas” passed as an email and the bar read
   6/6 complete on a form that could not be saved. */
function fieldErrors(user) {
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

  return found;
}
export default function AddUsers() {
  const currentUser = useCurrentUser();

  const [user, setUser] = useState(EMPTY_USER);

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
    const found = fieldErrors(user);

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

      setUser(EMPTY_USER);

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

  const fullName = [user.fname, user.mname, user.lname]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");

  const selectedRoleLabel = roleLabel(user.role);

  const checks = passwordChecks(user.password);

  /* Counted against the real rules, not against emptiness. The meter used to
     tick up for any non-blank value, so a half-typed email read as done and the
     bar sat at complete on a form submit would reject. */
  const pending = fieldErrors(user);
  const filledRequired = REQUIRED_FIELDS.filter((key) => !pending[key]).length;
  const isComplete = filledRequired === REQUIRED_FIELDS.length;
  const isDirty = Object.values(user).some((value) => value !== "");

  function handleReset() {
    setUser(EMPTY_USER);
    setErrors({});
    setStatus(null);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5">

      <PageHeader
        title="Add User"
        description="Create an account and assign the role that matches their department."
      />

      <form onSubmit={handleSubmit} className="w-full max-w-full space-y-5" noValidate>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start">

          <div className="space-y-5">

            <section className="rd-panel">

              <SectionHeader
                title="Personal information"
                description="The staff member's legal name, as it should appear on records."
              />

              <div className="grid gap-4 p-4 sm:grid-cols-2">

                <Field id="fname" label="First name" required error={errors.fname}>
                  <input
                    id="fname"
                    type="text"
                    name="fname"
                    autoComplete="off"
                    value={user.fname}
                    onChange={handleChange}
                    placeholder="Juan"
                    aria-invalid={errors.fname ? true : undefined}
                    aria-describedby={errors.fname ? "fname-error" : undefined}
                    className={field(errors.fname)}
                  />
                </Field>

                <Field id="mname" label="Middle name">
                  <input
                    id="mname"
                    type="text"
                    name="mname"
                    autoComplete="off"
                    value={user.mname}
                    onChange={handleChange}
                    placeholder="Santos"
                    className={field(false)}
                  />
                </Field>

                <Field
                  id="lname"
                  label="Last name"
                  required
                  error={errors.lname}
                  className="sm:col-span-2"
                >
                  <input
                    id="lname"
                    type="text"
                    name="lname"
                    autoComplete="off"
                    value={user.lname}
                    onChange={handleChange}
                    placeholder="Dela Cruz"
                    aria-invalid={errors.lname ? true : undefined}
                    aria-describedby={errors.lname ? "lname-error" : undefined}
                    className={field(errors.lname)}
                  />
                </Field>

              </div>

            </section>


            <section className="rd-panel">

              <SectionHeader
                title="Account access"
                description="How they sign in, and what the account is allowed to reach."
              />

              <div className="grid gap-4 p-4 sm:grid-cols-2">

                <Field id="username" label="Username" required error={errors.username}>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    autoComplete="off"
                    value={user.username}
                    onChange={handleChange}
                    placeholder="jdelacruz"
                    aria-invalid={errors.username ? true : undefined}
                    aria-describedby={errors.username ? "username-error" : undefined}
                    className={field(errors.username)}
                  />
                </Field>

                <Field id="email" label="Email address" required error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="off"
                    value={user.email}
                    onChange={handleChange}
                    placeholder="name@rapha.com"
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={field(errors.email)}
                  />
                </Field>

                <Field id="role" label="Role" required error={errors.role}>
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
                    <option value="" disabled hidden>
                      Select Role
                    </option>

                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {roleLabel(role)}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="createdAt" label="Created at">
                  <LiveTimestamp />
                  <p id="createdAt-hint" className="mt-1.5 text-xs text-rd-muted">
                    Recorded automatically when the account is saved.
                  </p>
                </Field>

              </div>

            </section>


            <section className="rd-panel">

              <SectionHeader
                title="Password"
                description="Set the first password. The account can sign in with it immediately."
              />

              <div className="grid gap-4 p-4 sm:grid-cols-2">

                <Field id="password" label="Password" required error={errors.password}>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    value={user.password}
                    onChange={handleChange}
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={errors.password ? "password-error" : "password-rules"}
                    className={field(errors.password)}
                  />
                </Field>

                <Field
                  id="confirmPassword"
                  label="Confirm password"
                  required
                  error={errors.confirmPassword}
                >
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={errors.confirmPassword ? true : undefined}
                    aria-describedby={
                      errors.confirmPassword ? "confirmPassword-error" : undefined
                    }
                    className={field(errors.confirmPassword)}
                  />
                </Field>

                {/* validate() tests the five rules in sequence and reports only the
                    first failure, so a weak password took up to four submits to
                    fix. Showing all five live turns that into none. */}
                <ul
                  id="password-rules"
                  className="grid gap-x-4 gap-y-1.5 sm:col-span-2 sm:grid-cols-2"
                >
                  {PASSWORD_RULES.map(({ key, label }) => (
                    <Requirement key={key} met={checks[key]} label={label} />
                  ))}
                </ul>

              </div>

            </section>

          </div>


          <aside className="lg:sticky lg:top-4">

            <section className="rd-panel">

              <SectionHeader
                title="Account preview"
                description="A quick check of what will be created."
              />

              <div className="space-y-4 p-4">

                <div className="flex items-center gap-3 rounded-xl border border-rd-hair bg-rd-sunken p-3">

                  <Avatar
                    name={fullName || user.username || "?"}
                    className="size-11 text-sm"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-rd-title">
                      {fullName || "New staff member"}
                    </p>
                    <p className="mt-0.5 text-xs text-rd-muted">
                      {user.role ? selectedRoleLabel : "Role not set"}
                    </p>
                  </div>

                </div>

                <dl className="divide-y divide-rd-hair">
                  <SummaryRow label="Username" value={user.username} />
                  <SummaryRow label="Email" value={user.email} />
                  <SummaryRow label="Role" value={user.role ? selectedRoleLabel : ""} />
                  <SummaryRow label="Password" value={passwordSummary(user)} />
                </dl>

                <div className="rounded-xl border border-rd-hair bg-rd-sunken p-3">

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                      Required fields
                    </span>
                    <span className="text-sm font-bold tabular-nums text-rd-title">
                      {filledRequired}/{REQUIRED_FIELDS.length}
                    </span>
                  </div>

                  <div
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={REQUIRED_FIELDS.length}
                    aria-valuenow={filledRequired}
                    aria-label="Required fields completed"
                    className="mt-2 h-1.5 overflow-hidden rounded-full bg-rd-raised"
                  >
                    <span
                      className={`block h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${
                        isComplete ? "bg-emerald-500" : "bg-rd-cyan"
                      }`}
                      style={{
                        width: `${(filledRequired / REQUIRED_FIELDS.length) * 100}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="flex flex-col gap-2.5">

                  <button
                    type="submit"
                    disabled={submitting}
                    className="rd-btn rd-press rd-focus w-full"
                  >
                    {submitting ? (
                      <>
                        <Spinner />
                        Adding…
                      </>
                    ) : (
                      <>
                        <CheckIcon size={16} />
                        Add User
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={submitting || !isDirty}
                    className="rd-btn-ghost rd-press rd-focus w-full"
                  >
                    Clear form
                  </button>

                </div>

              </div>

            </section>

          </aside>

        </div>

      </form>


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
