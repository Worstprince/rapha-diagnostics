"use client";


import { CheckIcon } from "./_ui";

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MIN_PASSWORD = 8;
export const MIN_USERNAME = 3;

export const errText = "mt-1.5 text-sm text-rd-danger";

export function field(hasError) {
    return `rd-input ${hasError ? "rd-input--error" : ""}`;
}

export const PASSWORD_RULES = [
    { key: "length", label: `At least ${MIN_PASSWORD} characters` },
    { key: "lower", label: "One lowercase letter" },
    { key: "upper", label: "One uppercase letter" },
    { key: "digit", label: "One number" },
    { key: "symbol", label: "One symbol" },
];

export function passwordChecks(value) {
    return {
        length: value.length >= MIN_PASSWORD,
        lower: /[a-z]/.test(value),
        upper: /[A-Z]/.test(value),
        digit: /\d/.test(value),
        symbol: /[^A-Za-z0-9]/.test(value),
    };
}

export function firstPasswordProblem(value) {
    const checks = passwordChecks(value);
    const failed = PASSWORD_RULES.find((rule) => !checks[rule.key]);

    return failed ? `Password needs: ${failed.label.toLowerCase()}.` : null;
}

export function SectionHeader({ title, description, aside }) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-rd-hair p-4">
            <div className="min-w-0">
                <h2 className="text-lg font-semibold text-rd-title">{title}</h2>
                <p className="mt-0.5 text-sm text-rd-muted">{description}</p>
            </div>
            {aside}
        </div>
    );
}

export function Field({ id, label, error, hint, required = false, className = "", children }) {
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

            {error ? (
                <p id={`${id}-error`} role="alert" className={errText}>
                    {error}
                </p>
            ) : (
                hint && <p className="mt-1.5 text-xs text-rd-muted">{hint}</p>
            )}

        </div>
    );
}

export function SummaryRow({ label, value }) {
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

export function Requirement({ met, label }) {
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

export function EyeIcon({ off = false, size = 18 }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7Z" />
            {off ? <path d="M4.5 4.5l15 15" /> : <circle cx="12" cy="12" r="3" />}
        </svg>
    );
}

export function PasswordField({
    id,
    name,
    value,
    onChange,
    placeholder,
    error,
    shown,
    onToggle,
    autoComplete = "new-password",
}) {
    return (
        <div className="relative">

            <input
                id={id}
                name={name}
                type={shown ? "text" : "password"}
                autoComplete={autoComplete}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`${field(error)} pr-12`}
            />

            <button
                type="button"
                onClick={onToggle}
                aria-pressed={shown}
                aria-controls={id}
                aria-label={shown ? "Hide password" : "Show password"}
                className="rd-focus absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-rd-muted transition-colors hover:bg-rd-raised hover:text-rd-title"
            >
                <EyeIcon off={!shown} />
            </button>

        </div>
    );
}
