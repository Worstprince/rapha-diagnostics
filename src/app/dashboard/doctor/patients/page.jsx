"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
    Avatar,
    ChevronRightIcon,
    EmptyState,
    HeaderGlow,
    SearchIcon,
    TableSkeleton,
    rowAction,
    td,
    th,
} from "../_ui";

function lastVisitLabel(value) {
    if (!value) return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function DoctorPatientsPage() {

    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPatients();
    }, []);

    async function fetchPatients() {

        try {

            const response = await fetch("/api/doctor/patients");

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load patients.");
            }

            setPatients(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    const rows = Array.isArray(patients) ? patients : [];

    const searchValue = search.trim().toLowerCase();

    const filteredPatients = !searchValue
        ? rows
        : rows.filter((patient) =>
              String(patient.name ?? "").toLowerCase().includes(searchValue) ||
              String(patient.patientid).includes(searchValue)
          );

    return (

        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <header className="rd-panel relative flex-none overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative">

                    <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                        Doctor
                    </p>

                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                        Patients
                    </h1>

                    <p className="mt-2 text-sm text-rd-muted">
                        View patient information, laboratory results, and visit history.
                    </p>

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
                                : `${filteredPatients.length} of ${rows.length} ${
                                      rows.length === 1 ? "patient" : "patients"
                                  }`}
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name or ID…"
                            className="rd-input pl-11"
                        />

                    </div>

                </div>

                <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">

                    {loading ? (

                        <TableSkeleton rows={5} />

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

                                <tr className="border-b border-rd-hair">

                                    <th className={th}>Patient</th>

                                    <th className={th}>ID</th>

                                    <th className={th}>Age / Sex</th>

                                    <th className={th}>Last visit</th>

                                    <th className={th}>Visits</th>

                                    <th className={`${th} text-right`}>
                                        <span className="sr-only">Actions</span>
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredPatients.map((patient) => {

                                    const lastVisit = lastVisitLabel(patient.lastvisited);

                                    return (

                                        <tr
                                            key={patient.patientid}
                                            className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                        >

                                            <td className={td}>

                                                <div className="flex items-center gap-3">

                                                    <Avatar name={patient.name} />

                                                    <div className="min-w-0">

                                                        <p className="truncate font-medium text-rd-title">
                                                            {patient.name}
                                                        </p>

                                                        {patient.address && (
                                                            <p className="mt-0.5 max-w-[22ch] truncate text-xs text-rd-muted">
                                                                {patient.address}
                                                            </p>
                                                        )}

                                                    </div>

                                                </div>

                                            </td>

                                            <td className={`${td} tabular-nums text-rd-muted`}>
                                                #{patient.patientid}
                                            </td>

                                            <td className={td}>
                                                {[
                                                    patient.age ? `${patient.age} yrs` : null,
                                                    patient.sex,
                                                ]
                                                    .filter(Boolean)
                                                    .join(" · ") || "—"}
                                            </td>

                                            <td className={`${td} tabular-nums`}>
                                                {lastVisit ?? (
                                                    <span className="text-rd-muted">No visits</span>
                                                )}
                                            </td>

                                            <td className={td}>
                                                <span className="inline-flex min-w-8 items-center justify-center rounded-full border border-rd-hair-strong bg-rd-raised px-2.5 py-1 text-xs font-medium tabular-nums text-rd-label">
                                                    {patient.visitcount ?? 0}
                                                </span>
                                            </td>

                                            <td className={`${td} text-right`}>

                                                <Link
                                                    href={`/dashboard/doctor/patients/${patient.patientid}`}
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

            </section>

        </div>

    );

}
