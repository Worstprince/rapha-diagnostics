import Link from "next/link";

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

export function ArrowLeftIcon(props) {
    return (
        <Icon {...props}>
            <path d="M19 12H5" />
            <path d="m11 18-6-6 6-6" />
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

const ROLE_LABELS = {
    Physician: "Doctor",
};

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
    Receptionist: "cyan",
    "Medical Technologist": "amber",
    Pathologist: "emerald",
    Physician: "rose",
    Administrator: "violet",
};

export const STAFF_ROLES = Object.keys(ROLE_TONES);

export function roleTone(value) {
    return ROLE_TONES[String(value ?? "")] ?? "neutral";
}


export const EVENT_CATEGORIES = [
    {
        key: "create",
        label: "Created",
        hint: "New records added",
        actions: [
            "User registration",
            "Patient registration",
            "Visitation created",
            "Save Test Result",
        ],
        match: /creat|regist|\badd|\bnew\b|save|submit|insert/,
    },
    {
        key: "update",
        label: "Updated",
        hint: "Existing records changed",
        actions: [
            "User Update",
            "Profile Updated",
            "Update Test Result",
            "Assign MedTech",
        ],
        match: /updat|edit|modif|chang|assign|renam|transfer/,
    },
    {
        key: "approve",
        label: "Approved",
        hint: "Results signed off",
        actions: ["Result Approved"],
        match: /approv|verif|releas|finali|complet/,
    },
    {
        key: "archive",
        label: "Archived",
        hint: "Records withdrawn",
        actions: ["User Archived"],
        match: /archiv|delet|remov|deactivat|disabl|revok|void|cancel/,
    },
    {
        key: "restore",
        label: "Restored",
        hint: "Records reinstated",
        actions: ["User Restored"],
        match: /restor|reactivat|reinstat|unarchiv/,
    },
    {
        key: "security",
        label: "Security",
        hint: "Credentials and permissions",
        actions: ["Password Changed"],
        match: /password|credential|permission|\brole\b|reset|lock/,
    },
    {
        key: "access",
        label: "Access",
        hint: "Sign-ins and sessions",
        actions: ["Login", "Logout"],
        match: /log ?in|log ?out|signed |session/,
    },
];

export const OTHER_CATEGORY = {
    key: "other",
    label: "Other",
    hint: "Not yet categorised",
};

const EXACT = new Map();
for (const category of EVENT_CATEGORIES) {
    for (const action of category.actions) {
        EXACT.set(action.toLowerCase(), category.key);
    }
}

const FALLBACK_ORDER = [
    "archive",
    "restore",
    "security",
    "access",
    "approve",
    "create",
    "update",
];

export function eventCategory(value) {
    const text = String(value ?? "").trim().toLowerCase();
    if (!text) return OTHER_CATEGORY.key;

    const exact = EXACT.get(text);
    if (exact) return exact;

    for (const key of FALLBACK_ORDER) {
        const category = EVENT_CATEGORIES.find((item) => item.key === key);
        if (category.match.test(text)) return category.key;
    }

    return OTHER_CATEGORY.key;
}

export function categoryMeta(key) {
    return EVENT_CATEGORIES.find((item) => item.key === key) ?? OTHER_CATEGORY;
}

export const EVENT_TONE = {
    create: {
        node: "border-rd-ev-create/40 bg-rd-ev-create/12 text-rd-ev-create",
        dot: "bg-rd-ev-create",
        rail: "bg-rd-ev-create/35",
        hover: "group-hover:bg-rd-ev-create/8",
        chip: "border-rd-ev-create/45 bg-rd-ev-create/12 text-rd-ev-create",
    },
    update: {
        node: "border-rd-ev-update/40 bg-rd-ev-update/12 text-rd-ev-update",
        dot: "bg-rd-ev-update",
        rail: "bg-rd-ev-update/35",
        hover: "group-hover:bg-rd-ev-update/8",
        chip: "border-rd-ev-update/45 bg-rd-ev-update/12 text-rd-ev-update",
    },
    approve: {
        node: "border-rd-ev-approve/40 bg-rd-ev-approve/12 text-rd-ev-approve",
        dot: "bg-rd-ev-approve",
        rail: "bg-rd-ev-approve/35",
        hover: "group-hover:bg-rd-ev-approve/8",
        chip: "border-rd-ev-approve/45 bg-rd-ev-approve/12 text-rd-ev-approve",
    },
    archive: {
        node: "border-rd-ev-archive/40 bg-rd-ev-archive/12 text-rd-ev-archive",
        dot: "bg-rd-ev-archive",
        rail: "bg-rd-ev-archive/35",
        hover: "group-hover:bg-rd-ev-archive/8",
        chip: "border-rd-ev-archive/45 bg-rd-ev-archive/12 text-rd-ev-archive",
    },
    restore: {
        node: "border-rd-ev-restore/40 bg-rd-ev-restore/12 text-rd-ev-restore",
        dot: "bg-rd-ev-restore",
        rail: "bg-rd-ev-restore/35",
        hover: "group-hover:bg-rd-ev-restore/8",
        chip: "border-rd-ev-restore/45 bg-rd-ev-restore/12 text-rd-ev-restore",
    },
    security: {
        node: "border-rd-ev-security/40 bg-rd-ev-security/12 text-rd-ev-security",
        dot: "bg-rd-ev-security",
        rail: "bg-rd-ev-security/35",
        hover: "group-hover:bg-rd-ev-security/8",
        chip: "border-rd-ev-security/45 bg-rd-ev-security/12 text-rd-ev-security",
    },
    access: {
        node: "border-rd-ev-access/40 bg-rd-ev-access/12 text-rd-ev-access",
        dot: "bg-rd-ev-access",
        rail: "bg-rd-ev-access/35",
        hover: "group-hover:bg-rd-ev-access/8",
        chip: "border-rd-ev-access/45 bg-rd-ev-access/12 text-rd-ev-access",
    },
    other: {
        node: "border-rd-hair-strong bg-rd-raised text-rd-muted",
        dot: "bg-rd-muted",
        rail: "bg-rd-hair-strong",
        hover: "group-hover:bg-rd-raised",
        chip: "border-rd-hair-strong bg-rd-raised text-rd-muted",
    },
};

export function PlusCircleIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8.5v7" />
            <path d="M8.5 12h7" />
        </Icon>
    );
}

export function ArchiveIcon(props) {
    return (
        <Icon {...props}>
            <path d="M3.5 5.5h17v4h-17z" />
            <path d="M5 9.5V18a1.5 1.5 0 0 0 1.5 1.5h11a1.5 1.5 0 0 0 1.5-1.5V9.5" />
            <path d="M10 13h4" />
        </Icon>
    );
}

export function RestoreIcon(props) {
    return (
        <Icon {...props}>
            <path d="M3.5 12a8.5 8.5 0 1 0 2.7-6.2" />
            <path d="M3.5 4.2v4.6h4.6" />
        </Icon>
    );
}

export function KeyIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="8.5" cy="15.5" r="3.8" />
            <path d="m11.2 12.8 7.6-7.6" />
            <path d="m16.4 7.6 2 2" />
        </Icon>
    );
}

export function SignInIcon(props) {
    return (
        <Icon {...props}>
            <path d="M14.5 3.5h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-3" />
            <path d="m9.5 16.5 4.5-4.5-4.5-4.5" />
            <path d="M14 12H3.5" />
        </Icon>
    );
}

export function PulseIcon(props) {
    return (
        <Icon {...props}>
            <path d="M3 12h3.5l2.5 6 4-13 2.5 7H21" />
        </Icon>
    );
}

export const EVENT_ICON = {
    create: PlusCircleIcon,
    update: PencilIcon,
    approve: CheckCircleIcon,
    archive: ArchiveIcon,
    restore: RestoreIcon,
    security: KeyIcon,
    access: SignInIcon,
    other: PulseIcon,
};

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

export function BackLink({ href, label = "All users", onNavigate }) {

    const className =
        "rd-press rd-focus group/back inline-flex min-h-10 w-fit cursor-pointer items-center gap-2 rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-semibold text-rd-label transition-[color,background-color,border-color,box-shadow] duration-200 hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)] motion-reduce:transition-none";

    const inner = (
        <>
            <ArrowLeftIcon
                size={16}
                className="transition-transform duration-200 group-hover/back:-translate-x-0.5 motion-reduce:transition-none"
            />
            {label}
        </>
    );

    if (onNavigate) {
        return (
            <button type="button" onClick={() => onNavigate(href)} className={className}>
                {inner}
            </button>
        );
    }

    return (
        <Link href={href} className={className}>
            {inner}
        </Link>
    );

}

export function PageHeader({ title, description, back }) {
    return (
        <header className="rd-panel flex-none p-6">
            {back && (
                <div className="mb-4">
                    <BackLink {...back} />
                </div>
            )}
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                Admin
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                {title}
            </h1>
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
