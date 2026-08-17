"use client";

import { useState } from "react";
import { REFERENCE_RANGES } from "./referenceRanges";
import LabReportHeader, { LabSignatures } from "./labReportHeader";
import ResultField from "./ResultField";

const RANGES = REFERENCE_RANGES.ogtt;

export default function OGTTForm({
    patient,
    onSubmit,
    initialData = {},
    readOnly = false,
    hasExistingResult = false,
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
            className="print-result space-y-8 rounded-2xl border border-rd-hair bg-rd-card p-8"
        >

            <LabReportHeader
                patient={patient}
                title="CLINICAL CHEMISTRY"
            />

            <h2 className="text-center text-3xl font-bold">
                ORAL GLUCOSE TOLERANCE TEST
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

                            <th className="border border-rd-hair-strong p-3">
                                Normal Values
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-3 font-semibold">
                                FBS
                            </td>

                            <td className="border border-rd-hair-strong p-3">

                                <ResultField
                                    name="fbs"
                                    value={result.fbs}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    range={RANGES.fbs}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-3">
                                3.89 - 5.83 mmol/L
                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-3 font-semibold">
                                1st Hour
                            </td>

                            <td className="border border-rd-hair-strong p-3">

                                <ResultField
                                    name="firstHour"
                                    value={result.firstHour}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    range={RANGES.firstHour}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-3">
                                Less than 11.1 mmol/L
                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-3 font-semibold">
                                2nd Hour
                            </td>

                            <td className="border border-rd-hair-strong p-3">

                                <ResultField
                                    name="secondHour"
                                    value={result.secondHour}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    range={RANGES.secondHour}
                                    sex={patient?.sex}
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-3">
                                Less than 7.8 mmol/L
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
                        {hasExistingResult  ? "Update Result" : "Save Result"}
                    </button>

                </div>

            )}

        </form>

    );

}