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
    PriorityPill,
    TableSkeleton,
    isEmergency,
    priorityTone,
    rowAction,
    toneBar,
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

function checkedInLabel(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    if (isToday(value)) {
        return `Checked in ${date.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
        })}`;
    }

    return date.toLocaleString();
}

function detailsOf(visit) {
    return [visit.age ? `${visit.age} yrs` : null, visit.sex, checkedInLabel(visit.visited_at)]
        .filter(Boolean)
        .join(" · ");
}

export default function DoctorDashboardPage() {

    const [visitations, setVisitations] = useState([]);
    const [queueTotal, setQueueTotal] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchVisitations();

    }, []);

    async function fetchVisitations() {

        try {
            /* The endpoint paginates, so the shortlist and the emergency/today
               counts are drawn from a wide first page while "In the queue"
               uses the server's own total. */
            const response = await fetch(
                "/api/doctor/visitationDisplay?search=&page=1&limit=100"
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load the queue.");
            }

            setVisitations(Array.isArray(data.rows) ? data.rows : []);
            setQueueTotal(Number(data.total ?? 0));
            setHasError(false);
        } catch (error) {
            console.error(error);
            setVisitations([]);
            setQueueTotal(0);
            setHasError(true);
        } finally {
            setLoading(false);
        }

    }

    const rows = visitations;

    const stats = [
        {
            label: "In the queue",
            value: queueTotal,
            hint: "Patients waiting to be seen",
            Icon: ClockIcon,
            chip: "bg-cyan-500/12 text-cyan-600",
        },
        {
            label: "Flagged emergency",
            value: rows.filter((visit) => isEmergency(visit.priority)).length,
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

    const emergency = rows
        .filter((visit) => isEmergency(visit.priority))
        .sort(
            (a, b) =>
                Number(priorityTone(a.priority) !== "danger") -
                Number(priorityTone(b.priority) !== "danger")
        );

    const shortlist = emergency.slice(0, SHORTLIST);

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

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

                    <div className="flex items-center gap-2.5">

                        <h2 className="text-lg font-semibold text-rd-title">Priority patients</h2>

                        {!loading && emergency.length > 0 && (
                            <span className="grid min-w-6 place-items-center rounded-full border border-red-500/50 bg-red-500/14 px-1.5 py-0.5 text-xs font-bold tabular-nums text-rd-title">
                                {emergency.length}
                            </span>
                        )}

                    </div>

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

                ) : hasError ? (

                    <EmptyState
                        title="Could not load the queue"
                        hint="Something went wrong reaching the server. Refresh the page to try again."
                    />

                ) : shortlist.length === 0 ? (

                    <EmptyState
                        title="No emergency patients"
                        hint="Only visits marked Emergency appear here. Open the queue to see everyone waiting."
                    />

                ) : (

                    <ul className="space-y-3 p-4">

                        {shortlist.map((visit) => {

                            const tone = priorityTone(visit.priority);

                            return (

                                <li
                                    key={visit.visitid}
                                    className="relative flex flex-wrap items-center gap-x-4 gap-y-3 overflow-hidden rounded-xl border border-rd-hair bg-rd-sunken py-4 pl-6 pr-4 transition-colors hover:border-rd-hair-strong hover:bg-rd-raised"
                                >

                                    <span
                                        aria-hidden="true"
                                        className={`absolute inset-y-0 left-0 w-1 ${toneBar[tone]}`}
                                    />

                                    <Avatar name={visit.name} className="size-10 text-sm" />

                                    <div className="min-w-0 flex-1">

                                        <p className="truncate text-[15px] font-semibold text-rd-title">
                                            {visit.name}
                                        </p>

                                        <p className="mt-0.5 truncate text-sm text-rd-muted">
                                            {detailsOf(visit)}
                                        </p>

                                    </div>

                                    <div className="ml-auto flex flex-wrap items-center gap-3">

                                        <PriorityPill value={visit.priority} />

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

                            );

                        })}

                        {!loading && emergency.length > shortlist.length && (
                            <li className="pt-1 text-center text-sm text-rd-muted">
                                {emergency.length - shortlist.length} more emergency{" "}
                                {emergency.length - shortlist.length === 1 ? "patient" : "patients"} in the queue
                            </li>
                        )}

                    </ul>

                )}

                </div>

            </section>

        </div>
    );
}
