"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    Avatar,
    ChevronDownIcon,
    ChevronRightIcon,
    EmptyState,
    FlaskIcon,
    HeaderGlow,
    Pill,
    SearchField,
    TableSkeleton,
    isDone,
    rowAction,
    td,
    th,
    toneBar,
} from "../_ui";

export default function MedTechAssignmentsPage() {

    const [openVisit, setOpenVisit] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchAssignments();
    }, []);

    async function fetchAssignments() {

        try {
            const response = await fetch("/api/medtech/assignments");
            const result = await response.json();
            setTests(result);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const rows = Array.isArray(tests) ? tests : [];

    const searchValue = search.trim().toLowerCase();

    const visits = !searchValue
        ? rows
        : rows.filter((visit) => {
              const matchesPatient = String(visit.patientname ?? "")
                  .toLowerCase()
                  .includes(searchValue);

              const matchesTest = (visit.tests ?? []).some((test) =>
                  String(test.name ?? "").toLowerCase().includes(searchValue)
              );

              return matchesPatient || matchesTest;
          });

    const pendingCount = (visit) =>
        (visit.tests ?? []).filter((test) => !isDone(test.status)).length;

    function visitedLabel(value) {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "";

        const now = new Date();
        const sameDay =
            date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear();

        if (sameDay) {
            return `Today, ${date.toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
            })}`;
        }

        return date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    }

    return (

        <div className="mx-auto flex max-w-5xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <header className="rd-panel relative flex-none overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative">

                    <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                        Medtech
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                        My Laboratory Assignments
                    </h1>

                    <p className="mt-2 text-sm text-rd-muted">
                        View laboratory requests assigned to you.
                    </p>

                </div>

            </header>

            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">

                <div className="flex flex-none flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">

                    <div>

                        <h2 className="text-lg font-semibold text-rd-title">
                            Assigned visits
                        </h2>

                        <p className="mt-0.5 text-sm text-rd-muted">
                            {loading
                                ? "Loading your assignments…"
                                : `${visits.length} ${visits.length === 1 ? "visit" : "visits"}`}
                        </p>

                    </div>

                    <SearchField
                        label="Search assignments"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search patient or test…"
                    />

                </div>

                <div className="rd-scroll-thin min-h-0 flex-1 overflow-y-auto">

                    {loading ? (

                        <TableSkeleton rows={3} />

                    ) : visits.length === 0 ? (

                        <EmptyState
                            title="No assignments found"
                            hint={
                                searchValue
                                    ? "No patient or test matches that search."
                                    : "Requests appear here once a physician assigns them to you."
                            }
                            Icon={FlaskIcon}
                        />

                    ) : (

                        <ul className="space-y-3 p-4">

                            {visits.map((visit) => {

                                const open = openVisit === visit.visitid;
                                const pending = pendingCount(visit);
                                const total = (visit.tests ?? []).length;

                                return (

                                    <li
                                        key={visit.visitid}
                                        className="relative overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken transition-colors hover:border-rd-hair-strong"
                                    >

                                        <span
                                            aria-hidden="true"
                                            className={`absolute inset-y-0 left-0 w-1 ${
                                                pending > 0 ? toneBar.warn : toneBar.ok
                                            }`}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOpenVisit(open ? null : visit.visitid)
                                            }
                                            aria-expanded={open}
                                            className={`rd-focus flex w-full cursor-pointer items-center gap-4 p-4 text-left transition-colors hover:bg-rd-raised ${
                                                open ? "bg-rd-raised" : ""
                                            }`}
                                        >

                                            <Avatar name={visit.patientname} className="size-10 text-sm" />

                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-[15px] font-semibold text-rd-title">
                                                    {visit.patientname}
                                                </p>

                                                <p className="mt-0.5 truncate text-sm text-rd-muted">
                                                    {visitedLabel(visit.visited_at)}
                                                    {total > 0 && (
                                                        <span className="tabular-nums">
                                                            {" · "}
                                                            {total} {total === 1 ? "test" : "tests"}
                                                        </span>
                                                    )}
                                                </p>

                                            </div>

                                            <div className="ml-auto flex flex-none items-center gap-3">

                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                                        pending > 0
                                                            ? "border-amber-500/45 bg-amber-500/14 text-rd-title"
                                                            : "border-emerald-500/40 bg-emerald-500/12 text-rd-title"
                                                    }`}
                                                >
                                                    <span
                                                        aria-hidden="true"
                                                        className={`size-1.5 rounded-full ${
                                                            pending > 0 ? "bg-amber-500" : "bg-emerald-500"
                                                        }`}
                                                    />
                                                    {pending > 0 ? `${pending} pending` : "All encoded"}
                                                </span>

                                                <span
                                                    aria-hidden="true"
                                                    className="grid size-9 flex-none place-items-center rounded-lg border border-rd-hair-strong bg-rd-card text-rd-label"
                                                >
                                                    <ChevronDownIcon
                                                        size={16}
                                                        className={`transition-transform duration-200 motion-reduce:transition-none ${
                                                            open ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </span>

                                            </div>

                                        </button>

                                        {open && (

                                            <div className="overflow-x-auto border-t border-rd-hair bg-rd-card">

                                                <table className="w-full min-w-[520px] table-fixed border-collapse">

                                                    <thead>

                                                        <tr className="border-b border-rd-hair">

                                                            <th className={`${th} w-[46%]`}>Test</th>

                                                            <th className={`${th} w-[26%]`}>Status</th>

                                                            <th className={`${th} w-[28%] text-right`}>
                                                                <span className="sr-only">Action</span>
                                                            </th>

                                                        </tr>

                                                    </thead>

                                                    <tbody>

                                                        {(visit.tests ?? []).map((test) => (

                                                            <tr
                                                                key={test.assignmentid}
                                                                className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                                            >

                                                                <td className={`${td} break-words font-medium text-rd-title`}>
                                                                    {test.name}
                                                                </td>

                                                                <td className={td}>
                                                                    <Pill value={test.status} />
                                                                </td>

                                                                <td className={`${td} text-right`}>

                                                                    <Link
                                                                        href={`/dashboard/medtech/test/${test.assignmentid}`}
                                                                        aria-label={`Open ${test.name} for ${visit.patientname}`}
                                                                        className={rowAction}
                                                                    >
                                                                        {isDone(test.status) ? "View" : "Encode"}
                                                                        <ChevronRightIcon size={16} />
                                                                    </Link>

                                                                </td>

                                                            </tr>

                                                        ))}

                                                    </tbody>

                                                </table>

                                            </div>

                                        )}

                                    </li>

                                );

                            })}

                        </ul>

                    )}

                </div>

            </section>

        </div>

    );

}
