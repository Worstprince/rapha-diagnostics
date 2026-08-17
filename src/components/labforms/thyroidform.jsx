"use client";

import { useEffect, useState } from "react";
import { REFERENCE_RANGES } from "./referenceRanges";
import LabReportHeader, { LabSignatures } from "./labReportHeader";
import ResultField from "./ResultField";

const RANGES = REFERENCE_RANGES.thyroid;

export default function ThyroidPanelForm({
    patient,
    initialData,
    readOnly = false,
    hasExistingResult = false,
    onSubmit,
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
        tsh: "",
        ft4: ""
    });

    useEffect(() => {

        if (initialData) {

            setResult({
                tsh: initialData?.tsh ?? "",
                ft4: initialData?.ft4 ?? ""
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
                title="CHEMISTRY"
            />

            <h2 className="text-center text-2xl font-bold">
                THYROID PANEL
            </h2>

            <div className="overflow-x-auto">
                <table className="mx-auto w-full max-w-3xl border-collapse border border-rd-hair-strong text-center">

                    <thead>

                        <tr>

                            <th className="border border-rd-hair-strong p-2">
                                TEST
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                Result
                            </th>

                            <th className="border border-rd-hair-strong p-2">
                                Normal Values
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td className="border border-rd-hair-strong p-2">
                                TSH
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <ResultField
                                    name="tsh"
                                    value={result.tsh}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    range={RANGES.tsh}
                                    sex={patient?.sex}
                                    className="text-center"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                0.27-4.20 uIU/mL
                            </td>

                        </tr>

                        <tr>

                            <td className="border border-rd-hair-strong p-2">
                                FT4
                            </td>

                            <td className="border border-rd-hair-strong p-2">

                                <ResultField
                                    name="ft4"
                                    value={result.ft4}
                                    onChange={handleChange}
                                    readOnly={readOnly}
                                    range={RANGES.ft4}
                                    sex={patient?.sex}
                                    className="text-center"
                                />

                            </td>

                            <td className="border border-rd-hair-strong p-2">
                                12.00-22.00 pmol/L
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