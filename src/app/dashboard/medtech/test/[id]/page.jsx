"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import bloodtypeform from "@/components/labforms/bloodtypeform";
import chemistryform from "@/components/labforms/chemistryform";
import hematology from "@/components/labforms/hematology";
import dengueform from "@/components/labforms/dengueform";

const forms = {

    1: bloodtypeform,

    2: chemistryform,

    3: dengueform,

    6: hematology,

};

export default function TestPage() {

    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [test, setTest] = useState(null);

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

        const result = await response.json();

        setPatient({
            patientid: result.patientid,
            name: result.patientname,
            birthdate: result.birthdate,
            age: result.age,
            sex: result.sex,
            address: result.address
        });

        setTest({
            id: result.id,
            testid: result.testid,
            visitid: result.visitid,
            status: result.status,
            medtechid: result.medtechid
        });
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
        onSubmit={handleSubmit}
    />
);

}