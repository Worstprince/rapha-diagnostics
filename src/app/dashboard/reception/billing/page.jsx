"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ClearFilters,
    FilterField,
    FilterToggle,
    ResultCount,
    RowSkeleton,
    SearchField,
    StateMessage,
    td,
    th,
} from "@/app/dashboard/admin/_ui";


function formatCurrency(value) {

    return `₱${Number(value || 0).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

}


function formatDate(value) {

    if (!value) return "—";

    return new Date(value).toLocaleString(
        "en-PH",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        }
    );

}


export default function ViewBillingHistory() {

    const router = useRouter();

    const [visits, setVisits] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [showFilters, setShowFilters] = useState(false);

    const [statusFilter, setStatusFilter] = useState("");

    const [priorityFilter, setPriorityFilter] = useState("");

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);

    const [limit, setLimit] = useState(10);

    const [total, setTotal] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    const [error, setError] = useState("");


    async function fetchVisits() {

        setLoading(true);
        setError("");

        try {

            const params = new URLSearchParams();

            params.set("page", page);
            params.set("limit", limit);

            if (search.trim()) {
                params.set("search", search.trim());
            }

            if (statusFilter) {
                params.set("status", statusFilter);
            }

            if (priorityFilter) {
                params.set("priority", priorityFilter);
            }

            if (dateFrom) {
                params.set("dateFrom", dateFrom);
            }

            if (dateTo) {
                params.set("dateTo", dateTo);
            }

            if (sort) {
                params.set("sort", sort);
            }


            const response = await fetch(
                `/api/billing/?${params.toString()}`
            );

            const data = await response.json();

            if (!response.ok || !data.success) {

                throw new Error(
                    data.message ||
                    "Failed to load billing history."
                );

            }


            setVisits(
                Array.isArray(data.rows)
                    ? data.rows
                    : []
            );


            setTotal(
                Number(
                    data.pagination?.total || 0
                )
            );


            setTotalPages(
                Number(
                    data.pagination?.totalPages || 0
                )
            );

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to load billing history."
            );

            setVisits([]);

        } finally {

            setLoading(false);

        }

    }


    useEffect(() => {

        const timeout = setTimeout(() => {
            fetchVisits();
        }, 300);

        return () => clearTimeout(timeout);

    }, [
        page,
        limit,
        search,
        statusFilter,
        priorityFilter,
        dateFrom,
        dateTo,
        sort,
    ]);


    const activeCount = [
        statusFilter,
        priorityFilter,
        dateFrom,
        dateTo,
        sort !== "newest" ? sort : "",
    ].filter(Boolean).length;


    function clearFilters() {

        setStatusFilter("");
        setPriorityFilter("");
        setDateFrom("");
        setDateTo("");
        setSort("newest");
        setPage(1);

    }


    function handlePageChange(nextPage) {

        if (
            nextPage < 1 ||
            nextPage > totalPages
        ) {
            return;
        }

        setPage(nextPage);

    }


    const startResult =
        total === 0
            ? 0
            : (page - 1) * limit + 1;


    const endResult =
        Math.min(
            page * limit,
            total
        );


    const pageNumbers = useMemo(() => {

        const pages = [];

        const start = Math.max(
            1,
            page - 2
        );

        const end = Math.min(
            totalPages,
            page + 2
        );

        for (
            let i = start;
            i <= end;
            i++
        ) {

            pages.push(i);

        }

        return pages;

    }, [
        page,
        totalPages
    ]);


    return (

        <section className="flex min-h-0 flex-1 flex-col gap-5">


            <div className="rd-panel flex-none overflow-hidden">


                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">

                    <SearchField
                        label="Search billing history"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                        placeholder="Search patient, visit ID, patient ID, or test..."
                    />


                    <div className="flex items-center justify-between gap-3">

                        {!loading && (

                            <ResultCount
                                shown={visits.length}
                                total={total}
                                noun="visits"
                            />

                        )}


                        <FilterToggle
                            open={showFilters}
                            count={activeCount}
                            controls="billing-filters"
                            onClick={() =>
                                setShowFilters(
                                    prev => !prev
                                )
                            }
                        />

                    </div>

                </div>


                {showFilters && (

                    <div
                        id="billing-filters"
                        className="border-t border-rd-hair p-4"
                    >

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">


                            <FilterField
                                label="Status"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(
                                        e.target.value
                                    );
                                    setPage(1);
                                }}
                            >

                                <option value="">
                                    All statuses
                                </option>

                                <option value="Registered">
                                    Registered
                                </option>

                                <option value="Pending Payment">
                                    Pending Payment
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Under Review">
                                    Under Review
                                </option>

                                <option value="Approved">
                                    Approved
                                </option>

                                <option value="Released">
                                    Released
                                </option>

                            </FilterField>


                            <FilterField
                                label="Priority"
                                value={priorityFilter}
                                onChange={(e) => {
                                    setPriorityFilter(
                                        e.target.value
                                    );
                                    setPage(1);
                                }}
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

                            </FilterField>


                            <div className="space-y-1.5">

                                <label className="rd-label">
                                    From
                                </label>

                                <input
                                    type="date"
                                    value={dateFrom}
                                    onChange={(e) => {
                                        setDateFrom(
                                            e.target.value
                                        );
                                        setPage(1);
                                    }}
                                    className="rd-input"
                                />

                            </div>


                            <div className="space-y-1.5">

                                <label className="rd-label">
                                    To
                                </label>

                                <input
                                    type="date"
                                    value={dateTo}
                                    onChange={(e) => {
                                        setDateTo(
                                            e.target.value
                                        );
                                        setPage(1);
                                    }}
                                    className="rd-input"
                                />

                            </div>


                            <FilterField
                                label="Sort by"
                                value={sort}
                                onChange={(e) => {
                                    setSort(
                                        e.target.value
                                    );
                                    setPage(1);
                                }}
                            >

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

            </div>


            <div className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden max-lg:max-h-[70vh]">


                {loading && <RowSkeleton />}


                {!loading && error && (

                    <StateMessage
                        title="Could not load billing history"
                        hint={error}
                    />

                )}


                {!loading &&
                    !error &&
                    visits.length === 0 && (

                    <StateMessage
                        title="No billing records found"
                        hint={
                            search ||
                            activeCount > 0
                                ? "Nothing matches the current search and filters."
                                : "Registered visits will appear here."
                        }
                    />

                )}


                {!loading &&
                    !error &&
                    visits.length > 0 && (

                    <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">

                        <table className="w-full min-w-[900px] border-collapse">

                            <thead>

                                <tr className="border-b border-rd-hair">

                                    <th className={th}>
                                        Visit ID
                                    </th>

                                    <th className={th}>
                                        Date
                                    </th>

                                    <th className={th}>
                                        Patient
                                    </th>

                                    <th className={th}>
                                        Tests
                                    </th>

                                    <th className={th}>
                                        Total
                                    </th>

                                    <th className={th}>
                                        Status
                                    </th>

                                    <th className={`${th} text-right`}>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {visits.map((visit) => (

                                    <tr
                                        key={visit.visitId}
                                        className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                    >

                                        <td
                                            className={`${td} tabular-nums text-rd-muted`}
                                        >
                                            {visit.visitId}
                                        </td>


                                        <td
                                            className={`${td} tabular-nums`}
                                        >
                                            {formatDate(
                                                visit.visitDate
                                            )}
                                        </td>


                                        <td
                                            className={`${td} font-medium text-rd-title`}
                                        >

                                            <div>
                                                {visit.patientName || "Unknown patient"}
                                            </div>

                                            <p className="mt-1 text-xs text-rd-muted">
                                                Patient ID:{" "}
                                                {visit.patientId}
                                            </p>

                                        </td>


                                        <td className={td}>

                                            <div className="max-w-[280px]">

                                                <p className="truncate text-rd-title">
                                                    {visit.tests ||
                                                        "No tests"}
                                                </p>

                                                <p className="mt-1 text-xs text-rd-muted">
                                                    {visit.testCount}{" "}
                                                    {Number(
                                                        visit.testCount
                                                    ) === 1
                                                        ? "test"
                                                        : "tests"}
                                                </p>

                                            </div>

                                        </td>


                                        <td
                                            className={`${td} font-medium tabular-nums text-rd-title`}
                                        >
                                            {formatCurrency(
                                                visit.totalCost
                                            )}
                                        </td>


                                        <td className={td}>

                                            <span className="text-sm text-rd-label">
                                                {visit.status || "—"}
                                            </span>

                                        </td>


                                        <td
                                            className={`${td} text-right`}
                                        >

                                            <button
                                                type="button"
                                                className="rd-btn-secondary rd-press rd-focus"
                                                onClick={() =>
                                                    router.push(
                                                        `/dashboard/reception/billing/${visit.visitId}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}


                {!loading &&
                    !error &&
                    total > 0 && (

                    <div className="flex flex-col gap-3 border-t border-rd-hair p-4 sm:flex-row sm:items-center sm:justify-between">


                        <div className="text-sm text-rd-muted">

                            Showing{" "}

                            <span className="font-medium text-rd-title">
                                {startResult}
                            </span>

                            {" "}–{" "}

                            <span className="font-medium text-rd-title">
                                {endResult}
                            </span>

                            {" "}of{" "}

                            <span className="font-medium text-rd-title">
                                {total}
                            </span>

                            {" "}visits

                        </div>


                        <div className="flex items-center gap-1">

                            {pageNumbers.map(
                                (pageNumber) => (

                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() =>
                                        handlePageChange(
                                            pageNumber
                                        )
                                    }
                                    aria-current={pageNumber === page ? "page" : undefined}
                                    className={`rd-press rd-focus inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-xl px-3 text-sm font-medium tabular-nums ${
                                        pageNumber === page
                                            ? "bg-rd-cyan text-rd-on-cyan"
                                            : "text-rd-muted hover:bg-rd-raised hover:text-rd-title"
                                    }`}
                                >
                                    {pageNumber}
                                </button>

                            ))}

                        </div>

                    </div>

                )}

            </div>

        </section>

    );

}