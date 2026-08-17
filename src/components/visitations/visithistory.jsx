"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    Avatar,
    CheckIcon,
    ChevronRightIcon,
    EmptyState,
    HeaderGlow,
    Pill,
    PriorityPill,
    SearchIcon,
    TableSkeleton,
    priorityTone,
    rowAction,
    td,
    th,
    toneBar,
} from "@/app/dashboard/doctor/_ui";

const PAGE_SIZE = 10;
const DAY = 24 * 60 * 60 * 1000;

function relativeLabel(date) {
    const days = Math.floor((Date.now() - date.getTime()) / DAY);

    if (days < 0) return "Scheduled";
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    }

    if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} ${months === 1 ? "month" : "months"} ago`;
    }

    const years = Math.floor(days / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
}

function recencyTone(date) {
    const days = Math.floor((Date.now() - date.getTime()) / DAY);

    if (days <= 7) return "text-rd-fresh";
    if (days <= 30) return "text-rd-text";

    return "text-rd-muted";
}

export default function VisitationHistory({
    role = "doctor",
}) {

    const [visitations, setVisitations] = useState([]);

    const [search, setSearch] = useState("");
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

        const timer = setTimeout(
            () => setDebouncedSearch(search),
            300
        );

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
                    params.set(
                        "search",
                        debouncedSearch.trim()
                    );
                }

                if (priorityFilter) {
                    params.set(
                        "priority",
                        priorityFilter
                    );
                }

                if (sortDate) {
                    params.set(
                        "sortDate",
                        sortDate
                    );
                }

                /*
                 * The history data is identical for doctor and medtech,
                 * so the API endpoint is intentionally shared.
                 */
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

                setTotal(data.total ?? 0);

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

                <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-5">

                    <div>

                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                            {role === "medtech" ? "Medical Technologist" : "Doctor"}
                        </p>

                        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-rd-title">
                            Visitation History
                        </h1>

                        <p className="mt-1.5 text-sm text-rd-muted">
                            View previously approved patient visitations.
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <span className="rd-tint-green grid size-9 flex-none place-items-center rounded-xl">
                            <CheckIcon size={18} />
                        </span>

                        <div>

                            <p className="text-xl font-bold tabular-nums leading-none tracking-tight text-rd-title">
                                {loading ? "—" : total}
                            </p>

                            <p className="mt-1 text-xs text-rd-muted">
                                {activeFilterCount > 0
                                    ? "Matching visits"
                                    : "Approved"}
                            </p>

                        </div>

                    </div>

                </div>

            </header>


            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">

                <div className="flex flex-none flex-col gap-3 border-b border-rd-hair p-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-lg font-semibold text-rd-title">
                            Approved Visitations
                        </h2>

                        <p className="mt-0.5 text-sm text-rd-muted">

                            {loading
                                ? "Loading history…"
                                : visitations.length === 0
                                    ? "No matching visitations"
                                    : `Showing ${(page - 1) * PAGE_SIZE + 1}–${
                                          (page - 1) * PAGE_SIZE +
                                          visitations.length
                                      } of ${total}`}

                        </p>

                    </div>


                    <div className="flex w-full items-center gap-3 sm:w-auto">

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


                        <button
                            type="button"
                            onClick={() =>
                                setShowFilters(prev => !prev)
                            }
                            className="rd-btn-secondary rd-press rd-focus whitespace-nowrap"
                        >

                            Filters

                            {activeFilterCount > 0 && (

                                <span className="rd-tint-cyan rounded-full px-2 py-0.5 text-xs font-bold tabular-nums">
                                    {activeFilterCount}
                                </span>

                            )}

                        </button>

                    </div>

                </div>


                {showFilters && (

                    <div className="border-b border-rd-hair bg-rd-sunken p-4">

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <label className="space-y-2">

                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rd-muted">
                                    Priority
                                </span>

                                <select
                                    value={priorityFilter}
                                    onChange={handlePriorityChange}
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
                                    onChange={handleSortChange}
                                    className="rd-input"
                                >

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

                        <table className="w-full min-w-[780px] border-collapse">

                            <thead>

                                <tr className="border-b border-rd-hair-strong bg-rd-sunken">

                                    <th className={th}>Patient</th>
                                    <th className={th}>Age / Sex</th>
                                    <th className={th}>Visit date</th>
                                    <th className={th}>Status</th>
                                    <th className={th}>Priority</th>

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

                                        <td className={`${td} relative`}>

                                            <span
                                                aria-hidden="true"
                                                className={`absolute inset-y-0 left-0 w-1 ${
                                                    toneBar[
                                                        priorityTone(
                                                            visit.priority
                                                        )
                                                    ]
                                                }`}
                                            />

                                            <div className="flex items-center gap-3">

                                                <Avatar
                                                    name={visit.name}
                                                />

                                                <div className="min-w-0">

                                                    <p className="truncate font-medium text-rd-title">
                                                        {visit.name}
                                                    </p>

                                                    <p className="mt-0.5 text-xs tabular-nums text-rd-muted">
                                                        Visit #{visit.visitid}
                                                    </p>

                                                </div>

                                            </div>

                                        </td>


                                        <td className={td}>

                                            {[
                                                visit.age
                                                    ? `${visit.age} yrs`
                                                    : null,
                                                visit.sex,
                                            ]
                                                .filter(Boolean)
                                                .join(" · ") || "—"}

                                        </td>


                                        <td className={td}>

                                            {(() => {

                                                const date = new Date(
                                                    visit.visited_at
                                                );

                                                if (
                                                    Number.isNaN(
                                                        date.getTime()
                                                    )
                                                ) {
                                                    return (
                                                        <span className="text-rd-muted">
                                                            —
                                                        </span>
                                                    );
                                                }

                                                return (
                                                    <>
                                                        <p
                                                            className={`font-medium ${recencyTone(
                                                                date
                                                            )}`}
                                                        >
                                                            {relativeLabel(date)}
                                                        </p>

                                                        <p className="mt-0.5 text-xs tabular-nums text-rd-muted">
                                                            {date.toLocaleDateString()}
                                                            {" · "}
                                                            {date.toLocaleTimeString(
                                                                [],
                                                                {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                }
                                                            )}
                                                        </p>
                                                    </>
                                                );

                                            })()}

                                        </td>


                                        <td className={td}>
                                            <Pill value={visit.status} />
                                        </td>


                                        <td className={td}>
                                            <PriorityPill
                                                value={visit.priority}
                                            />
                                        </td>


                                        <td className={`${td} text-right`}>

                                            <Link
                                                href={`/dashboard/${role}/visitation/${visit.visitid}`}
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