"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrentUser } from "@/lib/session";

import {
    Avatar,
    CheckIcon,
    ChevronRightIcon,
    ClockIcon,
    EmptyState,
    FlaskIcon,
    HeaderGlow,
    TableSkeleton,
    isDone,
    toneBar,
} from "./_ui";

const SHORTLIST = 5;

export default function MedtechDashboardPage() {
    const user = useCurrentUser();

    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    if (!user?.id) return;
    fetchAssignments();
}, [user?.id]);

    async function fetchAssignments() {

        try {
            const response = await fetch(`/api/medtech/assignments?medtechId=${user.id}`);
            const data = await response.json();
            setVisits(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const rows = Array.isArray(visits) ? visits : [];

    const allTests = rows.flatMap((visit) => visit.tests ?? []);

    const pending = allTests.filter((test) => !isDone(test.status));
    const completed = allTests.filter((test) => isDone(test.status));

    const stats = [
        {
            label: "Assigned visits",
            value: rows.length,
            hint: "Patients on your bench",
            Icon: ClockIcon,
            chip: "bg-cyan-500/12 text-cyan-600",
        },
        {
            label: "Tests pending",
            value: pending.length,
            hint: "Waiting for results",
            Icon: FlaskIcon,
            chip: "bg-amber-500/12 text-amber-600",
        },
        {
            label: "Tests completed",
            value: completed.length,
            hint: "Encoded and submitted",
            Icon: CheckIcon,
            chip: "bg-emerald-500/12 text-emerald-600",
        },
    ];

    const outstanding = rows
        .map((visit) => {
            const tests = visit.tests ?? [];
            return {
                visitid: visit.visitid,
                patientname: visit.patientname,
                visited_at: visit.visited_at,
                total: tests.length,
                pendingTests: tests.filter((test) => !isDone(test.status)),
            };
        })
        .filter((visit) => visit.pendingTests.length > 0);

    const shortlist = outstanding.slice(0, SHORTLIST);

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <header className="rd-panel relative flex-none overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative">

                    <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                        Medtech
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                        Lab workflow station
                    </h1>

                    <p className="mt-2 text-sm text-rd-muted">
                        Track sample progress and encode results without leaving the bench.
                    </p>

                </div>

            </header>

            <section className="grid flex-none gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {stats.map(({ label, value, hint, Icon, chip }) => (

                    <article key={label} className="rd-panel p-5">

                        <div className="flex items-start justify-between gap-3">

                            <p className="text-sm font-medium text-rd-label">{label}</p>

                            <span className={`grid size-10 flex-none place-items-center rounded-xl ${chip}`}>
                                <Icon size={20} />
                            </span>

                        </div>

                        <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-rd-title">
                            {loading ? "—" : value}
                        </p>

                        <p className="mt-1 text-sm text-rd-muted">{hint}</p>

                    </article>

                ))}

            </section>

            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">

                <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">

                    <div className="flex items-center gap-2.5">

                        <h2 className="text-lg font-semibold text-rd-title">Awaiting results</h2>

                        {!loading && outstanding.length > 0 && (
                            <span className="grid min-w-6 place-items-center rounded-full border border-amber-500/45 bg-amber-500/14 px-1.5 py-0.5 text-xs font-bold tabular-nums text-rd-title">
                                {outstanding.length}
                            </span>
                        )}

                    </div>

                    <Link
                        href="/dashboard/medtech/assignments"
                        className="rd-focus rounded-lg text-sm font-medium text-rd-cyan hover:underline"
                    >
                        View all
                    </Link>

                </div>

                <div className="rd-scroll-thin min-h-0 flex-1 overflow-y-auto">

                    {loading ? (

                        <TableSkeleton rows={3} />

                    ) : shortlist.length === 0 ? (

                        <EmptyState
                            title="Nothing awaiting results"
                            hint="Patients with tests still to encode appear here."
                            Icon={FlaskIcon}
                        />

                    ) : (

                        <ul className="space-y-3 p-4">

                            {shortlist.map((visit) => (

                                <li
                                    key={visit.visitid}
                                    className="relative overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken p-4 pl-6 transition-colors hover:border-rd-hair-strong"
                                >

                                    <span
                                        aria-hidden="true"
                                        className={`absolute inset-y-0 left-0 w-1 ${toneBar.warn}`}
                                    />

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">

                                        <Avatar name={visit.patientname} className="size-10 text-sm" />

                                        <div className="min-w-0 flex-1">

                                            <p className="truncate text-[15px] font-semibold text-rd-title">
                                                {visit.patientname}
                                            </p>

                                            <p className="mt-0.5 truncate text-sm tabular-nums text-rd-muted">
                                                {visit.pendingTests.length} of {visit.total}{" "}
                                                {visit.total === 1 ? "test" : "tests"} awaiting results
                                            </p>

                                        </div>

                                        <span className="ml-auto inline-flex flex-none items-center gap-1.5 rounded-full border border-amber-500/45 bg-amber-500/14 px-2.5 py-1 text-xs font-medium text-rd-title">
                                            <span
                                                aria-hidden="true"
                                                className="size-1.5 rounded-full bg-amber-500"
                                            />
                                            {visit.pendingTests.length} pending
                                        </span>

                                    </div>

                                    <ul className="mt-3 space-y-1 border-t border-rd-hair pt-3">

                                        {visit.pendingTests.map((test) => (

                                            <li key={test.assignmentid}>

                                                <Link
                                                    href={`/dashboard/medtech/test/${test.assignmentid}`}
                                                    aria-label={`Encode ${test.name} for ${visit.patientname}`}
                                                    className="rd-press rd-focus flex min-h-11 items-center gap-3 rounded-lg px-2 text-sm font-medium text-rd-label transition-colors hover:bg-rd-raised hover:text-rd-cyan"
                                                >

                                                    <span
                                                        aria-hidden="true"
                                                        className="size-1.5 flex-none rounded-full bg-amber-500"
                                                    />

                                                    <span className="min-w-0 flex-1 truncate">
                                                        {test.name}
                                                    </span>

                                                    <ChevronRightIcon size={16} />

                                                </Link>

                                            </li>

                                        ))}

                                    </ul>

                                </li>

                            ))}

                            {outstanding.length > shortlist.length && (
                                <li className="pt-1 text-center text-sm text-rd-muted">
                                    {outstanding.length - shortlist.length} more{" "}
                                    {outstanding.length - shortlist.length === 1 ? "patient" : "patients"}{" "}
                                    awaiting results
                                </li>
                            )}

                        </ul>

                    )}

                </div>

            </section>

        </div>
    );
}
