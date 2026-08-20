function Icon({ size = 18, className = "", children }) {
    return (
        <svg
            className={`flex-none ${className}`.trim()}
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

export function SearchIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
        </Icon>
    );
}

export function FilterIcon(props) {
    return (
        <Icon {...props}>
            <path d="M4 6h16" />
            <path d="M7 12h10" />
            <path d="M10 18h4" />
        </Icon>
    );
}

export function CloseIcon(props) {
    return (
        <Icon {...props}>
            <path d="m6 6 12 12" />
            <path d="m18 6-12 12" />
        </Icon>
    );
}

export function ChevronDownIcon(props) {
    return (
        <Icon {...props}>
            <path d="m6 9 6 6 6-6" />
        </Icon>
    );
}

export function ChevronRightIcon(props) {
    return (
        <Icon {...props}>
            <path d="m9 18 6-6-6-6" />
        </Icon>
    );
}

export function PencilIcon(props) {
    return (
        <Icon {...props}>
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </Icon>
    );
}

export function UsersIcon(props) {
    return (
        <Icon {...props}>
            <path d="M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19" />
            <circle cx="9" cy="7" r="3.5" />
            <path d="M17 5.2a3.5 3.5 0 0 1 0 6.6" />
            <path d="M22 19v-1.5a4 4 0 0 0-3-3.8" />
        </Icon>
    );
}

export function FlaskIcon(props) {
    return (
        <Icon {...props}>
            <path d="M9 3h6" />
            <path d="M10 3v6.4L4.9 17.9A2 2 0 0 0 6.6 21h10.8a2 2 0 0 0 1.7-3.1L14 9.4V3" />
            <path d="M7.6 15h8.8" />
        </Icon>
    );
}

export function WalletIcon(props) {
    return (
        <Icon {...props}>
            <path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
            <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" />
            <path d="M21 11h-4a2 2 0 0 0 0 4h4Z" />
        </Icon>
    );
}

export function InboxIcon(props) {
    return (
        <Icon {...props}>
            <path d="M3 13h4l2 3h6l2-3h4" />
            <path d="M5.5 5h13l2.5 8v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4Z" />
        </Icon>
    );
}

export function WarningIcon(props) {
    return (
        <Icon {...props}>
            <path d="m10.3 3.86-8.2 14.2A1.7 1.7 0 0 0 3.55 20.6h16.9a1.7 1.7 0 0 0 1.45-2.54l-8.2-14.2a1.7 1.7 0 0 0-2.9 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </Icon>
    );
}

export function CheckCircleIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.5 2.5 5-5" />
        </Icon>
    );
}

export function XCircleIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="m9.5 9.5 5 5" />
            <path d="m14.5 9.5-5 5" />
        </Icon>
    );
}

export function InfoIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5" />
            <path d="M12 8h.01" />
        </Icon>
    );
}

export function ClockIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3.5 2" />
        </Icon>
    );
}

/* Deliberately empty. This used to render the stored role "Pathologist" as
   "Physician", which was a problem rather than a nicety: "Physician" is itself
   a separate stored role -- the doctor list selects on
   `role = 'Physician' OR role = 'Pathologist'`, and login and the middleware
   both route the two independently. Aliasing one to the other made two
   distinct roles indistinguishable in every admin table and dropdown. Roles
   now display under the name they are saved as. */
const ROLE_LABELS = {};

export function roleLabel(value) {
    const role = String(value ?? "");
    return ROLE_LABELS[role] ?? role;
}

export const toneBadge = {
    cyan: "border-cyan-500/40 bg-cyan-500/12 text-rd-title",
    emerald: "border-emerald-500/40 bg-emerald-500/12 text-rd-title",
    amber: "border-amber-500/45 bg-amber-500/14 text-rd-title",
    violet: "border-violet-500/40 bg-violet-500/12 text-rd-title",
    rose: "border-rose-500/40 bg-rose-500/12 text-rd-title",
    neutral: "border-rd-hair-strong bg-rd-raised text-rd-label",
};

export const toneDot = {
    cyan: "bg-cyan-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    violet: "bg-violet-500",
    rose: "bg-rose-500",
    neutral: "bg-rd-muted",
};

export const toneBar = {
    cyan: "bg-cyan-500/70",
    emerald: "bg-emerald-500/70",
    amber: "bg-amber-500/70",
    violet: "bg-violet-500/70",
    rose: "bg-rose-500/70",
    neutral: "bg-rd-hair-strong",
};

export const toneChip = {
    cyan: "bg-cyan-500/12 text-cyan-600",
    emerald: "bg-emerald-500/12 text-emerald-600",
    amber: "bg-amber-500/12 text-amber-600",
    violet: "bg-violet-500/12 text-violet-600",
    rose: "bg-rose-500/12 text-rose-600",
};

const ROLE_TONES = {
    Administrator: "violet",
    Receptionist: "cyan",
    "Medical Technologist": "amber",
    Pathologist: "emerald",
    Cashier: "rose",
};

export function roleTone(value) {
    return ROLE_TONES[String(value ?? "")] ?? "neutral";
}

const ACTION_TONES = [
    [/create|add|register|insert|new/, "emerald"],
    [/delete|remove|archive|deactivate|disable/, "rose"],
    [/update|edit|modify|change|assign|approve/, "amber"],
    [/login|logout|sign|access|view|search/, "cyan"],
];

export function actionTone(value) {
    const text = String(value ?? "").toLowerCase();
    const rule = ACTION_TONES.find(([pattern]) => pattern.test(text));
    return rule ? rule[1] : "violet";
}

export function Badge({ tone = "neutral", children }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${toneBadge[tone] ?? toneBadge.neutral}`}
        >
            <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${toneDot[tone] ?? toneDot.neutral}`}
            />
            {children}
        </span>
    );
}

export const th =
    "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted";

export const td = "px-5 py-4 text-sm text-rd-label";

export const rowAction =
    "rd-press rd-focus inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]";

export const quietAction =
    "rd-press rd-focus inline-flex w-fit min-h-11 flex-none cursor-pointer items-center gap-1.5 rounded-xl border border-transparent px-3 text-sm font-medium text-rd-muted hover:border-rd-hair-strong hover:bg-rd-raised hover:text-rd-cyan";

export function ClearFilters({ count, onClear }) {
    if (count === 0) return null;

    return (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-rd-hair pt-4">
            <p className="text-sm text-rd-muted">
                <span className="font-semibold text-rd-label">{count}</span>{" "}
                {count === 1 ? "filter" : "filters"} applied
            </p>

            <button type="button" onClick={onClear} className={quietAction}>
                <CloseIcon size={16} />
                Clear filters
            </button>
        </div>
    );
}

export function PageHeader({ title, description }) {
    return (
        <header className="rd-panel flex-none p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                Admin
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">{title}</h1>
            {description && <p className="mt-2 text-sm text-rd-muted">{description}</p>}
        </header>
    );
}

export function SearchField({ label, value, onChange, placeholder }) {
    return (
        <div className="relative flex-1">
            <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rd-placeholder"
            >
                <SearchIcon />
            </span>
            <input
                type="search"
                aria-label={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="rd-input pl-11"
            />
        </div>
    );
}

export function FilterToggle({ open, count, controls, onClick }) {
    const lit = open || count > 0;

    return (
        <button
            type="button"
            onClick={onClick}
            aria-expanded={open}
            aria-controls={controls}
            className={`rd-press rd-focus inline-flex min-h-11 flex-none cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium ${
                lit
                    ? "border-rd-cyan/50 bg-rd-cyan/10 text-rd-cyan shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                    : "border-rd-hair-strong bg-rd-sunken text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
            }`}
        >
            <FilterIcon size={16} />

            Filters

            {count > 0 && (
                <span className="grid size-5 flex-none place-items-center rounded-full border border-rd-cyan/40 bg-rd-cyan/15 text-[11px] font-bold tabular-nums text-rd-cyan">
                    {count}
                </span>
            )}

            <ChevronDownIcon
                size={16}
                className={`transition-transform duration-200 motion-reduce:transition-none ${
                    open ? "rotate-180" : ""
                }`}
            />
        </button>
    );
}

export function FilterField({ label, value, onChange, children }) {
    return (
        <label className="block">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                {label}
            </span>
            <select
                value={value}
                onChange={onChange}
                data-empty={value === ""}
                className="rd-input mt-1.5 py-2.5 text-sm"
            >
                {children}
            </select>
        </label>
    );
}

export function ResultCount({ shown, total, noun }) {
    return (
        <p className="text-sm text-rd-muted">
            Showing <span className="font-semibold text-rd-label">{shown}</span> of{" "}
            <span className="font-semibold text-rd-label">{total}</span> {noun}
        </p>
    );
}

export function StateMessage({ title, hint, Icon: Glyph = InboxIcon }) {
    return (
        <div className="px-4 py-14 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-rd-hair bg-rd-sunken text-rd-muted">
                <Glyph size={22} />
            </span>
            <p className="mt-4 text-sm font-semibold text-rd-title">{title}</p>
            {hint && <p className="mt-1 text-sm text-rd-muted">{hint}</p>}
        </div>
    );
}

export function RowSkeleton({ rows = 5 }) {
    return (
        <div className="space-y-2 p-4">
            {Array.from({ length: rows }).map((_, index) => (
                <div
                    key={index}
                    className="h-12 animate-pulse rounded-xl bg-rd-raised motion-reduce:animate-none"
                />
            ))}
        </div>
    );
}

export function HeaderGlow() {
    return (
        <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-rd-cyan/10 blur-3xl"
        />
    );
}

/* Identity and progress primitives, mirroring the ones the other dashboard
   sections already carry in their own _ui. Admin had no need for them until the
   Add User form grew a live preview panel. */
export function initialsOf(name) {
    if (!name) return "";
    return String(name)
        .split(/[\s._-]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join("");
}

export function Avatar({ name, className = "size-9 text-xs" }) {
    return (
        <span
            aria-hidden="true"
            className={`grid flex-none place-items-center rounded-full bg-rd-cyan/15 font-bold text-rd-cyan ${className}`}
        >
            {initialsOf(name)}
        </span>
    );
}

export function Spinner({ size = 16 }) {
    return (
        <svg
            className="animate-spin motion-reduce:animate-none"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

export function CheckIcon({ size = 16, className = "" }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}
