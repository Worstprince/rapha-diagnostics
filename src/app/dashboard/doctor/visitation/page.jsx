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
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchVisitations(search);

    }, [search]);

    async function fetchVisitations(searchText = "") {

        try {
            const response = await fetch(
                `/api/doctor/visitationDisplay?search=${encodeURIComponent(searchText)}`
            );
            const data = await response.json();
            setVisitations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }

    }

    const rows = Array.isArray(visitations) ? visitations : [];

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
                        View today&apos;s patients and begin consultations.
                    </p>

                </div>

            </header>

            <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden">

                <div className="flex flex-none flex-wrap items-center justify-between gap-4 border-b border-rd-hair p-4">

                    <div>

                        <h2 className="text-lg font-semibold text-rd-title">
                            Waiting Patients
                        </h2>

                        <p className="mt-0.5 text-sm text-rd-muted">
                            {loading ? "Loading the queue…" : `${rows.length} in the queue`}
                        </p>

                    </div>

                    <div className="relative w-full sm:w-72">

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
                            onChange={(e) => setSearch(e.target.value)}
                            className="rd-input pl-11"
                        />

                    </div>

                </div>

                {loading ? (

                    <TableSkeleton />

                ) : rows.length === 0 ? (

                    <EmptyState
                        title="No patients waiting"
                        hint={
                            search
                                ? "No visitation matches that search."
                                : "Visitations appear here once reception checks a patient in."
                        }
                    />

                ) : (

                    <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">

                        <table className="w-full min-w-[860px] border-collapse">

                            <thead>

                                <tr className="border-b border-rd-hair">

                                    <th className={th}>Patient</th>
                                    <th className={th}>Age</th>
                                    <th className={th}>Sex</th>
                                    <th className={th}>Visit Date</th>
                                    <th className={th}>Status</th>
                                    <th className={th}>Priority</th>
                                    <th className={`${th} text-right`}>
                                        <span className="sr-only">Action</span>
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {rows.map((visit) => (

                                    <tr
                                        key={visit.visitid}
                                        className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                    >

                                        <td className={td}>

                                            <div className="flex items-center gap-3">

                                                <Avatar name={visit.name} />

                                                <span className="font-medium text-rd-title">
                                                    {visit.name}
                                                </span>

                                            </div>

                                        </td>

                                        <td className={`${td} tabular-nums`}>{visit.age}</td>

                                        <td className={td}>{visit.sex}</td>

                                        <td className={`${td} tabular-nums`}>
                                            {new Date(visit.visited_at).toLocaleString()}
                                        </td>

                                        <td className={td}>
                                            <Pill value={visit.status} />
                                        </td>

                                        <td className={td}>
                                            <PriorityPill value={visit.priority} />
                                        </td>

                                        <td className={`${td} text-right`}>

                                            <Link
                                                href={`/dashboard/doctor/visitation/${visit.visitid}`}
                                                aria-label={`Open the visitation for ${visit.name}`}
                                                className={rowAction}
                                            >
                                                Open
                                                <ChevronRightIcon size={16} />
                                            </Link>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>

    );

}
