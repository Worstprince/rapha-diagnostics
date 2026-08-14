"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/lib/session";

import {
    ArrowLeftIcon,
    Avatar,
    CakeIcon,
    CalendarIcon,
    ChevronRightIcon,
    EmptyState,
    FlaskIcon,
    HeaderGlow,
    MapPinIcon,
    PhoneIcon,
    Pill,
    PriorityPill,
    UserIcon,
    backLink,
    rowAction,
    td,
    th,
} from "../../_ui";
import Toast from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

/* Each fact gets its own cell on a recessed band — a flat row of small grey
   text read as a caption rather than as the patient's record. */
function Detail({ icon: Glyph, label, value }) {
    return (
        <div className="min-w-0 bg-rd-sunken px-6 py-5">

            <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-rd-muted">
                <Glyph size={14} />
                {label}
            </dt>

            <dd
                title={value || undefined}
                className="mt-2 truncate text-base font-semibold text-rd-title"
            >
                {value || <span className="text-rd-placeholder">Not recorded</span>}
            </dd>

        </div>
    );
}

export default function VisitationDetailsPage() {

    const { id } = useParams();
    
    const currentUser = useCurrentUser();
    const [patient, setPatient] = useState(null);

    const [tests, setTests] = useState([]);

    const [medtechs, setMedtechs] = useState([]);

    const [toast, setToast] = useState(null);

    const [isSaving, setIsSaving] = useState(false);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    /* Collapsed by default: contact details are looked up occasionally, while
       the tests table is the work — it should own the vertical space. */
    const [showDetails, setShowDetails] = useState(false);

    /* The assignments as they exist on the server, so a row can be marked as
       edited — and changing one back to its original value clears the flag. */
    const [savedAssignments, setSavedAssignments] = useState({});

    const changedIds = new Set(
        tests
            .filter(
                (test) =>
                    String(test.medtechid ?? "") !==
                    String(savedAssignments[test.id] ?? "")
            )
            .map((test) => test.id)
    );

    const isDirty = changedIds.size > 0;

    const assignable = tests.filter((test) => test.status !== "Done");
    const assignedCount = assignable.filter((test) => test.medtechid).length;
    const unassignedCount = assignable.length - assignedCount;

    /* Assignments only live in local state until Assign Tests is pressed, so
       leaving the page mid-edit would discard them without a word. */
    useEffect(() => {

        if (!isDirty) return;

        function handleBeforeUnload(event) {
            event.preventDefault();
            event.returnValue = "";
        }

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };

    }, [isDirty]);

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
                setToast({
                    tone: "error",
                    text: result.message || "Could not load this visitation."
                });
                return;
            }

            setPatient(result.patient);
            setTests(result.tests);

            setSavedAssignments(
                Object.fromEntries(
                    (result.tests ?? []).map((test) => [
                        test.id,
                        test.medtechid ?? ""
                    ])
                )
            );

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

    function discardChanges() {

        setTests(prev =>
            prev.map(test => ({
                ...test,
                medtechid: savedAssignments[test.id] ?? ""
            }))
        );

    }

    /* One medtech usually takes the whole panel, so this saves picking the same
       name in every row. Completed tests keep the technologist who ran them. */
    function assignAll(medtechId) {

        if (!medtechId) return;

        setTests(prev =>
            prev.map(test =>
                test.status === "Done"
                    ? test
                    : {
                        ...test,
                        medtechid: medtechId
                    }
            )
        );

    }

async function handleSave() {

    /* "Assign Tests" that assigns nobody is a no-op with a misleading name.
       Un-assigning a row is still fine as long as one technologist remains. */
    if (assignedCount === 0) {
        setToast({
            tone: "error",
            text: "Choose a medical technologist for at least one test."
        });
        return;
    }

    setIsSaving(true);

    try {

        const response = await fetch("/api/doctor/assignMedTech", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                /* An un-assigned row has to travel as null — an empty string
                   would land in an integer column as 0. */
                tests: tests.map(test => ({
                    ...test,
                    medtechid: test.medtechid || null
                })),
                userId: currentUser?.id
            })

        });

        const result = await response.json();

        setToast({
            tone: response.ok ? "success" : "error",
            text:
                result.message ||
                (response.ok
                    ? "Medical technologists assigned."
                    : "Failed to assign medical technologists.")
        });

        if (response.ok) {
            setSavedAssignments(
                Object.fromEntries(
                    tests.map(test => [test.id, test.medtechid ?? ""])
                )
            );
        }

    } catch (error) {

        console.error(error);

        setToast({
            tone: "error",
            text: "Unable to reach the server. Please try again."
        });

    } finally {

        setIsSaving(false);

    }

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

                <Toast
                    status={toast}
                    onDismiss={() => setToast(null)}
                />

            </div>
        );

    }

    const medtechOf = (test) =>
        medtechs.find((medtech) => String(medtech.id) === String(test.medtechid));

    /* Age and sex stay on screen even when the band is collapsed — they frame
       every reference range on the panel below. */
    const identitySummary = [
        patient.age ? `${patient.age} yrs` : null,
        patient.sex,
        `${tests.length} ${tests.length === 1 ? "test" : "tests"} requested`,
        unassignedCount > 0 ? `${unassignedCount} unassigned` : null,
    ]
        .filter(Boolean)
        .join("  ·  ");

    return (

        <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <div className="flex-none">{backToQueue}</div>

            <header className="rd-panel relative flex-none overflow-hidden">

                <HeaderGlow />

                <div className="relative flex flex-wrap items-center justify-between gap-5 px-6 py-6">

                    <div className="flex min-w-0 items-center gap-4">

                        <Avatar name={patient.name} className="size-14 text-base" />

                        <div className="min-w-0">

                            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-rd-cyan">
                                Laboratory request
                            </p>

                            <h1 className="mt-1.5 truncate text-2xl font-bold tracking-tight text-rd-title">
                                {patient.name}
                            </h1>

                            <p className="mt-1.5 truncate text-sm text-rd-muted">
                                {identitySummary}
                            </p>

                        </div>

                    </div>

                    <div className="flex flex-wrap items-center gap-2">

                        <PriorityPill value={patient.priority} />

                        <Pill value={patient.status} />

                        <button
                            type="button"
                            onClick={() => setShowDetails((open) => !open)}
                            aria-expanded={showDetails}
                            aria-controls="patient-details"
                            className={rowAction}
                        >
                            Details
                            <ChevronRightIcon
                                size={16}
                                className={`transition-transform ${
                                    showDetails ? "rotate-90" : ""
                                }`}
                            />
                        </button>

                    </div>

                </div>

                {showDetails && (

                <dl
                    id="patient-details"
                    className="relative grid gap-px border-t border-rd-hair bg-rd-hair sm:grid-cols-2 lg:grid-cols-3"
                >

                    <Detail
                        icon={UserIcon}
                        label="Age"
                        value={patient.age ? `${patient.age} yrs` : ""}
                    />

                    <Detail
                        icon={UserIcon}
                        label="Sex"
                        value={patient.sex}
                    />

                    <Detail
                        icon={CakeIcon}
                        label="Birthdate"
                        value={patient.birthdate}
                    />

                    <Detail
                        icon={PhoneIcon}
                        label="Mobile"
                        value={patient.mobileNum}
                    />

                    <Detail
                        icon={CalendarIcon}
                        label="Visit Date"
                        value={patient.visited_at}
                    />

                    <Detail
                        icon={MapPinIcon}
                        label="Address"
                        value={patient.address}
                    />

                </dl>

                )}

            </header>

                <section className="rd-panel flex min-h-0 flex-1 flex-col overflow-hidden max-lg:h-fit">

                    <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-b border-rd-hair p-4">

                        <div className="min-w-0">

                            <h2 className="text-lg font-semibold text-rd-title">
                                Requested Laboratory Tests
                            </h2>

                            <p className="mt-0.5 text-sm text-rd-muted">
                                {tests.length} requested
                                {unassignedCount > 0 && (
                                    <>
                                        {" · "}
                                        <span className="font-medium text-rd-danger">
                                            {unassignedCount} unassigned
                                        </span>
                                    </>
                                )}
                            </p>

                        </div>

                        {assignable.length > 1 && (
                            <label className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                                    Assign all
                                </span>
                                <select
                                    aria-label="Assign every pending test to one medical technologist"
                                    value=""
                                    data-empty="true"
                                    onChange={(e) => assignAll(e.target.value)}
                                    className="rd-input min-w-[13rem]"
                                >
                                    <option value="">Choose…</option>
                                    {medtechs.map(medtech => (
                                        <option key={medtech.id} value={medtech.id}>
                                            {medtech.username}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}

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

                                                            <div className="flex items-center gap-2">

                                                                <select
                                                                    aria-label={`Assign a medical technologist to ${test.name}`}
                                                                    value={test.medtechid ?? ""}
                                                                    onChange={(e) =>
                                                                        assignMedtech(test.id, e.target.value)
                                                                    }
                                                                    data-empty={!test.medtechid}
                                                                    className="rd-input min-w-[15rem]"
                                                                >

                                                                    <option value="">
                                                                        Unassigned
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

                                                                {changedIds.has(test.id) && (
                                                                    <span
                                                                        title="Not saved yet"
                                                                        className="inline-flex flex-none items-center gap-1.5 rounded-full border border-amber-500/45 bg-amber-500/14 px-2 py-0.5 text-[11px] font-semibold text-rd-title"
                                                                    >
                                                                        <span
                                                                            aria-hidden="true"
                                                                            className="size-1.5 rounded-full bg-amber-500"
                                                                        />
                                                                        Unsaved
                                                                    </span>
                                                                )}

                                                            </div>

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

                        </>

                    )}

                </section>

                {assignable.length > 0 && (

                    <div className="rd-panel flex flex-none flex-wrap items-center justify-between gap-4 p-4 max-lg:sticky max-lg:bottom-0">

                        <div className="flex min-w-0 flex-1 items-center gap-4">

                            <div
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={assignable.length}
                                aria-valuenow={assignedCount}
                                aria-label="Tests routed to a medical technologist"
                                className="h-2 w-28 flex-none overflow-hidden rounded-full bg-rd-raised"
                            >
                                <span
                                    className={`block h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none ${
                                        unassignedCount === 0 ? "bg-emerald-500" : "bg-rd-cyan"
                                    }`}
                                    style={{
                                        width: `${(assignedCount / assignable.length) * 100}%`
                                    }}
                                />
                            </div>

                            <div className="min-w-0">

                                <p className="text-sm font-semibold text-rd-title">
                                    {assignedCount} of {assignable.length} routed
                                </p>

                                <p className="truncate text-xs text-rd-muted">
                                    {isDirty
                                        ? `${changedIds.size} unsaved ${
                                            changedIds.size === 1 ? "change" : "changes"
                                        }`
                                        : unassignedCount > 0
                                            ? `${unassignedCount} still waiting for a technologist`
                                            : "Every test has a technologist"}
                                </p>

                            </div>

                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">

                            {isDirty && (
                                <button
                                    type="button"
                                    onClick={discardChanges}
                                    disabled={isSaving}
                                    className="rd-btn-ghost rd-press rd-focus"
                                >
                                    Discard
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setIsConfirmOpen(true)}
                                disabled={isSaving || !isDirty || assignedCount === 0}
                                className="rd-btn rd-press rd-focus"
                            >
                                {isSaving ? "Assigning…" : "Assign Tests"}
                            </button>

                        </div>

                    </div>

                )}

            <ConfirmDialog
                open={isConfirmOpen}
                title="Save these assignments?"
                description={
                    unassignedCount > 0
                        ? `${changedIds.size} ${
                            changedIds.size === 1 ? "change" : "changes"
                        } will be saved. ${unassignedCount} ${
                            unassignedCount === 1 ? "test is" : "tests are"
                        } still unassigned and will stay in the queue.`
                        : `${changedIds.size} ${
                            changedIds.size === 1 ? "change" : "changes"
                        } will be saved and the technologists notified in their assignments list.`
                }
                confirmLabel="Assign tests"
                cancelLabel="Go back"
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    handleSave();
                }}
                onCancel={() => setIsConfirmOpen(false)}
            />

            <Toast
                status={toast}
                onDismiss={() => setToast(null)}
            />

        </div>

    );

}
