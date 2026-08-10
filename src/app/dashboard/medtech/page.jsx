"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    Avatar,
    CheckIcon,
    ChevronRightIcon,
    ClockIcon,
    EmptyState,
    FlaskIcon,
    HeaderGlow,
    Pill,
    TableSkeleton,
    isDone,
    rowAction,
    statusTone,
    toneBar,
} from "./_ui";

const SHORTLIST = 5;

export default function MedtechDashboardPage() {

    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchAssignments();

    }, []);

    async function fetchAssignments() {

        try {
            const response = await fetch("/api/medtech/assignments");
            const data = await response.json();
            setVisits(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const rows = Array.isArray(visits) ? visits : [];

    const allTests = rows.flatMap((visit) =>
        (visit.tests ?? []).map((test) => ({
            ...test,
            patientname: visit.patientname,
            visitid: visit.visitid,
        }))
    );

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

    const shortlist = pending.slice(0, SHORTLIST);

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <header className="rd-panel relative flex-none overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative flex flex-wrap items-end justify-between gap-4">

                    <div>
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

                    <Link
                        href="/dashboard/medtech/assignments"
                        className="rd-btn rd-press rd-focus"
                    >
                        Open assignments
                        <ChevronRightIcon />
                    </Link>

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

                        <h2 className="text-lg font-semibold text-rd-title">Pending tests</h2>

                        {!loading && pending.length > 0 && (
                            <span className="grid min-w-6 place-items-center rounded-full border border-amber-500/45 bg-amber-500/14 px-1.5 py-0.5 text-xs font-bold tabular-nums text-rd-title">
                                {pending.length}
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
                            title="Nothing pending"
                            hint="Tests assigned to you appear here until their results are encoded."
                            Icon={FlaskIcon}
                        />

                    ) : (

                        <ul className="space-y-3 p-4">

                            {shortlist.map((test) => {

                                const tone = statusTone(test.status);

                                return (

                                    <li
                                        key={test.assignmentid}
                                        className="relative flex flex-wrap items-center gap-x-4 gap-y-3 overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken py-4 pl-6 pr-4 transition-colors hover:border-rd-hair-strong hover:bg-rd-raised"
                                    >

                                        <span
                                            aria-hidden="true"
                                            className={`absolute inset-y-0 left-0 w-1 ${toneBar[tone]}`}
                                        />

                                        <Avatar name={test.patientname} className="size-10 text-sm" />

                                        <div className="min-w-0 flex-1">

                                            <p className="truncate text-[15px] font-semibold text-rd-title">
                                                {test.name}
                                            </p>

                                            <p className="mt-0.5 truncate text-sm text-rd-muted">
                                                {test.patientname}
                                            </p>

                                        </div>

                                        <div className="ml-auto flex flex-wrap items-center gap-3">

                                            <Pill value={test.status} />

                                            <Link
                                                href={`/dashboard/medtech/test/${test.assignmentid}`}
                                                aria-label={`Open ${test.name} for ${test.patientname}`}
                                                className={rowAction}
                                            >
                                                Open
                                                <ChevronRightIcon size={16} />
                                            </Link>

                                        </div>

                                    </li>

                                );

                            })}

                            {pending.length > shortlist.length && (
                                <li className="pt-1 text-center text-sm text-rd-muted">
                                    {pending.length - shortlist.length} more pending{" "}
                                    {pending.length - shortlist.length === 1 ? "test" : "tests"} in your assignments
                                </li>
                            )}

                        </ul>

                    )}

                </div>

            </section>

        </div>
    );
}
