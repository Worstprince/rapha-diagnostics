"use client";

import { useEffect, useState } from "react";

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
                            search ||
                            moduleFilter ||
                            actionFilter ||
                            usernameFilter ||
                            sortDate
                                ? "Nothing matches the current search and filters."
                                : "Activity appears here as staff use the system."
                        }
                    />

                )}


                {!loading && logs.length > 0 && (

                    <ol className="rd-scroll-thin min-h-0 flex-1 space-y-3 overflow-y-auto p-5">

                        {logs.map((log) => {

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
                                className="rd-btn-ghost rd-press rd-focus min-h-10 disabled:cursor-not-allowed disabled:opacity-50"
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
                                className="rd-btn rd-press rd-focus min-h-10 disabled:cursor-not-allowed disabled:opacity-50"
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