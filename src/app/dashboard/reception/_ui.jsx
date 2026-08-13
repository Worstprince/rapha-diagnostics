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

export function ClipboardIcon(props) {
    return (
        <Icon {...props}>
            <rect x="8" y="3" width="8" height="4" rx="1.4" />
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <path d="M9 12h6" />
            <path d="M9 16h4" />
        </Icon>
    );
}

export function CalendarCheckIcon(props) {
    return (
        <Icon {...props}>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M8 3v4" />
            <path d="M16 3v4" />
            <path d="M3 11h18" />
            <path d="m9 16 2 2 4-4" />
        </Icon>
    );
}

export function CheckIcon(props) {
    return (
        <Icon {...props}>
            <path d="m5 13 4 4L19 7" />
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

export function ClockIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </Icon>
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
            <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeOpacity="0.3"
                strokeWidth="3"
            />
            <path
                d="M21 12a9 9 0 0 0-9-9"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
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
    "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted";

export const td = "px-5 py-4 text-sm text-rd-label";

export const rowAction =
    "rd-press rd-focus inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]";

export const backLink =
    "rd-press rd-focus inline-flex w-fit min-h-11 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-medium text-rd-muted hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]";

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

const TONE_RULES = [
    [/approved|released|complete|done|ready|finished/, "ok"],
    [/cancel|rejected|failed|void|expired|invalid/, "dead"],
    [/urgent|stat|critical|emergency/, "danger"],
    [/pending|waiting|queue|review|draft|incomplete|hold|high/, "warn"],
    [/progress|processing|ongoing|assigned|collected|received|active|open/, "info"],
];

function toneOf(value) {
    const text = String(value ?? "").toLowerCase();
    const rule = TONE_RULES.find(([pattern]) => pattern.test(text));
    return rule ? rule[1] : "neutral";
}

const pillTone = {
    ok: "border-emerald-500/40 bg-emerald-500/12 text-rd-title",
    info: "border-cyan-500/40 bg-cyan-500/12 text-rd-title",
    warn: "border-amber-500/45 bg-amber-500/14 text-rd-title",
    danger: "border-red-500/50 bg-red-500/14 text-rd-title",
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

export const toneBar = {
    ok: "bg-emerald-500/70",
    info: "bg-cyan-500/70",
    warn: "bg-amber-500/70",
    danger: "bg-red-500/70",
    dead: "bg-rose-500/70",
    neutral: "bg-rd-hair-strong",
};

export function Pill({ value, tone: forcedTone }) {
    if (!value) return <span className="text-rd-muted">—</span>;

    const tone = forcedTone ?? toneOf(value);

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

export function PageHeader({ title, description, action }) {
    return (
        <header className="rd-panel relative flex-none overflow-hidden p-6">

            <HeaderGlow />

            <div className="relative flex flex-wrap items-end justify-between gap-4">

                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                        Reception
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-2 text-sm text-rd-muted">{description}</p>
                    )}
                </div>

                {action}

            </div>

        </header>
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
