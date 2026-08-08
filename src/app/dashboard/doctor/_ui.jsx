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

export function ChevronRightIcon(props) {
    return (
        <Icon {...props}>
            <path d="m9 6 6 6-6 6" />
        </Icon>
    );
}

export function ArrowLeftIcon(props) {
    return (
        <Icon {...props}>
            <path d="M19 12H5" />
            <path d="m11 6-6 6 6 6" />
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

export function ClockIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </Icon>
    );
}

export function CalendarIcon(props) {
    return (
        <Icon {...props}>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4" />
            <path d="M16 3v4" />
            <path d="M3 11h18" />
        </Icon>
    );
}

export function FileTextIcon(props) {
    return (
        <Icon {...props}>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
            <path d="M14 3v5h5" />
            <path d="M9 13h6" />
            <path d="M9 17h4" />
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

export const th =
    "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted";

export const td = "px-4 py-3 text-sm text-rd-label";

export const rowAction =
    "rd-press rd-focus inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan";

export const backLink =
    "rd-press rd-focus inline-flex w-fit min-h-11 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-medium text-rd-muted hover:border-rd-hair-strong hover:bg-rd-raised hover:text-rd-title";

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

const URGENT = /urgent|stat|critical|emergency/;

const TONE_RULES = [
    [/approved|released|complete|done|ready|finished/, "ok"],
    [/cancel|rejected|failed|void|expired|invalid/, "dead"],
    [URGENT, "danger"],
    [/pending|waiting|queue|review|draft|incomplete|hold|high/, "warn"],
    [/progress|processing|ongoing|assigned|collected|received|active|open/, "info"],
];

function toneOf(value) {
    const text = String(value ?? "").toLowerCase();
    const rule = TONE_RULES.find(([pattern]) => pattern.test(text));
    return rule ? rule[1] : "neutral";
}

export function isUrgent(value) {
    return URGENT.test(String(value ?? "").toLowerCase());
}

const pillTone = {
    ok: "border-emerald-500/40 bg-emerald-500/12 text-rd-title",
    info: "border-cyan-500/40 bg-cyan-500/12 text-rd-title",
    warn: "border-amber-500/45 bg-amber-500/14 text-rd-title",
    danger: "border-red-500/45 bg-red-500/12 text-rd-title",
    dead: "border-rose-500/35 bg-rose-500/10 text-rd-muted",
    neutral: "border-rd-hair-strong bg-rd-raised text-rd-label",
};

const dotTone = {
    ok: "bg-emerald-500",
    info: "bg-cyan-500",
    warn: "bg-amber-500",
    danger: "bg-red-500",
    dead: "bg-rose-500",
    neutral: "bg-rd-muted",
};

export function Pill({ value }) {
    if (!value) return <span className="text-rd-muted">—</span>;

    const tone = toneOf(value);

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${pillTone[tone]}`}
        >
            <span aria-hidden="true" className={`size-1.5 rounded-full ${dotTone[tone]}`} />
            {value}
        </span>
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

export function EmptyState({ title, hint, Icon: Glyph = InboxIcon }) {
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

export function TableSkeleton({ rows = 4 }) {
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
