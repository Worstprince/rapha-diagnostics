"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

    const filteredPatients = patients.filter(patient => {

        const searchValue = search.toLowerCase();

        return (
            patient.name?.toLowerCase().includes(searchValue) ||
            String(patient.patientid).includes(searchValue)
        );

    });

    return (

        <div className="mx-auto max-w-6xl space-y-5">

            {/* HEADER */}

            <header className="rd-panel p-6">

                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                    Doctor
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                    Patients
                </h1>

                <p className="mt-2 text-sm text-rd-muted">
                    View patient information, laboratory results, and visit history.
                </p>

            </header>


            {/* SEARCH */}

            <div className="rd-panel p-5">

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="relative w-full sm:max-w-md">

                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search patient name or ID..."
                            className="w-full rounded-xl border border-rd-hair-strong bg-rd-field px-4 py-3 text-sm text-rd-title outline-none transition focus:border-rd-cyan"
                        />

                    </div>

                    <p className="text-sm text-rd-muted">
                        {filteredPatients.length} patient
                        {filteredPatients.length !== 1 ? "s" : ""}
                    </p>

                </div>

            </div>


            {/* PATIENT LIST */}

            <div className="rd-panel overflow-hidden">

                {loading ? (

                    <div className="space-y-3 p-5">

                        <div className="h-16 animate-pulse rounded-xl bg-rd-sunken" />
                        <div className="h-16 animate-pulse rounded-xl bg-rd-sunken" />
                        <div className="h-16 animate-pulse rounded-xl bg-rd-sunken" />

                    </div>

                ) : filteredPatients.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-sm font-medium text-rd-title">
                            No patients found
                        </p>

                        <p className="mt-1 text-sm text-rd-muted">
                            Try a different search term.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-rd-hair bg-rd-sunken">

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Patient
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Patient ID
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Age / Sex
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Last Visit
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Visits
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredPatients.map(patient => (

                                    <tr
                                        key={patient.patientid}
                                        className="border-b border-rd-hair last:border-0 transition-colors hover:bg-rd-raised"
                                    >

                                        {/* NAME */}

                                        <td className="px-5 py-4">

                                            <div>

                                                <p className="font-medium text-rd-title">
                                                    {patient.name}
                                                </p>

                                                {patient.address && (

                                                    <p className="mt-1 max-w-xs truncate text-xs text-rd-muted">
                                                        {patient.address}
                                                    </p>

                                                )}

                                            </div>

                                        </td>


                                        {/* ID */}

                                        <td className="px-5 py-4 text-sm tabular-nums text-rd-label">

                                            #{patient.patientid}

                                        </td>


                                        {/* AGE / SEX */}

                                        <td className="px-5 py-4 text-sm text-rd-label">

                                            <div className="flex flex-col">

                                                <span>
                                                    {patient.age} years old
                                                </span>

                                                <span className="text-xs text-rd-muted">
                                                    {patient.sex}
                                                </span>

                                            </div>

                                        </td>


                                        {/* LAST VISIT */}

                                        <td className="px-5 py-4 text-sm text-rd-label">

                                            {patient.lastvisited
                                                ? new Date(patient.lastvisited).toLocaleDateString()
                                                : "No visits"
                                            }

                                        </td>


                                        {/* VISITS */}

                                        <td className="px-5 py-4">

                                            <span className="inline-flex items-center rounded-full border border-rd-hair-strong bg-rd-raised px-2.5 py-1 text-xs font-medium text-rd-label">

                                                {patient.visitcount ?? 0}

                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td className="px-5 py-4">

                                            <div className="flex justify-end gap-2">

                                                <Link
                                                    href={`/dashboard/doctor/patients/${patient.patientid}`}
                                                    className="rd-press rd-focus inline-flex min-h-10 items-center rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label transition hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan"
                                                >
                                                    Details & History
                                                </Link>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}