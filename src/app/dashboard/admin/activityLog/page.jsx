"use client";

import { useEffect, useMemo, useState } from "react";

import {
    ClearFilters,
    FilterField,
    FilterToggle,
    PageHeader,
    ResultCount,
    RowSkeleton,
    SearchField,
    StateMessage,
    actionTone,
    toneBar,
    toneDot,
} from "../_ui";

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

        setModuleFilter("");
        setActionFilter("");
        setUsernameFilter("");
        setSortDate("");

    }


    const activeCount = [
        moduleFilter,
        actionFilter,
        usernameFilter,
        sortDate
    ].filter(Boolean).length;


    return (

        <div className="mx-auto flex max-w-5xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <PageHeader
                title="Activity Log"
                description="Monitor and review all user activities within the system."
            />

            <section className="rd-panel flex-none overflow-hidden">

                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">

                    <SearchField
                        label="Search activity"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search activity…"
                    />

                    <div className="flex items-center justify-between gap-3">

                        {!loading && (
                            <ResultCount
                                shown={filteredLogs.length}
                                total={logs.length}
                                noun="activities"
                            />
                        )}

                        <FilterToggle
                            open={showFilters}
                            count={activeCount}
                            controls="activity-filters"
                            onClick={() => setShowFilters(prev => !prev)}
                        />

                    </div>

                </div>

                {showFilters && (

                    <div id="activity-filters" className="border-t border-rd-hair p-4">

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                            <FilterField
                                label="Module"
                                value={moduleFilter}
                                onChange={(e) => setModuleFilter(e.target.value)}
                            >
                                <option value="">All modules</option>
                                {modules.map(module => (
                                    <option key={module} value={module}>
                                        {module}
                                    </option>
                                ))}
                            </FilterField>

                            <FilterField
                                label="Action"
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                            >
                                <option value="">All actions</option>
                                {actions.map(action => (
                                    <option key={action} value={action}>
                                        {action}
                                    </option>
                                ))}
                            </FilterField>

                            <FilterField
                                label="User"
                                value={usernameFilter}
                                onChange={(e) => setUsernameFilter(e.target.value)}
                            >
                                <option value="">All users</option>
                                {usernames.map(username => (
                                    <option key={username} value={username}>
                                        {username}
                                    </option>
                                ))}
                            </FilterField>

                            <FilterField
                                label="Sort by date"
                                value={sortDate}
                                onChange={(e) => setSortDate(e.target.value)}
                            >
                                <option value="">Default order</option>
                                <option value="newest">Newest first</option>
                                <option value="oldest">Oldest first</option>
                            </FilterField>

                        </div>

                        <ClearFilters count={activeCount} onClear={clearFilters} />

                    </div>

                )}

            </section>

            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden max-lg:max-h-[70vh]">

                {loading && <RowSkeleton />}

                {!loading && filteredLogs.length === 0 && (
                    <StateMessage
                        title="No activity found"
                        hint={
                            search || activeCount > 0
                                ? "Nothing matches the current search and filters."
                                : "Activity appears here as staff use the system."
                        }
                    />
                )}

                {!loading && filteredLogs.length > 0 && (

                    <ol className="rd-scroll-thin min-h-0 flex-1 space-y-3 overflow-y-auto p-5">

                        {filteredLogs.map((log) => {

                            const tone = actionTone(log.action);

                            return (

                            <li
                                key={log.id}
                                className="relative overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken px-6 py-5 transition-colors hover:border-rd-hair-strong hover:bg-rd-raised"
                            >

                                <span
                                    aria-hidden="true"
                                    className={`absolute inset-y-0 left-0 w-1 ${toneBar[tone]}`}
                                />

                                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">

                                    <div className="flex flex-wrap items-center gap-2.5">

                                        <span
                                            aria-hidden="true"
                                            className={`size-2 flex-none rounded-full ${toneDot[tone]}`}
                                        />

                                        <p className="text-[15px] font-semibold text-rd-title">
                                            {log.action}
                                        </p>

                                        {log.module && (
                                            <span className="rounded-full border border-rd-hair-strong bg-rd-raised px-2.5 py-1 text-xs font-medium text-rd-label">
                                                {log.module}
                                            </span>
                                        )}

                                    </div>

                                    <time className="text-xs tabular-nums text-rd-muted">
                                        {log.datetime}
                                    </time>

                                </div>

                                <p className="mt-2.5 text-sm leading-relaxed text-rd-label">
                                    {log.description}
                                </p>

                                <p className="mt-3 text-xs text-rd-muted">
                                    Performed by{" "}
                                    <span className="font-semibold text-rd-label">
                                        {log.username}
                                    </span>
                                </p>

                            </li>

                            );

                        })}

                    </ol>

                )}

            </section>

        </div>

    );

}
