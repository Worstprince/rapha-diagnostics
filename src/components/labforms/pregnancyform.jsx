"use client";

import { useState } from "react";
import LabReportHeader from "./labReportHeader";
import LabSignatures from "./labSignatures";

export default function PregnancyForm({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false,
    medtechName = "",
    doctorName = ""
}) {

    const [result, setResult] = useState({
        pregnancyResult: initialData?.ptHCGSerum ?? ""
    });

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
                PREGNANCY TEST
            </h2>

            <table className="w-full border border-collapse text-center">

                <thead>

                    <tr>

                        <th className="border p-3">
                            Test
                        </th>

                        <th className="border p-3">
                            Result
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-6 font-bold">
                            PT(HCG) SERUM
                        </td>

                        <td className="border p-6">

                            <select
                                name="pregnancyResult"
                                value={result.pregnancyResult}
                                onChange={handleChange}
                                disabled={readOnly}
                                className="w-full rounded border bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
                            >

                                <option value="">
                                    Select
                                </option>

                                <option value="POSITIVE">
                                    POSITIVE
                                </option>

                                <option value="NEGATIVE">
                                    NEGATIVE
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