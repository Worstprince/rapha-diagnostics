"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    Avatar,
    ChevronRightIcon,
    ClockIcon,
    EmptyState,
    HeaderGlow,
    InboxIcon,
    SearchIcon,
    TableSkeleton,
    UserIcon,
    rowAction,
    td,
    th,
} from "@/app/dashboard/doctor/_ui";

const DAY = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 10;

function visitDate(value) {
    if (!value) return null;

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? null
        : date;
}

function exactDate(date) {
    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function relativeLabel(date) {
    const days = Math.floor(
        (Date.now() - date.getTime()) / DAY
    );

    if (days < 0) return exactDate(date);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;

    if (days < 30) {
        const weeks = Math.floor(days / 7);

        return `${weeks} ${
            weeks === 1 ? "week" : "weeks"
        } ago`;
    }

    if (days < 365) {
        const months = Math.floor(days / 30);

        return `${months} ${
            months === 1 ? "month" : "months"
        } ago`;
    }

    return exactDate(date);
}

function recencyTone(date) {
    if (!date) return "text-rd-muted";

    const days = Math.floor(
        (Date.now() - date.getTime()) / DAY
    );

    if (days <= 7) return "text-rd-fresh";
    if (days <= 30) return "text-rd-text";

    return "text-rd-muted";
}

const VISIT_TIERS = [
    {
        min: 6,
        label: "Frequent patient",
        className:
            "border-transparent bg-rd-cyan text-rd-on-cyan",
    },
    {
        min: 3,
        label: "Regular patient",
        className:
            "border-rd-cyan/55 bg-rd-cyan/25 text-rd-title",
    },
    {
        min: 1,
        label: "Occasional patient",
        className:
            "border-rd-cyan/35 bg-rd-cyan/10 text-rd-label",
    },
    {
        min: 0,
        label: "No visits yet",
        className:
            "border-rd-hair bg-rd-sunken text-rd-placeholder",
    },
];

function visitTier(visits) {
    return (
        VISIT_TIERS.find(
            (tier) => visits >= tier.min
        ) ??
        VISIT_TIERS.at(-1)
    );
}

const SORTS = {
    recent: {
        label: "Recent visit",
        compare: (a, b) =>
            (visitDate(b.lastvisited)?.getTime() ??
                -Infinity) -
            (visitDate(a.lastvisited)?.getTime() ??
                -Infinity),
    },

    name: {
        label: "Name",
        compare: (a, b) =>
            String(a.name ?? "").localeCompare(
                String(b.name ?? "")
            ),
    },

    visits: {
        label: "Most visits",
        compare: (a, b) =>
            (b.visitcount ?? 0) -
            (a.visitcount ?? 0),
    },
};


export default function PatientsList({
    apiEndpoint,
    recordPath,
    roleLabel = "Patients",
}) {

    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState("recent");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        fetchPatients();

    }, []);


    useEffect(() => {

        setPage(1);

    }, [
        search,
        sortKey
    ]);


    async function fetchPatients() {

        try {

            const response = await fetch(
                apiEndpoint
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load patients."
                );

            }

            setPatients(
                Array.isArray(data)
                    ? data
                    : []
            );

            setHasError(false);

        } catch (error) {

            console.error(error);

            setPatients([]);
            setHasError(true);

        } finally {

            setLoading(false);

        }

    }


    const rows =
        Array.isArray(patients)
            ? patients
            : [];


    const searchValue =
        search.trim().toLowerCase();


    const filteredPatients = (
        !searchValue
            ? rows
            : rows.filter(
                (patient) =>
                    String(
                        patient.name ?? ""
                    )
                        .toLowerCase()
                        .includes(searchValue) ||

                    String(
                        patient.patientid
                    ).includes(searchValue)
            )
    )
        .slice()
        .sort(
            SORTS[sortKey].compare
        );


    const activeFilterCount = [
        search,
        sortKey !== "recent",
    ].filter(Boolean).length;


    function clearFilters() {

        setSearch("");
        setSortKey("recent");
        setPage(1);

    }


    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredPatients.length /
            PAGE_SIZE
        )
    );


    const currentPage = Math.min(
        page,
        totalPages
    );


    const pagedPatients =
        filteredPatients.slice(
            (currentPage - 1) *
                PAGE_SIZE,
            currentPage *
                PAGE_SIZE
        );


    const rangeStart =
        filteredPatients.length === 0
            ? 0
            : (currentPage - 1) *
                PAGE_SIZE +
                1;


    const rangeEnd =
        Math.min(
            currentPage * PAGE_SIZE,
            filteredPatients.length
        );


    const seenThisWeek =
        rows.filter((patient) => {

            const date =
                visitDate(
                    patient.lastvisited
                );

            return date
                ? Date.now() -
                      date.getTime() <=
                      7 * DAY
                : false;

        }).length;


    const neverSeen =
        rows.filter(
            (patient) =>
                !visitDate(
                    patient.lastvisited
                )
        ).length;


    const stats = [

        {
            label: "Total patients",
            value: rows.length,
            hint: "On the clinic register",
            Icon: UserIcon,
            chip: "rd-tint-cyan",
        },

        {
            label: "Seen this week",
            value: seenThisWeek,
            hint: "Visited in the last 7 days",
            Icon: ClockIcon,
            chip: "rd-tint-green",
        },

        {
            label: "Never seen",
            value: neverSeen,
            hint: "Registered but no visit yet",
            Icon: InboxIcon,
            chip: "rd-tint-amber",
        },

    ];


    return (

        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <header className="rd-panel relative flex-none overflow-hidden">

                <HeaderGlow />

                <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-5 px-6 py-5">

                    <div>

                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                            {roleLabel}
                        </p>

                        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-rd-title">
                            Patients
                        </h1>

                        <p className="mt-1.5 text-sm text-rd-muted">
                            View patient information, laboratory results, and visit history.
                        </p>

                    </div>


                    <dl className="flex flex-wrap items-center gap-x-7 gap-y-4">

                        {stats.map(
                            ({
                                label,
                                value,
                                hint,
                                Icon,
                                chip,
                            }) => (

                            <div
                                key={label}
                                title={hint}
                                className="flex items-center gap-3"
                            >

                                <span
                                    className={`grid size-9 flex-none place-items-center rounded-xl ${chip}`}
                                >
                                    <Icon size={18} />
                                </span>

                                <div>

                                    <dd className="text-xl font-bold tabular-nums leading-none tracking-tight text-rd-title">
                                        {loading
                                            ? "—"
                                            : value}
                                    </dd>

                                    <dt className="mt-1 text-xs text-rd-muted">
                                        {label}
                                    </dt>

                                </div>

                            </div>

                        ))}

                    </dl>

                </div>

            </header>


            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">

                <div className="flex flex-none flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">

                    <div>

                        <h2 className="text-lg font-semibold text-rd-title">
                            Patient records
                        </h2>

                        <p className="mt-0.5 text-sm text-rd-muted">

                            {loading
                                ? "Loading records…"
                                : filteredPatients.length === 0
                                    ? "No matching patients"
                                    : `Showing ${rangeStart}–${rangeEnd} of ${
                                          filteredPatients.length
                                      }${
                                          searchValue
                                              ? ` (filtered from ${rows.length})`
                                              : ` ${
                                                    filteredPatients.length === 1
                                                        ? "patient"
                                                        : "patients"
                                                }`
                                      }`}

                        </p>

                    </div>


                    <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">

                        <div className="relative w-full sm:w-64">

                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-rd-placeholder"
                            >
                                <SearchIcon />
                            </span>

                            <input
                                type="search"
                                aria-label="Search patients"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search name or ID…"
                                className="rd-input pl-11"
                            />

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                setShowFilters(
                                    (prev) => !prev
                                )
                            }
                            aria-expanded={showFilters}
                            className="rd-btn-secondary rd-press rd-focus whitespace-nowrap"
                        >

                            Filters

                            {activeFilterCount > 0 && (

                                <span className="rd-tint-cyan rounded-full px-2 py-0.5 text-xs font-bold">
                                    {activeFilterCount}
                                </span>

                            )}

                        </button>

                    </div>

                </div>


                {showFilters && (

                    <div className="flex-none border-b border-rd-hair bg-rd-sunken p-4">

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                            <label className="space-y-2">

                                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rd-muted">
                                    Sort by
                                </span>

                                <select
                                    value={sortKey}
                                    onChange={(e) =>
                                        setSortKey(
                                            e.target.value
                                        )
                                    }
                                    className="rd-input"
                                >

                                    {Object.entries(
                                        SORTS
                                    ).map(
                                        ([
                                            key,
                                            { label },
                                        ]) => (

                                        <option
                                            key={key}
                                            value={key}
                                        >
                                            {label}
                                        </option>

                                    ))}

                                </select>

                            </label>

                        </div>


                        {activeFilterCount > 0 && (

                            <div className="mt-4 flex justify-end">

                                <button
                                    type="button"
                                    onClick={
                                        clearFilters
                                    }
                                    className="text-sm font-medium text-rd-muted hover:text-rd-title"
                                >
                                    Clear filters
                                </button>

                            </div>

                        )}

                    </div>

                )}


                <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">

                    {loading ? (

                        <TableSkeleton rows={5} />

                    ) : hasError ? (

                        <EmptyState
                            title="Could not load patients"
                            hint="Something went wrong reaching the server. Refresh the page to try again."
                        />

                    ) : filteredPatients.length === 0 ? (

                        <EmptyState
                            title="No patients found"
                            hint={
                                searchValue
                                    ? "No name or ID matches that search."
                                    : "Registered patients appear here."
                            }
                        />

                    ) : (

                        <table className="w-full min-w-[860px] border-collapse">

                            <thead>

                                <tr className="border-b border-rd-hair-strong bg-rd-sunken">

                                    <th className={th}>
                                        Patient
                                    </th>

                                    <th className={th}>
                                        ID
                                    </th>

                                    <th className={th}>
                                        Age / Sex
                                    </th>

                                    <th className={th}>
                                        Last visit
                                    </th>

                                    <th className={th}>
                                        Visits
                                    </th>

                                    <th className={`${th} text-right`}>
                                        <span className="sr-only">
                                            Actions
                                        </span>
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {pagedPatients.map(
                                    (patient) => {

                                    const lastVisit =
                                        visitDate(
                                            patient.lastvisited
                                        );

                                    const visits =
                                        patient.visitcount ??
                                        0;

                                    return (

                                        <tr
                                            key={
                                                patient.patientid
                                            }
                                            className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                        >

                                            <td className={td}>

                                                <div className="flex items-center gap-3">

                                                    <Avatar
                                                        name={
                                                            patient.name
                                                        }
                                                    />

                                                    <div className="min-w-0">

                                                        <div className="flex items-center gap-2">

                                                            <p className="truncate font-medium text-rd-title">
                                                                {
                                                                    patient.name
                                                                }
                                                            </p>

                                                            {!lastVisit && (

                                                                <span className="rd-tint-amber flex-none rounded-full px-2 py-0.5 text-[11px] font-bold">
                                                                    New
                                                                </span>

                                                            )}

                                                        </div>


                                                        {patient.address && (

                                                            <p className="mt-0.5 max-w-[22ch] truncate text-xs text-rd-muted">
                                                                {
                                                                    patient.address
                                                                }
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            <td
                                                className={`${td} tabular-nums text-rd-muted`}
                                            >
                                                #{patient.patientid}
                                            </td>


                                            <td className={td}>

                                                {[
                                                    patient.age
                                                        ? `${patient.age} yrs`
                                                        : null,
                                                    patient.sex,
                                                ]
                                                    .filter(Boolean)
                                                    .join(
                                                        " · "
                                                    ) ||
                                                    "—"}

                                            </td>


                                            <td className={td}>

                                                {lastVisit ? (

                                                    <span
                                                        title={exactDate(
                                                            lastVisit
                                                        )}
                                                        className={`font-medium ${recencyTone(
                                                            lastVisit
                                                        )}`}
                                                    >
                                                        {relativeLabel(
                                                            lastVisit
                                                        )}
                                                    </span>

                                                ) : (

                                                    <span className="text-rd-muted">
                                                        No visits yet
                                                    </span>

                                                )}

                                            </td>


                                            <td className={td}>

                                                <span
                                                    title={`${visits} ${
                                                        visits === 1
                                                            ? "visit"
                                                            : "visits"
                                                    } · ${
                                                        visitTier(
                                                            visits
                                                        ).label
                                                    }`}
                                                    className={`inline-flex min-w-9 items-center justify-center rounded-full border px-2.5 py-1 text-xs font-bold tabular-nums ${
                                                        visitTier(
                                                            visits
                                                        ).className
                                                    }`}
                                                >
                                                    {visits}
                                                </span>

                                            </td>


                                            <td
                                                className={`${td} text-right`}
                                            >

                                                <Link
                                                    href={`${recordPath}/${patient.patientid}`}
                                                    aria-label={`Open the record for ${patient.name}`}
                                                    className={rowAction}
                                                >
                                                    Open record
                                                    <ChevronRightIcon size={16} />
                                                </Link>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    )}

                </div>


                {!loading &&
                    !hasError &&
                    filteredPatients.length > 0 && (

                    <div className="flex flex-none items-center justify-between border-t border-rd-hair px-5 py-4">

                        <p className="text-sm text-rd-muted">
                            Page {currentPage} of {totalPages}
                        </p>

                        <div className="flex items-center gap-2">

                            <button
                                type="button"
                                disabled={
                                    currentPage <= 1
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
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
                                    currentPage >=
                                    totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (prev) =>
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