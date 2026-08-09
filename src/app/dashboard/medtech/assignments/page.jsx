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

        <div className="mx-auto max-w-5xl space-y-5">

            <header className="rd-panel p-6">

                <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                    Medtech
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                    My Laboratory Assignments
                </h1>

                <p className="mt-2 text-sm text-rd-muted">
                    View laboratory requests assigned to you.
                </p>

            </header>

<div className="space-y-4">

    {tests.map(visit => (

        <div
            key={visit.visitid}
            className="rd-panel overflow-hidden"
        >

<button
    type="button"
    onClick={() =>
        setOpenVisit(openVisit === visit.visitid ? null : visit.visitid)
    }
    aria-expanded={openVisit === visit.visitid}
    className="rd-press rd-focus flex w-full cursor-pointer items-center justify-between gap-4 border-b border-rd-hair bg-rd-sunken p-5 text-left transition-colors hover:bg-rd-raised"
>

    <div>

        <h2 className="text-lg font-semibold text-rd-title">
            {visit.patientname}
        </h2>

        <p className="mt-1 text-sm tabular-nums text-rd-muted">
            {new Date(visit.visited_at).toLocaleString()}
        </p>

    </div>

    <span
        aria-hidden="true"
        className="grid size-9 flex-none place-items-center rounded-lg border border-rd-hair-strong bg-rd-card text-lg font-semibold text-rd-label"
    >
        {openVisit === visit.visitid ? "−" : "+"}
    </span>

</button>
    {openVisit === visit.visitid && (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse">

                <thead>

                    <tr className="border-b border-rd-hair">

                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">Test</th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-rd-muted">Status</th>
                        <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-rd-muted">Action</th>

                    </tr>

                </thead>

                <tbody>

                    {visit.tests.map(test => (

                        <tr
                            key={test.assignmentid}
                            className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                        >

                            <td className="px-5 py-4 text-sm font-medium text-rd-title">
                                {test.name}
                            </td>

                            <td className="px-5 py-4 text-sm text-rd-label">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-rd-hair-strong bg-rd-raised px-2.5 py-1 text-xs font-medium text-rd-label">
                                    <span aria-hidden="true" className="size-1.5 rounded-full bg-rd-muted" />
                                    {test.status}
                                </span>
                            </td>

                            <td className="px-5 py-4 text-right">

                                <Link
                                    href={`/dashboard/medtech/test/${test.assignmentid}`}
                                    aria-label={`Open ${test.name}`}
                                    className="rd-press rd-focus inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-rd-hair-strong bg-rd-sunken px-3.5 text-sm font-medium text-rd-label hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan-strong hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                                >
                                    Open
                                </Link>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
        </div>
    )}
        </div>

    ))}

</div>

        </div>

    );

}
