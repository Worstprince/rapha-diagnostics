"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

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

        return <p>Loading...</p>;

    }

    const FormComponent = forms[test.testid];

    if (!FormComponent) {

        return <p>Unknown test.</p>;

    }

    return (
    <FormComponent
        patient={patient}
        test={test}
        initialData={result ?? {}}
        onSubmit={handleSubmit}
    />
);

}