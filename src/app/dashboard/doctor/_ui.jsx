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

export function CheckIcon(props) {
    return (
        <Icon {...props}>
            <path d="m5 13 4 4L19 7" />
        </Icon>
    );
}

export function HeartIcon(props) {
    return (
        <Icon {...props}>
            <path d="M12 20s-7-4.6-7-9.4A3.9 3.9 0 0 1 12 8a3.9 3.9 0 0 1 7 2.6c0 4.8-7 9.4-7 9.4Z" />
        </Icon>
    );
}

export function MailIcon(props) {
    return (
        <Icon {...props}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
        </Icon>
    );
}

export function ActivityIcon(props) {
    return (
        <Icon {...props}>
            <path d="M3 12h3.5l2.5-7 4 14 2.5-7H21" />
        </Icon>
    );
}

export function TrendUpIcon(props) {
    return (
        <Icon {...props}>
            <path d="m4 16 5.5-5.5 3.5 3.5L20 7" />
            <path d="M15 7h5v5" />
        </Icon>
    );
}

export function TrendDownIcon(props) {
    return (
        <Icon {...props}>
            <path d="m4 8 5.5 5.5L13 10l7 7" />
            <path d="M15 17h5v-5" />
        </Icon>
    );
}

export function MinusIcon(props) {
    return (
        <Icon {...props}>
            <path d="M5 12h14" />
        </Icon>
    );
}

export function UserIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </Icon>
    );
}

export function CakeIcon(props) {
    return (
        <Icon {...props}>
            <path d="M4 21h16v-6a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3Z" />
            <path d="M12 8V5" />
            <circle cx="12" cy="3.5" r="1" />
        </Icon>
    );
}

export function PhoneIcon(props) {
    return (
        <Icon {...props}>
            <path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
        </Icon>
    );
}

export function MapPinIcon(props) {
    return (
        <Icon {...props}>
            <path d="M20 10.5c0 5-8 11-8 11s-8-6-8-11a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10.5" r="2.75" />
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

export function PrinterIcon(props) {
    return (
        <Icon {...props}>
            <path d="M7 9V4h10v5" />
            <path d="M7 19H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
            <rect x="7" y="15" width="10" height="6" rx="1" />
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
    "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted";

export const td = "px-5 py-4 text-sm text-rd-label";

/* The glow reads from --rd-accent-shadow rather than a baked cyan: the literal
   was dark-mode's bright #22d3ee, which fires a neon halo in light mode where
   the accent is a dark teal. */
export const rowAction =
    "rd-press rd-focus inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label transition duration-150 hover:border-rd-cyan/60 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_var(--rd-accent-shadow)]";

export const backLink =
    "rd-press rd-focus inline-flex w-fit min-h-11 items-center gap-2 rounded-xl border border-transparent px-3 text-sm font-medium text-rd-muted transition duration-150 hover:border-rd-cyan/60 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_var(--rd-accent-shadow)]";

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

const EMERGENCY = /emergency|urgent|stat|critical/;

const TONE_RULES = [
    [/approved|released|complete|done|ready|finished/, "ok"],
    [/cancel|rejected|failed|void|expired|invalid/, "dead"],
    [EMERGENCY, "danger"],
    [/pending|waiting|queue|review|draft|incomplete|hold|high/, "warn"],
    [/progress|processing|ongoing|assigned|collected|received|active|open/, "info"],
];

function toneOf(value) {
    const text = String(value ?? "").toLowerCase();
    const rule = TONE_RULES.find(([pattern]) => pattern.test(text));
    return rule ? rule[1] : "neutral";
}

export function isEmergency(value) {
    return EMERGENCY.test(String(value ?? "").toLowerCase());
}

export function priorityTone(value) {
    return EMERGENCY.test(String(value ?? "").toLowerCase()) ? "danger" : "neutral";
}

export const toneBar = {
    ok: "bg-emerald-500/70",
    info: "bg-cyan-500/70",
    warn: "bg-amber-500/70",
    danger: "bg-red-500/70",
    dead: "bg-rose-500/70",
    neutral: "bg-rd-hair-strong",
};

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

export function PriorityPill({ value }) {
    return <Pill value={value} tone={priorityTone(value)} />;
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
