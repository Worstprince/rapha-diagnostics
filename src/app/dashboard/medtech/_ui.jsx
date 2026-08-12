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

export function CheckIcon(props) {
    return (
        <Icon {...props}>
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.5 2.5 4.5-5" />
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

const DONE = /approved|released|complete|done|finished/;

export function isDone(value) {
    return DONE.test(String(value ?? "").toLowerCase());
}

const TONE_RULES = [
    [DONE, "ok"],
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

export function statusTone(value) {
    return toneOf(value);
}

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
                        Medtech
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

export function SearchField({ label, value, onChange, placeholder }) {
    return (
        <div className="relative w-full sm:w-72">
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

export const formSkin = [

    "[&>form]:mx-auto [&>form]:space-y-6 [&>form]:p-6 sm:[&>form]:p-10",

    "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:uppercase [&_h1]:tracking-[0.14em] [&_h1]:text-rd-title",
    "[&_h1~p]:text-xs [&_h1~p]:leading-relaxed [&_h1~p]:text-rd-muted",

    "[&_h2]:text-sm [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-[0.22em] [&_h2]:text-rd-cyan",

    "[&_.grid.border]:w-full [&_.grid.border]:rounded-none [&_.grid.border]:border-rd-hair [&_.grid.border]:bg-rd-sunken [&_.grid.border]:px-4 [&_.grid.border]:py-3.5 [&_.grid.border]:text-sm [&_.grid.border]:gap-x-10 [&_.grid.border]:gap-y-2.5",

    "[&_b]:mr-1.5 [&_b]:text-[11px] [&_b]:font-semibold [&_b]:uppercase [&_b]:tracking-wider [&_b]:text-rd-muted",

    "[&_table]:w-full [&_table]:max-w-full [&_table]:table-fixed [&_table]:border-collapse",

    "[&_table]:border-rd-hair [&_th]:border-rd-hair [&_td]:border-rd-hair [&_.border]:border-rd-hair",

    "[&_th]:px-4 [&_th]:py-3.5 [&_th]:align-middle [&_th]:leading-snug [&_th]:break-words",
    "[&_td]:px-4 [&_td]:py-3.5 [&_td]:align-middle [&_td]:leading-snug [&_td]:break-words",

    "[&_thead_th]:bg-rd-sunken [&_thead_th]:text-xs [&_thead_th]:font-semibold [&_thead_th]:uppercase [&_thead_th]:tracking-wider [&_thead_th]:text-rd-muted",

    "[&_tbody_tr:nth-child(even)]:bg-rd-sunken/40",

    "[&_input]:w-full [&_input]:rounded-lg [&_input]:border [&_input]:border-rd-hair-strong [&_input]:bg-rd-field [&_input]:px-3 [&_input]:py-2 [&_input]:text-center [&_input]:text-sm [&_input]:font-semibold [&_input]:text-rd-text",
    "[&_select]:w-full [&_select]:rounded-lg [&_select]:border [&_select]:border-rd-hair-strong [&_select]:bg-rd-field [&_select]:py-2 [&_select]:pl-3 [&_select]:pr-10 [&_select]:text-sm [&_select]:font-semibold [&_select]:text-rd-text",
    "[&_textarea]:w-full [&_textarea]:rounded-lg [&_textarea]:border [&_textarea]:border-rd-hair-strong [&_textarea]:bg-rd-field [&_textarea]:px-3 [&_textarea]:py-2 [&_textarea]:text-sm [&_textarea]:text-rd-text",

    "[&_.pt-16]:pt-10 [&_.gap-20]:gap-12",

].join(" ");

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
