"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
    PageHeader,
    StateMessage,
    td,
    th,
} from "@/app/dashboard/admin/_ui";


function formatCurrency(value) {

    return `₱${Number(value || 0).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    )}`;

}


function formatPatientName(visit) {

    return [
        visit.fname,
        visit.mname,
        visit.lname,
        visit.suffix,
    ]
        .filter(Boolean)
        .join(" ");

}


export default function BillingDetailsPage() {

    const params = useParams();
    const router = useRouter();

    const visitId = params.id;

    const [visit, setVisit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function fetchVisit() {

            try {

                const response = await fetch(
                    `/api/billing/${visitId}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load billing record."
                    );
                }

                setVisit(data);

            } catch (error) {

                console.error(error);

                setError(
                    error.message ||
                    "Unable to load billing record."
                );

            } finally {

                setLoading(false);

            }

        }

        if (visitId) {
            fetchVisit();
        }

    }, [visitId]);


    if (loading) {

        return (

            <section className="flex min-h-0 flex-1 flex-col gap-5">

                <StateMessage
                    title="Loading billing record..."
                    hint="Please wait while the visit information is loaded."
                />

            </section>

        );

    }


    if (error || !visit) {

        return (

            <section className="flex min-h-0 flex-1 flex-col gap-5">

                <StateMessage
                    title="Could not load billing record"
                    hint={error || "Billing record not found."}
                />

                <div>
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/dashboard/reception/billing"
                            )
                        }
                        className="rd-btn-secondary rd-press rd-focus"
                    >
                        Back to Billing History
                    </button>
                </div>

            </section>

        );

    }


    return (
        <div className="mx-auto max-w-5xl space-y-5">
            <div className="no-print">
                <PageHeader
                    title={`Visit #${visit.visitId}`}
                    description="Review and print the invoice for this visit."
                />
            </div>

            <article className="print-result rd-panel overflow-hidden bg-rd-card">
                <header className="border-b-2 border-rd-cyan px-6 py-7 sm:px-10">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div>
                           <Image
    src="/rapha-logo.png"
    alt="Rapha Diagnostics"
    width={64}
    height={64}
    className="h-16 w-16 object-contain"
/>
                                <p className="text-xl font-bold tracking-tight text-rd-title">
                                    Rapha Diagnostics
                                </p>
                                <p className="mt-1 text-sm text-rd-muted">
                                    Laboratory Services
                                </p>
                            </div>
                        </div>
                        <div className="text-left sm:text-right">
                            <p className="text-xs font-bold uppercase tracking-[0.24em] text-rd-cyan">
                                Invoice
                            </p>
                            <p className="mt-2 text-2xl font-bold text-rd-title">
                                #{visit.visitId}
                            </p>
                            <p className="mt-1 text-sm text-rd-muted">
                                Issued {visit.recordedAt || visit.visitDate}
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid gap-6 border-b border-rd-hair px-6 py-6 sm:grid-cols-2 sm:px-10">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-rd-muted">Bill To</p>
                        <p className="mt-2 text-lg font-semibold text-rd-title">{formatPatientName(visit)}</p>
                        <p className="mt-1 text-sm text-rd-muted">Patient ID: {visit.patientId}</p>
                    </div>
                    <div className="sm:text-right">
                        <p className="text-xs font-bold uppercase tracking-wider text-rd-muted">Visit Details</p>
                        <p className="mt-2 font-medium text-rd-title">Visit date: {visit.visitDate}</p>
                        <p className="mt-1 text-sm text-rd-muted">Priority: {visit.priority || "Routine"}</p>
                        <p className="mt-1 text-sm text-rd-muted">
                            Doctor: {visit.doctorName ? `Dr. ${visit.doctorName}` : "Unassigned"}
                        </p>
                    </div>
                </section>

                <section className="px-6 py-6 sm:px-10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-rd-title">Services</h2>
                    <div className="rd-scroll-thin mt-4 overflow-auto">
                        <table className="w-full min-w-[520px] border-collapse">
                            <thead>
                                <tr className="border-b-2 border-rd-hair-strong">
                                    <th className={`${th} pl-0`}>Description</th>
                                    <th className={`${th} pr-0 text-right`}>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visit.tests?.map((test) => (
                                    <tr key={test.id} className="border-b border-rd-hair last:border-0">
                                        <td className={`${td} pl-0 font-medium text-rd-title`}>{test.name}</td>
                                        <td className={`${td} pr-0 text-right tabular-nums`}>{formatCurrency(test.cost)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td className="pt-6 text-right text-base font-semibold text-rd-title">Total Due</td>
                                    <td className="pt-6 pr-0 text-right text-2xl font-bold tabular-nums text-rd-cyan">{formatCurrency(visit.totalCost)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </section>

                <footer className="grid gap-4 border-t border-rd-hair bg-rd-sunken px-6 py-5 text-sm sm:grid-cols-2 sm:px-10">
                    <div>
                        <span className="font-semibold text-rd-title">Assigned doctor:</span>{" "}
                        <span className="text-rd-muted">{visit.doctorName ? `Dr. ${visit.doctorName}` : "Unassigned"}</span>
                    </div>
                    <div className="sm:text-right">
                        <span className="font-semibold text-rd-title">Recorded by:</span>{" "}
                        <span className="text-rd-muted">{visit.recordedBy || "—"}</span>
                    </div>
                </footer>
            </article>

            <div className="no-print flex flex-wrap justify-end gap-3">
                <button type="button" onClick={() => router.push("/dashboard/reception/billing")} className="rd-btn-secondary rd-press rd-focus">
                    Back to Billing History
                </button>
                <button type="button" onClick={() => window.print()} className="rd-btn rd-press rd-focus">
                    Print Invoice
                </button>
            </div>
        </div>
    );

}