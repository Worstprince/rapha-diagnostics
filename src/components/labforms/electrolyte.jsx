"use client";

import { useEffect, useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";
import { REFERENCE_RANGES } from "./referenceRanges";
import ResultField from "./ResultField";

const RANGES = REFERENCE_RANGES.electrolyte;

export default function ElectrolytesForm({
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
        sodium: initialData?.sodium ?? "",
        potassium: initialData?.potassium ?? "",
        calcium: initialData?.calcium ?? "",
        magnesium: initialData?.magnesium ?? "",
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                sodium: initialData?.sodium ?? "",
                potassium: initialData?.potassium ?? "",
                calcium: initialData?.calcium ?? "",
                magnesium: initialData?.magnesium ?? "",
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
                ELECTROLYTES
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
                                Sodium
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <div className="flex items-center justify-center gap-1">

                                    <ResultField
                                        name="sodium"
                                        value={result.sodium}
                                        onChange={handleChange}
                                        readOnly={readOnly}
                                        range={RANGES.sodium}
                                    />

                                    <span className="whitespace-nowrap text-sm text-rd-muted">
                                        mmol/L
                                    </span>

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-4">
                                136 – 145 mmol/L
                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-4 font-semibold">
                                Potassium
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <div className="flex items-center justify-center gap-1">


                                    <ResultField
                                        name="potassium"
                                        value={result.potassium}
                                        onChange={handleChange}
                                        readOnly={readOnly}
                                        range={RANGES.potassium}
                                    />

                                    <span className="whitespace-nowrap text-sm text-rd-muted">
                                        mmol/L
                                    </span>

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-4">
                                3.5 – 5.5 mmol/L
                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-4 font-semibold">
                                Calcium
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <div className="flex items-center justify-center gap-1">


                                    <ResultField
                                        name="calcium"
                                        value={result.calcium}
                                        onChange={handleChange}
                                        readOnly={readOnly}
                                        range={RANGES.calcium}
                                    />

                                    <span className="whitespace-nowrap text-sm text-rd-muted">
                                        mmol/L
                                    </span>

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-4">
                                2.10 – 2.70 mmol/L
                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-4 font-semibold">
                                Magnesium
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <div className="flex items-center justify-center gap-1">


                                    <ResultField
                                        name="magnesium"
                                        value={result.magnesium}
                                        onChange={handleChange}
                                        readOnly={readOnly}
                                        range={RANGES.magnesium}
                                    />

                                    <span className="whitespace-nowrap text-sm text-rd-muted">
                                        mg/dL
                                    </span>

                                </div>

                            </td>

                            <td className="border border-rd-hair-strong p-4">
                                1.7 – 2.2 mg/dL
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