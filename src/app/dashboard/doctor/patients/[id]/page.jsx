"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DoctorPatientPage() {

    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (id) {
            fetchPatient();
        }

    }, [id]);

    async function fetchPatient() {

        try {

            const response = await fetch(`/api/doctor/patients/${id}`);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load patient."
                );
            }

            setPatient(data.patient);
            setVisits(data.visits || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (
            <div className="mx-auto max-w-6xl space-y-5">

                <div className="rd-panel h-32 animate-pulse motion-reduce:animate-none" />

                <div className="rd-panel h-72 animate-pulse motion-reduce:animate-none" />

                <div className="rd-panel h-96 animate-pulse motion-reduce:animate-none" />

            </div>
        );

    }

    if (!patient) {

        return (
            <div className="mx-auto max-w-6xl">

                <div className="rd-panel p-10 text-center">

                    <p className="font-medium text-rd-title">
                        Patient not found
                    </p>

                    <p className="mt-1 text-sm text-rd-muted">
                        The requested patient could not be loaded.
                    </p>

                    <Link
                        href="/dashboard/doctor/patients"
                        className="rd-btn rd-press rd-focus mt-5 inline-flex"
                    >
                        Back to Patients
                    </Link>

                </div>

            </div>
        );

    }

    return (

        <div className="mx-auto max-w-6xl space-y-5">

            {/* HEADER */}

            <header className="rd-panel p-6">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                            Doctor
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                            {patient.name}
                        </h1>

                        <p className="mt-1 text-sm text-rd-muted">
                            Patient ID #{patient.patientid}
                        </p>

                    </div>

                    <Link
                        href="/dashboard/doctor/patients"
                        className="rd-press rd-focus inline-flex min-h-10 items-center justify-center rounded-xl border border-rd-hair-strong bg-rd-sunken px-4 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan"
                    >
                        Back to Patients
                    </Link>

                </div>

            </header>


            {/* PATIENT INFORMATION */}

            <section className="rd-panel overflow-hidden">

                <div className="border-b border-rd-hair bg-rd-sunken px-6 py-4">

                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-rd-cyan">
                        Patient Information
                    </h2>

                </div>

                <div className="grid gap-x-10 gap-y-6 p-6 sm:grid-cols-2 lg:grid-cols-3">

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Full Name
                        </p>

                        <p className="mt-1 text-sm font-medium text-rd-title">
                            {patient.name}
                        </p>

                    </div>

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Birthdate
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.birthdate
                                ? new Date(patient.birthdate).toLocaleDateString()
                                : "—"
                            }
                        </p>

                    </div>

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Age
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.age} years old
                        </p>

                    </div>

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Sex
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.sex || "—"}
                        </p>

                    </div>

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Civil Status
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.civilStatus || "—"}
                        </p>

                    </div>

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Mobile Number
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.mobilenum || "—"}
                        </p>

                    </div>

                    <div>

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Email
                        </p>

                        <p className="mt-1 break-words text-sm text-rd-label">
                            {patient.email || "—"}
                        </p>

                    </div>

                    <div className="sm:col-span-2">

                        <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                            Address
                        </p>

                        <p className="mt-1 text-sm text-rd-label">
                            {patient.address || "—"}
                        </p>

                    </div>

                </div>

            </section>


            {/* VISIT SUMMARY */}

            <section className="grid gap-5 sm:grid-cols-3">

                <div className="rd-panel p-5">

                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                        Total Visits
                    </p>

                    <p className="mt-2 text-2xl font-bold tabular-nums text-rd-title">
                        {visits.length}
                    </p>

                </div>

                <div className="rd-panel p-5">

                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                        Last Visit
                    </p>

                    <p className="mt-2 text-sm font-medium text-rd-title">
                        {visits.length > 0
                            ? new Date(visits[0].visited_at).toLocaleDateString()
                            : "No visits"
                        }
                    </p>

                </div>

                <div className="rd-panel p-5">

                    <p className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                        Patient ID
                    </p>

                    <p className="mt-2 text-2xl font-bold tabular-nums text-rd-title">
                        #{patient.patientid}
                    </p>

                </div>

            </section>


            {/* VISIT HISTORY */}

            <section className="rd-panel overflow-hidden">

                <div className="flex flex-col gap-2 border-b border-rd-hair bg-rd-sunken px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-rd-cyan">
                            Visit History
                        </h2>

                        <p className="mt-1 text-xs text-rd-muted">
                            Previous visits and laboratory requests.
                        </p>

                    </div>

                    <span className="text-sm text-rd-muted">
                        {visits.length} visit{visits.length !== 1 ? "s" : ""}
                    </span>

                </div>


                {visits.length === 0 ? (

                    <div className="p-10 text-center">

                        <p className="text-sm font-medium text-rd-title">
                            No visit history
                        </p>

                        <p className="mt-1 text-sm text-rd-muted">
                            This patient has no recorded visits.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b border-rd-hair">

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Visit
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Time
                                    </th>

                                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {visits.map((visit, index) => {

                                    const date = new Date(visit.visited_at);

                                    return (

                                        <tr
                                            key={visit.visitid}
                                            className="border-b border-rd-hair last:border-0 transition-colors hover:bg-rd-raised"
                                        >

                                            <td className="px-6 py-4 text-sm font-medium text-rd-title">
                                                Visit #{visits.length - index}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-rd-label">
                                                {date.toLocaleDateString()}
                                            </td>

                                            <td className="px-6 py-4 text-sm tabular-nums text-rd-label">
                                                {date.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </td>

                                            <td className="px-6 py-4 text-right">

                                                <Link
                                                    href={`/dashboard/doctor/visitation/${visit.visitid}`}
                                                    className="rd-press rd-focus inline-flex min-h-10 items-center rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan"
                                                >
                                                    View Visit
                                                </Link>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

        </div>

    );

}