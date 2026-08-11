"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/lib/session";

import {
    ArrowLeftIcon,
    Avatar,
    ChevronRightIcon,
    EmptyState,
    FlaskIcon,
    HeaderGlow,
    Pill,
    PriorityPill,
    backLink,
    rowAction,
    td,
    th,
} from "../../_ui";

function Detail({ label, children }) {
    return (
        <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                {label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-rd-title">{children || "—"}</dd>
        </div>
    );
}

export default function VisitationDetailsPage() {

    const { id } = useParams();
    
    const currentUser = useCurrentUser();
    const [patient, setPatient] = useState(null);

    const [tests, setTests] = useState([]);

    const [medtechs, setMedtechs] = useState([]);

    useEffect(() => {

        if (!id) return;

        fetchVisitation();
        fetchMedtechs();

    }, [id]);

    async function fetchVisitation() {

        try {

            const response = await fetch(`/api/doctor/visitationDisplay/${id}`);

            const result = await response.json();

            if (!response.ok) {
                alert(result.message);
                return;
            }

            setPatient(result.patient);
            setTests(result.tests);

        } catch (error) {

            console.error(error);

        }

    }

    async function fetchMedtechs() {
        try {
            const response = await fetch("/api/medtech/display");

            const data = await response.json();

            setMedtechs(data);

        } catch (error) {

            console.error(error);

        }

    }

    function assignMedtech(testId, medtechId) {

        setTests(prev =>
            prev.map(test =>
                test.id === testId
                    ? {
                        ...test,
                        medtechid: medtechId
                    }
                    : test
            )
        );

    }

async function handleSave() {
    const response = await fetch("/api/doctor/assignMedTech", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

body: JSON.stringify({
    tests,
    userId: currentUser?.id
})

    });

    const result = await response.json();

    alert(result.message);

}

    const backToQueue = (
        <Link href="/dashboard/doctor/visitation" className={backLink}>
            <ArrowLeftIcon size={16} />
            Back to visitations
        </Link>
    );

    if (!patient) {

        return (
            <div className="mx-auto max-w-6xl space-y-5">

                {backToQueue}

                <div className="rd-panel h-32 animate-pulse motion-reduce:animate-none" />

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="rd-panel h-80 animate-pulse motion-reduce:animate-none" />
                    <div className="rd-panel h-80 animate-pulse motion-reduce:animate-none lg:col-span-2" />
                </div>

            </div>
        );

    }

    const medtechOf = (test) =>
        medtechs.find((medtech) => String(medtech.id) === String(test.medtechid));

    return (

        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <div className="flex-none">{backToQueue}</div>

            <header className="rd-panel relative flex-none overflow-hidden p-6">

                <HeaderGlow />

                <div className="relative flex flex-wrap items-end justify-between gap-4">

                    <div>

                        <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                            Doctor
                        </p>

                        <h1 className="mt-2 text-2xl font-bold tracking-tight text-rd-title">
                            Patient Laboratory Request
                        </h1>

                        <p className="mt-2 text-sm text-rd-muted">
                            Review patient information and assign laboratory tests.
                        </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <PriorityPill value={patient.priority} />
                        <Pill value={patient.status} />
                    </div>

                </div>

            </header>

            <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-3">

                <section className="rd-panel flex min-h-0 flex-col overflow-hidden max-lg:h-fit">

                    <div className="flex flex-none items-center gap-3 border-b border-rd-hair p-4">

                        <Avatar name={patient.name} className="size-11 text-sm" />

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-rd-title">
                                {patient.name}
                            </p>
                            <p className="truncate text-xs text-rd-muted">
                                Patient Information
                            </p>
                        </div>

                    </div>

                    <dl className="rd-scroll-thin grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 lg:grid-cols-1">

                        <Detail label="Age">{patient.age}</Detail>

                        <Detail label="Sex">{patient.sex}</Detail>

                        <Detail label="Birthdate">{patient.birthdate}</Detail>

                        <Detail label="Mobile">{patient.mobileNum}</Detail>

                        <Detail label="Address">{patient.address}</Detail>

                        <Detail label="Visit Date">{patient.visited_at}</Detail>

                    </dl>

                </section>

                <section className="rd-panel flex min-h-0 flex-col overflow-hidden lg:col-span-2">

                    <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">

                        <div>

                            <h2 className="text-lg font-semibold text-rd-title">
                                Requested Laboratory Tests
                            </h2>

                            <p className="mt-0.5 text-sm text-rd-muted">
                                {tests.length} requested
                            </p>

                        </div>

                    </div>

                    {tests.length === 0 ? (

                        <EmptyState
                            title="No tests requested"
                            hint="Laboratory tests requested for this visit will appear here."
                            Icon={FlaskIcon}
                        />

                    ) : (

                        <>

                            <div className="rd-scroll-thin min-h-0 flex-1 overflow-auto">

                                <table className="w-full min-w-[720px] border-collapse">

                                    <thead>

                                        <tr className="border-b border-rd-hair">

                                            <th className={th}>Test</th>

                                            <th className={th}>Status</th>

                                            <th className={th}>Assigned Medical Technologist</th>

                                            <th className={`${th} text-right`}>Action</th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {tests.map(test => {

                                            const locked = test.status === "Done";

                                            return (

                                                <tr
                                                    key={test.id}
                                                    className="border-b border-rd-hair transition-colors last:border-0 hover:bg-rd-raised"
                                                >

                                                    <td className={`${td} font-medium text-rd-title`}>
                                                        {test.name}
                                                    </td>

                                                    <td className={td}>
                                                        <Pill value={test.status} />
                                                    </td>

                                                    <td className={td}>

                                                        {locked ? (

                                                            <span className="text-rd-label">
                                                                {medtechOf(test)?.username ?? "—"}
                                                            </span>

                                                        ) : (

                                                            <select
                                                                aria-label={`Assign a medical technologist to ${test.name}`}
                                                                value={test.medtechid ?? ""}
                                                                onChange={(e) =>
                                                                    assignMedtech(test.id, e.target.value)
                                                                }
                                                                data-empty={!test.medtechid}
                                                                className="rd-input min-w-[15rem]"
                                                            >

                                                                <option value="" disabled hidden>
                                                                    Select Medical Technologist
                                                                </option>

                                                                {medtechs.map(medtech => (

                                                                    <option
                                                                        key={medtech.id}
                                                                        value={medtech.id}
                                                                    >
                                                                        {medtech.username}
                                                                    </option>

                                                                ))}

                                                            </select>

                                                        )}

                                                    </td>

                                                    <td className={`${td} text-right`}>
                                                        {(test.status === "Done" || test.status === "Approved") ? (
                                                            <Link
                                                                href={`/dashboard/doctor/result/${test.id}`}
                                                                aria-label={`View the result for ${test.name}`}
                                                                className={rowAction}
                                                            >
                                                                View Result
                                                                <ChevronRightIcon size={16} />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-rd-muted">—</span>
                                                        )}
                                                    </td>

                                                </tr>

                                            );

                                        })}

                                    </tbody>

                                </table>

                            </div>

                            <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-t border-rd-hair p-4">

                                <p className="text-sm text-rd-muted">
                                    Assignments are saved together.
                                </p>

                                <button
                                    onClick={handleSave}
                                    className="rd-btn rd-press rd-focus"
                                >
                                    Assign Tests
                                </button>

                            </div>

                        </>

                    )}

                </section>

            </div>

        </div>

    );

}
