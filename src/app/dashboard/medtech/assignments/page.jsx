"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MedTechAssignmentsPage() {
    const [openVisit, setOpenVisit] = useState(null);
    const [tests, setTests] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    async function fetchAssignments() {

        const response = await fetch("/api/medtech/assignments");

        const result = await response.json();
console.log(result);
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

<div className="space-y-6">

    {tests.map(visit => (

        <div
            key={visit.visitid}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden"
        >

<button
    type="button"
    onClick={() =>
        setOpenVisit(openVisit === visit.visitid ? null : visit.visitid)
    }
    className="flex w-full items-center justify-between border-b border-slate-800 bg-slate-800/50 p-6 text-left"
>

    <div>

        <h2 className="text-xl font-semibold text-white">
            {visit.patientname}
        </h2>

        <p className="mt-1 text-slate-400">
            {new Date(visit.visited_at).toLocaleString()}
        </p>

    </div>

    <span className="text-2xl text-white">
        {openVisit === visit.visitid ? "−" : "+"}
    </span>

</button>
    {openVisit === visit.visitid && (
            <table className="w-full">

                <thead>

                    <tr className="border-b border-slate-700">

                        <th className="p-3 text-left">Test</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Action</th>

                    </tr>

                </thead>

                <tbody>

                    {visit.tests.map(test => (

                        <tr
                            key={test.assignmentid}
                            className="border-b border-slate-800"
                        >

                            <td className="p-3">
                                {test.name}
                            </td>

                            <td className="p-3">
                                {test.status}
                            </td>

                            <td className="p-3">

                                <Link
                                    href={`/dashboard/medtech/test/${test.assignmentid}`}
                                    className="rounded-lg bg-cyan-600 px-4 py-2 text-white"
                                >
                                    Open
                                </Link>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
    )}
        </div>

    ))}

</div>

        </div>

    );

}