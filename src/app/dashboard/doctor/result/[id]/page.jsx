"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/lib/session";
import ConfirmDialog from "@/components/ConfirmDialog";
import Toast from "@/components/Toast";

import {
    ArrowLeftIcon,
    Avatar,
    EmptyState,
    FlaskIcon,
    Pill,
    PrinterIcon,
    backLink,
} from "../../_ui";

import BloodTypeForm from "@/components/labforms/bloodtypeform";
import ChemistryForm from "@/components/labforms/hba1c";
import DengueForm from "@/components/labforms/dengueform";
import FOBTForm from "@/components/labforms/fobtform";
import HBSAGForm from "@/components/labforms/hbsagform";
import HematologyForm from "@/components/labforms/hematology";
import OGTTForm from "@/components/labforms/ogttform";
import SemenAnalysisForm from "@/components/labforms/semenalysisform";
import stool from "@/components/labforms/stoolexamform";
import UrinalysisForm from "@/components/labforms/urinalysisform";
import PregnancyTestForm from "@/components/labforms/pregnancyform";
import thyroid from "@/components/labforms/thyroidform";
import vdrl from "@/components/labforms/vdrlform";
import hbsagvdrl from "@/components/labforms/hbsagvdrlform";
import hem from "@/components/labforms/hemform";
import antihav from "@/components/labforms/antihav";
import rbs from "@/components/labforms/rbsform";

const forms = {

    1: BloodTypeForm,
    2: ChemistryForm,
    3: DengueForm,
    4: FOBTForm,
    5: HBSAGForm,
    6: HematologyForm,
    7: OGTTForm,
    8: PregnancyTestForm,
    9: SemenAnalysisForm,
    10: stool,
    11: thyroid,
    12: UrinalysisForm,
    13: vdrl,
    14: hbsagvdrl,
    15: antihav,
    16: rbs,
    18: hem,

};

const reportSkin = [

    "[&>form]:mx-auto [&>form]:space-y-6 [&>form]:p-6 sm:[&>form]:p-10",

    "[&_h1]:text-xl [&_h1]:font-bold [&_h1]:uppercase [&_h1]:tracking-[0.14em] [&_h1]:text-rd-title",
    "[&_h1~p]:text-xs [&_h1~p]:leading-relaxed [&_h1~p]:text-rd-muted",

    "[&_h2]:text-sm [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-[0.22em] [&_h2]:text-rd-cyan",

    "[&_.grid.border]:w-full [&_.grid.border]:rounded-none [&_.grid.border]:border-rd-hair [&_.grid.border]:bg-rd-sunken [&_.grid.border]:px-4 [&_.grid.border]:py-3.5 [&_.grid.border]:text-sm [&_.grid.border]:gap-x-10 [&_.grid.border]:gap-y-2.5",

    "[&_b]:mr-1.5 [&_b]:text-[11px] [&_b]:font-semibold [&_b]:uppercase [&_b]:tracking-wider [&_b]:text-rd-muted",

    "[&_table]:w-full [&_table]:max-w-full [&_table]:table-fixed [&_table]:border-collapse",

    "[&_table]:border-rd-hair [&_th]:border-rd-hair [&_td]:border-rd-hair [&_.border]:border-rd-hair",

    "[&_th]:px-4 [&_th]:py-3.5 [&_th]:align-middle [&_th]:leading-snug [&_th]:break-words",
    "[&_td]:px-4 [&_td]:py-3.5 [&_td]:align-middle [&_td]:leading-snug [&_td]:break-words",

    "[&_thead_th]:bg-rd-sunken [&_thead_th]:text-xs [&_thead_th]:font-semibold [&_thead_th]:uppercase [&_thead_th]:tracking-wider [&_thead_th]:text-rd-muted",

    "[&_tbody_tr:nth-child(even)]:bg-rd-sunken/40",

    "[&_select:disabled]:border-transparent [&_select:disabled]:bg-transparent [&_select:disabled]:bg-none [&_select:disabled]:p-0 [&_select:disabled]:text-center [&_select:disabled]:font-semibold [&_select:disabled]:text-rd-title",
    "[&_input:read-only]:border-transparent [&_input:read-only]:bg-transparent [&_input:read-only]:p-0 [&_input:read-only]:text-center [&_input:read-only]:font-semibold [&_input:read-only]:text-rd-title",
    "[&_textarea:read-only]:border-transparent [&_textarea:read-only]:bg-transparent [&_textarea:read-only]:text-rd-title",

    "[&_.pt-16]:pt-10 [&_.gap-20]:gap-12",

].join(" ");

export default function DoctorResultPage() {
    const currentUser = useCurrentUser();
    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [test, setTest] = useState(null);
    const [result, setResult] = useState(null);

    const [toast, setToast] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isApproving, setIsApproving] = useState(false);

    useEffect(() => {

        if (id) {

            fetchResult();

        }

    }, [id]);

    async function fetchResult() {

        const response = await fetch(`/api/doctor/result/${id}`);

        const data = await response.json();

        setPatient(data.patient);
        setTest(data.test);
        setResult(data.result);

    }

async function approveResult() {

    setIsApproving(true);

    try {

        const response = await fetch(`/api/doctor/result/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: "Approved",
                userId: currentUser?.id
            })
        });

        const data = await response.json();

        if (!response.ok) {
            setToast({
                tone: "error",
                text: data.message || "Failed to approve result."
            });
            return;
        }

        setToast({
            tone: "success",
            text: "Laboratory result approved successfully."
        });

        await fetchResult();

    } catch (error) {

        console.error(error);

        setToast({
            tone: "error",
            text: "Unable to reach the server. Please try again."
        });

    } finally {

        setIsApproving(false);

    }
}

    function handlePrint() {

        document.body.classList.add("printing");

        window.addEventListener(
            "afterprint",
            () => document.body.classList.remove("printing"),
            { once: true }
        );

        window.print();

    }

    if (!patient || !test || !result) {

        return (
            <div className="mx-auto max-w-5xl space-y-5">
                <div className="rd-panel h-16 animate-pulse motion-reduce:animate-none" />
                <div className="rd-panel h-96 animate-pulse motion-reduce:animate-none" />
            </div>
        );

    }

    const FormComponent = forms[test.testid];

    if (!FormComponent) {

        return (
            <div className="rd-panel mx-auto max-w-5xl">
                <EmptyState
                    title="Unknown test"
                    hint="No report layout is registered for this test type."
                    Icon={FlaskIcon}
                />
            </div>
        );

    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden print:h-auto print:overflow-visible">

            <div className="no-print rd-panel flex flex-none flex-wrap items-center gap-x-4 gap-y-3 p-4">

                <Link
                    href={`/dashboard/doctor/visitation/${test.visitid}`}
                    className={backLink}
                >
                    <ArrowLeftIcon size={16} />
                    Back to request
                </Link>

                <span aria-hidden="true" className="hidden h-6 w-px bg-rd-hair-strong sm:block" />

                <div className="flex min-w-0 items-center gap-3">

                    <Avatar name={patient.name} />

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-rd-title">
                            {patient.name}
                        </p>
                        <p className="truncate text-xs text-rd-muted">{test.name}</p>
                    </div>

                </div>

                <div className="ml-auto">
                    <Pill value={test.status} />
                </div>

            </div>

            <div
                className={`print-result rd-scroll-thin min-h-0 flex-1 overflow-auto print:h-auto print:overflow-visible ${reportSkin}`}
            >

                <FormComponent
                    patient={patient}
                    initialData={result}
                    readOnly={true}
                    doctorId={test.doctorid}
                    doctorName={test.doctorName}
                    doctorLicense={test.doctorLicense}
                    doctorExtension={test.doctorExtension}
                    medtechId={test.medtechid}
                    medtechName={test.medtechName}
                    medtechLicense={test.medtechLicense}
                    medtechExtension={test.medtechExtension}
                />

            </div>

            <div className="no-print rd-panel flex flex-none flex-wrap items-center justify-between gap-3 p-4">

                <p className="text-sm text-rd-muted">
                    {test.status === "Approved"
                        ? "This result has been approved and released."
                        : "Approving releases this result to the patient record."}
                </p>

                <div className="flex flex-wrap items-center gap-3">

                    <button
                        type="button"
                        onClick={handlePrint}
                        className="rd-btn-ghost rd-press rd-focus min-h-11 py-0 hover:border-rd-cyan/50 hover:bg-rd-cyan/10 hover:text-rd-cyan hover:shadow-[0_0_18px_-6px_rgba(34,211,238,0.5)]"
                    >
                        <PrinterIcon size={16} />
                        Print Result
                    </button>

                    {test.status !== "Approved" && (

                        <button
                            type="button"
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={isApproving}
                            className="rd-btn rd-press rd-focus"
                        >
                            {isApproving ? "Approving…" : "Approve"}
                        </button>

                    )}

                </div>

            </div>

            <ConfirmDialog
                open={isConfirmOpen}
                title="Approve this result?"
                description="Approving releases this laboratory result to the patient record. This cannot be undone."
                confirmLabel="Approve result"
                cancelLabel="Go back"
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    approveResult();
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