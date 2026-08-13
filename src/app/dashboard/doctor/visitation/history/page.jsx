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
} from "../../_ui";

const PAGE_SIZE = 10;

export default function DoctorVisitationHistoryPage() {

    const [visitations, setVisitations] = useState([]);

    const [search, setSearch] = useState("");

    /* Debounced so typing a name is one query instead of one per keystroke. */
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [hasError, setHasError] = useState(false);

    const [priorityFilter, setPriorityFilter] = useState("");

    const [sortDate, setSortDate] = useState("newest");

    const [page, setPage] = useState(1);

    const [total, setTotal] = useState(0);

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);

    const [showFilters, setShowFilters] = useState(false);


    useEffect(() => {

        const timer = setTimeout(() => setDebouncedSearch(search), 300);

        return () => clearTimeout(timer);

    }, [search]);


    useEffect(() => {

        let cancelled = false;

        async function fetchHistory() {

            setLoading(true);

            try {

                const params = new URLSearchParams();

                params.set("page", page);
                params.set("limit", PAGE_SIZE);

                if (debouncedSearch.trim()) {
                    params.set("search", debouncedSearch.trim());
                }

                if (priorityFilter) {
                    params.set("priority", priorityFilter);
                }

                if (sortDate) {
                    params.set("sortDate", sortDate);
                }


                const response = await fetch(
                    `/api/doctor/visitationHistory?${params.toString()}`
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
                    setTotalPages(1);

                    return;

                }


                setHasError(false);

                setVisitations(
                    Array.isArray(data.rows)
                        ? data.rows
                        : []
                );

                setTotal(
                    data.total ?? 0
                );

                setTotalPages(
                    Math.max(
                        data.totalPages ?? 1,
                        1
                    )
                );

            } catch (error) {

                console.error(error);

                if (!cancelled) {

                    setHasError(true);
                    setVisitations([]);
                    setTotal(0);
                    setTotalPages(1);

                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }

            }

        }


        fetchHistory();


        return () => {
            cancelled = true;
        };

    }, [
        page,
        debouncedSearch,
        priorityFilter,
        sortDate
    ]);


    function handleSearchChange(e) {

        setSearch(e.target.value);
        setPage(1);

    }


    function handlePriorityChange(e) {

        setPriorityFilter(e.target.value);
        setPage(1);

    }


    function handleSortChange(e) {

        setSortDate(e.target.value);
        setPage(1);

    }


    function clearFilters() {

        setSearch("");
        setPriorityFilter("");
        setSortDate("newest");
        setPage(1);

    }


    const activeFilterCount = [
        search,
        priorityFilter
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
                        Visitation History
                    </h1>

                    <p className="mt-2 text-sm text-rd-muted">
                        View previously approved patient visitations.
                    </p>

                </div>

            </header>


            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">


                {/* SEARCH / FILTER HEADER */}

                <div className="flex flex-none flex-col gap-3 border-b border-rd-hair p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-lg font-semibold text-rd-title">
                            Approved Visitations
                        </h2>

                        <p className="mt-0.5 text-sm text-rd-muted">

                            {loading
                                ? "Loading history…"
                                : `${total} approved visitations`}

                        </p>

                    </div>


                    <div className="flex w-full items-center gap-3 sm:w-auto">


                        {/* SEARCH */}

                        <div className="relative w-full sm:w-72">

                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rd-placeholder"
                            >
                                <SearchIcon />
                            </span>

                            <input
                                type="search"
                                aria-label="Search patient history"
                                placeholder="Search patient…"
                                value={search}
                                onChange={handleSearchChange}
                                className="rd-input pl-11"
                            />

                        </div>


                        {/* FILTER BUTTON */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowFilters(prev => !prev)
                            }
                            className="rd-btn-secondary rd-press rd-focus whitespace-nowrap"
                        >

                            Filters

                            {activeFilterCount > 0 && (

                                <span className="ml-2 rounded-full bg-rd-cyan px-2 py-0.5 text-xs font-bold text-black">
                                    {activeFilterCount}
                                </span>

                            )}

                        </button>

                    </div>

                </div>


                {/* FILTERS */}

                {showFilters && (

                    <div className="flex flex-wrap items-end gap-4 border-b border-rd-hair p-4">


                        {/* PRIORITY */}

                        <div className="flex flex-col gap-1.5">

                            <label className="text-xs font-semibold text-rd-label">
                                Priority
                            </label>

                            <select
                                value={priorityFilter}
                                onChange={handlePriorityChange}
                                className="rd-input min-w-40"
                            >

                                <option value="">
                                    All priorities
                                </option>

                                <option value="Normal">
                                    Normal
                                </option>

                                <option value="Urgent">
                                    Urgent
                                </option>

                            </select>

                        </div>


                        {/* DATE */}

                        <div className="flex flex-col gap-1.5">

                            <label className="text-xs font-semibold text-rd-label">
                                Sort by date
                            </label>

                            <select
                                value={sortDate}
                                onChange={handleSortChange}
                                className="rd-input min-w-40"
                            >

                                <option value="newest">
                                    Newest first
                                </option>

                                <option value="oldest">
                                    Oldest first
                                </option>

                            </select>

                        </div>


                        {/* CLEAR */}

                        {(search || priorityFilter) && (

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rd-btn-ghost rd-press rd-focus"
                            >
                                Clear filters
                            </button>

                        )}

                    </div>

                )}


                {/* TABLE */}

                {loading ? (

                    <TableSkeleton />

                ) : hasError ? (

                    <EmptyState
                        title="Could not load visitation history"
                        hint="Something went wrong reaching the server. Adjust the filters or refresh to try again."
                    />

                ) : visitations.length === 0 ? (

                    <EmptyState
                        title="No visitation history"
                        hint={
                            search || priorityFilter
                                ? "Nothing matches the current search and filters."
                                : "Approved visitations will appear here."
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

                {!loading && visitations.length > 0 && (

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
                                        Math.max(1, prev - 1)
                                    )
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