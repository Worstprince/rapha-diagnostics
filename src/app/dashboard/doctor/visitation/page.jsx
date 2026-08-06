"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
export default function DoctorVisitationPage() {

    const [visitations, setVisitations] = useState([]);
    const [search, setSearch] = useState("");
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
        }

    }

    return (

        <div className="space-y-6">

            <header className="rounded-2xl border border-rd-hair bg-rd-card p-6">

                <h1 className="text-3xl font-semibold text-rd-title">
                    Patient Visitations
                </h1>

                <p className="mt-2 text-sm text-rd-muted">
                    View today's patients and begin consultations.
                </p>

            </header>

            <div className="rounded-2xl border border-rd-hair bg-rd-card p-6">

                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-rd-title">
                        Waiting Patients
                    </h2>

                    <input
                        type="text"
                        placeholder="Search patient..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-lg border border-rd-hair-strong bg-rd-field px-4 py-2 text-rd-text outline-none"
                    />

                </div>

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="border-b border-rd-hair-strong text-left text-rd-label">

                            <th className="p-3">Patient</th>
                            <th className="p-3">Age</th>
                            <th className="p-3">Sex</th>
                            <th className="p-3">Visit Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Priority</th>
                            <th className="p-3">Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {visitations.map((visit) => (

                            <tr
                                key={visit.visitid}
                                className="border-b border-rd-hair hover:bg-rd-raised"
                            >

                                <td className="p-3 text-rd-title">{visit.name}</td>
                                <td className="p-3 text-rd-label">{visit.age}</td>
                                <td className="p-3 text-rd-label">{visit.sex}</td>
                                <td className="p-3 text-rd-label">{new Date(visit.visited_at).toLocaleString()}</td>

                                <td className="p-3">

                                    {/* No amber token exists, and a pale yellow reads as nearly
                                        invisible on a light card — the neutral surface pair is
                                        legible in both themes. */}
                                    <span className="rounded-full border border-rd-hair-strong bg-rd-raised px-3 py-1 text-xs font-medium text-rd-label">
                                        {visit.status}
                                    </span>

                                </td>

                                <td className="p-3">

                                    <span className="rounded-full border border-rd-danger-edge bg-rd-danger-bg px-3 py-1 text-xs font-medium text-rd-danger">
                                        {visit.priority}
                                    </span>

                                </td>

                                <td className="p-3">

                                <Link
                                    href={`/dashboard/doctor/visitation/${visit.visitid}`}
                                    className="rd-btn rd-press rd-focus"
                                >
                                    Open
                                </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}
