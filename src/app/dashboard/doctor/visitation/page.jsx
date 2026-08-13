"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    Avatar,
    ChevronRightIcon,
    EmptyState,
    HeaderGlow,
    Pill,
    PriorityPill,
    SearchIcon,
    TableSkeleton,
    rowAction,
    td,
    th,
} from "../_ui";

export default function DoctorVisitationPage() {

    const [visitations, setVisitations] = useState([]);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    /* The queue is server-paginated, so the search term is debounced rather
       than filtered locally — otherwise every keystroke is its own query. */
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [hasError, setHasError] = useState(false);

    const [showFilters, setShowFilters] = useState(false);

    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [sortDate, setSortDate] = useState("");


    useEffect(() => {

        const timer = setTimeout(() => setDebouncedSearch(search), 300);

        return () => clearTimeout(timer);

    }, [search]);


    useEffect(() => {

        let cancelled = false;

        async function fetchVisitations() {

            setLoading(true);

            try {

                const params = new URLSearchParams();

                params.set("page", page);
                params.set("limit", limit);

                if (debouncedSearch.trim()) {
                    params.set("search", debouncedSearch.trim());
                }

                if (statusFilter) {
                    params.set("status", statusFilter);
                }

                if (priorityFilter) {
                    params.set("priority", priorityFilter);
                }

                if (sortDate) {
                    params.set("sortDate", sortDate);
                }


                const response = await fetch(
                    `/api/doctor/visitationDisplay?${params.toString()}`
                );

                const data = await response.json();

                if (cancelled) {
                    return;
                }


                if (!response.ok) {

                    console.error(data.message);

                    setHasError(true);
                    setVisitations([]);
                    setTotal(0);
                    setTotalPages(0);

                    return;

                }


                setHasError(false);

                setVisitations(
                    Array.isArray(data.rows)
                        ? data.rows
                        : []
                );

                setTotal(data.total ?? 0);

                setTotalPages(
                    data.totalPages ?? 0
                );

            } catch (error) {

                console.error(error);

                if (!cancelled) {

                    setHasError(true);
                    setVisitations([]);
                    setTotal(0);
                    setTotalPages(0);

                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }


        fetchVisitations();


        return () => {
            cancelled = true;
        };

    }, [
        page,
        limit,
        debouncedSearch,
        statusFilter,
        priorityFilter,
        sortDate
    ]);


    function handleSearchChange(e) {

        setSearch(e.target.value);
        setPage(1);

    }


    function clearFilters() {

        setSearch("");
        setStatusFilter("");
        setPriorityFilter("");
        setSortDate("");
        setPage(1);

    }


    const activeFilterCount = [
        search,
        statusFilter,
        priorityFilter,
        sortDate
    ].filter(Boolean).length;


    return (

        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">


            <header className="rd-panel relative flex-none overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative">

                    <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                        Doctor
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                        Patient Visitations
                    </h1>

                    <p className="mt-2 text-sm text-rd-muted">
                        Review visitations that still require test approval.
                    </p>

                </div>

            </header>


            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">


                {/* SEARCH + FILTER BUTTON */}

                <div className="flex flex-col gap-3 border-b border-rd-hair p-4 sm:flex-row sm:items-center">


                    <div className="relative flex-1">

                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rd-placeholder"
                        >
                            <SearchIcon />
                        </span>


                        <input
                            type="search"
                            aria-label="Search patients"
                            placeholder="Search patient…"
                            value={search}
                            onChange={handleSearchChange}
                            className="rd-input pl-11"
                        />

                    </div>


                    <div className="flex items-center justify-between gap-3">


                        {!loading && (

                            <p className="text-sm text-rd-muted">

                                Showing{" "}

                                <span className="font-medium text-rd-label">
                                    {visitations.length}
                                </span>

                                {" "}of{" "}

                                <span className="font-medium text-rd-label">
                                    {total}
                                </span>

                                {" "}visitations

                            </p>

                        )}


                        <button
                            type="button"
                            onClick={() =>
                                setShowFilters(
                                    prev => !prev
                                )
                            }
                            className="rd-btn-secondary rd-press rd-focus whitespace-nowrap"
                        >

                            Filters

                            {activeFilterCount > 0 && (

                                <span className="ml-2 rounded-full bg-rd-cyan px-2 py-0.5 text-xs font-semibold text-slate-950">
                                    {activeFilterCount}
                                </span>

                            )}

                        </button>

                    </div>

                </div>


                {/* COLLAPSIBLE FILTERS */}

                {showFilters && (

                    <div className="border-b border-rd-hair bg-rd-sunken p-4">

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


                            <label className="space-y-2">

                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rd-muted">
                                    Status
                                </span>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => {

                                        setStatusFilter(
                                            e.target.value
                                        );

                                        setPage(1);

                                    }}
                                    className="rd-input"
                                >

                                    <option value="">
                                        All statuses
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="In Progress">
                                        In Progress
                                    </option>

                                    <option value="Under Review">
                                        Under Review
                                    </option>

                                    <option value="Done">
                                        Done
                                    </option>

                                </select>

                            </label>


                            <label className="space-y-2">

                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rd-muted">
                                    Priority
                                </span>

                                <select
                                    value={priorityFilter}
                                    onChange={(e) => {

                                        setPriorityFilter(
                                            e.target.value
                                        );

                                        setPage(1);

                                    }}
                                    className="rd-input"
                                >

                                    <option value="">
                                        All priorities
                                    </option>

                                    <option value="Routine">
                                        Routine
                                    </option>

                                    <option value="Urgent">
                                        Urgent
                                    </option>

                                    <option value="Emergency">
                                        Emergency
                                    </option>

                                </select>

                            </label>


                            <label className="space-y-2">

                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rd-muted">
                                    Sort by date
                                </span>

                                <select
                                    value={sortDate}
                                    onChange={(e) => {

                                        setSortDate(
                                            e.target.value
                                        );

                                        setPage(1);

                                    }}
                                    className="rd-input"
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

                                </select>

                            </label>

                        </div>


                        {activeFilterCount > 0 && (

                            <div className="mt-4 flex justify-end">

                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-sm font-medium text-rd-muted hover:text-rd-title"
                                >
                                    Clear filters
                                </button>

                            </div>

                        )}

                    </div>

                )}


                {/* TABLE */}

                {loading ? (

                    <TableSkeleton />

                ) : hasError ? (

                    <EmptyState
                        title="Could not load the queue"
                        hint="Something went wrong reaching the server. Adjust the filters or refresh to try again."
                    />

                ) : visitations.length === 0 ? (

                    <EmptyState
                        title="No visitations found"
                        hint={
                            search ||
                            statusFilter ||
                            priorityFilter ||
                            sortDate
                                ? "Nothing matches the current search and filters."
                                : "Visitations requiring approval will appear here."
                        }
                    />

                ) : (

                    <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">

                        <table className="w-full min-w-[860px] border-collapse">

                            <thead>

                                <tr className="border-b border-rd-hair">

                                    <th className={th}>
                                        Patient
                                    </th>

                                    <th className={th}>
                                        Age
                                    </th>

                                    <th className={th}>
                                        Sex
                                    </th>

                                    <th className={th}>
                                        Visit Date
                                    </th>

                                    <th className={th}>
                                        Status
                                    </th>

                                    <th className={th}>
                                        Priority
                                    </th>

                                    <th className={`${th} text-right`}>
                                        <span className="sr-only">
                                            Action
                                        </span>
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {visitations.map((visit) => (

                                    <tr
                                        key={visit.visitid}
                                        className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                    >


                                        <td className={td}>

                                            <div className="flex items-center gap-3">

                                                <Avatar
                                                    name={visit.name}
                                                />

                                                <div>

                                                    <p className="font-medium text-rd-title">
                                                        {visit.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-rd-muted">
                                                        Visit #{visit.visitid}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        <td className={`${td} tabular-nums`}>
                                            {visit.age}
                                        </td>


                                        <td className={td}>
                                            {visit.sex}
                                        </td>


                                        <td className={`${td} tabular-nums`}>
                                            {new Date(
                                                visit.visited_at
                                            ).toLocaleString()}
                                        </td>


                                        <td className={td}>

                                            <Pill
                                                value={visit.status}
                                            />

                                        </td>


                                        <td className={td}>

                                            <PriorityPill
                                                value={visit.priority}
                                            />

                                        </td>


                                        <td className={`${td} text-right`}>

                                            <Link
                                                href={`/dashboard/doctor/visitation/${visit.visitid}`}
                                                aria-label={`Open the visitation for ${visit.name}`}
                                                className={rowAction}
                                            >

                                                Open

                                                <ChevronRightIcon
                                                    size={16}
                                                />

                                            </Link>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* PAGINATION */}

                {!loading &&
                    visitations.length > 0 && (

                        <div className="flex flex-none items-center justify-between border-t border-rd-hair px-5 py-4">

                            <p className="text-sm text-rd-muted">
                                Page {page} of {totalPages}
                            </p>


                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    disabled={page <= 1}
                                    onClick={() =>
                                        setPage(prev =>
                                            Math.max(
                                                1,
                                                prev - 1
                                            )
                                        )
                                    }
                                    className="rd-btn-ghost rd-press rd-focus min-h-10 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>


                                <button
                                    type="button"
                                    disabled={
                                        page >= totalPages
                                    }
                                    onClick={() =>
                                        setPage(prev =>
                                            Math.min(
                                                totalPages,
                                                prev + 1
                                            )
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