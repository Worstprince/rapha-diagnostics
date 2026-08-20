"use client";

import { useEffect, useMemo, useState } from "react";

import {
    Avatar,
    ClearFilters,
    EVENT_ICON,
    EVENT_TONE,
    FilterField,
    FilterToggle,
    PageHeader,
    ResultCount,
    RowSkeleton,
    SearchField,
    StateMessage,
    categoryMeta,
    eventCategory,
} from "../_ui";


const DAY_MS = 86400000;


function startOfDay(value) {

    const date = new Date(value);

    date.setHours(0, 0, 0, 0);

    return date.getTime();

}


/* The rows used to print the raw column value, which arrives as an ISO string:
   "2026-08-19T19:47:16.000Z". That is unreadable at a glance and it is also the
   UTC instant, so an admin in Manila reading a log of their own morning's work
   saw the previous evening's date on every line. The Date the driver hands back
   is correct -- only the rendering was wrong -- so the local wall clock goes on
   screen, with the full timestamp kept on hover. */
function timeLabel(date) {

    return date.toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit"
    });

}


function fullLabel(date) {

    return date.toLocaleString("en-PH", {
        dateStyle: "full",
        timeStyle: "medium"
    });

}


function dayLabel(dayStart, todayStart) {

    const date = new Date(dayStart);

    if (todayStart !== null) {

        const days = Math.round((todayStart - dayStart) / DAY_MS);

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";

    }

    return date.toLocaleDateString("en-PH", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year:
            todayStart !== null &&
            date.getFullYear() === new Date(todayStart).getFullYear()
                ? undefined
                : "numeric"
    });

}


export default function ActivityLogPage() {

    const [logs, setLogs] = useState([]);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [modules, setModules] = useState([]);
    const [actions, setActions] = useState([]);
    const [usernames, setUsernames] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [moduleFilter, setModuleFilter] = useState("");

    const [actionFilter, setActionFilter] = useState("");

    const [usernameFilter, setUsernameFilter] = useState("");

    const [sortDate, setSortDate] = useState("");


    useEffect(() => {

        let cancelled = false;

        async function fetchLogs() {

            setLoading(true);

            try {

                const params = new URLSearchParams();

                params.set("page", page);
                params.set("limit", limit);

                if (search.trim()) {
                    params.set("search", search.trim());
                }

                if (moduleFilter) {
                    params.set("module", moduleFilter);
                }

                if (actionFilter) {
                    params.set("action", actionFilter);
                }

                if (usernameFilter) {
                    params.set("username", usernameFilter);
                }

                if (sortDate) {
                    params.set("sortDate", sortDate);
                }

                const response = await fetch(
                    `/api/activityLog?${params.toString()}`
                );

                const data = await response.json();

                if (cancelled) return;

                if (!response.ok) {
                    console.error(data.message);
                    setLogs([]);
                    setTotal(0);
                    setTotalPages(0);
                    return;
                }

                setLogs(data.rows ?? []);
                setTotal(data.total ?? 0);
                setTotalPages(data.totalPages ?? 0);

                setModules(data.modules ?? []);
                setActions(data.actions ?? []);
                setUsernames(data.usernames ?? []);

            } catch (error) {

                console.error(error);

                if (!cancelled) {
                    setLogs([]);
                    setTotal(0);
                    setTotalPages(0);
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }

        fetchLogs();

        return () => {
            cancelled = true;
        };

    }, [
        page,
        limit,
        search,
        moduleFilter,
        actionFilter,
        usernameFilter,
        sortDate
    ]);


    function clearFilters() {

        setSearch("");
        setModuleFilter("");
        setActionFilter("");
        setUsernameFilter("");
        setSortDate("");
        setPage(1);

    }


    const activeCount = [
        search,
        moduleFilter,
        actionFilter,
        usernameFilter,
        sortDate
    ].filter(Boolean).length;


    /* "Today" is not a pure function of the rows -- it depends on when you look
       -- so it cannot be read during render, and a log left open past midnight
       would otherwise keep labelling yesterday's entries Today. Same shape the
       overview page already uses for its clock. */
    const [todayStart, setTodayStart] = useState(null);

    useEffect(() => {

        const sync = () => setTodayStart(startOfDay(Date.now()));

        sync();

        const id = setInterval(sync, 60_000);

        return () => clearInterval(id);

    }, []);


    /* Rows arrive already sorted by datetime, so one pass is enough to cut them
       into day runs -- no bucketing and re-sorting needed. */
    const groups = useMemo(() => {

        const out = [];

        for (const log of logs) {

            const when = new Date(log.datetime);
            const valid = !Number.isNaN(when.getTime());
            const key = valid ? startOfDay(when) : "unknown";

            let group = out[out.length - 1];

            if (!group || group.key !== key) {
                group = { key, items: [] };
                out.push(group);
            }

            group.items.push({ log, when: valid ? when : null });

        }

        return out;

    }, [logs]);


    return (

        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <PageHeader
                title="Activity Log"
                description="Monitor and review all user activities within the system."
            />

            <section className="rd-panel flex-none overflow-hidden">

                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">

                    <SearchField
                        label="Search activity"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search activity…"
                    />

                    <div className="flex items-center justify-between gap-3">

                        {!loading && (
                            <ResultCount
                                shown={logs.length}
                                total={total}
                                noun="activities"
                            />
                        )}

                        <FilterToggle
                            open={showFilters}
                            count={activeCount}
                            controls="activity-filters"
                            onClick={() =>
                                setShowFilters(prev => !prev)
                            }
                        />

                    </div>

                </div>


                {showFilters && (

                    <div
                        id="activity-filters"
                        className="border-t border-rd-hair p-4"
                    >

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            <FilterField
                                label="Module"
                                value={moduleFilter}
                                onChange={(e) => {
                                    setModuleFilter(e.target.value);
                                    setPage(1);
                                }}
                            >

                                <option value="">
                                    All modules
                                </option>

                                {modules.map(module => (

                                    <option
                                        key={module}
                                        value={module}
                                    >
                                        {module}
                                    </option>

                                ))}

                            </FilterField>


                            <FilterField
                                label="Action"
                                value={actionFilter}
                                onChange={(e) => {
                                    setActionFilter(e.target.value);
                                    setPage(1);
                                }}
                            >

                                <option value="">
                                    All actions
                                </option>

                                {actions.map(action => (

                                    <option
                                        key={action}
                                        value={action}
                                    >
                                        {action}
                                    </option>

                                ))}

                            </FilterField>


                            <FilterField
                                label="User"
                                value={usernameFilter}
                                onChange={(e) => {
                                    setUsernameFilter(e.target.value);
                                    setPage(1);
                                }}
                            >

                                <option value="">
                                    All users
                                </option>

                                {usernames.map(username => (

                                    <option
                                        key={username}
                                        value={username}
                                    >
                                        {username}
                                    </option>

                                ))}

                            </FilterField>


                            <FilterField
                                label="Sort by date"
                                value={sortDate}
                                onChange={(e) => {
                                    setSortDate(e.target.value);
                                    setPage(1);
                                }}
                            >

                                <option value="">
                                    Default order
                                </option>

                                <option value="newest">
                                    Newest first
                                </option>

                                <option value="oldest">
                                    Oldest first
                                </option>

                            </FilterField>

                        </div>


                        <ClearFilters
                            count={activeCount}
                            onClear={clearFilters}
                        />

                    </div>

                )}

            </section>


            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden max-lg:max-h-[70vh]">

                {loading && <RowSkeleton />}


                {!loading && logs.length === 0 && (

                    <StateMessage
                        title="No activity found"
                        hint={
                            activeCount > 0
                                ? "Nothing matches the current search and filters."
                                : "Activity appears here as staff use the system."
                        }
                    />

                )}


                {!loading && logs.length > 0 && (

                    <div className="rd-scroll-thin min-h-0 flex-1 overflow-y-auto px-4 pb-2">

                        {groups.map(group => (

                            <section key={group.key}>

                                <h3 className="sticky top-0 z-10 flex items-center gap-3 bg-rd-card/95 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-rd-muted backdrop-blur-sm">

                                    {group.key === "unknown"
                                        ? "Undated"
                                        : dayLabel(group.key, todayStart)}

                                    <span
                                        aria-hidden="true"
                                        className="h-px flex-1 bg-rd-hair"
                                    />

                                    <span className="font-semibold tabular-nums tracking-normal">
                                        {group.items.length}
                                    </span>

                                </h3>


                                <ol>

                                    {group.items.map(({ log, when }, index) => {

                                        const key = eventCategory(log.action);
                                        const tone = EVENT_TONE[key];
                                        const meta = categoryMeta(key);
                                        const Glyph = EVENT_ICON[key];
                                        const last = index === group.items.length - 1;

                                        return (

                                            <li
                                                key={log.id}
                                                className="group flex gap-3"
                                            >

                                                {/* Node, thread and label all take the
                                                    event's colour, so what kind of change
                                                    a row records is legible before any of
                                                    it is read. The thread also ties a
                                                    day's entries into one strand instead
                                                    of ten loose cards; it is dropped on
                                                    the last row, where it would dangle. */}
                                                <div className="flex w-9 flex-none flex-col items-center">

                                                    <span
                                                        className={`grid size-9 flex-none place-items-center rounded-full border ${tone.node}`}
                                                    >
                                                        <Glyph size={16} />
                                                    </span>

                                                    {!last && (
                                                        <span
                                                            aria-hidden="true"
                                                            className={`mt-1.5 w-px flex-1 ${tone.rail}`}
                                                        />
                                                    )}

                                                </div>


                                                <div className={`mb-2 min-w-0 flex-1 rounded-xl px-3 py-2 transition-colors ${tone.hover}`}>

                                                    <div className="flex items-baseline justify-between gap-3">

                                                        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">

                                                            <p className="text-[15px] font-semibold leading-tight text-rd-title">
                                                                {log.action}
                                                            </p>

                                                            {/* Names the colour it is
                                                                wearing. Without it the
                                                                palette would be a code
                                                                with no key, and colour on
                                                                its own is not something
                                                                every reader can use. */}
                                                            <span
                                                                title={meta.hint}
                                                                className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tone.chip}`}
                                                            >
                                                                {meta.label}
                                                            </span>

                                                            {log.module && (

                                                                <span className="rounded-full border border-rd-hair px-2 py-0.5 text-[11px] font-medium text-rd-muted">
                                                                    {log.module}
                                                                </span>

                                                            )}

                                                        </div>


                                                        {when ? (

                                                            <time
                                                                dateTime={when.toISOString()}
                                                                title={fullLabel(when)}
                                                                className="w-[4.75rem] flex-none text-right text-xs tabular-nums text-rd-muted"
                                                            >
                                                                {timeLabel(when)}
                                                            </time>

                                                        ) : (

                                                            <span className="w-[4.75rem] flex-none text-right text-xs text-rd-muted">
                                                                —
                                                            </span>

                                                        )}

                                                    </div>


                                                    <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">

                                                        <p className="min-w-0 text-sm leading-snug text-rd-label">
                                                            {log.description}
                                                        </p>

                                                        <span className="flex flex-none items-center gap-1.5 text-xs text-rd-muted">

                                                            <Avatar
                                                                name={log.username}
                                                                className="size-5 text-[9px]"
                                                            />

                                                            {log.username ?? "Unknown user"}

                                                        </span>

                                                    </div>

                                                </div>

                                            </li>

                                        );

                                    })}

                                </ol>

                            </section>

                        ))}

                    </div>

                )}


                {!loading && logs.length > 0 && (

                    <div className="flex items-center justify-between border-t border-rd-hair px-5 py-4">

                        <p className="text-sm text-rd-muted">
                            Page {page} of {totalPages}
                        </p>


                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() =>
                                    setPage(prev => Math.max(1, prev - 1))
                                }
                                className="rd-btn-ghost rd-press rd-focus min-h-11 disabled:pointer-events-none disabled:opacity-40"
                            >
                                Previous
                            </button>


                            <button
                                type="button"
                                disabled={page >= totalPages}
                                onClick={() =>
                                    setPage(prev =>
                                        Math.min(totalPages, prev + 1)
                                    )
                                }
                                className="rd-btn-ghost rd-press rd-focus min-h-11 disabled:pointer-events-none disabled:opacity-40"
                            >
                                Next
                            </button>

                        </div>

                    </div>

                )}

            </section>

        </div>

    );

}
