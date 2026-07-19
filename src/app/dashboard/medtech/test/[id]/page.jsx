"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import bloodtypeform from "@/components/labforms/bloodtypeform";
import chemistryform from "@/components/labforms/chemistryform";

const forms = {

    1: bloodtypeform,

    2: chemistryform

};

export default function TestPage() {

    const { id } = useParams();

    const [test, setTest] = useState(null);

    useEffect(() => {

        if (id) {

            fetchTest();

        }

    }, [id]);

    async function fetchTest() {

        const response = await fetch(`/api/medtech/test/${id}`);

        const data = await response.json();

        setTest(data);

    }

    if (!test) {

        return <p>Loading...</p>;

    }

    const FormComponent = forms[test.testid];

    if (!FormComponent) {

        return <p>Unknown test.</p>;

    }

    return <FormComponent test={test} />;

}