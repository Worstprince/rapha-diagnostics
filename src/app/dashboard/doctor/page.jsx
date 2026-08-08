"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    Avatar,
    CalendarIcon,
    ChevronRightIcon,
    ClockIcon,
    EmptyState,
    FlaskIcon,
    HeaderGlow,
    Pill,
    TableSkeleton,
    isUrgent,
    rowAction,
} from "./_ui";

const SHORTLIST = 5;

function isToday(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    const now = new Date();
    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}

export default function DoctorDashboardPage() {

    const [visitations, setVisitations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchVisitations();

    }, []);

    async function fetchVisitations() {

        try {
            const response = await fetch("/api/doctor/visitationDisplay?search=");
            const data = await response.json();
            setVisitations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const rows = Array.isArray(visitations) ? visitations : [];

    const stats = [
        {
            label: "In the queue",
            value: rows.length,
            hint: "Patients waiting to be seen",
            Icon: ClockIcon,
            chip: "bg-cyan-500/12 text-cyan-600",
        },
        {
            label: "Flagged urgent",
            value: rows.filter((visit) => isUrgent(visit.priority)).length,
            hint: "Need attention first",
            Icon: FlaskIcon,
            chip: "bg-red-500/12 text-red-600",
        },
        {
            label: "Checked in today",
            value: rows.filter((visit) => isToday(visit.visited_at)).length,
            hint: "Arrived since midnight",
            Icon: CalendarIcon,
            chip: "bg-emerald-500/12 text-emerald-600",
        },
    ];

    const shortlist = [...rows]
        .sort((a, b) => Number(isUrgent(b.priority)) - Number(isUrgent(a.priority)))
        .slice(0, SHORTLIST);

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <header className="rd-panel relative flex-none overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative flex flex-wrap items-end justify-between gap-4">

                    <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                            Doctor
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                            Today’s care queue
                        </h1>

                        <p className="mt-2 text-sm text-rd-muted">
                            Review lab findings, notes, and follow-up tasks in one place.
                        </p>
                    </div>

                    <Link href="/dashboard/doctor/visitation" className="rd-btn rd-press rd-focus">
                        Open visitation queue
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

                    <h2 className="text-lg font-semibold text-rd-title">Priority patients</h2>

                    <Link
                        href="/dashboard/doctor/visitation"
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
                        title="No patients waiting"
                        hint="Visitations appear here once reception checks a patient in."
                    />

                ) : (

                    <ul className="divide-y divide-rd-hair">

                        {shortlist.map((visit) => (

                            <li
                                key={visit.visitid}
                                className="flex flex-wrap items-center gap-3 p-4 transition-colors hover:bg-rd-raised"
                            >

                                <Avatar name={visit.name} />

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-rd-title">
                                        {visit.name}
                                    </p>
                                    <p className="truncate text-sm text-rd-muted">
                                        {new Date(visit.visited_at).toLocaleString()}
                                    </p>
                                </div>

                                <div className="ml-auto flex flex-wrap items-center gap-3">

                                    <Pill value={visit.priority} />

                                    <Link
                                        href={`/dashboard/doctor/visitation/${visit.visitid}`}
                                        aria-label={`Open the visitation for ${visit.name}`}
                                        className={rowAction}
                                    >
                                        Open
                                        <ChevronRightIcon size={16} />
                                    </Link>

                                </div>

                            </li>

                        ))}

                    </ul>

                )}

                </div>

            </section>

        </div>
    );
}
