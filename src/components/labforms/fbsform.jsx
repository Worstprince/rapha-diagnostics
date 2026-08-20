"use client";

import { useEffect, useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";
import { REFERENCE_RANGES } from "./referenceRanges";
import ResultField from "./ResultField";

const RANGES = REFERENCE_RANGES.fbs;

export default function FBSForm({
    patient,
    onSubmit,
    initialData = {},
    hasExistingResult = false,
    readOnly = false,
    doctorId,
    doctorName,
    doctorLicense,
    doctorExtension,
    medtechId,
    medtechName,
    medtechLicense,
    medtechExtension,
}) {

    const [result, setResult] = useState({
        glucose: initialData?.glucose ?? "",
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                glucose: initialData?.glucose ?? "",
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

        onSubmit(result, hasExistingResult);

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="print-result space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="CLINICAL CHEMISTRY"
            />

            <h2 className="text-center text-2xl font-bold">
                FASTING BLOOD SUGAR (FBS)
            </h2>

            <div className="overflow-x-auto">

                <table className="mx-auto w-full max-w-3xl border-collapse border border-rd-hair-strong text-center">

                    <thead>

                        <tr>

                            <th className="border border-rd-hair-strong p-3">
                                EXAMINATION
                            </th>

                            <th className="border border-rd-hair-strong p-3">
                                RESULT
                            </th>

                            <th className="border border-rd-hair-strong p-3">
                                NORMAL VALUES
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-4 font-semibold">
                                Glucose
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <div className="flex items-center justify-center gap-1">

                                    <ResultField
                                        name="glucose"
                                        value={result.glucose}
                                        onChange={handleChange}
                                        readOnly={readOnly}
                                        range={RANGES.glucose}
                                        type="number"
                                    />

                                    <span className="whitespace-nowrap text-sm text-rd-muted">
                                        mmol/L
                                    </span>

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-4">
                                4.38 – 6.05 mmol/L
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

            <LabSignatures
                doctorId={doctorId}
                doctorName={doctorName}
                doctorLicense={doctorLicense}
                doctorExtension={doctorExtension}
                medtechId={medtechId}
                medtechName={medtechName}
                medtechLicense={medtechLicense}
                medtechExtension={medtechExtension}
            />

            {!readOnly && (

                <div className="flex justify-end">

                    <button
                        type="submit"
                        className="rd-btn rd-press rd-focus"
                    >
                        {hasExistingResult
                            ? "Update Result"
                            : "Save Result"}
                    </button>

                </div>

            )}

        </form>

    );

}