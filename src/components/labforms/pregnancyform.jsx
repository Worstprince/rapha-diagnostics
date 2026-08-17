"use client";

import { useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function PregnancyTestForm({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false,
    doctorId,
    doctorName,
    medtechId,
    medtechName,
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

        onSubmit(result, hasExistingResult);

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

            <div className="overflow-x-auto">
                <table className="w-full border border-rd-hair-strong border-collapse text-center">

                    <thead>

                        <tr>

                            <th className="border border-rd-hair-strong p-3">
                                Test
                            </th>

                            <th className="border border-rd-hair-strong p-3">
                                Result
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-6 font-bold">
                                PT(HCG) SERUM
                            </td>

                            <td className="border border-rd-hair-strong p-6">

                                <select
                                    name="pregnancyResult"
                                    value={result.pregnancyResult}
                                    onChange={handleChange}
                                    disabled={readOnly}
                                    className="w-full rounded border border-rd-hair-strong bg-rd-field p-2 disabled:cursor-not-allowed disabled:opacity-100"
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
            </div>

            <LabSignatures
                doctorId={doctorId}
                doctorName={doctorName}
                medtechId={medtechId}
                medtechName={medtechName}
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