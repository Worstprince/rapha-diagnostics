"use client";

import { useEffect, useState } from "react";
import LabReportHeader, { LabSignatures } from "./labReportHeader";
import { REFERENCE_RANGES } from "./referenceRanges";
import ResultField from "./ResultField";

const RANGES = REFERENCE_RANGES.rbs;

export default function RBSForm({
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
        siUnit: initialData?.siUnit ?? "",
        conventionalUnit: initialData?.conventionalUnit ?? "",
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                siUnit: initialData?.siUnit ?? "",
                conventionalUnit: initialData?.conventionalUnit ?? "",
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
                RANDOM BLOOD SUGAR (RBS)
            </h2>

            <div className="overflow-x-auto">

                <table className="mx-auto w-full max-w-4xl border-collapse border border-rd-hair-strong text-center">

                    <thead>

                        <tr>

                            <th
                                rowSpan={2}
                                className="border border-rd-hair-strong p-3"
                            >
                                TEST
                            </th>

                            <th
                                colSpan={2}
                                className="border border-rd-hair-strong p-3"
                            >
                                RESULTS
                            </th>

                            <th
                                colSpan={2}
                                className="border border-rd-hair-strong p-3"
                            >
                                NORMAL VALUES
                            </th>

                        </tr>

                        <tr>

                            <th className="border border-rd-hair-strong p-2">
                                S.I Unit
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                Conv. Unit
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                S.I Unit
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                Conv. Unit
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-4 font-semibold">
                                RBS
                                <span className="block text-xs font-normal text-rd-muted">
                                    Random Blood Sugar
                                </span>
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <ResultField
                                    name="siUnit"
                                    value={result.siUnit}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    range={RANGES.siUnit}
                                    type="number"
                                />
                            </td>

                            <td className="border border-rd-hair-strong p-4">

                                <ResultField
                                    name="conventionalUnit"
                                    value={result.conventionalUnit}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    range={RANGES.conventionalUnit}
                                    type="number"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-4">
                                3.4 – 6.7 mmol/L
                            </td>

                            <td className="border border-rd-hair-strong p-4">
                                60 – 120 mg/dL
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