"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmDialog from "@/components/ConfirmDialog";
import FormDialog from "@/components/FormDialog";
import { MoonIcon, SunIcon } from "@/components/ThemeToggle";
import {
  CheckIcon,
  ChevronUpDownIcon,
  DotIcon,
  EyeIcon,
  KeyIcon,
  PaletteIcon,
  SignOutIcon,
  UserPenIcon,
} from "@/components/icons";
import { setCurrentUser, signOut, useCurrentUser } from "@/lib/session";
import { useTheme } from "@/lib/theme";

const MIN_USERNAME = 3;

/* Same rules the Add User form enforces, restated as a checklist so the meter
   and the validator can never drift apart. */
const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "lower", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { id: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "number", label: "One number", test: (v) => /\d/.test(v) },
  { id: "symbol", label: "One symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

/* Reads off the same met-rule count the meter draws from, so the word and the
   bar can't disagree. An empty field gets no label at all — nothing typed yet
   isn't a verdict of "weak". */
function strengthLabel(met, value) {
  if (!value) return "";
  if (met <= 2) return "Weak";
  if (met < PASSWORD_RULES.length) return "Fair";
  return "Strong";
}

const errText = "mt-1.5 text-sm text-rd-danger";

function field(hasError) {
  return `rd-input ${hasError ? "rd-input--error" : ""}`;
}

function initialsOf(name) {
  if (!name) return "";
  return name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function Avatar({ name, className = "size-9 text-xs" }) {
  return (
    <span
      aria-hidden="true"
      className={`grid flex-none place-items-center rounded-full bg-rd-cyan/15 font-bold text-rd-cyan ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}

/* Rows are deliberately single-line and uniform in height. Descriptive hints
   under each label turned the menu into a settings page; the labels carry it. */
const menuRow =
  "rd-press rd-focus group flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-2 text-left";

const menuGlyph =
  "grid size-9 flex-none place-items-center rounded-lg transition-colors duration-150 motion-reduce:transition-none";

function MenuRow({ Icon, label, onClick, tone = "default" }) {
  const danger = tone === "danger";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${menuRow} ${danger ? "hover:bg-rd-danger-bg" : "hover:bg-rd-raised"}`}
    >
      <span
        className={`${menuGlyph} ${
          danger
            ? "bg-rd-danger-bg text-rd-danger"
            : "bg-rd-sunken text-rd-muted group-hover:bg-rd-cyan/12 group-hover:text-rd-cyan"
        }`}
      >
        <Icon />
      </span>
      <span
        className={`truncate text-sm font-medium ${
          danger ? "text-rd-danger" : "text-rd-label group-hover:text-rd-title"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function PasswordField({ id, label, value, onChange, error, autoComplete, inputRef, describedBy }) {
  const [visible, setVisible] = useState(false);

  const described = [error ? `${id}-error` : null, describedBy].filter(Boolean).join(" ");

  return (
    <div>
      <label htmlFor={id} className="rd-label">
        {label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={described || undefined}
          className={`${field(error)} pr-14`}
        />

        {/* onMouseDown is swallowed so peeking at the value never pulls the
            caret out of the field you're typing in. */}
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          onMouseDown={(event) => event.preventDefault()}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="rd-focus absolute right-1 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-rd-muted hover:text-rd-title"
        >
          <EyeIcon off={visible} />
        </button>
      </div>

      {error && (
        <p id={`${id}-error`} className={errText}>
          {error}
        </p>
      )}
    </div>
  );
}

function StatusNote({ status }) {
  if (!status) return null;

  return (
    <p
      role={status.tone === "error" ? "alert" : "status"}
      className={`rd-status mt-4 ${
        status.tone === "error" ? "rd-status--error" : "rd-status--success"
      }`}
    >
      {status.text}
    </p>
  );
}

function DialogActions({ onCancel, submitLabel }) {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" onClick={onCancel} className="rd-btn-ghost rd-press rd-focus">
        Cancel
      </button>
      <button type="submit" className="rd-btn rd-press rd-focus">
        {submitLabel}
      </button>
    </div>
  );
}

function EditProfileDialog({ open, user, onClose }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inputRef = useRef(null);

  /* Reset per opening rather than per render, so reopening after a cancel shows
     the stored value again instead of the abandoned edit. */
  useEffect(() => {
    if (!open) return;
    setUsername(user?.username ?? "");
    setError("");
    setStatus(null);
    setConfirmOpen(false);
  }, [open, user?.username]);

  async function handleConfirm() {
    setConfirmOpen(false);

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || "Unable to update username.");
      }

      const nextUser = { ...user, username };
      setCurrentUser(nextUser);
      setStatus({ tone: "success", text: "Username updated successfully." });
      onClose();
    } catch (error) {
      setStatus({
        tone: "error",
        text: error.message || "Unable to update your username right now.",
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const value = username.trim();

    if (!value) {
      setError("Username is required.");
      inputRef.current?.focus();
      return;
    }
    if (value.length < MIN_USERNAME) {
      setError(`Username must be at least ${MIN_USERNAME} characters.`);
      inputRef.current?.focus();
      return;
    }
    if (value === user?.username) {
      setError("That is already your username.");
      inputRef.current?.focus();
      return;
    }

    setError("");
    setStatus(null);
    setConfirmOpen(true);
  }

  return (
    <>
      <FormDialog
        open={open}
        title="Edit profile"
        description="Update the name your account signs in and appears under."
        onClose={onClose}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="account-username" className="rd-label">
              Username
            </label>
            <input
              ref={inputRef}
              id="account-username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "account-username-error" : undefined}
              className={field(error)}
            />
            {error && (
              <p id="account-username-error" className={errText}>
                {error}
              </p>
            )}
          </div>

          {/* Email and role are shown for context but stay read-only — both are
              administrator-managed, and a disabled input would wrongly imply this
              screen could someday edit them. */}
          <dl className="mt-5 space-y-3 rounded-xl border border-rd-hair bg-rd-sunken p-4">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-rd-muted">Email</dt>
              <dd className="min-w-0 truncate text-sm text-rd-label">{user?.email ?? "—"}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-rd-muted">Role</dt>
              <dd className="min-w-0 truncate text-sm text-rd-label">{user?.role ?? "—"}</dd>
            </div>
          </dl>

          <p className="mt-2.5 text-xs text-rd-muted">
            Email and role are managed by an administrator.
          </p>

          <StatusNote status={status} />

          <DialogActions onCancel={onClose} submitLabel="Save changes" />
        </form>
      </FormDialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Update username?"
        description={`This will change your display name from ${user?.username ?? "your current username"} to ${username.trim()}.`}
        confirmLabel="Save username"
        cancelLabel="Keep current"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

const EMPTY_PASSWORD_FORM = { currentPassword: "", newPassword: "", confirmPassword: "" };

function ChangePasswordDialog({ open, user, onClose }) {
  const [form, setForm] = useState(EMPTY_PASSWORD_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const currentRef = useRef(null);
  const newRef = useRef(null);
  const confirmRef = useRef(null);
  const refs = {
    currentPassword: currentRef,
    newPassword: newRef,
    confirmPassword: confirmRef,
  };

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY_PASSWORD_FORM);
    setErrors({});
    setStatus(null);
    setConfirmOpen(false);
  }, [open]);

  function update(name) {
    return (event) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => {
        if (!prev[name]) return prev;
        const next = { ...prev };
        delete next[name];
        return next;
      });
    };
  }

  const strength = PASSWORD_RULES.filter((rule) => rule.test(form.newPassword)).length;

  async function handleConfirm() {
    setConfirmOpen(false);

    try {
      const response = await fetch(`/api/users/${user.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result?.message || "Unable to update password.");
      }

      setStatus({ tone: "success", text: "Password updated successfully." });
      onClose();
    } catch (error) {
      setStatus({
        tone: "error",
        text: error.message || "Unable to update your password right now.",
      });
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    const found = {};

    if (!form.currentPassword) {
      found.currentPassword = "Enter your current password.";
    }

    if (!form.newPassword) {
      found.newPassword = "Enter a new password.";
    } else {
      const failed = PASSWORD_RULES.find((rule) => !rule.test(form.newPassword));
      if (failed) {
        found.newPassword = `Password needs: ${failed.label.toLowerCase()}.`;
      } else if (form.newPassword === form.currentPassword) {
        found.newPassword = "New password must differ from the current one.";
      }
    }

    if (!form.confirmPassword) {
      found.confirmPassword = "Re-enter the new password.";
    } else if (form.confirmPassword !== form.newPassword) {
      found.confirmPassword = "Passwords do not match.";
    }

    setErrors(found);

    const firstInvalid = ["currentPassword", "newPassword", "confirmPassword"].find(
      (name) => found[name],
    );
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    setStatus(null);
    setConfirmOpen(true);
  }

  return (
    <>
      <FormDialog
        open={open}
        title="Change password"
        description="Choose a password you don't use anywhere else."
        onClose={onClose}
      >
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <PasswordField
            id="current-password"
            label="Current password"
            value={form.currentPassword}
            onChange={update("currentPassword")}
            error={errors.currentPassword}
            autoComplete="current-password"
            inputRef={currentRef}
          />

          <div>
            <PasswordField
              id="new-password"
              label="New password"
              value={form.newPassword}
              onChange={update("newPassword")}
              error={errors.newPassword}
              autoComplete="new-password"
              inputRef={newRef}
              describedBy="password-rules"
            />

            {/* Segments are backed by the same rule list the validator uses, so the
                meter can never claim a password is stronger than it validates. */}
            <div aria-hidden="true" className="mt-3 flex items-center gap-3">
              <div className="flex flex-1 gap-1.5">
                {PASSWORD_RULES.map((rule, index) => (
                  <span
                    key={rule.id}
                    className={`h-1 flex-1 rounded-full transition-colors duration-200 motion-reduce:transition-none ${
                      index < strength ? "bg-rd-fresh" : "bg-rd-hair-strong"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`w-12 flex-none text-right text-xs font-semibold ${
                  strength === PASSWORD_RULES.length ? "text-rd-fresh" : "text-rd-muted"
                }`}
              >
                {strengthLabel(strength, form.newPassword)}
              </span>
            </div>

            <ul id="password-rules" className="mt-3 grid gap-1.5 sm:grid-cols-2">
              {PASSWORD_RULES.map((rule) => {
                const ok = rule.test(form.newPassword);
                return (
                  <li
                    key={rule.id}
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 motion-reduce:transition-none ${
                      ok ? "text-rd-fresh" : "text-rd-muted"
                    }`}
                  >
                    {ok ? <CheckIcon size={14} /> : <DotIcon size={14} />}
                    <span>{rule.label}</span>
                    <span className="sr-only">{ok ? "requirement met" : "requirement not met"}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            error={errors.confirmPassword}
            autoComplete="new-password"
            inputRef={confirmRef}
          />

          <StatusNote status={status} />

          <DialogActions onCancel={onClose} submitLabel="Update password" />
        </form>
      </FormDialog>

      <ConfirmDialog
        open={confirmOpen}
        title="Change password?"
        description="Your current password will be replaced, and you’ll need to use the new one the next time you sign in."
        confirmLabel="Update password"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export default function AccountMenu() {
  const router = useRouter();
  const user = useCurrentUser();
  const { theme, toggle } = useTheme();

  const panelId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* The popover closes as a dialog opens, so the row that opened it is gone by
     the time the dialog closes — ConfirmDialog's restore-to-opener lands on a
     detached node and focus falls to <body>. Claiming it a frame later, once
     that restore has run, hands it back to the trigger instead. */
  function returnFocus() {
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function openDialog(name) {
    setOpen(false);
    setDialog(name);
  }

  function closeDialog() {
    setDialog(null);
    returnFocus();
  }

  const handleSignOut = () => {
    setConfirmOpen(false);
    signOut();
    router.push("/auth/login");
  };

  /* The session is null on the server and on the first client paint, so rather
     than flash a guessed name this holds the exact footprint of the loaded row —
     the nav above it doesn't shift when the real one arrives. */
  if (!user) {
    return (
      <div
        aria-hidden="true"
        className="flex items-center gap-3 rounded-xl border border-rd-hair bg-rd-sunken p-2.5"
      >
        <span className="size-9 flex-none rounded-full bg-rd-raised" />
        <span className="flex-1 space-y-1.5">
          <span className="block h-3 w-2/3 rounded bg-rd-raised" />
          <span className="block h-2.5 w-1/2 rounded bg-rd-raised" />
        </span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div ref={rootRef} className="relative z-10">
      {/* The panel is capped and scrollable so a short viewport can't push it off
          the top of the sidebar, and its edge is hair-strong rather than hair —
          in light mode the popover and the sidebar behind it are both white, and
          the softer rule leaves the panel with no discernible boundary. */}
      {open && (
        <div
          id={panelId}
          className="rd-pop rd-scroll-thin absolute bottom-full left-0 right-0 z-[80] mb-2 max-h-[calc(100dvh-11rem)] overflow-y-auto overscroll-contain rounded-2xl border border-rd-hair-strong bg-rd-popover p-2 shadow-[var(--rd-card-shadow)]"
        >
          {/* Identity reads as a card rather than another row, so the menu opens
              with a clear "this is you" block above the actions. */}
          <div className="flex items-start gap-3 rounded-xl border border-rd-hair bg-rd-sunken p-3">
            <Avatar name={user.username} className="size-10 text-sm" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-rd-title">{user.username}</p>
              {user.email && (
                <p className="mt-0.5 truncate text-xs text-rd-muted">{user.email}</p>
              )}
              <span className="mt-2 inline-flex items-center rounded-full border border-rd-cyan/40 bg-rd-cyan/12 px-2 py-0.5 text-[11px] font-semibold text-rd-cyan">
                {user.role}
              </span>
            </div>
          </div>

          <div className="mt-2">
            <MenuRow
              Icon={UserPenIcon}
              label="Edit profile"
              onClick={() => openDialog("profile")}
            />
            <MenuRow
              Icon={KeyIcon}
              label="Change password"
              onClick={() => openDialog("password")}
            />
          </div>

          <div className="mt-2 border-t border-rd-hair pt-2">
            {/* The whole row is the switch, not just the track — a 68px target
                beside a label that looked clickable but wasn't. Labelled for the
                thing being switched, so it announces "Dark mode, switch, on"
                rather than an ambiguous "Appearance, on". */}
            <button
              type="button"
              role="switch"
              aria-checked={isDark}
              onClick={toggle}
              className={`${menuRow} hover:bg-rd-raised`}
            >
              <span
                className={`${menuGlyph} bg-rd-sunken text-rd-muted group-hover:bg-rd-cyan/12 group-hover:text-rd-cyan`}
              >
                <PaletteIcon />
              </span>
              <span className="flex-1 truncate text-sm font-medium text-rd-label group-hover:text-rd-title">
                Dark mode
              </span>

              {/* Decorative twin of the login toggle: the row owns the
                  interaction, so this must not be a second focus stop inside it. */}
              <span aria-hidden="true" className="rd-theme block">
                <SunIcon className="rd-theme-i rd-theme-sun" />
                <MoonIcon className="rd-theme-i rd-theme-moon" />
                <span className="rd-theme-knob">{isDark ? <MoonIcon /> : <SunIcon />}</span>
              </span>
            </button>
          </div>

          {/* Sign out sits behind its own rule: a destructive action shouldn't be
              one mis-tap away from the row above it. */}
          <div className="mt-2 border-t border-rd-hair pt-2">
            <MenuRow
              Icon={SignOutIcon}
              label="Sign out"
              tone="danger"
              onClick={() => {
                setOpen(false);
                setConfirmOpen(true);
              }}
            />
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={`rd-press rd-focus flex w-full cursor-pointer items-center gap-3 rounded-xl border p-2.5 text-left ${
          open
            ? "border-rd-cyan/40 bg-rd-raised"
            : "border-rd-hair bg-rd-sunken hover:border-rd-hair-strong hover:bg-rd-raised"
        }`}
      >
        <Avatar name={user.username} />

        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-semibold text-rd-title">
            {user.username}
          </span>
          <span className="block truncate text-xs text-rd-muted">{user.role}</span>
        </span>

        <ChevronUpDownIcon className={open ? "text-rd-cyan" : "text-rd-muted"} />
      </button>

      <EditProfileDialog open={dialog === "profile"} user={user} onClose={closeDialog} />

      <ChangePasswordDialog open={dialog === "password"} user={user} onClose={closeDialog} />

      <ConfirmDialog
        open={confirmOpen}
        tone="danger"
        title="Sign out?"
        description={`You'll be signed out of ${user.username} and returned to the login page.`}
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={handleSignOut}
        onCancel={() => {
          setConfirmOpen(false);
          returnFocus();
        }}
      />
    </div>
  );
}
