"use client";

import { useEffect, useMemo, useState } from "react";

export default function ActivityLogPage() {

    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [moduleFilter, setModuleFilter] = useState("");

    const [actionFilter, setActionFilter] = useState("");

    const [usernameFilter, setUsernameFilter] = useState("");

    const [sortDate, setSortDate] = useState("");


    useEffect(() => {

        let cancelled = false;

        (async () => {

            try {

                const response = await fetch("/api/activityLog");

                const data = await response.json();

                if (cancelled) return;

                setLogs(
                    Array.isArray(data)
                        ? data
                        : (data?.rows ?? [])
                );

            } catch (error) {

                console.error(error);

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        })();

        return () => {
            cancelled = true;
        };

    }, []);


    /*
        Get filter options dynamically from the activity logs.
    */

    const modules = useMemo(() => {

        return [
            ...new Set(
                logs
                    .map(log => log.module)
                    .filter(Boolean)
            )
        ];

    }, [logs]);


    const actions = useMemo(() => {

        return [
            ...new Set(
                logs
                    .map(log => log.action)
                    .filter(Boolean)
            )
        ];

    }, [logs]);


    const usernames = useMemo(() => {

        return [
            ...new Set(
                logs
                    .map(log => log.username)
                    .filter(Boolean)
            )
        ];

    }, [logs]);


    /*
        Search + filters + sorting
    */

    const filteredLogs = useMemo(() => {

        const searchValue = search.trim().toLowerCase();

        const filtered = logs.filter(log => {

            const matchesSearch =
                !searchValue ||
                String(log.username ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(log.action ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(log.module ?? "")
                    .toLowerCase()
                    .includes(searchValue) ||
                String(log.description ?? "")
                    .toLowerCase()
                    .includes(searchValue);


            const matchesModule =
                !moduleFilter ||
                log.module === moduleFilter;


            const matchesAction =
                !actionFilter ||
                log.action === actionFilter;


            const matchesUsername =
                !usernameFilter ||
                log.username === usernameFilter;


            return (
                matchesSearch &&
                matchesModule &&
                matchesAction &&
                matchesUsername
            );

        });


        if (sortDate === "newest") {

            filtered.sort(
                (a, b) =>
                    new Date(b.datetime) -
                    new Date(a.datetime)
            );

        }


        if (sortDate === "oldest") {

            filtered.sort(
                (a, b) =>
                    new Date(a.datetime) -
                    new Date(b.datetime)
            );

        }


        return filtered;

    }, [
        logs,
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

    }


    const filtersActive =
        moduleFilter !== "" ||
        actionFilter !== "" ||
        usernameFilter !== "" ||
        sortDate !== "";


    return (

        <div className="space-y-6">

            <div>

                <p className="text-sm font-medium text-rd-cyan">
                    Admin
                </p>

                <h1 className="mt-1 text-3xl font-semibold text-rd-title">
                    Activity Log
                </h1>

                <p className="mt-2 text-sm text-rd-muted">
                    Monitor and review all user activities within the system.
                </p>

            </div>


            {/* SEARCH + FILTER BUTTON */}

            <div className="flex flex-col gap-3 sm:flex-row">

                <div className="relative flex-1">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search activity..."
                        className="w-full rounded-xl border border-rd-hair-strong bg-rd-sunken px-4 py-3 pl-10 text-sm text-rd-title outline-none placeholder:text-rd-muted focus:border-rd-cyan/50 focus:ring-1 focus:ring-rd-cyan/30"
                    />

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-rd-muted"
                    >

                        <circle
                            cx="11"
                            cy="11"
                            r="8"
                        />

                        <path d="m21 21-4.3-4.3" />

                    </svg>

                </div>


                <button
                    type="button"
                    onClick={() => setShowFilters(prev => !prev)}
                    className={`rd-press inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border px-5 text-sm font-medium transition-colors ${
                        showFilters || filtersActive
                            ? "border-rd-cyan/50 bg-rd-cyan/10 text-rd-cyan"
                            : "border-rd-hair-strong bg-rd-sunken text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan"
                    }`}
                >

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="size-4"
                    >

                        <path d="M4 6h16" />
                        <path d="M7 12h10" />
                        <path d="M10 18h4" />

                    </svg>

                    Filters

                    {filtersActive && (

                        <span className="flex size-5 items-center justify-center rounded-full bg-rd-cyan text-xs font-bold text-slate-950">
                            !
                        </span>

                    )}

                </button>

            </div>


            {/* FILTER PANEL */}

            {showFilters && (

                <div className="rounded-xl border border-rd-hair-strong bg-rd-raised p-5">

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


                        {/* MODULE */}

                        <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                Module
                            </label>

                            <select
                                value={moduleFilter}
                                onChange={(e) =>
                                    setModuleFilter(e.target.value)
                                }
                                className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                            >

                                <option value="">
                                    All Modules
                                </option>

                                {modules.map(module => (

                                    <option
                                        key={module}
                                        value={module}
                                    >
                                        {module}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* ACTION */}

                        <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                Action
                            </label>

                            <select
                                value={actionFilter}
                                onChange={(e) =>
                                    setActionFilter(e.target.value)
                                }
                                className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                            >

                                <option value="">
                                    All Actions
                                </option>

                                {actions.map(action => (

                                    <option
                                        key={action}
                                        value={action}
                                    >
                                        {action}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* USER */}

                        <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                User
                            </label>

                            <select
                                value={usernameFilter}
                                onChange={(e) =>
                                    setUsernameFilter(e.target.value)
                                }
                                className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                            >

                                <option value="">
                                    All Users
                                </option>

                                {usernames.map(username => (

                                    <option
                                        key={username}
                                        value={username}
                                    >
                                        {username}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* DATE */}

                        <div>

                            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                Sort by Date
                            </label>

                            <select
                                value={sortDate}
                                onChange={(e) =>
                                    setSortDate(e.target.value)
                                }
                                className="w-full rounded-lg border border-rd-hair-strong bg-rd-sunken px-3 py-2.5 text-sm text-rd-label outline-none focus:border-rd-cyan/50"
                            >

                                <option value="">
                                    Default
                                </option>

                                <option value="newest">
                                    Newest First
                                </option>

                                <option value="oldest">
                                    Oldest First
                                </option>

                            </select>

                        </div>

                    </div>


                    {filtersActive && (

                        <div className="mt-4 flex justify-end">

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="text-sm text-rd-muted hover:text-rd-cyan"
                            >
                                Clear filters
                            </button>

                        </div>

                    )}

                </div>

            )}


            {/* RESULT COUNT */}

            {!loading && (

                <div className="text-sm text-rd-muted">

                    Showing{" "}
                    <span className="font-medium text-rd-label">
                        {filteredLogs.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-rd-label">
                        {logs.length}
                    </span>{" "}
                    activities

                </div>

            )}


            {/* ACTIVITY LOG */}

            <section className="rd-panel max-h-[70vh] overflow-y-auto p-6 rd-scroll-thin">

                {loading && (

                    <p className="py-10 text-center text-sm text-rd-muted">
                        Loading activity…
                    </p>

                )}


                {!loading && filteredLogs.length === 0 && (

                    <p className="py-10 text-center text-sm text-rd-muted">
                        No activity found.
                    </p>

                )}


                {!loading && filteredLogs.length > 0 && (

                    <ol className="space-y-2.5">

                        {filteredLogs.map((log) => (

                            <li
                                key={log.id}
                                className="relative overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken p-4 pl-5"
                            >

                                <span
                                    aria-hidden="true"
                                    className="absolute inset-y-3 left-0 w-0.5 rounded-full bg-rd-cyan/40"
                                />


                                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">

                                    <div className="flex flex-wrap items-center gap-2">

                                        <h2 className="text-sm font-semibold text-rd-title">
                                            {log.action}
                                        </h2>

                                        {log.module && (

                                            <span className="rounded-full border border-rd-hair-strong bg-rd-raised px-2 py-0.5 text-xs text-rd-muted">
                                                {log.module}
                                            </span>

                                        )}

                                    </div>


                                    <time className="text-xs tabular-nums text-rd-muted">
                                        {log.datetime}
                                    </time>

                                </div>


                                <p className="mt-1.5 text-sm text-rd-label">
                                    {log.description}
                                </p>


                                <p className="mt-2 text-xs text-rd-muted">

                                    Performed by{" "}

                                    <span className="font-medium text-rd-label">
                                        {log.username}
                                    </span>

                                </p>

                            </li>

                        ))}

                    </ol>

                )}

            </section>

        </div>

    );

}