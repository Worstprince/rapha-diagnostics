"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

            <PageHeader
                title={`Visit #${visit.visitId}`}
                description="View the billing details and tests associated with this visit."
            />


            <section className="rd-panel p-6">

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                            Patient
                        </p>

                        <p className="mt-1 font-medium text-rd-title">
                            {formatPatientName(visit)}
                        </p>

                        <p className="mt-1 text-sm text-rd-muted">
                            Patient ID: {visit.patientId}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                            Visit Date
                        </p>

                        <p className="mt-1 font-medium text-rd-title">
                            {visit.visitDate}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                            Priority
                        </p>

                        <p className="mt-1 font-medium text-rd-title">
                            {visit.priority || "Routine"}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                            Assigned Doctor
                        </p>

                        <p className="mt-1 font-medium text-rd-title">
                            {visit.doctorName
                                ? `Dr. ${visit.doctorName}`
                                : "Unassigned"}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                            Referring Doctor
                        </p>

                        <p className="mt-1 font-medium text-rd-title">
                            {visit.referringDoctorName ||
                                "Walk-in / none"}
                        </p>

                        {visit.referringDoctorClinic && (
                            <p className="mt-1 text-sm text-rd-muted">
                                {visit.referringDoctorClinic}
                            </p>
                        )}
                    </div>

                </div>

            </section>


            <section className="rd-panel overflow-hidden">

                <div className="border-b border-rd-hair p-5">

                    <h2 className="font-semibold text-rd-title">
                        Tests and Charges
                    </h2>

                    <p className="mt-1 text-sm text-rd-muted">
                        Tests requested for this visit and their recorded charges.
                    </p>

                </div>


                <div className="rd-scroll-thin overflow-auto">

                    <table className="w-full min-w-[600px] border-collapse">

                        <thead>

                            <tr className="border-b border-rd-hair">

                                <th className={th}>
                                    Test
                                </th>

                                <th className={`${th} text-right`}>
                                    Cost
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {visit.tests?.map((test) => (

                                <tr
                                    key={test.id}
                                    className="border-b border-rd-hair last:border-0"
                                >

                                    <td className={`${td} font-medium text-rd-title`}>
                                        {test.name}
                                    </td>

                                    <td className={`${td} text-right tabular-nums`}>
                                        {formatCurrency(test.cost)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>


                        <tfoot>

                            <tr className="border-t border-rd-hair">

                                <td className={`${td} text-right font-semibold text-rd-title`}>
                                    Total
                                </td>

                                <td className={`${td} text-right text-lg font-semibold tabular-nums text-rd-title`}>
                                    {formatCurrency(visit.totalCost)}
                                </td>

                            </tr>

                        </tfoot>

                    </table>

                </div>

            </section>


            <section className="rd-panel p-6">

                <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                            Recorded At
                        </p>

                        <p className="mt-1 font-medium text-rd-title">
                            {visit.recordedAt || "—"}
                        </p>
                    </div>


                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-rd-muted">
                            Recorded By
                        </p>

                        <p className="mt-1 font-medium text-rd-title">
                            {visit.recordedBy || "—"}
                        </p>
                    </div>

                </div>

            </section>


            <div className="flex justify-end">

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

        </div>

    );

}