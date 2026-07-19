"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MedTechAssignmentsPage() {

    const [tests, setTests] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    async function fetchAssignments() {

        const response = await fetch("/api/medtech/assignments");

        const result = await response.json();

        setTests(result);

    }

    return (

        <div className="space-y-6">

            <header className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

                <h1 className="text-3xl font-semibold text-white">
                    My Laboratory Assignments
                </h1>

                <p className="mt-2 text-slate-400">
                    View laboratory requests assigned to you.
                </p>

            </header>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">

                <table className="w-full">

                    <thead>

                        <tr className="border-b border-slate-700">

                            <th className="p-3 text-left">Patient</th>
                            <th className="p-3 text-left">Test</th>
                            <th className="p-3 text-left">Requested</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Action</th>

                        </tr>

                    </thead>

                    <tbody>

                        {tests.map(test => (

                            <tr
                                key={test.id}
                                className="border-b border-slate-800"
                            >

                                <td className="p-3">{test.patientname}</td>

                                <td className="p-3">{test.name}</td>

                                <td className="p-3">
                                    {new Date(test.visited_at).toLocaleString()}
                                </td>

                                <td className="p-3">
                                    {test.status}
                                </td>

                                <td className="p-3">

                                    <Link
                                        href={`/dashboard/medtech/test/${test.id}`}
                                        className="rounded-lg bg-cyan-600 px-4 py-2 text-white"
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