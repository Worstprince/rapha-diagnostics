"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
    ArrowLeftIcon,
    Avatar,
    EmptyState,
    FlaskIcon,
    Pill,
    backLink,
    formSkin,
} from "../../_ui";

import bloodtypeform from "@/components/labforms/bloodtypeform";
import chemistryform from "@/components/labforms/chemistryform";
import hematology from "@/components/labforms/hematology";
import dengueform from "@/components/labforms/dengueform";
import fobtform from "@/components/labforms/fobtform";
import hbsagform from "@/components/labforms/hbsagform";
import ogttform from "@/components/labforms/ogttform";
import pregnancyform from "@/components/labforms/pregnancyform";
import semenalysisform from "@/components/labforms/semenalysisform";
import stoolexam from "@/components/labforms/stoolexamform";
import thyroidexam from "@/components/labforms/thyroidform";
import urinalysisexam from "@/components/labforms/urinalysisform";
import vdrlexam from "@/components/labforms/vdrlform";

const forms = {

    1: bloodtypeform,

    2: chemistryform,

    3: dengueform,

    4: fobtform,

    5: hbsagform,

    6: hematology,

    7: ogttform,

    8: pregnancyform,

    9: semenalysisform,
    
    10: stoolexam,

    11: thyroidexam,

    12: urinalysisexam,

    13: vdrlexam
};

export default function TestPage() {

    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [test, setTest] = useState(null);
    const [result, setResult] = useState(null);

    async function handleSubmit(result) {
        try {
        const response = await fetch("/api/medtech/test/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                patientId: patient.patientid,
                assignmentId: test.id, 
                testId: test.testid,
                visitId: test.visitid,
                result
            })
        });
                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                alert("Test result saved successfully!");

            } catch (error) {
                console.error(error);
                alert("Failed to save test result.");
        } // BLOOD TYPE RESULT
    }
    useEffect(() => {

        if (id) {

            fetchTest();

        }

    }, [id]);

async function fetchTest() {

    const response = await fetch(`/api/medtech/test/${id}`);

    const data = await response.json();

    setPatient({
        patientid: data.test.patientid,
        name: data.test.patientname,
        birthdate: data.test.birthdate,
        age: data.test.age,
        sex: data.test.sex,
        address: data.test.address
    });

    setTest({
        id: data.test.id,
        testid: data.test.testid,
        visitid: data.test.visitid,
        status: data.test.status,
        medtechid: data.test.medtechid
    });

    setResult(data.result);
}

    if (!test || !patient) {

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
                    hint="No encoding form is registered for this test type."
                    Icon={FlaskIcon}
                />
            </div>
        );

    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-5 lg:h-[calc(100dvh-4rem)] lg:overflow-hidden">

            <div className="rd-panel flex flex-none flex-wrap items-center gap-x-4 gap-y-3 p-4">

                <Link href="/dashboard/medtech/assignments" className={backLink}>
                    <ArrowLeftIcon size={16} />
                    Back to assignments
                </Link>

                <span aria-hidden="true" className="hidden h-6 w-px bg-rd-hair-strong sm:block" />

                <div className="flex min-w-0 items-center gap-3">

                    <Avatar name={patient.name} />

                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-rd-title">
                            {patient.name}
                        </p>
                        <p className="truncate text-xs text-rd-muted">
                            {[patient.age ? `${patient.age} yrs` : null, patient.sex]
                                .filter(Boolean)
                                .join(" · ")}
                        </p>
                    </div>

                </div>

                <div className="ml-auto">
                    <Pill value={test.status} />
                </div>

            </div>

            <div className={`rd-scroll-thin min-h-0 flex-1 overflow-auto ${formSkin}`}>

                <FormComponent
                    patient={patient}
                    test={test}
                    initialData={result ?? {}}
                    hasExistingResult={result !== null}
                    onSubmit={handleSubmit}
                />

            </div>

        </div>
    );

}