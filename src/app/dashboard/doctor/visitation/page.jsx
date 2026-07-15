"use client";

import { useEffect, useState } from "react";

export default function DoctorVisitationPage() {

    const [visitations, setVisitations] = useState([]);

    useEffect(() => {

        fetchVisitations();

    }, []);

    async function fetchVisitations() {

        // Backend later
        setVisitations([
            {
                id: 1,
                patient: "Juan Dela Cruz",
                age: 24,
                sex: "Male",
                date: "2026-07-15",
                status: "Waiting"
            },
            {
                id: 2,
                patient: "Maria Santos",
                age: 31,
                sex: "Female",
                date: "2026-07-15",
                status: "Waiting"
            }
        ]);

    }

    return (

        <div className="space-y-6">

            <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

                <h1 className="text-3xl font-semibold text-white">
                    Patient Visitations
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                    View today's patients and begin consultations.
                </p>

            </header>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

                <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-white">
                        Waiting Patients
                    </h2>

                    <input
                        type="text"
                        placeholder="Search patient..."
                        className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white outline-none"
                    />

                </div>

                <table className="w-full border-collapse">

                    <thead>

                        <tr className="border-b border-slate-700 text-left text-slate-300">

                            <th className="p-3">Patient</th>
                            <th className="p-3">Age</th>
                            <th className="p-3">Sex</th>
                            <th className="p-3">Visit Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {visitations.map((visit) => (

                            <tr
                                key={visit.id}
                                className="border-b border-slate-800 hover:bg-slate-800/40"
                            >

                                <td className="p-3 text-white">{visit.patient}</td>
                                <td className="p-3 text-slate-300">{visit.age}</td>
                                <td className="p-3 text-slate-300">{visit.sex}</td>
                                <td className="p-3 text-slate-300">{visit.date}</td>

                                <td className="p-3">

                                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300">
                                        {visit.status}
                                    </span>

                                </td>

                                <td className="p-3">

                                    <button
                                        className="rounded-lg bg-cyan-600 px-4 py-2 text-sm text-white transition hover:bg-cyan-500"
                                    >
                                        Open
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}