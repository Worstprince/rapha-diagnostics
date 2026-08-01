"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import BloodTypeForm from "@/components/labforms/bloodtypeform";
import ChemistryForm from "@/components/labforms/chemistryform";
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
    13: vdrl

};

export default function DoctorResultPage() {

    const { id } = useParams();

    const [patient, setPatient] = useState(null);
    const [test, setTest] = useState(null);
    const [result, setResult] = useState(null);

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

    if (!patient || !test || !result) {

        return <p className="p-6">Loading...</p>;

    }

    const FormComponent = forms[test.testid];

    if (!FormComponent) {

        return <p>Unknown Test</p>;

    }

    return (

        <FormComponent
            patient={patient}
            initialData={result}
            readOnly={true}
        />

    );

}