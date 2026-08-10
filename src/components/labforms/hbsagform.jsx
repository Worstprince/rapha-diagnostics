"use client";

import { useEffect, useState } from "react";
import LabReportHeader from "./labReportHeader";
import LabSignatures from "./labSignatures";

export default function HepatitisForm({
    patient,
    onSubmit,
    initialData = {},
    hasExistingResult = false,
    readOnly = false,
        medtechName = "",
    doctorName = "",
}) {

    const [result, setResult] = useState({
        hbsag: ""
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                hbsag: initialData?.hbsagResult ?? ""
            });

        }

    }, [initialData]);

    function handleChange(e) {

        if (readOnly) return;

        const { name, value } = e.target;

        setResult(prev => ({
            ...prev,
            [name]: value
        }));

    }

    function handleSubmit(e) {

        e.preventDefault();

        if (readOnly) return;

        onSubmit(result);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="IMMUNOLOGY/SEROLOGY"
            />

            <h2 className="text-center text-3xl font-bold">
                HEPATITIS
            </h2>

            <table className="mx-auto w-[460px] border-collapse border text-center">

                <thead>

                    <tr>

                        <th className="border p-4">
                            TEST
                        </th>

                        <th className="border p-4">
                            RESULT
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-8 text-2xl font-bold">
                            HBSAg
                        </td>

                        <td className="border p-8">

                            <select
                                name="hbsag"
                                value={result.hbsag}
                                onChange={handleChange}
                                disabled={readOnly}
                                className="w-full rounded bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                            >

                                <option value="">
                                    Select
                                </option>

                                <option value="REACTIVE">
                                    REACTIVE
                                </option>

                                <option value="NON REACTIVE">
                                    NON REACTIVE
                                </option>

                            </select>

                        </td>

                    </tr>

                </tbody>

            </table>

            <LabSignatures
                medtechName={medtechName}
                doctorName={doctorName}
            />

            {!readOnly && (

                <div className="flex justify-end">

                    <button
                        type="submit"
                        className="rd-btn rd-press rd-focus"
                    >
                        {hasExistingResult  ? "Update Result" : "Save Result"}
                    </button>

                </div>

            )}

        </form>

    );

}