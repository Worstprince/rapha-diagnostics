"use client";

import { useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";

export default function OGTTForm({
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
        fbs: initialData?.fbs ?? "",
        firstHour: initialData?.firstHour ?? "",
        secondHour: initialData?.secondHour ?? ""
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
                title="CLINICAL CHEMISTRY"
            />

            <h2 className="text-center text-3xl font-bold">
                ORAL GLUCOSE TOLERANCE TEST
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

                        <th className="border p-3">
                            Normal Values
                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td className="border p-3 font-semibold">
                            FBS
                        </td>

                        <td className="border p-3">

                            <input
                                name="fbs"
                                value={result.fbs}
                                onChange={handleChange}
                                readOnly={readOnly}
                                className="w-full rounded bg-rd-field p-2"
                            />

                        </td>

                        <td className="border p-3">
                            3.89 - 5.83 mmol/L
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-3 font-semibold">
                            1st Hour
                        </td>

                        <td className="border p-3">

                            <input
                                name="firstHour"
                                value={result.firstHour}
                                onChange={handleChange}
                                readOnly={readOnly}
                                className="w-full rounded bg-rd-field p-2"
                            />

                        </td>

                        <td className="border p-3">
                            Less than 11.1 mmol/L
                        </td>

                    </tr>

                    <tr>

                        <td className="border p-3 font-semibold">
                            2nd Hour
                        </td>

                        <td className="border p-3">

                            <input
                                name="secondHour"
                                value={result.secondHour}
                                onChange={handleChange}
                                readOnly={readOnly}
                                className="w-full rounded bg-rd-field p-2"
                            />

                        </td>

                        <td className="border p-3">
                            Less than 7.8 mmol/L
                        </td>

                    </tr>

                </tbody>

            </table>

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